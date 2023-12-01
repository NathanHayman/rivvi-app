"use client";

import { buttonVariants,Label, LoadingDots } from "@phunq/ui";
import { cn } from "@phunq/utils";
import { UploadCloud } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function UploadAvatar() {
  const { data: session, update } = useSession();

  const [image, setImage] = useState<string | null>();

  useEffect(() => {
    setImage(
      session?.user?.image ||
        (session?.user?.email
          ? `https://api.dicebear.com/7.x/micah/svg?seed=${session?.user?.email}`
          : null),
    );
  }, [session]);

  const [dragActive, setDragActive] = useState(false);

  const onChangePicture = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size / 1024 / 1024 > 2) {
          toast.error("File size too big (max 2MB)");
        } else if (file.type !== "image/png" && file.type !== "image/jpeg") {
          toast.error("File type not supported (.png or .jpg only)");
        } else {
          const reader = new FileReader();
          reader.onload = (e) => {
            setImage(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      }
    },
    [setImage],
  );

  const [uploading, setUploading] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        setUploading(true);
        e.preventDefault();
        fetch("/api/user", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image }),
        }).then(async (res) => {
          setUploading(false);
          if (res.status === 200) {
            await update();
            toast.success("Successfully updated your profile picture!");
          } else {
            const errorMessage = await res.text();
            toast.error(errorMessage || "Something went wrong");
          }
        });
      }}
      className="border-border rounded-lg border"
    >
      <div className="flex flex-col space-y-3 p-5 sm:p-10">
        <h2 className="text-foreground text-xl font-medium">Your Avatar</h2>
        <p className="text-muted-foreground text-sm">
          This is your avatar image on Phunq.
        </p>
        <div>
          <Label
            htmlFor="image"
            className="border-accent bg-primary/50 hover:bg-primary/80 group relative mt-1 flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border shadow-sm transition-all"
          >
            <div
              className="absolute z-[5] h-full w-full rounded-full"
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(true);
              }}
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(false);
                const file = e.dataTransfer.files && e.dataTransfer.files[0];
                if (file) {
                  if (file.size / 1024 / 1024 > 2) {
                    toast.error("File size too big (max 2MB)");
                  } else if (
                    file.type !== "image/png" &&
                    file.type !== "image/jpeg"
                  ) {
                    toast.error("File type not supported (.png or .jpg only)");
                  } else {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      setImage(e.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }
              }}
            />
            <div
              className={`${
                dragActive
                  ? "border-primary bg-primary cursor-copy border-2 opacity-80"
                  : ""
              } bg-primary absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-full transition-all ${
                image
                  ? "opacity-0 group-hover:opacity-100"
                  : "group-hover:bg-primary-foreground"
              }`}
            >
              <UploadCloud
                className={`${
                  dragActive ? "scale-110" : "scale-100"
                } text-secondary h-5 w-5 transition-all duration-75 group-hover:scale-110 group-active:scale-95`}
              />
            </div>
            {image && (
              <img
                src={image}
                alt="Preview"
                className="h-full w-full rounded-full object-cover"
              />
            )}
          </Label>
          <div className="mt-1 flex rounded-full shadow-sm">
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={onChangePicture}
            />
          </div>
        </div>
      </div>

      <div className="border-border bg-accent/50 flex w-full items-end justify-between border-t px-4 py-3 lg:px-6 lg:py-5">
        <p className="text-muted-foreground text-xs">
          Square image recommended. Accepted file types: .png, .jpg. Max file
          size: 2MB.
        </p>
        <div>
          <button
            className={cn(
              buttonVariants({ variant: "default", size: "default" }),
              "w-full space-x-2",
            )}
            disabled={!image || session?.user?.image === image}
          >
            {uploading && (
              <LoadingDots className="bg-primary-foreground mr-4" />
            )}
            <p className="">Save changes</p>
          </button>
        </div>
      </div>
    </form>
  );
}
