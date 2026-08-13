import json

from image_engine import generate_images


print("Loading project.json...")

with open(
    "project.json",
    "r",
    encoding="utf-8"
) as f:
    project = json.load(f)


print("Project loaded!")
print(
    f"Generating images for {len(project['scenes'])} scenes..."
)

images = generate_images(project)


print("\nGenerated images:")

for image in images:
    print(
        f"Scene {image['scene_number']}: "
        f"{image['image_path']}"
    )