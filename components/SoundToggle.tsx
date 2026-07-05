"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isSoundEnabled, setSoundEnabled, playChime } from "@/lib/sound";
import { Button } from "@/components/ui/Button";

export function SoundToggle() {
  const [on, setOn] = useState(true);

  useEffect(() => setOn(isSoundEnabled()), []);

  function toggle() {
    const next = !on;
    setOn(next);
    setSoundEnabled(next);
    if (next) playChime();
  }

  return (
    <Button variant="secondary" size="sm" onClick={toggle} aria-pressed={on}>
      {on ? <Volume2 className="h-4 w-4" aria-hidden /> : <VolumeX className="h-4 w-4" aria-hidden />}
      {on ? "Sound on" : "Sound off"}
    </Button>
  );
}
