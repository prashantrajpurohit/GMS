"use client";
import BlankLayout from "@/components/blank-layout";
import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  // const getHomeRoute = (role: string) => {
  //   if (role === "admin") {
  //     return "/dashboard";
  //   } else if (role === "staff") {
  //     return "/404";
  //   } else {
  //     return "/401";
  //   }
  // };

  useEffect(() => {
    console.log("IN PAGE");

    router.replace("/dashboard");
  }, []);

  return (
    <BlankLayout>
      <Image
        src="/images/logo_1.gif"
        alt="logo_1.gif"
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "100%", height: "65vh" }}
      />
    </BlankLayout>
  );
}
