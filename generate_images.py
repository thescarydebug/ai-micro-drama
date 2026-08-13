import json
import os
import shutil

from gradio_client import Client


# --------------------------------------------------
# Load visual prompts
# --------------------------------------------------

with open("visual_prompts.json", "r", encoding="utf-8") as f:
    data = json.load(f)

prompts = data["image_prompts"]


# --------------------------------------------------
# Create output directory
# --------------------------------------------------

output_dir = "generated_images"

os.makedirs(
    output_dir,
    exist_ok=True
)


# --------------------------------------------------
# Connect to FLUX
# --------------------------------------------------

print("Connecting to FLUX.1 Schnell...")

client = Client(
    "black-forest-labs/FLUX.1-schnell"
)

print("Connected!\n")


# --------------------------------------------------
# Generate every scene
# --------------------------------------------------

for scene in prompts:

    scene_number = scene["scene_number"]

    prompt = scene["image_prompt"]

    print("=" * 60)
    print(f"Generating Scene {scene_number}...")
    print("=" * 60)

    result = client.predict(
        prompt,
        42 + scene_number,
        True,
        1024,
        1024,
        4,
        api_name="/infer"
    )

    image_path = result[0]
    seed = result[1]

    output_path = os.path.join(
        output_dir,
        f"scene_{scene_number}.webp"
    )

    shutil.copy2(
        image_path,
        output_path
    )

    print(f"Saved: {output_path}")
    print(f"Seed: {seed}")
    print()


print("=" * 60)
print("ALL SCENES GENERATED!")
print("=" * 60)