import os
import shutil

from gradio_client import Client


# --------------------------------------------------
# Configuration
# --------------------------------------------------

OUTPUT_DIR = "generated_images"

FLUX_SPACE = "black-forest-labs/FLUX.1-schnell"

# True cinematic 16:9 resolution.
# FLUX Space supports dimensions from 256 to 2048
# in increments of 32.
IMAGE_WIDTH = 1360
IMAGE_HEIGHT = 768

NUM_INFERENCE_STEPS = 4


# --------------------------------------------------
# Create FLUX client
# --------------------------------------------------

def create_client():
    """
    Connect to the official FLUX.1 Schnell Hugging Face Space.
    """

    print("Connecting to FLUX.1 Schnell...")

    client = Client(
        FLUX_SPACE
    )

    print("Connected!\n")

    return client


# --------------------------------------------------
# Generate a single image
# --------------------------------------------------

def generate_single_image(
    scene,
    client=None
):
    """
    Generate one cinematic image for a single scene.

    Used by:
        - Full image generation
        - Retry Scene
    """

    os.makedirs(
        OUTPUT_DIR,
        exist_ok=True
    )

    scene_number = scene["scene_number"]

    prompt = scene["image_prompt"]

    # --------------------------------------------------
    # Display information
    # --------------------------------------------------

    print("=" * 60)

    print(
        f"Generating Scene {scene_number}..."
    )

    print("=" * 60)

    print("Resolution:")
    print(
        f"{IMAGE_WIDTH} x {IMAGE_HEIGHT}"
    )

    print("\nPrompt:")

    if len(prompt) > 500:
        print(
            prompt[:500] + "..."
        )
    else:
        print(prompt)

    print()

    try:

        # --------------------------------------------------
        # Connect only if a client wasn't supplied
        # --------------------------------------------------

        if client is None:

            client = create_client()

        # --------------------------------------------------
        # Deterministic seed per scene
        # --------------------------------------------------

        seed = 42 + scene_number

        # --------------------------------------------------
        # Generate image
        # --------------------------------------------------

        result = client.predict(

            prompt,

            seed,

            False,

            IMAGE_WIDTH,

            IMAGE_HEIGHT,

            NUM_INFERENCE_STEPS,

            api_name="/infer"
        )

        image_path = result[0]

        returned_seed = result[1]

        # --------------------------------------------------
        # Permanent output path
        # --------------------------------------------------

        output_path = os.path.join(

            OUTPUT_DIR,

            f"scene_{scene_number}.webp"

        )

        shutil.copy2(

            image_path,

            output_path

        )

        print(
            f"Saved: {output_path}"
        )

        print(
            f"Seed: {returned_seed}"
        )

        print()

        # --------------------------------------------------
        # Browser-accessible URL
        # --------------------------------------------------

        return {

            "scene_number": scene_number,

            "status": "complete",

            "image_url": (
                "http://127.0.0.1:8000/"
                "generated-images/"
                f"scene_{scene_number}.webp"
            ),

            "seed": returned_seed,

            "width": IMAGE_WIDTH,

            "height": IMAGE_HEIGHT,

            "aspect_ratio": "16:9"

        }

    except Exception as e:

        print(
            f"Scene {scene_number} failed:"
        )

        print(e)

        print()

        return {

            "scene_number": scene_number,

            "status": "error",

            "image_url": None,

            "seed": None,

            "width": IMAGE_WIDTH,

            "height": IMAGE_HEIGHT,

            "aspect_ratio": "16:9",

            "error": str(e)

        }


# --------------------------------------------------
# Generate all scene images
# --------------------------------------------------

def generate_images(project):
    """
    Generate one cinematic FLUX image for every scene.

    Each scene is handled independently.

    If one scene fails, the remaining scenes continue.
    """

    os.makedirs(

        OUTPUT_DIR,

        exist_ok=True

    )

    # --------------------------------------------------
    # Connect once
    # --------------------------------------------------

    try:

        client = create_client()

    except Exception as e:

        print(
            "Could not connect to FLUX:"
        )

        print(e)

        return [

            {

                "scene_number":
                    scene["scene_number"],

                "status":
                    "error",

                "image_url":
                    None,

                "seed":
                    None,

                "width":
                    IMAGE_WIDTH,

                "height":
                    IMAGE_HEIGHT,

                "aspect_ratio":
                    "16:9",

                "error":
                    str(e)

            }

            for scene in project["scenes"]

        ]

    # --------------------------------------------------
    # Generate scenes
    # --------------------------------------------------

    generated_images = []

    for scene in project["scenes"]:

        result = generate_single_image(

            scene,

            client=client

        )

        generated_images.append(
            result
        )

    # --------------------------------------------------
    # Final summary
    # --------------------------------------------------

    completed = sum(

        1

        for image in generated_images

        if image["status"] == "complete"

    )

    failed = sum(

        1

        for image in generated_images

        if image["status"] == "error"

    )

    print("=" * 60)

    print(
        "IMAGE GENERATION FINISHED"
    )

    print("=" * 60)

    print(
        f"Completed: {completed}"
    )

    print(
        f"Failed:    {failed}"
    )

    print(
        f"Resolution: {IMAGE_WIDTH}x{IMAGE_HEIGHT}"
    )

    print(
        "Aspect Ratio: 16:9"
    )

    print("=" * 60)

    return generated_images