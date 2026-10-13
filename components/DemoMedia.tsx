import type { ProjectDemo } from "@/data/content";
import RedisTerminal from "./RedisTerminal";

// Animated job queue for Taskq: jobs move queued → running → done.
function QueueDemo() {
  return (
    <div className="queue-demo" role="img" aria-label="Animation of jobs moving from queued to running to done">
      <div className="queue-title">worker pool · 8 goroutines · SKIP LOCKED</div>
      <div className="queue-lanes" aria-hidden="true">
        <div className="queue-lane"><b>queued</b></div>
        <div className="queue-lane"><b>running</b></div>
        <div className="queue-lane"><b>done</b></div>
        <span className="queue-job j1">job#41</span>
        <span className="queue-job j2">job#42</span>
        <span className="queue-job j3">job#43</span>
      </div>
    </div>
  );
}

export default function DemoMedia({ demo }: { demo: ProjectDemo }) {
  if (demo.kind === "terminal") return <RedisTerminal />;
  if (demo.kind === "queue") return <QueueDemo />;
  if (demo.kind === "video") {
    return (
      <div className={`demo-video ${demo.shape}`}>
        <video autoPlay muted loop playsInline preload="metadata" poster={`${demo.src}-poster.jpg`} aria-label={demo.label}>
          <source src={`${demo.src}.webm`} type="video/webm" />
          <source src={`${demo.src}.mp4`} type="video/mp4" />
        </video>
      </div>
    );
  }
  return null;
}
