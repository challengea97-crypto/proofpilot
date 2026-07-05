"use client";

import { useEffect, useState, useTransition } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { setReportShareAction } from "@/app/dashboard/reports/[id]/actions";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export function ShareControls({
  reportId,
  shareToken,
}: {
  reportId: string;
  shareToken: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => setOrigin(window.location.origin), []);
  const shareUrl = shareToken ? `${origin}/r/${shareToken}` : "";

  function toggle(enable: boolean) {
    setError(null);
    startTransition(async () => {
      const res = await setReportShareAction(reportId, enable);
      if (res?.error) setError(res.error);
    });
  }

  function copy() {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="space-y-3">
      {shareToken ? (
        <>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={shareUrl}
              onFocus={(e) => e.currentTarget.select()}
              aria-label="Public share link"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-neutral-300"
            />
            <Button variant="secondary" size="sm" onClick={copy} aria-label="Copy link">
              {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
            </Button>
          </div>
          <p className="text-xs text-neutral-500">Anyone with this link can view the report.</p>
          <Button variant="ghost" size="sm" onClick={() => toggle(false)} loading={pending}>
            Stop sharing
          </Button>
        </>
      ) : (
        <Button variant="secondary" size="sm" onClick={() => toggle(true)} loading={pending}>
          <Share2 className="h-4 w-4" aria-hidden />
          Create share link
        </Button>
      )}
      {error && <Alert tone="error">{error}</Alert>}
    </div>
  );
}
