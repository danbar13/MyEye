import json, struct, numpy as np

f = open('public/models/human_eye.glb', 'rb')
data = f.read()
json_len = int.from_bytes(data[12:16], 'little')
gltf = json.loads(data[20:20+json_len])
bin_data = data[20+json_len+8:]

target = np.array([0.85, -0.22, -0.22])

candidates = [
    ('Old Tab 2', np.array([0.08, 0.16, 1.35])),
    ('Default camera', np.array([-1.15, 0.75, 2.85])),
    ('Front-cutaway Zoomed', np.array([-0.65, 0.65, 2.10])),
    ('Front-cutaway Closer', np.array([-0.45, 0.55, 1.85])),
    ('Front-cutaway Direct', np.array([-0.30, 0.45, 1.65])),
    ('Wide angle cutaway', np.array([-0.80, 0.70, 2.20])),
]

acc = gltf['accessors'][gltf['meshes'][16]['primitives'][0]['attributes']['POSITION']]
bv = gltf['bufferViews'][acc['bufferView']]
offset = bv.get('byteOffset', 0) + acc.get('byteOffset', 0)
sclera_verts = np.array([struct.unpack_from('<3f', bin_data, offset + i*12) for i in range(acc['count'])])

print("Sight line analysis:")
for name, cam in candidates:
    ray = target - cam
    ray_len = np.linalg.norm(ray)
    ray_dir = ray / ray_len
    vecs = sclera_verts - cam
    proj = np.dot(vecs, ray_dir)
    in_segment = (proj > 0.2) & (proj < ray_len - 0.1)
    perp = vecs - proj[:, None] * ray_dir
    dist_to_ray = np.linalg.norm(perp, axis=1)
    obstructing = np.sum(in_segment & (dist_to_ray < 0.10))
    print(f'{name}: cam={cam}, dist={ray_len:.2f}, obstructing sclera verts={obstructing}')
