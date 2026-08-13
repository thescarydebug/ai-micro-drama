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

🎨 Character Consistency

A major goal of MicroDrama is maintaining character consistency between scenes.

Instead of using a vague description such as:

young man in a laboratory

the system generates detailed visual identities containing:
Age
Physical appearance
Hairstyle
Clothing
Accessories
Facial characteristics
Personality

These details are repeated in scene prompts so the image-generation model receives enough context to reproduce the same character across the storyboard.
🏗️ Architecture
┌──────────────────────────────────┐
│          Next.js Frontend        │
│                                  │
│   Story Input → Storyboard UI    │
└───────────────┬──────────────────┘
                │
                │ HTTP
                ▼
┌──────────────────────────────────┐
│         FastAPI Backend          │
│                                  │
│  /generate                       │
│  /generate-images                │
│  /generate-image                 │
└───────────────┬──────────────────┘
                │
        ┌───────┴────────┐
        ▼                ▼
┌───────────────┐  ┌────────────────┐
│ Story Engine  │  │ Image Engine   │
│               │  │                │
│ Gemini API    │  │ FLUX.1 Schnell │
└───────────────┘  └────────────────┘
🛠️ Tech Stack
Frontend
Next.js
React
TypeScript
Tailwind CSS
Backend
Python
FastAPI
Uvicorn
AI
Google Gemini
FLUX.1 Schnell
Hugging Face Gradio Client
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

MVP

The current application demonstrates the complete workflow:
Idea
 ↓
AI Story
 ↓
Characters
 ↓
5 Scenes
 ↓
Cinematic Prompts
 ↓
AI-Generated Storyboard
🚧 Future Roadmap
 Image-to-video generation
 Character reference images
 Improved character consistency
 Camera-motion generation
 AI voice generation
 Background music
 Automatic video editing
 Final MP4 export
 Multiple visual styles
 Project history
⚠️ Current Limitation

The current version focuses on generating cinematic storyboard images.

The generated frames can serve as starting points for a future image-to-video pipeline, but MicroDrama does not currently claim to generate fully animated AI video clips.

👨‍💻 Author

Tahammul Hussain

Built as an exploration of AI-assisted storytelling, prompt engineering, cinematic image generation, and creative AI workflows.
