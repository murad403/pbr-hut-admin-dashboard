import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
  {
    variants: {
      variant: {
        pending: "bg-amber-400 text-black",
        preparing: "bg-blue-500 text-white",
        delivered: "bg-emerald-500 text-white",
        scheduled: "bg-purple-500 text-white",
        cancelled: "bg-red-500 text-white",
      },
    },
    defaultVariants: {
      variant: "pending",
    },
  }
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
