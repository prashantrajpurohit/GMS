import { LoginForm } from "@/components/login-form";
import { GradientCardClass } from "@/helper/helper";
export default function Page() {
  return (
    <div className="w-full max-w-sm">
      <LoginForm className={GradientCardClass} />
    </div>
  );
}
