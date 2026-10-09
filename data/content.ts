// All site content lives here. Edit this file to update the site;
// you shouldn't need to touch the page components for content changes.

export const profile = {
  name: "Sushant Pulipati",
  shortName: "Sushant",
  headline: "I learn by building things",
  headlineAccent: "from scratch.",
  bio: "Hey, I'm Sushant. From Mumbai, studying CS in Pune, graduating in 2027, obsessed with how software works under the hood. I used to be a graphic designer, so yes, I care how it looks too.",
  email: "sushantpulipati435@gmail.com",
  github: "https://github.com/SushantPulipati05",
  linkedin: "", // TODO: add your LinkedIn URL
  resume: "/resume.pdf", // lives in /public/resume.pdf
};

export type StoryItem = { date: string; text: string; highlight?: boolean };

export const story: StoryItem[] = [
  { date: "Mumbai", text: "Grew up in Mumbai." },
  { date: "2022", text: "Started freelancing as a graphic designer: logos for a few companies, festival greeting graphics, and a few website designs." },
  { date: "2023", text: "Moved to Pune for a B.Tech in Computer Science at MIT-WPU. I liked the coding side more and more: the logic behind systems that seem crazy. Pairing that with design felt like the right combo." },
  { date: "Sept 2024", text: "First real dev job: frontend engineer intern at 3cortex, remote." },
  { date: "Feb 2025", text: "Went to E-Summit '25 at IIT Bombay. Met a lot of students building real products at the Startup Expo and left completely fired up." },
  { date: "2025–26", text: "Learned Kotlin and built TrainLog, an Android workout tracker. Beta testers: two, and one of them is me." },
  { date: "Apr 2026", text: "iOS software engineer intern at Infosys in Mysuru. " },
  { date: "2026", text: "Decided I wanted to understand backends, so I picked Go. Built a CLI task tracker, then a small HTTP API, then a journaling app with its own sync engine." },
  { date: "now", text: "Building Redis_Go, a Redis-compatible database with replication and automatic failover.", highlight: true },
];

export type DomainIcon = "server" | "phone" | "database" | "layout" | "pen" | "terminal" | "sparkles";

export type Domain = {
  title: string;
  icon: DomainIcon;
  description: string;
  tools: string[];
  wide?: boolean;
};

export const domains: Domain[] = [
  {
    title: "Backend & Systems",
    icon: "server",
    description: "APIs, auth and sync engines, plus the low-level parts: protocols, concurrency, replication and failover.",
    tools: ["Go", "Node.js", "Express", "Ktor", "REST", "JWT/OAuth"],
    wide: true,
  },
  {
    title: "Mobile",
    icon: "phone",
    description: "Native Android with Compose, iOS with SwiftUI and UIKit, and shared code when it fits.",
    tools: ["Kotlin", "Jetpack Compose", "Compose Multiplatform", "SwiftUI", "UIKit"],
  },
  {
    title: "Data",
    icon: "database",
    description: "Relational schemas, type-safe queries, and keeping data consistent across devices.",
    tools: ["PostgreSQL", "MongoDB", "Supabase", "sqlc"],
  },
  {
    title: "Web",
    icon: "layout",
    description: "Fast, responsive interfaces, including the one you're looking at.",
    tools: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Three.js"],
    wide: true,
  },
  {
    title: "Design",
    icon: "pen",
    description: "Where I started. Layout, type and hierarchy, before I wrote a line of code.",
    tools: ["Figma", "Illustrator", "Photoshop", "Lightroom"],
  },
  {
    title: "Shipping & Tools",
    icon: "terminal",
    description: "Getting things out of localhost and into people's hands, with tests and CI along the way.",
    tools: ["Docker", "GitHub Actions", "Railway", "Git", "Jira"],
  },
  // {
  //   title: "AI",
  //   icon: "sparkles",
  //   description: "Putting LLMs to work inside real products: summaries, contextual search and recommendations.",
  //   tools: ["OpenAI API", "Gemini API"],
  //   wide: true,
  // },
];

export type Project = {
  slug: string;
  name: string;
  tags: string;
  description: string;
  // "terminal" shows the animated Redis demo; "media" shows a GIF/video.
  // Drop a GIF or MP4 in /public/demos and set src, e.g. "/demos/trainlog.mp4"
  demo: { kind: "terminal" } | { kind: "media"; src?: string; caption: string };
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "redis-go",
    name: "Redis_Go",
    tags: "go · replication · failover",
    description:
      "A Redis-compatible database built from scratch in Go. It works with the official redis-cli, redis-benchmark and client libraries, with AOF persistence and crash recovery, leader-follower replication, and automatic failover through Raft-inspired majority elections. Verified against real Redis with 100,000 randomized commands, and tuned to 660k GET/s with pipelining.",
    demo: { kind: "terminal" },
    links: [{ label: "code ↗", href: "https://github.com/SushantPulipati05/Redis_Go" }],
  },
  {
    slug: "trainlog",
    name: "TrainLog",
    tags: "kotlin · compose · ktor · postgresql",
    description:
      "A full-stack workout tracker: a native Android app backed by a Ktor REST API and PostgreSQL, deployed on Railway. Start a workout, pick an exercise, log sets, reps and weight. In beta with real users.",
    demo: { kind: "media", caption: "starting a workout and logging a set" },
    links: [{ label: "code ↗", href: "https://github.com/SushantPulipati05/TrainLog" }],
  },
  {
    slug: "journaling-app",
    name: "Journaling app",
    tags: "go · kotlin · postgresql · in progress",
    description:
      "An offline-first journal for Android and desktop, synced through a stateless Go REST API. Push/pull sync with conflict resolution, versioned records and tombstones, plus Google Sign-In with JWTs.",
    demo: { kind: "media", caption: "entry written on desktop, appearing on phone" },
    links: [],
  },
  {
    slug: "bigBrain",
    name: "BigBrain",
    tags: "next.js · typescript · node.js · openai",
    description:
      "An AI-powered note-taking app that keeps notes and uploaded files of different formats in one workspace, with automatic summaries, content extraction and contextual search across your documents.",
    demo: { kind: "media", caption: "uploading a file and searching across notes" },
    links: [{ label: "code ↗", href: "https://github.com/SushantPulipati05/big-brain" }],
  },
  // {
  //   slug: "diabetes-app",
  //   name: "Diabetes Management App",
  //   tags: "swift · uikit",
  //   description:
  //     "An iOS app that helps people with diabetes track blood glucose, meals, activity and symptoms, with custom charts of long-term trends.",
  //   demo: { kind: "media", caption: "logging a reading and viewing trend charts" },
  //   links: [],
  // },
];
