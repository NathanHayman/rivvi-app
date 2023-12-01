import { cn } from "@phunq/utils";

export default function LoadingDots({ className }: { className?: string }) {
  return (
    <span className="inline-flex items-center">
      {[...Array(3)].map((_, i) => (
        <span
          key={i}
          style={{
            animationDelay: `${0.2 * i}s`,
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            display: "inline-block",
            margin: "0 1px",
          }}
          className={cn(
            "animate-blink",
            "bg-accent",
            "h-5",
            "w-5",
            "rounded-full",
            className,
          )}
        />
      ))}
    </span>
  );
}
