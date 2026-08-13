from prompt_engine import (
    load_project,
    generate_all_visual_prompts,
    save_visual_prompts
)


print("Loading project.json...")

project = load_project()

print("Generating visual prompts...")

visual_prompts = generate_all_visual_prompts(project)

print(
    f"Generated {len(visual_prompts['image_prompts'])} "
    "visual prompts."
)

print("\nFIRST VISUAL PROMPT:\n")

print(
    visual_prompts["image_prompts"][0]["image_prompt"]
)

print("\nNEGATIVE PROMPT:\n")

print(
    visual_prompts["image_prompts"][0]["negative_prompt"]
)

save_visual_prompts(visual_prompts)

print("\nSaved to visual_prompts.json")