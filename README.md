# 🎬 MicroDrama

> Turn a simple story idea into a cinematic AI storyboard.

MicroDrama is an AI-powered creative tool that transforms a short story idea into a structured micro-drama and a sequence of cinematic storyboard frames.

Instead of manually writing a story, designing characters, planning scenes, and creating image prompts, MicroDrama connects the entire workflow into one pipeline.

## ✨ What MicroDrama Does

Give MicroDrama a simple idea:

> A student discovers that the mysterious phone calls he receives are coming from himself three days in the future.

MicroDrama generates:

- 🎭 A complete micro-drama story
- 👤 Detailed character identities
- 🎬 Five connected cinematic scenes
- 🎥 Camera and lighting directions
- 🖼️ Production-ready image prompts
- 🎨 AI-generated cinematic storyboard frames
- 🔄 Individual scene retry
- 📥 Image and project downloads

## 🧠 AI Pipeline

```text
Story Idea
    ↓
  Gemini
    ↓
Structured Story
    ↓
Characters + Scenes
    ↓
Cinematic Prompts
    ↓
FLUX.1 Schnell
    ↓
Cinematic Storyboard

***

## 🎨 Character Consistency

One of MicroDrama's key goals is maintaining visual consistency across scenes.

Instead of generating vague prompts like:

> "A young man in a laboratory"

MicroDrama creates detailed character identities containing:

- Age and appearance
- Hairstyle and facial features
- Clothing and accessories
- Physical characteristics
- Personality and visual traits

These details are carried into the scene prompts, giving the image-generation model consistent visual information throughout the storyboard.

---

## 🏗️ Architecture

```text
                 ┌─────────────────────┐
                 │    Next.js Frontend  │
                 │                     │
                 │ Story Idea → UI     │
                 └──────────┬──────────┘
                            │
                            │ HTTP
                            ▼
                 ┌─────────────────────┐
                 │    FastAPI Backend  │
                 │                     │
                 │ /generate           │
                 │ /generate-images    │
                 │ /generate-image     │
                 └──────────┬──────────┘
                            │
                  ┌─────────┴─────────┐
                  ▼                   ▼
          ┌───────────────┐   ┌────────────────┐
          │ Story Engine  │   │  Image Engine  │
          │               │   │                │
          │ Gemini API    │   │ FLUX.1 Schnell │
          └───────────────┘   └────────────────┘

🛠️ Tech Stack
| Layer                | Technologies                             |
| -------------------- | ---------------------------------------- |
| **Frontend**         | Next.js, React, TypeScript, Tailwind CSS |
| **Backend**          | Python, FastAPI, Uvicorn                 |
| **Story Generation** | Google Gemini                            |
| **Image Generation** | FLUX.1 Schnell                           |
| **AI Interface**     | Hugging Face Gradio Client               |


📁 Project Structure
ai-micro-drama/
│
├── api.py
├── story_engine.py
├── prompt_engine.py
├── image_engine.py
├── video_engine.py
├── generate_images.py
│
├── generated_images/
│   ├── scene_1.webp
│   ├── scene_2.webp
│   ├── scene_3.webp
│   ├── scene_4.webp
│   └── scene_5.webp
│
├── frontend/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   └── public/
│       └── scenes/
│
└── .gitignore

🚀 Current Status
The current version successfully demonstrates the complete pipeline:
💡 Story Idea
      ↓
🤖 AI Story Generation
      ↓
👤 Character Development
      ↓
🎬 Five Scene Breakdown
      ↓
✍️ Cinematic Prompt Generation
      ↓
🎨 FLUX Image Generation
      ↓
🖼️ Cinematic Storyboard


🚧 Roadmap

MicroDrama is designed to eventually evolve from a storyboard generator into a complete AI filmmaking pipeline.

 Image-to-video generation
 Persistent character reference images
 Improved cross-scene character consistency
 Camera-motion generation
 AI voice generation
 Background music and sound effects
 Automatic video editing
 Final MP4 export
 Multiple cinematic visual styles
 Project history and saved projects


⚠️ Current Limitation

The current version focuses on generating cinematic storyboard images.

The generated frames can serve as starting points for a future image-to-video pipeline, but MicroDrama does not currently claim to generate fully animated AI video clips.
