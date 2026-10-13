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

// Projects are shown in three tiers on the Projects page:
//   "featured" = Deep dives (built properly, measured, documented)
//   "app"      = Apps & products (full-stack apps, shipped or in progress)
//   "lab"      = Small builds & experiments (section is hidden while empty)
// Order inside a tier = order in this list.
export type ProjectTier = "featured" | "app" | "lab";

export type ProjectDemo =
  | { kind: "terminal" } // animated Redis terminal
  | { kind: "queue" } // animated job queue (Taskq)
  // A screen recording in /public/demos: give the path without the extension,
  // and provide both .webm and .mp4 plus a -poster.jpg
  | { kind: "video"; src: string; shape: "portrait" | "landscape"; label: string }
  | { kind: "none" };

export type Project = {
  slug: string;
  name: string;
  tier: ProjectTier;
  tags: string;
  status?: string;
  description: string;
  role?: string; // for team projects: what I built
  stats?: { value: string; label: string }[];
  learned: string[];
  demo: ProjectDemo;
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "redis-go",
    name: "Redis_Go",
    tier: "featured",
    tags: "go · distributed systems",
    description:
      "A Redis-compatible database built from scratch in Go. Works with the official redis-cli, redis-benchmark and client libraries, with AOF persistence and crash recovery, leader-follower replication, and automatic failover through Raft-inspired majority elections.",
    stats: [
      { value: "660k", label: "GET/s pipelined" },
      { value: "100,000", label: "commands verified vs real Redis" },
    ],
    learned: [
      "Profiling beats guessing: batching reply writes gave a 2.9× throughput jump.",
      "Failover is the hard part of a database: majority elections, split-brain write protection and WAIT for synchronous replication.",
      "Diffing 100,000 randomized commands against real Redis is a much stronger check than hand-written test cases.",
    ],
    demo: { kind: "terminal" },
    links: [{ label: "code ↗", href: "https://github.com/SushantPulipati05/Redis_Go" }],
  },
  {
    slug: "taskq",
    name: "Taskq",
    tier: "featured",
    tags: "go · postgres · prometheus",
    description:
      "A durable background-job queue with Postgres as the only store. Workers claim jobs atomically with SKIP LOCKED, hold leases with fencing, retry with exponential backoff, and a reaper recovers jobs from crashed workers. Enqueue can share a transaction with business data.",
    stats: [
      { value: "0.19 ms", label: "job claim on 1M rows" },
      { value: "4,383", label: "jobs/s, 32 workers, durable" },
    ],
    learned: [
      "A full index was slower than no index at all. A partial index on queued jobs took the claim query from ~306 ms to 0.19 ms.",
      "Durability has a cost: about 80% of each job's time was the commit flushing to disk.",
      "Exactly-once delivery isn't possible here, so job handlers have to be idempotent.",
    ],
    demo: { kind: "queue" },
    links: [{ label: "code ↗", href: "https://github.com/SushantPulipati05/taskq" }],
  },
  {
    slug: "razorpay-recovery",
    name: "razorpay_recovery",
    tier: "featured",
    tags: "typescript · postgres · razorpay · twilio",
    description:
      "Recovers revenue from failed payments, subscriptions and overdue invoices. It diagnoses each failure, picks a bounded fix (UPI-only link, WhatsApp nudge, deferral or a silent halt for fraud), respects quiet hours, and reports lift against a holdout group. Built for Razorpay's hackathon.",
    stats: [
      { value: "30%", label: "holdout to measure real lift" },
      { value: "rules → AI", label: "stricter action always wins" },
    ],
    learned: [
      "Let deterministic rules decide and let AI only make an action stricter, so the system stays predictable.",
      "Measure lift against a holdout group, not raw recovery counts.",
      "Webhooks need signature checks and idempotency, or retries count the same payment twice.",
    ],
    demo: { kind: "video", src: "/demos/razorpay-recovery", shape: "landscape", label: "razorpay_recovery dashboard: live recovery metrics, lift by strategy, agent activity and guardrails" },
    links: [{ label: "code ↗", href: "https://github.com/SushantPulipati05/razorpay_recovery" }],
  },
  {
    slug: "trainlog",
    name: "TrainLog",
    tier: "app",
    status: "in beta",
    tags: "kotlin · compose · ktor · postgres",
    description:
      "An Android workout tracker: plan your split, start a session and log sets with a live timer, then look back through every workout on a training calendar. Backed by a Ktor REST API and Postgres on Railway.",
    learned: [
      "Taking an app from localhost to a live API on Railway that real people use.",
      "Modelling workouts, exercises and sets as a relational schema in Postgres.",
    ],
    demo: { kind: "video", src: "/demos/trainlog", shape: "portrait", label: "TrainLog: starting a workout, logging sets and browsing the training calendar" },
    links: [{ label: "code ↗", href: "https://github.com/SushantPulipati05/TrainLog" }],
  },
  {
    slug: "diabetease",
    name: "DiabetEase",
    tier: "app",
    status: "iOS · team project",
    tags: "swift · uikit",
    description:
      "Helps people with diabetes track glucose, meals, water, steps and symptoms, share their data with family, and keep prescriptions and reports in one place.",
    role: "I built the meal logging screens and the onboarding pages, and worked on the app's UI.",
    learned: [
      "Building polished UIKit screens that match a design closely.",
      "Designing onboarding that collects health details without feeling like a long form.",
      "Working in a shared codebase with a team.",
    ],
    demo: { kind: "video", src: "/demos/diabetease", shape: "portrait", label: "DiabetEase: dashboard, meal logs, meal detail, symptoms and family" },
    links: [{ label: "code ↗", href: "https://github.com/chirag3003/mitwpu_group3" }],
  },
  {
    slug: "journaling-app",
    name: "Journaling app",
    tier: "app",
    status: "in progress",
    tags: "go · kotlin · postgres",
    description:
      "An offline-first journal for Android and desktop, synced through a stateless Go REST API, with Google Sign-In and JWTs.",
    learned: ["Designing sync: device-generated UUIDs, versioned records, tombstones and conflict resolution."],
    demo: { kind: "none" },
    links: [],
  },
  {
    slug: "bigBrain",
    name: "BigBrain",
    tier: "app",
    status: "AI notes",
    tags: "next.js · typescript · node.js · openai",
    description:
      "An AI-powered notes workspace that keeps notes and uploaded files in one place, with automatic summaries, content extraction and contextual search.",
    learned: ["Wiring LLMs and vector search into a real product."],
    demo: { kind: "none" },
    links: [{ label: "code ↗", href: "https://github.com/SushantPulipati05/big-brain" }],
  },
];
