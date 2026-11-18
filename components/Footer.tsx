"use client";

import { useEffect, useState } from "react";

// Site footer: Pune's coordinates and the current time there, plus a sign-off.
// The time is filled in after the page loads, so the server and browser
// never disagree about it.
export default function Footer() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" }) +
          " in Pune"
      );
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="footer">
      <span>
        18.52°N 73.86°E{time && <> · {time}</>}
      </span>
      <span>designed and built by me</span>
    </footer>
  );
}
