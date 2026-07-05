import { AuthSplit } from "@/components/auth/AuthSplit";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Reset password",
};

export default function ResetPasswordPage() {
  return (
    <AuthSplit title="Reset password" subtitle="We'll email you a secure link to set a new one.">
      <ResetPasswordForm />
    </AuthSplit>
  );
}
