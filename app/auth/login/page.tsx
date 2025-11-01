import LeftWrapper from "@/components/leftWrapper";
import LoginForm from "@/components/login-form";

export default function Page() {
  return (
    <div className="min-h-screen bg-background flex">
      <LeftWrapper />
      <LoginForm />
    </div>
  );
}
