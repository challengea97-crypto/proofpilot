import { AuthSplit } from "@/components/auth/AuthSplit";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Update password",
};

export default function UpdatePasswordPage() {
  return (
    <AuthSplit title="Set a new password" subtitle="Choose a new password for your account.">
      <UpdatePasswordForm />
    </AuthSplit>
  );
}
