"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/Button";

/** Opens the browser print dialog — the user can "Save as PDF" from there. */
export function PrintButton() {
  return (
    <Button variant="secondary" onClick={() => window.print()}>
      <Printer className="h-4 w-4" aria-hidden />
      Print / Save as PDF
    </Button>
  );
}
