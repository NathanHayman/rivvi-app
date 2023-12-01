"use client";

import { ReactNode } from "react";

import { cn } from "@phunq/utils";

import { LoadingDots } from "./icons";
import { Tooltip } from "./tooltip";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  variant?:
    | "primary"
    | "secondary"
    | "ghost"
    | "link"
    | "outline"
    | "destructive";
  loading?: boolean;
  icon?: ReactNode;
  disabledTooltip?: string | ReactNode;
  dotClassnames?: string;
}

export function Button({
  text,
  variant = "primary",
  loading,
  icon,
  disabledTooltip,
  dotClassnames,
  ...props
}: ButtonProps) {
  if (disabledTooltip) {
    return (
      <Tooltip content={disabledTooltip} fullWidth>
        <div className="border-border bg-accent text-muted-foreground flex h-10 w-full cursor-not-allowed items-center justify-center rounded-md border px-4 py-2 text-sm transition-all focus:outline-none">
          <p>{text}</p>
        </div>
      </Tooltip>
    );
  }
  return (
    <button
      // if onClick is passed, it's a "button" type, otherwise it's being used in a form, hence "submit"
      type={props.onClick ? "button" : "submit"}
      className={cn(
        "focus-visible:ring-ring inline-flex h-10 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-70",
        icon && "space-x-3",
        props.disabled
          ? "border-border cursor-not-allowed space-x-3 opacity-70"
          : {
              "bg-primary text-primary-foreground hover:bg-primary/90 shadow":
                variant === "primary",
              "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow":
                variant === "secondary",
              "hover:bg-accent hover:text-accent-foreground":
                variant === "ghost",
              "text-primary underline-offset-4 hover:underline":
                variant === "link",
              "border-input bg-background hover:bg-accent hover:text-accent-foreground border shadow":
                variant === "outline",
              "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow":
                variant === "destructive",
            },
        props.className,
      )}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading ? (
        <LoadingDots
          className={cn(
            dotClassnames,
            "h-5 w-5",
            icon ? "mr-2" : "",
            variant === "primary" && "bg-primary-foreground dark:bg-foreground",
            variant === "secondary" && "bg-muted-foreground dark:bg-foreground",
          )}
        />
      ) : icon ? (
        icon
      ) : null}
      <p className={cn(icon || loading ? "ml-2" : " ")}>{text}</p>
    </button>
  );
}
