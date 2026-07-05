import { AuthShell } from "@/components/auth/AuthShell";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Update password",
};

export default function UpdatePasswordPage() {
  return (
    <AuthShell title="Set a new password" subtitle="Choose a new password for your account.">
      <UpdatePasswordForm />
    </AuthShell>
  );
}
