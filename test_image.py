import json
import os
import shutil

from gradio_client import Client


# --------------------------------------------------
# Load visual prompts
# --------------------------------------------------

with open("visual_prompts.json", "r", encoding="utf-8") as f:
    data = json.load(f)


prompt_data = data["image_prompts"][0]

prompt = prompt_data["image_prompt"]


print("Using Scene 1 prompt...")
print(prompt)

print("\nConnecting to FLUX.1 Schnell Space...")


# --------------------------------------------------
# Connect to FLUX
# --------------------------------------------------

client = Client(
    "black-forest-labs/FLUX.1-schnell"
)

print("Connected!")

print("Generating Scene 1...")


# --------------------------------------------------
# Generate image
# --------------------------------------------------

result = client.predict(
    prompt,
    42,
    True,
    1024,
    1024,
    4,
    api_name="/infer"
)


# --------------------------------------------------
# Get generated image path
# --------------------------------------------------

image_path = result[0]

print("\nGeneration complete!")
print("Temporary image:")
print(image_path)


# --------------------------------------------------
# Create output directory
# --------------------------------------------------

output_dir = "generated_images"

os.makedirs(
    output_dir,
    exist_ok=True
)


# --------------------------------------------------
# Save image permanently
# --------------------------------------------------

output_path = os.path.join(
    output_dir,
    "scene_1.webp"
)


shutil.copy2(
    image_path,
    output_path
)


print("\nImage saved permanently:")
print(output_path)

print("\nSeed:")
print(result[1])