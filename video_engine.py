import os

from moviepy import (
    ImageClip,
    concatenate_videoclips,
)


# --------------------------------------------------
# Configuration
# --------------------------------------------------

IMAGE_DIR = "generated_images"
OUTPUT_DIR = "generated_videos"

VIDEO_WIDTH = 1360
VIDEO_HEIGHT = 768

SCENE_DURATION = 4


# --------------------------------------------------
# Generate video from scene images
# --------------------------------------------------

def generate_video(project):
    """
    Create a cinematic MP4 from the generated scene images.

    Each scene image is displayed for a few seconds and
    all scenes are combined into one video.
    """

    os.makedirs(
        OUTPUT_DIR,
        exist_ok=True
    )

    print("=" * 60)
    print("GENERATING MICRO-DRAMA VIDEO")
    print("=" * 60)

    clips = []

    scenes = project.get("scenes", [])

    if not scenes:
        raise ValueError(
            "Project contains no scenes."
        )

    # --------------------------------------------------
    # Process every scene
    # --------------------------------------------------

    for scene in scenes:

        scene_number = scene["scene_number"]

        image_path = os.path.join(
            IMAGE_DIR,
            f"scene_{scene_number}.webp"
        )

        print(
            f"Processing Scene {scene_number}..."
        )

        if not os.path.exists(image_path):

            raise FileNotFoundError(
                f"Image not found: {image_path}"
            )

        # --------------------------------------------------
        # Create image clip
        # --------------------------------------------------

        clip = (
            ImageClip(image_path)
            .with_duration(SCENE_DURATION)
        )

        # --------------------------------------------------
        # Resize to our cinematic resolution
        # --------------------------------------------------

        clip = clip.resized(
            width=VIDEO_WIDTH,
            height=VIDEO_HEIGHT
        )

        clips.append(clip)

    # --------------------------------------------------
    # Combine scenes
    # --------------------------------------------------

    print()
    print("Combining scenes...")

    final_video = concatenate_videoclips(
        clips,
        method="compose"
    )

    # --------------------------------------------------
    # Output
    # --------------------------------------------------

    output_path = os.path.join(
        OUTPUT_DIR,
        "microdrama.mp4"
    )

    print(
        f"Writing video to: {output_path}"
    )

    final_video.write_videofile(
        output_path,
        fps=24,
        codec="libx264",
        audio=False
    )

    # --------------------------------------------------
    # Cleanup
    # --------------------------------------------------

    final_video.close()

    for clip in clips:
        clip.close()

    print()
    print("=" * 60)
    print("VIDEO GENERATION COMPLETE!")
    print("=" * 60)

    print(
        f"Saved: {output_path}"
    )

    print(
        f"Duration: "
        f"{len(scenes) * SCENE_DURATION} seconds"
    )

    print("=" * 60)

    return {
        "status": "complete",
        "video_path": output_path,
        "duration_seconds":
            len(scenes) * SCENE_DURATION
    }