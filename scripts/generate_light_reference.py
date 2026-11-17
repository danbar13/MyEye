import os
from PIL import Image
import numpy as np
from scipy.ndimage import gaussian_filter

def create_light_reference():
    src_path = 'public/images/eye_reference.jpg'
    dst_path = 'public/images/eye_reference_light.jpg'
    
    if not os.path.exists(src_path):
        print(f"Error: {src_path} not found")
        return
        
    img = Image.open(src_path).convert('RGB')
    arr = np.array(img, dtype=float)
    H, W, _ = arr.shape
    
    # 1. Background profile estimation from left and right margins
    # Left 20px and Right 20px are pure background throughout the entire height
    left_bg = arr[:, :20, :].mean(axis=1)
    right_bg = arr[:, -20:, :].mean(axis=1)
    edge_bg = 0.5 * (left_bg + right_bg)
    edge_bg_smooth = gaussian_filter(edge_bg, sigma=(4, 0))
    
    # Replicate across width to form the background baseline
    bg_baseline = np.repeat(edge_bg_smooth[:, np.newaxis, :], W, axis=1)
    
    # Distance to background baseline
    color_dist = np.sqrt(np.sum((arr - bg_baseline)**2, axis=2))
    
    # Light studio background: clean medical gradient from #F8FAFC at top to #E8EFF5 at bottom
    y_norm = np.linspace(0, 1, H)[:, None, None]
    top_light_bg = np.array([248.0, 250.0, 252.0])
    bot_light_bg = np.array([230.0, 238.0, 246.0])
    light_studio_bg = top_light_bg * (1 - y_norm) + bot_light_bg * y_norm
    
    # Dark text color for inverted labels (#0F172A)
    dark_text_color = np.array([15.0, 23.0, 42.0])
    
    # Soft background mask: 1.0 for pixels identical to background, falling off smoothly
    # Any pixel with color_dist < 15 is solidly background
    # color_dist between 15 and 45 is antialiased transition
    bg_alpha = np.clip((40.0 - color_dist) / 25.0, 0.0, 1.0)
    
    # Smooth the bg_alpha slightly to avoid harsh pixel edges
    bg_alpha = gaussian_filter(bg_alpha, sigma=0.8)
    
    # Text labels: strictly outside the central eye body (y < 260 or y > 1200)
    # Bright pixels in these zones are Hebrew text and pointer lines
    outside_eye = np.zeros((H, W), dtype=bool)
    outside_eye[:260, :] = True
    outside_eye[1205:, :] = True
    
    # Brightness of original pixel
    brightness = arr.mean(axis=2)
    # Saturation
    max_c = arr.max(axis=2)
    min_c = arr.min(axis=2)
    sat = (max_c - min_c) / (max_c + 1e-5)
    
    # Invert text: bright, low-saturation pixels in the label zones outside the eye
    is_text = outside_eye & (brightness > 130) & (sat < 0.4)
    text_alpha = np.clip((brightness - 120.0) / 80.0, 0.0, 1.0) * is_text.astype(float)
    
    # Thin pointer lines outside the eye (can extend down to y=300 or up from y=1180)
    near_label_zone = (arr.mean(axis=2) > 160) & (sat < 0.25) & ((np.arange(H)[:, None] < 300) | (np.arange(H)[:, None] > 1180))
    line_alpha = np.clip((brightness - 140.0) / 70.0, 0.0, 1.0) * near_label_zone.astype(float)
    text_alpha = np.maximum(text_alpha, line_alpha)
    
    # Construct light version:
    out = arr.copy()
    
    # 1. Replace background with light studio background
    for c in range(3):
        out[:, :, c] = out[:, :, c] * (1.0 - bg_alpha) + light_studio_bg[:, :, c] * bg_alpha
        
    # 2. Invert text labels outside the eye to crisp dark slate text
    for c in range(3):
        out[:, :, c] = out[:, :, c] * (1.0 - text_alpha) + dark_text_color[c] * text_alpha
        
    out = np.clip(out, 0, 255).astype(np.uint8)
    out_img = Image.fromarray(out)
    out_img.save(dst_path, quality=95)
    print(f"Generated {dst_path} successfully!")

if __name__ == '__main__':
    create_light_reference()
