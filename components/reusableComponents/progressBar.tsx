"use client";

import * as Progress from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function ProgressBar({
  value,
  showLabel = true,
}: {
  value: number;
  showLabel?: boolean;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setProgress(value), 150);
    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <div className="w-full">
      <Progress.Root
        className={cn(
          "relative h-4 w-full overflow-hidden rounded-full bg-muted shadow-inner border border-gray-300"
        )}
        value={progress}
      >
        <Progress.Indicator
          className={cn(
            "h-full transition-all duration-500 ease-in-out",
            "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
            "shadow-[0_0_10px_rgba(147,51,234,0.5)]"
          )}
          style={{ transform: `translateX(-${100 - progress}%)` }}
        />
      </Progress.Root>
      {showLabel && (
        <div className="text-right text-sm text-muted-foreground mt-1 font-medium">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
}
