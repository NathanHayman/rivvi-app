"use client";

import { cn } from "@phunq/utils";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function Uploader({
  defaultValue,
  name,
}: {
  defaultValue: string | null;
  name: "image" | "logo" | "avatar";
}) {
  // make the logo, and image square or 16/9 and make it smaller
  const aspectRatio = name === "avatar" ? "aspect-square" : "aspect-16/9";

  const inputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState({
    [name]: defaultValue,
  });

  const [dragActive, setDragActive] = useState(false);

  const handleUpload = (file: File | null) => {
    if (file) {
      if (file.size / 1024 / 1024 > 50) {
        toast.error("File size too big (max 50MB)");
      } else if (
        !file.type.includes("png") &&
        !file.type.includes("jpg") &&
        !file.type.includes("jpeg")
      ) {
        toast.error("Invalid file type (must be .png, .jpg, or .jpeg)");
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          setData((prev) => ({ ...prev, [name]: e.target?.result as string }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div>
      <label
        htmlFor={`${name}-upload`}
        className={cn(
          "border-border bg-secondary hover:bg-secondary/80 group relative mt-2 flex min-h-[15rem] cursor-pointer flex-col items-center justify-center rounded-md border shadow-sm transition-all",
          aspectRatio,
          {
            "max-w-sm": aspectRatio === "aspect-16/9",
            "max-w-xs": aspectRatio === "aspect-square",
          },
        )}
      >
        <div
          className="absolute z-[5] h-full w-full rounded-md"
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
            inputRef.current!.files = e.dataTransfer.files; // set input file to dropped file
            handleUpload(file);
          }}
        />
        <div
          className={`${
            dragActive ? "border-primary border-2" : ""
          } absolute z-[3] flex h-full min-h-[10rem] w-full flex-col items-center justify-center rounded-md px-10 transition-all ${
            data[name]
              ? "bg-primary/80 opacity-0 hover:opacity-100 hover:backdrop-blur-md"
              : "bg-secondary hover:bg-secondary/80 opacity-100 hover:backdrop-blur-md"
          }`}
        >
          <svg
            className={`${
              dragActive ? "scale-110" : "scale-100"
            } text-muted-foreground h-7 w-7 transition-all duration-75 group-hover:scale-110 group-active:scale-95`}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
            <path d="M12 12v9"></path>
            <path d="m16 16-4-4-4 4"></path>
          </svg>
          <p className="text-muted-foreground mt-2 text-center text-sm">
            Drag and drop or click to upload.
          </p>
          <p className="text-muted-foreground mt-2 text-center text-sm">
            Max file size: 50MB
          </p>
          <span className="sr-only">Photo upload</span>
        </div>
        {data[name] &&
          // eslint-disable-next-line @next/next/no-img-element
          (name === "logo" ? (
            <img
              src={data[name] as string | undefined}
              alt="Preview"
              className="h-full w-full max-w-[200px] rounded-full object-cover"
            />
          ) : (
            <img
              src={data[name] as string | undefined}
              alt="Preview"
              className="h-full w-full rounded-md object-cover"
            />
          ))}
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <input
          id={`${name}-upload`}
          ref={inputRef}
          name={name}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const file = e.currentTarget.files && e.currentTarget.files[0];
            handleUpload(file);
          }}
        />
      </div>
    </div>
  );
}
