import { InputHTMLAttributes, ReactNode, useMemo, useState } from "react";

import { cn } from "@phunq/utils";

import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

export function Form({
  title,
  description,
  inputLabel,
  inputData,
  helpText,
  buttonText = "Save Changes",
  disabledTooltip,
  handleSubmit,
}: {
  title: string;
  description: string;
  inputLabel?: string;
  inputData: InputHTMLAttributes<HTMLInputElement>;
  helpText?: string;
  buttonText?: string;
  disabledTooltip?: string | ReactNode;
  handleSubmit?: (data: any) => Promise<any>;
}) {
  const [value, setValue] = useState(inputData.defaultValue);
  const [saving, setSaving] = useState(false);
  const saveDisabled = useMemo(() => {
    return saving || !value || value === inputData.defaultValue;
  }, [saving, value, inputData.defaultValue]);

  if (handleSubmit) {
    return (
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setSaving(true);
          await handleSubmit({
            [inputData.name as string]: value,
          });
          setSaving(false);
        }}
        className="border-border bg-background rounded-lg border"
      >
        <div className="flex flex-row items-center justify-between p-4 lg:p-6">
          <h2 className="text-foreground text-base font-medium">{title}</h2>
        </div>
        <div className="bg-background mb-2 flex max-w-md flex-col gap-2 p-4 lg:p-6">
          {typeof inputData.defaultValue === "string" ? (
            <>
              <Label className="select-none text-sm">{inputLabel}</Label>
              <Input
                {...inputData}
                type="text"
                required
                disabled={disabledTooltip ? true : false}
                onChange={(e) => setValue(e.target.value)}
                className={cn({
                  "bg-background text-muted-foreground placeholder:text-accent":
                    !disabledTooltip,
                  "cursor-not-allowed": disabledTooltip,
                })}
              />
            </>
          ) : (
            <div className="bg-background h-[2.35rem] w-full max-w-md animate-pulse rounded-md" />
          )}
        </div>

        <div className="bg-accent/50 border-border flex w-full items-end justify-between border-t px-4 py-3 lg:px-6 lg:py-5">
          <p className="text-muted-foreground text-xs">{helpText}</p>
          <div>
            <Button
              variant="primary"
              text={buttonText}
              loading={saving}
              disabled={saveDisabled}
              disabledTooltip={disabledTooltip}
            />
          </div>
        </div>
      </form>
    );
  }

  return (
    <form className="border-border bg-background rounded-lg border">
      <div className="flex flex-row items-center justify-between p-4 lg:p-6">
        <h2 className="text-muted-foreground text-base font-medium">{title}</h2>
      </div>
      <div className="bg-background mb-2 flex max-w-md flex-col gap-2 p-4 lg:p-6">
        {typeof inputData.defaultValue ? (
          <>
            <Label className="text-muted-foreground select-none text-sm">
              {inputLabel}
            </Label>
            <Input
              {...inputData}
              type="text"
              required
              disabled={true}
              className={cn({
                "bg-background text-muted-foreground placeholder:text-accent cursor-not-allowed":
                  disabledTooltip,
              })}
            />
          </>
        ) : (
          <div className="bg-background h-[2.35rem] w-full max-w-md animate-pulse rounded-md" />
        )}
      </div>
    </form>
  );
}
