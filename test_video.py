import json

from video_engine import generate_video


print("=" * 60)
print("TESTING VIDEO ENGINE")
print("=" * 60)


# --------------------------------------------------
# Load generated project
# --------------------------------------------------

print("Loading project.json...")

with open(
    "project.json",
    "r",
    encoding="utf-8"
) as f:

    project = json.load(f)


print("Project loaded!")

print(
    f"Scenes: {len(project['scenes'])}"
)

print()


# --------------------------------------------------
# Generate video
# --------------------------------------------------

result = generate_video(
    project
)


# --------------------------------------------------
# Result
# --------------------------------------------------

print()
print("=" * 60)
print("TEST RESULT")
print("=" * 60)

print(result)

print("=" * 60)