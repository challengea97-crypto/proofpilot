"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function openPortal() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not open the billing portal.");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open the billing portal.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <Button variant="secondary" onClick={openPortal} loading={loading}>
        <CreditCard className="h-4 w-4" aria-hidden />
        Manage subscription
      </Button>
      {error && <Alert tone="error">{error}</Alert>}
    </div>
  );
}
