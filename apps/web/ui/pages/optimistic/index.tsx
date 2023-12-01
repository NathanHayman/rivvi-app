"use client";

import { buttonVariants } from "@phunq/ui";
import { cn } from "@phunq/utils";
import { Page } from "@prisma/client";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import { AddPagesToFunnel } from "@/lib/actions/page";
import { Header } from "@/ui/layout/dashboard/header";
import { Main } from "@/ui/layout/dashboard/main";
import { Shell } from "@/ui/layout/dashboard/shell";

import AddPageItem from "../add";
import AddPagesToFunnelSidebar from "../add/sidebar";

export function OptimisticPages({
  workspaceSlug,
  workspacePagesFiltered,
  children,
}: {
  workspaceSlug: string;
  workspacePagesFiltered: any[];
  children: React.ReactNode;
}) {
  const [isOpened, setIsOpened] = useState(false);
  const [selectedPages, setSelectedPages] = useState([]) as any[];
  const { key } = useParams() as { key: string };
  return (
    <div>
      <Shell>
        <Header heading="Pages for this funnel">
          <div className="flex-end flex gap-y-2">
            <button
              className={cn(buttonVariants({ variant: "default" }))}
              onClick={() => setIsOpened(!isOpened)}
            >
              Add funnel pages
            </button>
            <motion.div
              initial={{ opacity: 0, x: -600 }}
              animate={{
                opacity: isOpened ? 1 : 0,
                x: isOpened ? 0 : -600,
              }}
              transition={{ duration: 0.2 }}
              className={cn(
                "bg-background/80 fixed left-0 top-0 z-[9999] h-full w-full",
                isOpened
                  ? "pointer-events-auto backdrop-blur-sm"
                  : "pointer-events-none hidden",
              )}
              // className="bg-background/50 fixed top-0 left-0 z-[9999] h-full w-full backdrop-blur-lg"
              onClick={() => setIsOpened(false)}
            />
            <motion.div
              initial={{ x: 700, opacity: 0 }}
              animate={{
                x: isOpened ? 0 : 700,
                opacity: isOpened ? 1 : 0,
              }}
              transition={{ duration: 0.2 }}
              className="bg-background border-border fixed right-0 top-0 z-[99999] mx-auto flex h-full w-[700px] flex-col items-center border-l"
            >
              <AddPagesToFunnelSidebar>
                <form
                  onSubmit={async (e: FormEvent) => {
                    e.preventDefault();
                    setIsOpened(false);
                    await AddPagesToFunnel({ key, pages: selectedPages });
                    toast.success("Successfully added pages to funnel!");
                  }}
                  className="mx-auto flex w-full flex-col gap-y-3 self-center"
                >
                  {workspacePagesFiltered.length ? (
                    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                      {workspacePagesFiltered.map((page: Page) => (
                        <div
                          key={page.id}
                          onClick={() => {
                            if (selectedPages.includes(page.id)) {
                              setSelectedPages(
                                selectedPages.filter((p) => p !== page.id),
                              );
                            } else {
                              setSelectedPages([...selectedPages, page.id]);
                            }
                          }}
                          className={cn(
                            "hover:bg-accent border-border flex w-full cursor-pointer flex-col justify-between rounded-lg border",
                            selectedPages.includes(page.id)
                              ? "bg-primary/40 ring-primary=70 ring-2 ring-offset-1"
                              : "border-none",
                          )}
                        >
                          <AddPageItem data={page} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center">
                      <h2 className="text-foreground text-2xl font-semibold">
                        No pages yet.
                      </h2>
                      <p className="text-muted-foreground mt-2 text-sm">
                        Create your first page to get started.
                      </p>
                    </div>
                  )}
                  <AddPagesToFunnelButton />
                </form>
              </AddPagesToFunnelSidebar>
            </motion.div>
          </div>
        </Header>
        <Main className="flex flex-col gap-4">{children}</Main>
      </Shell>
    </div>
  );
}

function AddPagesToFunnelButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={cn(buttonVariants({ variant: "default" }), "mt-6 w-fit")}
      disabled={pending}
    >
      Add Pages to Funnel
      {/* {pending ? <LoadingDots /> : <p>Save Changes</p>} */}
    </button>
  );
}
