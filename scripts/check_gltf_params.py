import bpy
props = bpy.ops.export_scene.gltf.get_rna_type().properties
for p in props:
    if any(x in p.identifier for x in ['morph', 'shape', 'target', 'anim', 'apply']):
        print(p.identifier, p.description)
