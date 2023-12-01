"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import { Dispatch, ReactNode, SetStateAction } from "react";

import { cn } from "@phunq/utils";

import { Tooltip } from "./tooltip";

export function Switch({
  fn,
  trackDimensions,
  thumbDimensions,
  thumbTranslate,
  checked = true,
  disabled = false,
  disabledTooltip,
}: {
  fn: Dispatch<SetStateAction<boolean>> | (() => void);
  trackDimensions?: string;
  thumbDimensions?: string;
  thumbTranslate?: string;
  checked?: boolean;
  disabled?: boolean;
  disabledTooltip?: string | ReactNode;
}) {
  if (disabledTooltip) {
    return (
      <Tooltip content={disabledTooltip}>
        <div className="radix-state-checked:bg-secondary bg-accent-foreground relative inline-flex h-4 w-8 flex-shrink-0 cursor-not-allowed rounded-full border-2 border-transparent">
          <div className="bg-primary h-3 w-3 transform rounded-full shadow-lg" />
        </div>
      </Tooltip>
    );
  }

  return (
    <SwitchPrimitive.Root
      checked={checked}
      name="switch"
      onCheckedChange={(checked) => fn(checked)}
      disabled={disabled}
      className={cn(
        disabled
          ? "bg-secondary cursor-not-allowed"
          : "radix-state-checked:bg-primary radix-state-unchecked:bg-secondary focus-visible:ring-primary cursor-pointer focus:outline-none focus-visible:ring focus-visible:ring-opacity-75",
        "focus-visible:ring-ring focus-visible:ring-offset-background data-[state=checked]:bg-primary data-[state=unchecked]:bg-input peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        trackDimensions,
      )}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          `radix-state-checked:${thumbTranslate}`,
          "radix-state-unchecked:translate-x-0",
          "bg-background pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
          thumbDimensions,
          thumbTranslate,
        )}
      />
    </SwitchPrimitive.Root>
  );
}
