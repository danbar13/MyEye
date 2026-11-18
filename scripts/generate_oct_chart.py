import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import numpy as np
from datetime import datetime
import os

# Set style
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
fig, ax = plt.subplots(figsize=(19.14, 10.34), dpi=150)

# Colors
COLOR_BG = '#ffffff'
COLOR_GRID = '#e5e7eb'
COLOR_OS = '#0077b6'
COLOR_OS_POINT = '#0096c7'
COLOR_OD = '#d97706'
COLOR_PHYSIO = '#ecfdf5'
COLOR_PHYSIO_BORDER = '#a7f3d0'
COLOR_TEXT_MAIN = '#111827'
COLOR_TEXT_MUTED = '#4b5563'

fig.patch.set_facecolor(COLOR_BG)
ax.set_facecolor(COLOR_BG)

# Data
dates_os_str = [
    '23/11/2021', '30/05/2024', '14/10/2024', '07/01/2025', '27/02/2025',
    '11/03/2025', '21/07/2025', '24/11/2025', '04/03/2026', '30/06/2026',
    '14/09/2026', '16/11/2026'
]
dates_os = [datetime.strptime(d, '%d/%m/%Y') for d in dates_os_str]
thickness_os = [245, 445, 465, 348, 478, 341, 347, 430, 565, 500, 521, 543]

dates_od_str = [
    '23/11/2021', '30/05/2024', '14/10/2024', '07/01/2025', '27/02/2025',
    '11/03/2025', '21/07/2025', '24/11/2025', '04/03/2026', '30/06/2026',
    '14/09/2026', '16/11/2026'
]
dates_od = [datetime.strptime(d, '%d/%m/%Y') for d in dates_od_str]
thickness_od = [209, 265, 280, 281, 282, 277, 280, 277, 277, 282, 280, 235]

# X range - extra room at the end for late 2026 annotations
xlim_start = datetime(2021, 9, 1)
xlim_end = datetime(2027, 2, 15)

# Normal Physiological Range (250 - 285 um)
ax.axhspan(250, 285, color=COLOR_PHYSIO, alpha=0.9, zorder=1)
ax.axhline(250, color=COLOR_PHYSIO_BORDER, linewidth=1, linestyle='--', zorder=1)
ax.axhline(285, color=COLOR_PHYSIO_BORDER, linewidth=1, linestyle='--', zorder=1)

# Plot Right Eye (OD)
ax.plot(dates_od, thickness_od, color=COLOR_OD, linestyle='--', linewidth=2.8,
        marker='s', markersize=8, markerfacecolor=COLOR_OD, markeredgecolor='white', markeredgewidth=1.5,
        label='Right Eye (OD) – Healthy Control (~275–282 µm / 235 µm)', zorder=4)

# Plot Left Eye (OS)
ax.plot(dates_os, thickness_os, color=COLOR_OS, linestyle='-', linewidth=4.2,
        marker='o', markersize=9, markerfacecolor=COLOR_OS_POINT, markeredgecolor='white', markeredgewidth=2,
        label='Left Eye (OS) – BRVO & Edema Fluctuations (245–565 µm)', zorder=5)

# Value callouts for OS points
callout_offsets = {
    0: (-35, -20),   # 2021: 245
    1: (-35, 12),    # 2024-05: 445
    2: (-15, 14),    # 2024-10: 465
    3: (-25, -22),   # 2025-01: 348
    4: (-15, 14),    # 2025-02: 478
    5: (10, -22),    # 2025-03: 341
    6: (15, -20),    # 2025-07: 347
    7: (-15, 14),    # 2025-11: 430
    8: (-15, 14),    # 2026-03: 565
    9: (-15, 14),    # 2026-06: 500
    10: (-25, 14),   # 2026-09: 521
    11: (18, 12),    # 2026-11: 543
}

for i, (dt, val) in enumerate(zip(dates_os, thickness_os)):
    ox, oy = callout_offsets.get(i, (0, 12))
    label_text = f'{val} µm'
    if i == 11:
        label_text = f'16/11: {val} µm'
    bbox_props = dict(boxstyle='square,pad=0.3', facecolor='white', edgecolor='#94a3b8', linewidth=1.2, alpha=0.95)
    if i == 11:
        bbox_props = dict(boxstyle='round,pad=0.4', facecolor='#eff6ff', edgecolor='#0284c7', linewidth=1.8, alpha=0.98)
    ax.annotate(label_text, xy=(mdates.date2num(dt), val),
                xytext=(ox, oy), textcoords='offset points',
                fontsize=10.5, fontweight='bold', color='#0f172a',
                bbox=bbox_props, zorder=6)

# OD callout for the latest normal reading 235 um
ax.annotate('16/11: 235 µm', xy=(mdates.date2num(dates_od[-1]), 235),
            xytext=(-25, -24), textcoords='offset points',
            fontsize=9.5, fontweight='bold', color=COLOR_OD,
            bbox=dict(boxstyle='round,pad=0.3', facecolor='#fffbeb', edgecolor='#f59e0b', linewidth=1.3),
            zorder=6)

# Interventions and milestone vertical lines + boxes
interventions = [
    {
        'date': datetime(2024, 6, 15),
        'color': '#7c3aed',
        'box_y': 525,
        'title': 'Ozurdex #1\n(Steroid Implant)',
        'align': 'center'
    },
    {
        'date': datetime(2024, 11, 3),
        'color': '#7c3aed',
        'box_y': 625,
        'title': 'Ozurdex #2\n(Drives -117 µm drop)',
        'align': 'center'
    },
    {
        'date': datetime(2025, 3, 15),
        'color': '#ea580c',
        'box_y': 485,
        'title': 'Focal Laser #1\n+ Heart Surgery',
        'align': 'center'
    },
    {
        'date': datetime(2025, 7, 25),
        'color': '#ea580c',
        'box_y': 485,
        'title': 'Focal Laser #2\n(Macroaneurysms)',
        'align': 'center'
    },
    {
        'date': datetime(2025, 11, 28),
        'color': '#0d9488',
        'box_y': 570,
        'title': 'Laser #3 + Restart\n3x Monthly Avastin',
        'align': 'center'
    },
    {
        'date': datetime(2026, 3, 10),
        'color': '#0284c7',
        'box_y': 650,
        'title': 'Switch to 4x Vabysmo\n(Refractory: 500–565 µm)',
        'align': 'center'
    },
    {
        'date': datetime(2026, 10, 18),
        'color': '#7c3aed',
        'box_y': 620,
        'title': 'Ozurdex #3\n(Protective Implant)',
        'align': 'right',
        'offset_x': -8
    },
    {
        'date': datetime(2026, 11, 2),
        'color': '#059669',
        'box_y': 480,
        'title': 'Cataract Surgery\n(Phaco + IOL)',
        'align': 'center',
        'offset_x': 0
    },
    {
        'date': datetime(2026, 11, 16),
        'color': '#0284c7',
        'box_y': 635,
        'title': 'OCT Follow-Up (16/11)\nEdema Contained (543 µm)',
        'align': 'left',
        'offset_x': 10
    }
]

for inv in interventions:
    dt_num = mdates.date2num(inv['date'])
    ax.axvline(dt_num, color=inv['color'], linestyle=':', linewidth=1.8, alpha=0.85, zorder=2)
    ox = inv.get('offset_x', 0)
    ax.annotate(inv['title'], xy=(dt_num, inv['box_y']),
                xytext=(ox, 0), textcoords='offset points',
                ha=inv.get('align', 'center'), va='center',
                fontsize=9, fontweight='bold', color=inv['color'],
                bbox=dict(boxstyle='round,pad=0.4', facecolor='white', edgecolor=inv['color'], linewidth=1.5, alpha=0.96),
                zorder=7)

# Multi-year stability banner (placed above the line around 2023)
banner_dt = datetime(2022, 11, 1)
ax.text(mdates.date2num(banner_dt), 370,
        '2022–2023: Initial Avastin Series\n& Prolonged Clinical Stability',
        ha='center', va='center', fontsize=9.5, fontweight='bold', color='#475569',
        bbox=dict(boxstyle='round,pad=0.5', facecolor='#f8fafc', edgecolor='#cbd5e1', linewidth=1.2),
        zorder=3)

# Titles
ax.text(0.025, 0.965, 'Left Eye Retinal Thickness Fluctuated (245 to 565 µm) Driven by Edema Cycles and Therapies',
        transform=ax.transAxes, fontsize=19, fontweight='heavy', color='#0f172a', va='top')
ax.text(0.025, 0.930, 'Longitudinal OCT Analysis (2021–2026): Response to Ozurdex vs. Refractory CME | Post-Cataract Follow-Up (16/11/2026)',
        transform=ax.transAxes, fontsize=12.5, fontweight='normal', color='#475569', va='top')

# Legend
leg_handles = [
    plt.Rectangle((0, 0), 1, 1, fc=COLOR_PHYSIO, ec=COLOR_PHYSIO_BORDER, label='Normal Physiological Range (250–285 µm)'),
    plt.Line2D([0], [0], color=COLOR_OD, linestyle='--', marker='s', markersize=7, label='Right Eye (OD) – Healthy Control (~275–282 µm / 235 µm)'),
    plt.Line2D([0], [0], color=COLOR_OS, linestyle='-', marker='o', markersize=8, label='Left Eye (OS) – BRVO & Edema Fluctuations (245–565 µm)')
]
ax.legend(handles=leg_handles, loc='upper left', bbox_to_anchor=(0.025, 0.895),
          frameon=True, framealpha=0.92, facecolor='white', edgecolor='#cbd5e1',
          fontsize=10.5, labelspacing=0.6, borderpad=0.7)

# Grid and axes
ax.set_xlim(mdates.date2num(xlim_start), mdates.date2num(xlim_end))
ax.set_ylim(160, 710)

ax.xaxis.set_major_locator(mdates.MonthLocator(bymonth=[1, 4, 7, 10]))
ax.xaxis.set_major_formatter(mdates.DateFormatter('%b %Y'))
fig.autofmt_xdate(rotation=30, ha='right')

ax.set_ylabel('Central Retinal Subfield Thickness (µm)', fontsize=12.5, fontweight='bold', color='#1e293b', labelpad=12)
ax.set_xlabel('Timeline (Longitudinal OCT 2021 – 2026)', fontsize=12.5, fontweight='bold', color='#1e293b', labelpad=12)

ax.tick_params(axis='both', which='major', labelsize=10.5, colors='#334155')
ax.grid(True, linestyle='-', linewidth=0.7, color='#e2e8f0', alpha=0.8)

# Footer caption
ax.text(0.015, -0.11, 'Source: Longitudinal OCT Scans (Spectralis Tracking Laser Tomography), Fluorescein Angiographies & Clinical Records (2021–2026). Updated with 16/11/2026 exam.',
        transform=ax.transAxes, fontsize=9.5, color='#64748b', va='top')

plt.tight_layout()

# Save paths
out_paths = [
    'public/retinal-thickness-longitudinal-chart.png',
    'public/images/retinal-thickness-longitudinal-chart.png',
    'retinal-thickness-longitudinal-chart.png',
    'dist/retinal-thickness-longitudinal-chart.png',
    'dist/images/retinal-thickness-longitudinal-chart.png'
]

for p in out_paths:
    d = os.path.dirname(p)
    if d and not os.path.exists(d):
        os.makedirs(d, exist_ok=True)
    fig.savefig(p, dpi=150)
    print(f'Saved: {p}')

print('Refined chart generated successfully!')
