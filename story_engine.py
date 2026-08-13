import os
import json

from dotenv import load_dotenv
from google import genai


# --------------------------------------------------
# Environment
# --------------------------------------------------

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


# --------------------------------------------------
# Generate complete MicroDrama project
# --------------------------------------------------

def generate_full_project(idea):
    """
    Generate the complete MicroDrama production package
    using a single Gemini API call.

    The response contains:

    - Story
    - Character bible
    - 5-7 scenes
    - Detailed cinematic image prompts
    - Negative prompts
    - 16:9 aspect ratio
    """

    prompt = """
You are an AI micro-drama production system combining the roles of:

1. Professional screenwriter
2. Character designer
3. Film director
4. Cinematographer
5. AI image-prompt engineer

Your task is to transform the user's idea into a complete,
production-ready 1-2 minute cinematic micro-drama.

USER IDEA:
""" + idea + """

==================================================
STORY REQUIREMENTS
==================================================

1. Stay faithful to the user's original idea.
2. Do not replace the core premise with an unrelated story.
3. Create a strong beginning, middle, escalation, ending and twist.
4. Create exactly 5 cinematic scenes.
5. Every scene must logically follow from the previous scene.
6. The final scene must deliver the story's twist or payoff.
7. Keep the story suitable for a 1-2 minute micro-drama.
8. Keep the number of main characters small.
9. Dialogue must be concise and cinematic.

==================================================
CHARACTER DESIGN REQUIREMENTS
==================================================

For every important character create a detailed visual identity.

Each character MUST have:

- name
- age
- gender
- physical appearance
- hairstyle
- clothing
- accessories
- personality
- facial expression style
- visual style

Character descriptions must be specific enough for an
AI image-generation model to reproduce the same person
across multiple scenes.

Examples of useful visual information include:

- approximate body type
- skin tone
- facial structure
- hair color
- hairstyle
- clothing colors
- clothing type
- distinctive accessories
- recognizable physical features

Avoid vague descriptions such as:

"young man"

Instead use descriptions such as:

"21-year-old male with a slender build, pale skin,
angular face, dark circles under his eyes, messy
dark-brown hair, wearing a charcoal-gray hoodie
over a plain white t-shirt and a vintage analog
wristwatch."

==================================================
SCENE REQUIREMENTS
==================================================

Create exactly 5 scenes.

For every scene provide:

- scene_number
- location
- time
- characters
- action
- dialogue
- emotion
- camera_shot
- lighting
- visual_description
- duration_seconds
- image_prompt
- negative_prompt
- aspect_ratio

Every scene should feel like a frame from the SAME film.

Maintain continuity of:

- characters
- faces
- age
- hairstyle
- clothing
- accessories
- environment
- time
- visual style

Do not randomly change a character's appearance between scenes.

==================================================
IMAGE PROMPT REQUIREMENTS
==================================================

This is extremely important.

The "image_prompt" is NOT a short description.

It must be a detailed production-ready prompt for a
photorealistic AI image-generation model.

For EVERY scene, the image prompt MUST include:

1. Cinematic context
2. Location
3. Time of day
4. Every character actually present in the scene
5. Each character's exact visual identity
6. Character pose
7. Character action
8. Facial expression
9. Emotional state
10. Important environment details
11. Important props
12. Camera framing
13. Camera perspective
14. Lighting
15. Atmosphere
16. Foreground/background separation
17. Depth of field
18. Realistic human proportions
19. Realistic skin texture
20. Detailed clothing
21. Physically accurate lighting
22. Photorealistic cinematic realism
23. Subtle film grain
24. Dramatic but realistic contrast
25. High-production-value cinematography
26. 16:9 widescreen composition

Begin each prompt with a cinematic description such as:

"A cinematic frame from a high-budget science-fiction
thriller..."

Then describe the actual scene.

==================================================
CHARACTER CONSISTENCY
==================================================

This is one of the most important requirements.

Whenever a character appears in an image prompt:

REPEAT their important visual identity.

Do NOT simply write:

"Leo looks frightened."

Instead write the character's visual identity again:

"Leo, a 21-year-old male with a slender build,
pale skin, angular features, dark circles under his
eyes and messy brown hair, wearing a gray hoodie over
a plain white t-shirt and a vintage analog wristwatch,
looks frightened..."

This repetition is intentional.

It allows an image-generation model to maintain
character consistency between scenes.

If two characters appear together, describe BOTH
characters individually.

Do not describe characters who are not present in
the scene.

==================================================
CINEMATIC COMPOSITION
==================================================

Choose camera framing appropriate to the scene.

Examples:

- extreme close-up
- close-up
- medium close-up
- medium shot
- two-shot
- over-the-shoulder
- wide shot
- establishing shot
- handheld tracking shot

The camera shot must make sense for the action.

Lighting should also match the emotional tone.

Examples:

- cold blue fluorescent lighting
- warm practical lighting
- flickering laboratory lights
- red emergency lighting
- harsh backlight
- soft moonlight
- high-contrast cinematic lighting

==================================================
VISUAL STYLE
==================================================

Every image must look like it belongs to the same
high-budget science-fiction thriller.

Use:

- photorealistic cinematic realism
- realistic human proportions
- realistic skin texture
- detailed clothing
- physically accurate lighting
- cinematic depth of field
- subtle film grain
- dramatic contrast
- professional cinematography
- high production value

Do NOT use:

- cartoon
- anime
- illustration
- painting
- low-poly
- fantasy art
- distorted anatomy
- unrealistic faces

==================================================
NEGATIVE PROMPT
==================================================

Every scene must have a useful negative prompt.

It should include:

cartoon, anime, illustration, painting, low resolution,
blurry, distorted face, deformed hands, extra fingers,
extra limbs, duplicate characters, inconsistent character
appearance, different clothing, different hairstyle,
different age, text, subtitles, captions, logo,
watermark, UI, oversaturated colors

==================================================
ASPECT RATIO
==================================================

Every scene MUST use:

"16:9"

==================================================
OUTPUT FORMAT
==================================================

Return ONLY valid JSON.

Do not include:

- markdown
- code fences
- explanations
- comments
- text outside JSON

Use EXACTLY this structure:

{
  "story": {
    "title": "string",
    "genre": "string",
    "logline": "string",
    "beginning": "string",
    "middle": "string",
    "ending": "string",
    "twist": "string"
  },

  "characters": [
    {
      "name": "string",
      "age": "string",
      "gender": "string",
      "physical_appearance": "string",
      "hairstyle": "string",
      "clothing": "string",
      "accessories": "string",
      "personality": "string",
      "facial_expression_style": "string",
      "visual_style": "string"
    }
  ],

  "scenes": [
    {
      "scene_number": 1,
      "location": "string",
      "time": "string",
      "characters": ["string"],
      "action": "string",
      "dialogue": "string",
      "emotion": "string",
      "camera_shot": "string",
      "lighting": "string",
      "visual_description": "string",
      "duration_seconds": 15,
      "image_prompt": "string",
      "negative_prompt": "string",
      "aspect_ratio": "16:9"
    }
  ]
}

IMPORTANT:

The image_prompt field must contain the FULL,
DETAILED cinematic prompt.

Do not abbreviate character descriptions.

Do not replace repeated character descriptions
with phrases such as:

"same character as before"

or

"as previously described".

Each scene must be independently usable by an
image-generation model.
"""

    # --------------------------------------------------
    # Gemini generation
    # --------------------------------------------------

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt,
        config={
            "response_mime_type": "application/json",

            "response_schema": {
                "type": "OBJECT",

                "properties": {

                    # ----------------------------------
                    # STORY
                    # ----------------------------------

                    "story": {
                        "type": "OBJECT",

                        "properties": {

                            "title": {
                                "type": "STRING"
                            },

                            "genre": {
                                "type": "STRING"
                            },

                            "logline": {
                                "type": "STRING"
                            },

                            "beginning": {
                                "type": "STRING"
                            },

                            "middle": {
                                "type": "STRING"
                            },

                            "ending": {
                                "type": "STRING"
                            },

                            "twist": {
                                "type": "STRING"
                            }
                        },

                        "required": [
                            "title",
                            "genre",
                            "logline",
                            "beginning",
                            "middle",
                            "ending",
                            "twist"
                        ]
                    },

                    # ----------------------------------
                    # CHARACTERS
                    # ----------------------------------

                    "characters": {
                        "type": "ARRAY",

                        "items": {
                            "type": "OBJECT",

                            "properties": {

                                "name": {
                                    "type": "STRING"
                                },

                                "age": {
                                    "type": "STRING"
                                },

                                "gender": {
                                    "type": "STRING"
                                },

                                "physical_appearance": {
                                    "type": "STRING"
                                },

                                "hairstyle": {
                                    "type": "STRING"
                                },

                                "clothing": {
                                    "type": "STRING"
                                },

                                "accessories": {
                                    "type": "STRING"
                                },

                                "personality": {
                                    "type": "STRING"
                                },

                                "facial_expression_style": {
                                    "type": "STRING"
                                },

                                "visual_style": {
                                    "type": "STRING"
                                }
                            },

                            "required": [
                                "name",
                                "age",
                                "gender",
                                "physical_appearance",
                                "hairstyle",
                                "clothing",
                                "accessories",
                                "personality",
                                "facial_expression_style",
                                "visual_style"
                            ]
                        }
                    },

                    # ----------------------------------
                    # SCENES
                    # ----------------------------------

                    "scenes": {
                        "type": "ARRAY",

                        "items": {
                            "type": "OBJECT",

                            "properties": {

                                "scene_number": {
                                    "type": "INTEGER"
                                },

                                "location": {
                                    "type": "STRING"
                                },

                                "time": {
                                    "type": "STRING"
                                },

                                "characters": {
                                    "type": "ARRAY",

                                    "items": {
                                        "type": "STRING"
                                    }
                                },

                                "action": {
                                    "type": "STRING"
                                },

                                "dialogue": {
                                    "type": "STRING"
                                },

                                "emotion": {
                                    "type": "STRING"
                                },

                                "camera_shot": {
                                    "type": "STRING"
                                },

                                "lighting": {
                                    "type": "STRING"
                                },

                                "visual_description": {
                                    "type": "STRING"
                                },

                                "duration_seconds": {
                                    "type": "INTEGER"
                                },

                                "image_prompt": {
                                    "type": "STRING"
                                },

                                "negative_prompt": {
                                    "type": "STRING"
                                },

                                "aspect_ratio": {
                                    "type": "STRING"
                                }
                            },

                            "required": [
                                "scene_number",
                                "location",
                                "time",
                                "characters",
                                "action",
                                "dialogue",
                                "emotion",
                                "camera_shot",
                                "lighting",
                                "visual_description",
                                "duration_seconds",
                                "image_prompt",
                                "negative_prompt",
                                "aspect_ratio"
                            ]
                        }
                    }
                },

                "required": [
                    "story",
                    "characters",
                    "scenes"
                ]
            }
        }
    )

    # --------------------------------------------------
    # Parse JSON
    # --------------------------------------------------

    project = json.loads(response.text)

    # --------------------------------------------------
    # Final safety normalization
    # --------------------------------------------------

    for scene in project.get("scenes", []):

        scene["aspect_ratio"] = "16:9"

        if not scene.get("negative_prompt"):
            scene["negative_prompt"] = (
                "cartoon, anime, illustration, painting, "
                "low resolution, blurry, distorted face, "
                "deformed hands, extra fingers, extra limbs, "
                "duplicate characters, inconsistent character "
                "appearance, different clothing, different "
                "hairstyle, different age, text, subtitles, "
                "captions, logo, watermark, UI, oversaturated colors"
            )

    return project