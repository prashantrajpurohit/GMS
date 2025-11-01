import LeftWrapper from "@/components/leftWrapper";
import LoginForm from "@/components/login-form";
import Registration from "@/components/register-form";

export default function Page() {
  return (
    <div className="min-h-screen bg-background flex">
      <LeftWrapper />
      <Registration />
    </div>
  );
}
