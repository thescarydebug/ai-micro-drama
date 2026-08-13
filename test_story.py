from story_engine import (
    generate_story,
    generate_character_bible,
    generate_scenes,
    generate_image_prompts
)

idea = """
A college student receives a voice message from himself three days
in the future warning him not to let his lab partner activate an
experimental machine.
"""

print("Generating story...")
story = generate_story(idea)

print("Generating character bible...")
character_bible = generate_character_bible(
    story["characters"]
)

print("Generating scenes...")
scenes = generate_scenes(
    story,
    character_bible
)

print("Generating image prompts...")
image_prompts = generate_image_prompts(
    scenes,
    character_bible
)

print("\nSTORY:")
print(story)

print("\nCHARACTER BIBLE:")
print(character_bible)

print("\nSCENES:")
print(scenes)

print("\nIMAGE PROMPTS:")
print(image_prompts)