"use client";

import { useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "/api";

type GeneratedImage = {
  scene_number: number;
  status: "complete" | "error";
  image_url: string | null;
  seed: number | null;
  error?: string;
};

type Character = {
  name: string;
  age: string;
  gender: string;
  physical_appearance: string;
  hairstyle: string;
  clothing: string;
  accessories: string;
  personality: string;
  facial_expression_style: string;
  visual_style: string;
};

type Scene = {
  scene_number: number;
  location: string;
  time: string;
  characters: string[];
  action: string;
  dialogue: string;
  emotion: string;
  camera_shot: string;
  lighting: string;
  visual_description: string;
  duration_seconds: number;
  image_prompt: string;
  negative_prompt: string;
  aspect_ratio: string;
};

type GeneratedProject = {
  story: {
    title: string;
    genre: string;
    logline: string;
    beginning: string;
    middle: string;
    ending: string;
    twist: string;
  };
  characters: Character[];
  scenes: Scene[];
};

const demoScenes = [
  [
    "01",
    "The Machine",
    "University Physics Lab · Night",
    "Sarah calibrates the humming experimental machine while Leo watches with growing unease.",
    "/scenes/scene_1.webp",
  ],
  [
    "02",
    "The Warning",
    "Lab Hallway · Night",
    "Leo receives a distorted voicemail from a voice that sounds exactly like his own.",
    "/scenes/scene_2.webp",
  ],
  [
    "03",
    "The Choice",
    "University Physics Lab · Night",
    "Leo rushes back into the lab and desperately tries to shut down the machine.",
    "/scenes/scene_3.webp",
  ],
  [
    "04",
    "The Struggle",
    "University Physics Lab · Night",
    "Sarah fights to protect their research as the machine begins to destabilize.",
    "/scenes/scene_4.webp",
  ],
  [
    "05",
    "The Collapse",
    "University Physics Lab · Night",
    "Leo destroys the machine and realizes the terrifying truth behind the voicemail.",
    "/scenes/scene_5.webp",
  ],
];

const demoCharacters = [
  [
    "Leo",
    "21",
    "Physics Student",
    "An anxious, observant student who works late in the university lab.",
  ],
  [
    "Sarah",
    "22",
    "Researcher",
    "An ambitious researcher determined to complete their experimental breakthrough.",
  ],
];

function isQuotaError(message?: string | null) {
  if (!message) return false;

  const value = message.toLowerCase();

  return (
    value.includes("zerogpu") ||
    value.includes("quota") ||
    value.includes("free zerogpu")
  );
}

function getImageErrorMessage(message?: string | null) {
  if (isQuotaError(message)) {
    return "The cinematic image service is temporarily out of compute quota. Your story is safe and can be rendered later.";
  }

  return message || "This scene could not be generated.";
}

// --------------------------------------------------
// Download complete project as JSON
// --------------------------------------------------

function downloadProject(project: GeneratedProject) {
  const projectData = {
    ...project,
    exported_at: new Date().toISOString(),
  };

  const blob = new Blob(
    [JSON.stringify(projectData, null, 2)],
    {
      type: "application/json",
    }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;

  const safeTitle = project.story.title
    .replace(/[^a-z0-9]/gi, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

  link.download = `${safeTitle || "microdrama"}_project.json`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

// --------------------------------------------------
// Download one generated scene image
// --------------------------------------------------

function downloadImage(
  imageUrl: string,
  sceneNumber: number
) {
  const link = document.createElement("a");

  link.href = imageUrl;
  link.download = `scene_${sceneNumber}.webp`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// --------------------------------------------------
// Download all generated scene images
// --------------------------------------------------

async function downloadAllImages(
  images: Record<number, GeneratedImage>
) {
  const completedImages = Object.values(images).filter(
    (image) =>
      image.status === "complete" &&
      image.image_url
  );

  if (completedImages.length === 0) {
    return;
  }

  for (const image of completedImages) {
    const link = document.createElement("a");

    link.href = image.image_url!;
    link.download = `scene_${image.scene_number}.webp`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    await new Promise((resolve) =>
      setTimeout(resolve, 250)
    );
  }
}

export default function Home() {
  const [showCreate, setShowCreate] = useState(false);

  const [idea, setIdea] = useState("");

  const [project, setProject] =
    useState<GeneratedProject | null>(null);

  const [generating, setGenerating] =
    useState(false);

  const [generatingImages, setGeneratingImages] =
    useState(false);

  const [imageGenerationComplete, setImageGenerationComplete] =
    useState(false);

  const [retryingScene, setRetryingScene] =
    useState<number | null>(null);

  const [generatedImages, setGeneratedImages] =
    useState<Record<number, GeneratedImage>>({});

  const completedImageCount = Object.values(
    generatedImages
  ).filter(
    (image) =>
      image.status === "complete" &&
      image.image_url
  ).length;

  const totalSceneCount = project?.scenes.length ?? 0;

  const allImagesGenerated =
    totalSceneCount > 0 &&
    completedImageCount === totalSceneCount;

  const [error, setError] = useState("");

  // --------------------------------------------------
  // Generate story
  // --------------------------------------------------

  const handleGenerate = async () => {
    if (!idea.trim() || generating) return;

    setGenerating(true);
    setError("");
    setGeneratedImages({});
    setImageGenerationComplete(false);

    try {
      const response = await fetch(
        `${API_URL}/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idea: idea.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status}`
        );
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      console.log(
        "Generated project:",
        data
      );

      setProject(data);
      setShowCreate(false);
      setIdea("");
    } catch (err) {
      console.error(
        "Generation failed:",
        err
      );

      setError(
        "Something went wrong while generating your drama. Make sure the Python API is running."
      );
    } finally {
      setGenerating(false);
    }
  };

  // --------------------------------------------------
  // Generate cinematic images
  // --------------------------------------------------

  const handleGenerateImages = async () => {
    if (!project || generatingImages) return;

    setGeneratingImages(true);
    setImageGenerationComplete(false);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/generate-images`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            project,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Image API failed: ${response.status}`
        );
      }

      const data = await response.json();

      console.log(
        "Image generation response:",
        data
      );

      const imageMap: Record<
        number,
        GeneratedImage
      > = {};

      for (const image of data.images || []) {
        imageMap[image.scene_number] = image;
      }

      setGeneratedImages(imageMap);

      // --------------------------------------------------
      // Detect ZeroGPU / quota exhaustion
      // --------------------------------------------------

      const quotaError = (
        data.images || []
      ).find(
        (image: GeneratedImage) =>
          image.status === "error" &&
          isQuotaError(image.error)
      );

      if (quotaError) {
        setImageGenerationComplete(false);

        setError(
          "The cinematic image service is temporarily out of compute quota. Your story and scene prompts were generated successfully. Please try generating the visuals again later."
        );
      }

      // --------------------------------------------------
      // Partial generation
      // --------------------------------------------------

      else if (data.status === "partial") {
        setImageGenerationComplete(false);

        setError(
          `${data.completed} of ${data.total} scenes generated. ${data.failed} scene(s) failed.`
        );
      }

      // --------------------------------------------------
      // Everything succeeded
      // --------------------------------------------------

      else if (data.status === "complete") {
        setError("");
        setImageGenerationComplete(true);
      }

      // --------------------------------------------------
      // Other backend error
      // --------------------------------------------------

      else if (data.status === "error") {
        setImageGenerationComplete(false);

        setError(
          getImageErrorMessage(data.error)
        );
      }
    } catch (err) {
      console.error(
        "Image generation failed:",
        err
      );

      const message =
        err instanceof Error
          ? err.message
          : "";

      setImageGenerationComplete(false);

      setError(
        isQuotaError(message)
          ? "The cinematic image service is temporarily out of compute quota. Your story is safe. Please try again later."
          : message ||
            "The cinematic image service is temporarily unavailable."
      );
    } finally {
      setGeneratingImages(false);
    }
  };

  // --------------------------------------------------
  // Retry a single scene
  // --------------------------------------------------

  const handleRetryScene = async (
    sceneNumber: number
  ) => {
    if (
      !project ||
      retryingScene !== null
    ) {
      return;
    }

    const scene = project.scenes.find(
      (item) =>
        item.scene_number === sceneNumber
    );

    if (!scene) return;

    setRetryingScene(sceneNumber);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/generate-image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            scene,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Retry API failed: ${response.status}`
        );
      }

      const data =
        await response.json();

      console.log(
        `Retry result for Scene ${sceneNumber}:`,
        data
      );

      setGeneratedImages(
        (previous) => ({
          ...previous,
          [sceneNumber]: data,
        })
      );

      if (data.status === "complete") {
        setError("");
      } else if (
        isQuotaError(data.error)
      ) {
        setError(
          "The cinematic image service is temporarily out of compute quota. Please try this scene again later."
        );
      } else {
        setError(
          `Scene ${sceneNumber} could not be generated.`
        );
      }
    } catch (err) {
      console.error(
        `Retry failed for Scene ${sceneNumber}:`,
        err
      );

      const message =
        err instanceof Error
          ? err.message
          : `Scene ${sceneNumber} retry failed.`;

      setError(
        isQuotaError(message)
          ? "The cinematic image service is temporarily out of compute quota. Please try this scene again later."
          : message
      );
    } finally {
      setRetryingScene(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#090909] text-white">

      {/* ================================================= */}
      {/* NAVIGATION */}
      {/* ================================================= */}

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">

        <div className="flex items-center gap-3">

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-bold text-black">
            M
          </div>

          <span className="text-sm font-semibold tracking-[0.2em]">
            MICRODRAMA
          </span>

        </div>

        <div className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">

          <button
            onClick={() => {
              setError("");
              setShowCreate(true);
            }}
            className="transition hover:text-white"
          >
            Create
          </button>

          <button className="transition hover:text-white">
            Projects
          </button>

        </div>

      </nav>


      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="mx-auto max-w-5xl px-6 pb-24 pt-20 text-center lg:pt-28">

        <div className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs tracking-wide text-zinc-400">
          AI-POWERED STORYTELLING
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl font-medium leading-[1.05] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
          Turn an idea into a
          <span className="block text-zinc-500">
            cinematic story.
          </span>
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
          From a single idea to characters, scenes,
          and cinematic visuals — generated as one
          cohesive micro-drama.
        </p>

        <div className="mt-10 flex justify-center">

          <button
            onClick={() => {
              setError("");
              setShowCreate(true);
            }}
            className="rounded-full bg-white px-7 py-3.5 text-sm font-medium text-black transition hover:bg-zinc-200"
          >
            Create a drama
          </button>

        </div>

      </section>


      {/* ================================================= */}
      {/* HOW IT WORKS */}
      {/* ================================================= */}

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">

        <div className="mb-10 flex items-center gap-4">

          <span className="text-xs font-medium tracking-[0.2em] text-zinc-500">
            HOW IT WORKS
          </span>

          <div className="h-px flex-1 bg-white/10" />

          <span className="text-xs text-zinc-600">
            AI STORY PRODUCTION PIPELINE
          </span>

        </div>


        <div className="grid gap-4 md:grid-cols-5">

          {/* STEP 01 */}

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

            <div className="mb-6 flex items-center justify-between">

              <span className="text-xs font-medium text-zinc-600">
                01
              </span>

              <span className="text-lg text-zinc-500">
                ✦
              </span>

            </div>

            <h3 className="text-lg font-medium">
              Your Idea
            </h3>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Start with a simple story concept,
              character idea, situation, or plot twist.
            </p>

          </div>


          {/* STEP 02 */}

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

            <div className="mb-6 flex items-center justify-between">

              <span className="text-xs font-medium text-zinc-600">
                02
              </span>

              <span className="text-lg text-zinc-500">
                AI
              </span>

            </div>

            <h3 className="text-lg font-medium">
              Story Engine
            </h3>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Gemini transforms your idea into a structured
              micro-drama with characters and scenes.
            </p>

          </div>


          {/* STEP 03 */}

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

            <div className="mb-6 flex items-center justify-between">

              <span className="text-xs font-medium text-zinc-600">
                03
              </span>

              <span className="text-lg text-zinc-500">
                ▣
              </span>

            </div>

            <h3 className="text-lg font-medium">
              Storyboard
            </h3>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Each scene receives cinematic direction,
              camera information, lighting, dialogue,
              and visual prompts.
            </p>

          </div>


          {/* STEP 04 */}

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

            <div className="mb-6 flex items-center justify-between">

              <span className="text-xs font-medium text-zinc-600">
                04
              </span>

              <span className="text-lg text-zinc-500">
                ◇
              </span>

            </div>

            <h3 className="text-lg font-medium">
              Cinematic Frames
            </h3>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              AI image generation turns the scene prompts
              into cinematic 16:9 visual frames.
            </p>

          </div>


          {/* STEP 05 */}

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

            <div className="mb-6 flex items-center justify-between">

              <span className="text-xs font-medium text-zinc-600">
                05
              </span>

              <span className="text-lg text-zinc-600">
                ▶
              </span>

            </div>

            <div className="flex items-center gap-2">

              <h3 className="text-lg font-medium">
                AI Video
              </h3>

              <span className="rounded-full border border-white/10 px-2 py-1 text-[9px] font-medium tracking-[0.12em] text-zinc-600">
                SOON
              </span>

            </div>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              The next step is transforming each storyboard
              frame into a short cinematic video clip.
            </p>

          </div>

        </div>


        {/* PIPELINE */}

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 px-6 py-5">

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs tracking-[0.12em] text-zinc-500 sm:gap-5">

            <span>IDEA</span>

            <span className="text-zinc-700">
              →
            </span>

            <span>GEMINI</span>

            <span className="text-zinc-700">
              →
            </span>

            <span>STORY</span>

            <span className="text-zinc-700">
              →
            </span>

            <span>STORYBOARD</span>

            <span className="text-zinc-700">
              →
            </span>

            <span>FLUX</span>

            <span className="text-zinc-700">
              →
            </span>

            <span className="text-zinc-300">
              CINEMATIC FRAMES
            </span>

            <span className="text-zinc-700">
              →
            </span>

            <span className="text-zinc-600">
              VIDEO
            </span>

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* GENERATED PROJECT */}
      {/* ================================================= */}

      {project && (

        <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-10">

            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

              <div>

                <p className="mb-3 text-xs font-medium tracking-[0.2em] text-zinc-500">
                  GENERATED PROJECT
                </p>

                <h2 className="text-4xl font-medium tracking-tight">
                  {project.story.title}
                </h2>

                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-zinc-600">
                  {project.story.genre}
                </p>

              </div>

              <div className="flex flex-wrap items-center gap-3">

                <div className="text-sm text-zinc-500">
                  {project.scenes.length} scenes
                </div>

                <button
                  type="button"
                  onClick={() => downloadProject(project)}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                >
                  ↓ Download project
                </button>

              </div>

            </div>


            <div className="mt-8 border-y border-white/10 py-7">

              <p className="max-w-4xl text-lg leading-8 text-zinc-300">
                {project.story.logline}
              </p>

            </div>


            <div className="mt-7 flex flex-wrap gap-3">

              {project.characters.map(
                (character) => (

                  <span
                    key={character.name}
                    className="rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-zinc-400"
                  >
                    {character.name}
                  </span>

                )
              )}

            </div>


            <div className="mt-8 grid gap-4 md:grid-cols-3">

              {[
                ["BEGINNING", project.story.beginning],
                ["MIDDLE", project.story.middle],
                ["TWIST", project.story.twist],
              ].map(([label, value]) => (

                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-black/20 p-5"
                >

                  <p className="text-xs tracking-[0.15em] text-zinc-600">
                    {label}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    {value}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </section>

      )}


      {/* ================================================= */}
      {/* PROJECT */}
      {/* ================================================= */}

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">

        <div className="mb-8 flex items-end justify-between">

          <div>

            <p className="mb-2 text-xs font-medium tracking-[0.2em] text-zinc-500">
              {project
                ? "GENERATED PROJECT"
                : "FEATURED PROJECT"}
            </p>

            <h2 className="text-3xl font-medium tracking-tight">
              {project
                ? project.story.title
                : "The Three-Day Warning"}
            </h2>

          </div>

          <span className="hidden rounded-full border border-white/10 px-4 py-2 text-xs text-zinc-400 sm:block">
            {project
              ? project.story.genre
              : "SCI-FI THRILLER"}
          </span>

        </div>


        {/* Logline */}

        <div className="mb-12 border-y border-white/10 py-7">

          <p className="max-w-4xl text-lg leading-8 text-zinc-300">
            {project
              ? project.story.logline
              : "A college student receives a frantic voicemail from his future self, warning him to sabotage his lab partner's experimental device before it is too late."}
          </p>

        </div>


        {/* ================================================= */}
        {/* CAST */}
        {/* ================================================= */}

        <div className="mb-16">

          <div className="mb-6 flex items-center gap-4">

            <span className="text-xs font-medium tracking-[0.2em] text-zinc-500">
              CAST
            </span>

            <div className="h-px flex-1 bg-white/10" />

            <span className="text-xs text-zinc-600">
              {project
                ? `${project.characters.length} ${
                    project.characters.length === 1
                      ? "CHARACTER"
                      : "CHARACTERS"
                  }`
                : "02 CHARACTERS"}
            </span>

          </div>


          <div className="grid gap-4 sm:grid-cols-2">

            {(
              project
                ? project.characters.map(
                    (character) => ({
                      name: character.name,
                      age: character.age,
                      role: character.gender,
                      description:
                        character.personality,
                    })
                  )
                : demoCharacters.map(
                    ([
                      name,
                      age,
                      role,
                      description,
                    ]) => ({
                      name,
                      age,
                      role,
                      description,
                    })
                  )
            ).map((character) => (

              <div
                key={character.name}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20"
              >

                <div className="flex items-start justify-between">

                  <div>

                    <h3 className="text-xl font-medium">
                      {character.name}
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                      {character.age} ·{" "}
                      {character.role}
                    </p>

                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-xs text-zinc-400">
                    {character.name[0]}
                  </div>

                </div>

                <p className="mt-5 max-w-md text-sm leading-6 text-zinc-400">
                  {character.description}
                </p>

              </div>

            ))}

          </div>

        </div>


        {/* ================================================= */}
        {/* STORYBOARD */}
        {/* ================================================= */}

        <div>

          <div className="mb-8 flex items-center gap-4">

            <span className="text-xs font-medium tracking-[0.2em] text-zinc-500">
              STORYBOARD
            </span>

            <div className="h-px flex-1 bg-white/10" />

            <span className="text-xs text-zinc-600">
              {project
                ? `${project.scenes.length
                    .toString()
                    .padStart(2, "0")} SCENES`
                : "05 SCENES"}
            </span>

          </div>


          {/* ================================================= */}
          {/* GENERATED PROJECT */}
          {/* ================================================= */}

          {project ? (

            <div className="space-y-12">

              {/* ================================================= */}
              {/* VISUAL GENERATION CONTROL */}
              {/* ================================================= */}

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                  <div>

                    <div className="flex flex-wrap items-center gap-3">

                      <p className="text-sm font-medium text-white">
                        Cinematic visuals
                      </p>

                      {allImagesGenerated ? (
                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 text-[10px] font-medium tracking-[0.12em] text-emerald-400">
                          PROJECT READY
                        </span>
                      ) : completedImageCount > 0 ? (
                        <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium tracking-[0.12em] text-zinc-400">
                          {completedImageCount}/{totalSceneCount} GENERATED
                        </span>
                      ) : null}

                    </div>

                    <p className="mt-1 max-w-xl text-sm leading-6 text-zinc-500">
                      Turn your generated scenes into
                      cinematic 16:9 frames using AI image
                      generation.
                    </p>

                  </div>

                  <div className="flex flex-wrap items-center gap-3">

                    {allImagesGenerated && (
                      <button
                        type="button"
                        onClick={() =>
                          downloadAllImages(generatedImages)
                        }
                        className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                      >
                        ↓ Download all images
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleGenerateImages}
                      disabled={
                        generatingImages ||
                        retryingScene !== null
                      }
                      className="shrink-0 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {generatingImages
                        ? "Generating visuals..."
                        : allImagesGenerated
                          ? "Regenerate visuals"
                          : "Generate visuals"}
                    </button>

                  </div>

                </div>


                {/* ================================================= */}
                {/* GENERATION PIPELINE */}
                {/* ================================================= */}

                <div className="mt-6 border-t border-white/10 pt-5">

                  <div className="grid gap-3 sm:grid-cols-3">

                    {/* Story */}

                    <div className="flex items-center gap-3">

                      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-400">
                        ✓
                      </div>

                      <div>

                        <p className="text-xs font-medium text-zinc-300">
                          Story
                        </p>

                        <p className="text-[10px] text-zinc-600">
                          Generated
                        </p>

                      </div>

                    </div>


                    {/* Characters */}

                    <div className="flex items-center gap-3">

                      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-400">
                        ✓
                      </div>

                      <div>

                        <p className="text-xs font-medium text-zinc-300">
                          Characters
                        </p>

                        <p className="text-[10px] text-zinc-600">
                          Generated
                        </p>

                      </div>

                    </div>


                    {/* Cinematic visuals */}

                    <div className="flex items-center gap-3">

                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs ${
                          generatingImages
                            ? "border-white/20 bg-white/[0.06] text-white"
                            : allImagesGenerated
                              ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                              : completedImageCount > 0
                                ? "border-white/20 bg-white/[0.04] text-zinc-300"
                                : "border-white/10 bg-white/[0.03] text-zinc-600"
                        }`}
                      >
                        {generatingImages
                          ? "..."
                          : allImagesGenerated
                            ? "✓"
                            : completedImageCount > 0
                              ? completedImageCount
                              : "3"}
                      </div>

                      <div>

                        <p className="text-xs font-medium text-zinc-300">
                          Cinematic visuals
                        </p>

                        <p className="text-[10px] text-zinc-600">
                          {generatingImages
                            ? "Generating..."
                            : completedImageCount > 0
                              ? `${completedImageCount}/${totalSceneCount} Generated`
                              : "Ready"}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              </div>


              {/* ================================================= */}
              {/* AI VIDEO GENERATION - COMING SOON */}
              {/* ================================================= */}

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">

                <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">

                  <div className="flex items-start gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-lg">
                      ▶
                    </div>

                    <div>

                      <div className="flex flex-wrap items-center gap-3">

                        <p className="text-sm font-medium text-white">
                          Bring your story to life
                        </p>

                        <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium tracking-[0.12em] text-zinc-500">
                          COMING SOON
                        </span>

                      </div>

                      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                        Transform each cinematic storyboard
                        frame into a short AI-generated video
                        clip with character motion, camera
                        movement, and cinematic animation.
                      </p>

                    </div>

                  </div>


                  <button
                    type="button"
                    disabled
                    className="shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-xs font-medium text-zinc-600"
                  >
                    Generate video
                  </button>

                </div>


                <div className="border-t border-white/10 px-6 py-4">

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] tracking-[0.12em] text-zinc-600">

                    <span>IMAGE → VIDEO</span>

                    <span>CHARACTER MOTION</span>

                    <span>CAMERA MOTION</span>

                    <span>CINEMATIC CLIPS</span>

                  </div>

                </div>

              </div>


              {/* ================================================= */}
              {/* IMAGE STATUS */}
              {/* ================================================= */}

              {error && (

                <div
                  className={`rounded-xl border px-5 py-4 text-sm ${
                    isQuotaError(error)
                      ? "border-amber-500/20 bg-amber-500/5 text-amber-300"
                      : "border-red-500/20 bg-red-500/5 text-red-300"
                  }`}
                >

                  <p className="font-medium">
                    {isQuotaError(error)
                      ? "Visual generation temporarily unavailable"
                      : "Image generation issue"}
                  </p>

                  <p className="mt-1 leading-6 opacity-80">
                    {error}
                  </p>

                </div>

              )}


              {/* ================================================= */}
              {/* SCENES */}
              {/* ================================================= */}

              {project.scenes.map(
                (scene) => {

                  const generatedImage =
                    generatedImages[
                      scene.scene_number
                    ];

                  const isRetrying =
                    retryingScene ===
                    scene.scene_number;

                  return (

                    <article
                      key={scene.scene_number}
                      className="grid gap-6 lg:grid-cols-[80px_1fr]"
                    >

                      <div className="pt-2 text-sm font-medium text-zinc-600">
                        {scene.scene_number
                          .toString()
                          .padStart(2, "0")}
                      </div>


                      <div>

                        {/* ================================================= */}
                        {/* VISUAL */}
                        {/* ================================================= */}

                        <div className="group relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">

                          {generatedImage?.status ===
                            "complete" &&
                          generatedImage.image_url ? (

                            <>

                              <img
                                src={
                                  generatedImage.image_url
                                }
                                alt={`Scene ${scene.scene_number}`}
                                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.015]"
                              />

                              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent px-5 pb-4 pt-12 opacity-0 transition-opacity duration-300 group-hover:opacity-100">

                                <span className="text-[10px] font-medium tracking-[0.15em] text-zinc-300">
                                  FLUX.1 SCHNELL
                                </span>

                                <div className="flex items-center gap-3">

                                  {generatedImage.seed !==
                                    null && (

                                    <span className="text-[10px] text-zinc-400">
                                      SEED{" "}
                                      {
                                        generatedImage.seed
                                      }
                                    </span>

                                  )}

                                  {generatedImage.image_url && (

                                    <button
                                      type="button"
                                      onClick={() =>
                                        downloadImage(
                                          generatedImage.image_url!,
                                          scene.scene_number
                                        )
                                      }
                                      className="rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-[10px] font-medium tracking-wide text-zinc-200 backdrop-blur-sm transition hover:bg-white/10 hover:text-white"
                                    >
                                      ↓ DOWNLOAD
                                    </button>

                                  )}

                                </div>

                              </div>

                            </>

                          ) : generatedImage?.status ===
                            "error" ? (

                            <div className="flex h-full w-full items-center justify-center px-6">

                              <div className="max-w-md text-center">

                                {isQuotaError(
                                  generatedImage.error
                                ) ? (

                                  <>

                                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/5 text-lg text-amber-400">
                                      ⏳
                                    </div>

                                    <p className="text-sm font-medium text-amber-300">
                                      Visual generation unavailable
                                    </p>

                                    <p className="mt-2 text-xs leading-5 text-zinc-500">
                                      The cinematic image
                                      service is temporarily
                                      out of compute quota.
                                      Your story and scene
                                      prompts are safe.
                                    </p>

                                  </>

                                ) : (

                                  <>

                                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-red-500/20 bg-red-500/5 text-lg text-red-400">
                                      ×
                                    </div>

                                    <p className="text-sm font-medium text-red-300">
                                      Generation failed
                                    </p>

                                    <p className="mt-2 text-xs leading-5 text-zinc-600">
                                      {getImageErrorMessage(
                                        generatedImage.error
                                      )}
                                    </p>

                                  </>

                                )}


                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRetryScene(
                                      scene.scene_number
                                    )
                                  }
                                  disabled={
                                    retryingScene !==
                                      null ||
                                    generatingImages
                                  }
                                  className="mt-5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  {isRetrying
                                    ? "Retrying..."
                                    : "Retry scene"}
                                </button>

                              </div>

                            </div>

                          ) : (

                            <>

                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_60%)]" />

                              <div className="relative flex h-full items-center justify-center">

                                <div className="text-center">

                                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-lg text-zinc-600">
                                    {generatingImages
                                      ? "..."
                                      : "✦"}
                                  </div>

                                  <p className="text-sm text-zinc-500">
                                    Cinematic visual
                                  </p>

                                  <p className="mt-1 text-xs text-zinc-700">
                                    {generatingImages
                                      ? "Generating..."
                                      : "Ready to generate"}
                                  </p>

                                </div>

                              </div>

                            </>

                          )}

                        </div>


                        {/* ================================================= */}
                        {/* SCENE HEADER */}
                        {/* ================================================= */}

                        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                          <div>

                            <div className="flex items-center gap-3">

                              <h3 className="text-xl font-medium">
                                Scene{" "}
                                {
                                  scene.scene_number
                                }
                              </h3>

                              <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-zinc-600">
                                {
                                  scene.duration_seconds
                                }
                                s
                              </span>

                            </div>

                            <p className="mt-2 text-xs uppercase tracking-[0.15em] text-zinc-600">
                              {scene.location} ·{" "}
                              {scene.time}
                            </p>

                          </div>

                          <p className="max-w-xl text-sm leading-6 text-zinc-400 sm:text-right">
                            {scene.action}
                          </p>

                        </div>


                        {/* ================================================= */}
                        {/* METADATA */}
                        {/* ================================================= */}

                        <div className="mt-5 grid gap-3 sm:grid-cols-3">

                          {[
                            [
                              "EMOTION",
                              scene.emotion,
                            ],
                            [
                              "CAMERA",
                              scene.camera_shot,
                            ],
                            [
                              "LIGHTING",
                              scene.lighting,
                            ],
                          ].map(
                            ([label, value]) => (

                              <div
                                key={label}
                                className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
                              >

                                <p className="text-[10px] font-medium tracking-[0.15em] text-zinc-600">
                                  {label}
                                </p>

                                <p className="mt-2 text-sm text-zinc-400">
                                  {value}
                                </p>

                              </div>

                            )
                          )}

                        </div>


                        {/* ================================================= */}
                        {/* DIALOGUE + VISUAL DESCRIPTION */}
                        {/* ================================================= */}

                        <div className="mt-3 grid gap-3 sm:grid-cols-2">

                          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">

                            <p className="text-[10px] font-medium tracking-[0.15em] text-zinc-600">
                              DIALOGUE
                            </p>

                            <p className="mt-2 text-sm leading-6 text-zinc-400">
                              {scene.dialogue}
                            </p>

                          </div>


                          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">

                            <p className="text-[10px] font-medium tracking-[0.15em] text-zinc-600">
                              VISUAL DESCRIPTION
                            </p>

                            <p className="mt-2 text-sm leading-6 text-zinc-400">
                              {
                                scene.visual_description
                              }
                            </p>

                          </div>

                        </div>


                        {/* ================================================= */}
                        {/* IMAGE PROMPT */}
                        {/* ================================================= */}

                        <details className="mt-3 rounded-xl border border-white/10 bg-white/[0.02]">

                          <summary className="cursor-pointer px-4 py-3 text-xs font-medium tracking-[0.12em] text-zinc-600 transition hover:text-zinc-400">
                            VIEW IMAGE PROMPT
                          </summary>

                          <div className="border-t border-white/10 px-4 py-4">

                            <p className="text-xs leading-6 text-zinc-500">
                              {scene.image_prompt}
                            </p>

                          </div>

                        </details>

                      </div>

                    </article>

                  );
                }
              )}

            </div>

          ) : (

            /* ================================================= */
            /* DEMO STORYBOARD */
            /* ================================================= */

            <div className="space-y-16">

              {demoScenes.map(
                (scene) => (

                  <article
                    key={scene[0]}
                    className="grid gap-6 lg:grid-cols-[80px_1fr]"
                  >

                    <div className="pt-2 text-sm font-medium text-zinc-600">
                      {scene[0]}
                    </div>

                    <div>

                      <div className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">

                        <img
                          src={scene[4]}
                          alt={`Scene ${scene[0]}: ${scene[1]}`}
                          className="aspect-video w-full object-cover transition duration-700 group-hover:scale-[1.015]"
                        />

                      </div>

                      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                        <div>

                          <h3 className="text-xl font-medium">
                            {scene[1]}
                          </h3>

                          <p className="mt-1 text-xs uppercase tracking-[0.15em] text-zinc-600">
                            {scene[2]}
                          </p>

                        </div>

                        <p className="max-w-xl text-sm leading-6 text-zinc-400 sm:text-right">
                          {scene[3]}
                        </p>

                      </div>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </div>

      </section>


      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      <footer className="border-t border-white/10">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8 text-xs text-zinc-600 lg:px-10">

          <span>
            MICRODRAMA
          </span>

          <span>
            AI STORY PRODUCTION STUDIO
          </span>

        </div>

      </footer>


      {/* ================================================= */}
      {/* CREATE MODAL */}
      {/* ================================================= */}

      {showCreate && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-5 backdrop-blur-md"
          onClick={() => {
            if (!generating) {
              setShowCreate(false);
            }
          }}
        >

          <div
            className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#111111] p-7 shadow-2xl sm:p-10"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="mb-8 flex items-start justify-between">

              <div>

                <p className="mb-2 text-xs font-medium tracking-[0.2em] text-zinc-500">
                  NEW PROJECT
                </p>

                <h2 className="text-3xl font-medium tracking-tight">
                  Create a micro-drama
                </h2>

                <p className="mt-3 max-w-lg text-sm leading-6 text-zinc-500">
                  Start with a single idea. Our
                  story engine will turn it into
                  a complete cinematic concept.
                </p>

              </div>

              <button
                onClick={() =>
                  setShowCreate(false)
                }
                disabled={generating}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-lg text-zinc-500 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Close"
              >
                ×
              </button>

            </div>


            <label className="mb-3 block text-xs font-medium tracking-[0.15em] text-zinc-500">
              YOUR IDEA
            </label>

            <textarea
              value={idea}
              onChange={(event) =>
                setIdea(event.target.value)
              }
              placeholder="A student receives a voicemail from his future self..."
              disabled={generating}
              className="h-44 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-7 text-white outline-none transition placeholder:text-zinc-700 focus:border-white/25 disabled:cursor-not-allowed disabled:opacity-50"
              autoFocus
            />


            {error && (

              <div
                className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
                  isQuotaError(error)
                    ? "border-amber-500/20 bg-amber-500/5 text-amber-300"
                    : "border-red-500/20 bg-red-500/5 text-red-300"
                }`}
              >
                {error}
              </div>

            )}


            <div className="mt-5 flex items-center justify-between">

              <span className="text-xs text-zinc-600">
                {idea.length} characters
              </span>

              <button
                onClick={handleGenerate}
                disabled={
                  !idea.trim() ||
                  generating
                }
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-30"
              >
                {generating
                  ? "Generating..."
                  : "Generate drama"}
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}
