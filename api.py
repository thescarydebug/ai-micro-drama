from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from story_engine import generate_full_project
from image_engine import (
    generate_images,
    generate_single_image,
)

app = FastAPI()


# --------------------------------------------------
# Serve generated images
# --------------------------------------------------

app.mount(
    "/generated-images",
    StaticFiles(directory="generated_images"),
    name="generated-images",
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ai-micro-drama-wheat.vercel.app",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Health check
# --------------------------------------------------

@app.get("/")
def health_check():
    return {
        "status": "ok",
        "message": "MicroDrama API is running",
    }


# --------------------------------------------------
# Generate complete story
# --------------------------------------------------

@app.post("/generate")
def generate_drama(data: dict):

    idea = data.get("idea", "").strip()

    if not idea:
        return {
            "error": "Story idea is required"
        }

    project = generate_full_project(idea)

    return project


# --------------------------------------------------
# Generate cinematic images for all scenes
# --------------------------------------------------

@app.post("/generate-images")
def generate_project_images(data: dict):

    project = data.get("project")

    if not project:
        return {
            "status": "error",
            "error": "Project is required"
        }

    try:

        images = generate_images(project)

        completed = sum(
            1
            for image in images
            if image["status"] == "complete"
        )

        failed = sum(
            1
            for image in images
            if image["status"] == "error"
        )

        if failed == 0:
            status = "complete"

        elif completed > 0:
            status = "partial"

        else:
            status = "error"

        return {
            "status": status,
            "images": images,
            "completed": completed,
            "failed": failed,
            "total": len(images),
        }

    except Exception as e:

        print("Image generation failed:")
        print(e)

        return {
            "status": "error",
            "error": str(e),
        }


# --------------------------------------------------
# Generate / retry a single cinematic image
# --------------------------------------------------

@app.post("/generate-image")
def generate_project_image(data: dict):

    scene = data.get("scene")

    if not scene:
        return {
            "status": "error",
            "error": "Scene is required"
        }

    try:

        image = generate_single_image(scene)

        return image

    except Exception as e:

        print("Single image generation failed:")
        print(e)

        return {
            "status": "error",
            "error": str(e),
        }
