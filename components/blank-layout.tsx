import { ReactNode } from "react";
export default function BlankLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full items-center justify-center">
      {children}
    </div>
  );
}
