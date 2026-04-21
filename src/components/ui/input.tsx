import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type = "text", ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full rounded-full border border-black/10 bg-white px-4 text-sm text-[#1A1A1A] shadow-sm outline-none placeholder:text-black/40 focus-visible:ring-2 focus-visible:ring-black/10",
        className
      )}
      {...props}
    />
  );
}

export { Input };
