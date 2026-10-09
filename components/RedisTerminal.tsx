// A looping, CSS-animated terminal recording for the Redis clone.
// Swap this for a real interactive demo later (e.g. a WebSocket to a hosted instance).
export default function RedisTerminal() {
  return (
    <div className="terminal" role="img" aria-label="Terminal recording: SET on the leader, then GET returns the value from a follower">
      <div className="terminal-bar">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
        <span className="terminal-title">redis-go — recording</span>
      </div>
      <div className="terminal-body" aria-hidden="true">
        <div className="l1 t-muted">leader :6379 · follower :6380 in sync</div>
        <div className="l2">
          <span className="t-prompt">&gt;</span> SET user:1 &quot;sushant&quot;
        </div>
        <div className="l3 t-ok">OK</div>
        <div className="l4">
          <span className="t-prompt">&gt;</span> GET user:1 <span className="t-muted">(read from follower)</span>
        </div>
        <div className="l5 t-ok">
          &quot;sushant&quot; <span className="t-cursor" />
        </div>
      </div>
    </div>
  );
}
