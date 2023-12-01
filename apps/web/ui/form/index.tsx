"use client";

import {
  buttonVariants,
  Input,
  LoadingDots,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@phunq/ui";
import { cn } from "@phunq/utils";
import va from "@vercel/analytics";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import DomainConfiguration from "./domain-configuration";
import DomainStatus from "./domain-status";
import Uploader from "./uploader";

export default function Form({
  title,
  description,
  helpText,
  inputAttrs,
  handleSubmit,
}: {
  title: string;
  description: string;
  helpText: string;
  inputAttrs: {
    name: string;
    type: string;
    defaultValue: string;
    placeholder?: string;
    maxLength?: number;
    pattern?: string;
  };
  handleSubmit: any;
}) {
  const { key, workspaceSlug } = useParams() as {
    key: string;
    workspaceSlug: string;
  };
  const router = useRouter();
  const { update } = useSession();
  return (
    <form
      action={async (data: FormData) => {
        if (
          inputAttrs.name === "domain" &&
          inputAttrs.defaultValue &&
          data.get("domain") !== inputAttrs.defaultValue &&
          !confirm("Are you sure you want to change your custom domain?")
        ) {
          return;
        }
        // if value was not changed, don't submit for any input
        if (
          inputAttrs.defaultValue === data.get(inputAttrs.name) ||
          (inputAttrs.name === "domain" &&
            inputAttrs.defaultValue === data.get("domain"))
        ) {
          return;
        }
        // if there is no value, don't submit for any input
        if (!data.get(inputAttrs.name)) {
          return;
        }
        handleSubmit(data, key, inputAttrs.name).then(async (res: any) => {
          if (res.error) {
            toast.error(`res.error - ${res.error}`);
          } else {
            va.track(`Updated ${inputAttrs.name}`, key ? { key } : {});
            if (key) {
              router.refresh();
            } else {
              await update();
              router.refresh();
            }
            toast.success(`Successfully updated ${inputAttrs.name}!`);
          }
        });
      }}
      className="border-border bg-background rounded-lg border"
    >
      <div className="flex flex-col items-start justify-center p-4 lg:p-6">
        <h2 className="text-foreground mb-2 text-base font-medium">{title}</h2>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <div className="bg-background relative mb-2 flex max-w-md flex-col gap-2 p-4 lg:p-6">
        {inputAttrs.name === "image" ||
        inputAttrs.name === "logo" ||
        inputAttrs.name === "avatar" ? (
          <Uploader
            defaultValue={inputAttrs.defaultValue}
            name={inputAttrs.name}
          />
        ) : inputAttrs.name === "font" ? (
          <Select {...inputAttrs}>
            <SelectTrigger className="border-border text-slate-12 w-full rounded-md border px-4 py-2 text-sm font-medium">
              <SelectValue placeholder="font" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              <SelectItem value="font-cal" className="hover:bg-accent">
                Cal Sans
              </SelectItem>
              <SelectItem value="font-lora" className="hover:bg-accent">
                Lora
              </SelectItem>
              <SelectItem value="font-work" className="hover:bg-accent">
                Work Sans
              </SelectItem>
            </SelectContent>
          </Select>
        ) : inputAttrs.name === "domain" ? (
          <>
            <Input {...inputAttrs} required />
            {inputAttrs.defaultValue && (
              <div className="absolute right-3 z-10 flex h-full items-center">
                <DomainStatus
                  domain={inputAttrs.defaultValue}
                  workspaceSlug={workspaceSlug}
                />
              </div>
            )}
          </>
        ) : inputAttrs.name === "customDomain" ? (
          <>
            <Input {...inputAttrs} required />
            <div className="flex items-center rounded-r-md border border-l-0 px-3 text-sm">
              {process.env.NEXT_PUBLIC_ROOT_DOMAIN}
            </div>
          </>
        ) : inputAttrs.name === "description" ? (
          <Textarea
            {...inputAttrs}
            rows={3}
            required
            className="border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        ) : inputAttrs.name === "email" ? (
          <div className="relative">
            <Input {...inputAttrs} required type="email" />
          </div>
        ) : (
          <Input {...inputAttrs} required />
        )}
        {inputAttrs.name === "domain" && inputAttrs.defaultValue && (
          <DomainConfiguration domain={inputAttrs.defaultValue} />
        )}
      </div>
      <div className="border-border bg-accent/50 flex w-full items-end justify-between border-t px-4 py-3 lg:px-6 lg:py-5">
        <p className="text-muted-foreground text-xs sm:max-w-md">{helpText}</p>
        <div>
          <FormButton />
        </div>
      </div>
    </form>
  );
}

function FormButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className={cn(
        buttonVariants({ variant: "default", size: "sm" }),
        "border-border flex h-8 w-40 items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none sm:h-10",
        pending
          ? "cursor-not-allowed"
          : "border-border bg-secondary text-muted-foreground dark:text-foreground hover:bg-secondary/90",
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots /> : <p>Save Changes</p>}
    </button>
  );
}
