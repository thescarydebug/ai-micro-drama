import json


def build_character_lookup(characters):
    """
    Convert the character list into a dictionary for fast lookup.

    Example:
        [
            {"name": "Leo", ...},
            {"name": "Sarah", ...}
        ]

    becomes:

        {
            "Leo": {...},
            "Sarah": {...}
        }
    """

    return {
        character["name"]: character
        for character in characters
    }
def build_character_description(character):
    """
    Convert one character's visual bible into a compact,
    consistent visual description.
    """

    return (
        f"{character['age']}-year-old {character['gender']}, "
        f"{character['physical_appearance']}. "
        f"Hairstyle: {character['hairstyle']}. "
        f"Clothing: {character['clothing']}. "
        f"Accessories: {character['accessories']}."
    )


def generate_visual_prompt(scene, character_lookup):
    """
    Build a detailed cinematic image-generation prompt
    from the scene and character bible.
    """

    character_descriptions = []

    for name in scene["characters"]:

        if name not in character_lookup:
            continue

        character = character_lookup[name]

        description = (
            f"{name} is a {character['age']}-year-old "
            f"{character['gender']} with "
            f"{character['physical_appearance']}. "
            f"They have {character['hairstyle']}. "
            f"They are wearing {character['clothing']}. "
            f"They have {character['accessories']}. "
            f"Their facial expression style is "
            f"{character['facial_expression_style']}."
        )

        character_descriptions.append(description)

    characters_text = " ".join(character_descriptions)

    prompt = (
        f"A cinematic frame from a high-budget "
        f"science-fiction thriller, set in a "
        f"{scene['location']} at {scene['time']}. "

        f"{characters_text} "

        f"{scene['action']} "

        f"The characters visibly convey "
        f"{scene['emotion']}. "

        f"The environment contains "
        f"{scene['visual_description']} "

        f"The scene is captured as a "
        f"{scene['camera_shot']}, with "
        f"{scene['lighting']}. "

        f"Use realistic human proportions, "
        f"realistic skin texture, detailed clothing "
        f"and physically accurate lighting. "

        f"Create strong foreground, subject and "
        f"background separation with cinematic depth "
        f"of field. "

        f"Photorealistic cinematic realism, subtle "
        f"film grain, dramatic contrast, professional "
        f"cinematography, high production value. "

        f"Maintain exactly the same character appearance, "
        f"hairstyle, clothing, accessories, age and "
        f"physical characteristics across every scene. "

        f"16:9 widescreen composition. "

        f"No text, subtitles, captions, logos, "
        f"watermarks or user-interface elements."
    )

    negative_prompt = (
        "cartoon, anime, illustration, low resolution, "
        "blurry, distorted face, deformed hands, "
        "extra fingers, extra limbs, duplicate characters, "
        "inconsistent character appearance, different "
        "clothing, different hairstyle, different age, "
        "text, subtitles, captions, watermark, logo, "
        "UI, oversaturated colors"
    )

    return {
        "scene_number": scene["scene_number"],
        "image_prompt": prompt,
        "negative_prompt": negative_prompt,
        "aspect_ratio": "16:9"
    }

def generate_all_visual_prompts(project):
    """
    Generate detailed visual prompts for every scene
    using the existing project.json data.
    """

    character_lookup = build_character_lookup(
        project["characters"]
    )

    prompts = []

    for scene in project["scenes"]:
        visual_prompt = generate_visual_prompt(
            scene,
            character_lookup
        )

        prompts.append(visual_prompt)

    return {
        "image_prompts": prompts
    }


def load_project(filename="project.json"):
    """
    Load the generated project from disk.
    """

    with open(filename, "r", encoding="utf-8") as file:
        return json.load(file)


def save_visual_prompts(
    prompts,
    filename="visual_prompts.json"
):
    """
    Save generated visual prompts to disk.
    """

    with open(
        filename,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            prompts,
            file,
            indent=2,
            ensure_ascii=False
        )