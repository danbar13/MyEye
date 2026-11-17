import bpy
import bmesh
import math
from mathutils import Vector

bpy.ops.wm.read_factory_settings(use_empty=True)

mesh = bpy.data.meshes.new("Edema_Swelling_mesh")
obj = bpy.data.objects.new("Edema_Swelling", mesh)
bpy.context.collection.objects.link(obj)

bm = bmesh.new()
bmesh.ops.create_circle(bm, cap_ends=True, radius=0.16, segments=24)
bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=2, use_grid_fill=True)

for v in bm.verts:
    y = 0.22 + v.co.x
    z = -0.22 + v.co.y
    dist_sq = y*y + z*z
    x = math.sqrt(max(0.01, 0.920**2 - dist_sq))
    v.co = Vector((x, y, z))

bm.to_mesh(mesh)
bm.free()

center_y = 0.22
center_z = -0.22
radius = 0.16

for i, v in enumerate(mesh.vertices[:10]):
    dy = v.co.y - center_y
    dz = v.co.z - center_z
    dist = math.sqrt(dy*dy + dz*dz)
    falloff = max(0.0, 1.0 - (dist / radius))
    print(f"Vert {i}: y={v.co.y:.4f}, z={v.co.z:.4f}, dist={dist:.4f}, falloff={falloff:.4f}")
