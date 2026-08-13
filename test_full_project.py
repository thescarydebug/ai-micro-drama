from story_engine import generate_full_project
import json

idea = """
A college student receives a voice message from himself three days
in the future warning him not to let his lab partner activate an
experimental machine.
"""

print("Generating complete project...")
print("This makes ONE Gemini API call.\n")

project = generate_full_project(idea)

print("PROJECT GENERATED!\n")

print("TITLE:")
print(project["story"]["title"])

print("\nGENRE:")
print(project["story"]["genre"])

print("\nCHARACTERS:")
for character in project["characters"]:
    print("-", character["name"])

print("\nNUMBER OF SCENES:")
print(len(project["scenes"]))

print("\nFIRST IMAGE PROMPT:")
print(project["scenes"][0]["image_prompt"])

with open("project.json", "w", encoding="utf-8") as f:
    json.dump(project, f, indent=2, ensure_ascii=False)

print("\nSaved complete project to project.json")