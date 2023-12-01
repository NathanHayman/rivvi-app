import {
  Avatar,
  CopyButton,
  IconMenu,
  Popover,
  Tooltip,
  TooltipContent,
  useIntersectionObserver,
  useRouterStuff,
} from "@phunq/ui";
import {
  cn,
  getApexDomain,
  GOOGLE_FAVICON_URL,
  linkConstructor,
  timeAgo,
} from "@phunq/utils";
import { type Site as SiteProps } from "@prisma/client";
import { Archive, CopyPlus, Edit3, QrCode } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";

import useDomains from "@/lib/swr/use-domains";
import useWorkspace from "@/lib/swr/use-workspace";
import { UserProps } from "@/lib/types";
import { useAddEditSiteModal } from "@/components/modal/add-edit-site-modal";
import { useArchiveSiteModal } from "@/components/modal/archive-site-modal";
import { useDeleteSiteModal } from "@/components/modal/delete-site-modal";
import { useSiteQRModal } from "@/components/modal/site-qr-modal";
import { ModalContext } from "@/components/modal/provider";
import { BlurImage } from "@/ui/shared/blur-image";
import { Delete, ThreeDots } from "@/ui/shared/icons";

export default function SiteCard({
  props,
}: {
  props: SiteProps & {
    user: UserProps;
  };
}) {
  const { key, domain, createdAt, archived, user } = props;
  const apexDomain = getApexDomain(domain as string);

  const params = useParams() as { workspaceSlug?: string };
  const { workspaceSlug } = params;
  const { queryParams } = useRouterStuff();

  const { exceededUsage } = useWorkspace();
  const { verified, loading } = useDomains({ domain } as any);

  const linkRef = useRef<any>();
  const entry = useIntersectionObserver(linkRef, {});
  const isVisible = !!entry?.isIntersecting;

  const { setShowSiteQRModal, SiteQRModal } = useSiteQRModal({
    props,
  });
  const { setShowAddEditSiteModal, AddEditSiteModal } = useAddEditSiteModal(); // Remove the unnecessary argument

  const { setShowUpgradePlanModal } = useContext(ModalContext);

  // Duplicate link Modal
  const {
    id: _,
    createdAt: __,
    updatedAt: ___,
    userId: ____,
    ...propsToDuplicate
  } = props;
  const {
    setShowAddEditSiteModal: setShowDuplicateSiteModal,
    AddEditSiteModal: DuplicateSiteModal,
  } = useAddEditSiteModal(); // Remove the unnecessary argument

  const { setShowArchiveSiteModal, ArchiveSiteModal } =
    useArchiveSiteModal({
      props,
      archived: !archived,
    });
  const { setShowDeleteSiteModal, DeleteSiteModal } = useDeleteSiteModal({
    props,
  });
  const [openPopover, setOpenPopover] = useState(false);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    // if there's an existing modal backdrop and the link is selected, unselect it
    const existingModalBackdrop = document.getElementById("modal-backdrop");
    if (existingModalBackdrop && selected) {
      setSelected(false);
    }
  }, [selected]);

  const handlClickOnLinkCard = (e: any) => {
    // Check if the clicked element is a linkRef or one of its descendants
    const isLinkCardClick =
      linkRef.current && linkRef.current.contains(e.target);

    // Check if the clicked element is an <a> or <button> element
    const isExcludedElement =
      e.target.tagName.toLowerCase() === "a" ||
      e.target.tagName.toLowerCase() === "button";

    if (isLinkCardClick && !isExcludedElement) {
      setSelected(!selected);
    } else {
      setSelected(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      document.addEventListener("click", handlClickOnLinkCard);
    }
    return () => {
      document.removeEventListener("click", handlClickOnLinkCard);
    };
  }, [handlClickOnLinkCard]);

  const onKeyDown = (e: any) => {
    // only run shortcut logic if:
    // - usage is not exceeded
    // - link is selected or the 3 dots menu is open
    // - the key pressed is one of the shortcuts
    // - there is no existing modal backdrop
    if (
      !exceededUsage &&
      (selected || openPopover) &&
      ["e", "d", "q", "a", "x"].includes(e.key)
    ) {
      setSelected(false);
      e.preventDefault();
      switch (e.key) {
        case "e":
          setShowAddEditSiteModal(true);
          break;
        case "d":
          setShowDuplicateSiteModal(true);
          break;
        case "q":
          setShowSiteQRModal(true);
          break;
        case "a":
          setShowArchiveSiteModal(true);
          break;
        case "x":
          setShowDeleteSiteModal(true);
          break;
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  return (
    <li
      ref={linkRef}
      className={`${
        selected ? "border-black" : "border-gray-50"
      } relative rounded-lg border-2 bg-white p-3 pr-1 shadow transition-all hover:shadow-md sm:p-4`}
    >
      {isVisible && (
        <>
          <SiteQRModal />
          <AddEditSiteModal />
          <DuplicateSiteModal />
          <ArchiveSiteModal />
          <DeleteSiteModal />
        </>
      )}
      <div className="relative flex items-center justify-between">
        <div className="relative flex shrink items-center">
          {archived ? (
            <Tooltip content="This link is archived. It will still work, but won't be shown in your dashboard.">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 px-0 sm:h-10 sm:w-10">
                <Archive className="h-4 w-4 text-gray-500 sm:h-5 sm:w-5" />
              </div>
            </Tooltip>
          ) : (
            <BlurImage
              src={`${GOOGLE_FAVICON_URL}${apexDomain}`}
              alt={apexDomain}
              className="h-8 w-8 rounded-full sm:h-10 sm:w-10"
              width={20}
              height={20}
            />
          )}
          {/* 
            Here, we're manually setting ml-* values because if we do space-x-* in the parent div, 
            it messes up the tooltip positioning.
          */}
          <div className="ml-2 sm:ml-4">
            <div className="flex max-w-fit items-center space-x-2">
              {workspaceSlug && !verified && !loading ? (
                <Tooltip
                  content={
                    <TooltipContent
                      title="Your branded links won't work until you verify your domain."
                      cta="Verify your domain"
                      href={`/${workspaceSlug}/domains`}
                    />
                  }
                >
                  <div className="w-24 -translate-x-2 cursor-not-allowed truncate text-sm font-semibold text-gray-400 line-through sm:w-full sm:text-base">
                    {linkConstructor({
                      key: key as string,
                      domain: domain as string,
                      pretty: true,
                    })}
                  </div>
                </Tooltip>
              ) : (
                <a
                  className={cn(
                    "w-full max-w-[140px] truncate text-sm font-semibold text-blue-800 sm:max-w-[300px] sm:text-base md:max-w-[360px] xl:max-w-[500px]",
                    {
                      "text-gray-500": archived,
                    },
                  )}
                  href={linkConstructor({ key, domain } as any)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {linkConstructor({
                    key: key as string,
                    domain: domain as string,
                    pretty: true,
                  })}
                </a>
              )}
              <CopyButton value={linkConstructor({ key, domain } as any)} />
            </div>
            <Link href={`/${workspaceSlug}/funnels/${key}`}>
              <p
                className={cn(
                  "mb-2 mt-1 text-sm font-semibold text-gray-700 transition-all duration-75 hover:text-blue-800 active:text-blue-900 sm:text-base",
                  {
                    "text-gray-600": archived,
                  },
                )}
              >
                Edit {props.name || "Untitled"}
              </p>
            </Link>
            <div className="flex max-w-fit items-center space-x-1">
              <Tooltip
                content={
                  <div className="w-full p-4">
                    <Avatar user={user} className="h-10 w-10" />
                    <p className="mt-2 text-sm font-semibold text-gray-700">
                      {user?.name || user?.email || "Anonymous User"}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Created{" "}
                      {new Date(createdAt).toLocaleDateString("en-us", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                }
              >
                {/* Without the wrapping div, the Tooltip won't be triggered for some reason */}
                <div className="w-4">
                  <Avatar user={user} className="h-4 w-4" />
                </div>
              </Tooltip>
              <p>•</p>
              <p
                className="whitespace-nowrap text-sm text-gray-500"
                suppressHydrationWarning
              >
                {timeAgo(createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Popover
            content={
              <div className="grid w-full gap-px p-2 sm:w-48">
                {workspaceSlug && exceededUsage ? (
                  <Tooltip
                    content={
                      <TooltipContent
                        title="Your project has exceeded its usage limit. We're still collecting data on your existing links, but you need to upgrade to edit them."
                        cta="Upgrade to Pro"
                        onClick={() => {
                          setOpenPopover(false);
                          setShowUpgradePlanModal(true);
                        }}
                      />
                    }
                  >
                    <div className="flex w-full cursor-not-allowed items-center justify-between p-2 text-left text-sm font-medium text-gray-300 transition-all duration-75">
                      <IconMenu
                        text="Edit"
                        icon={<Edit3 className="h-4 w-4" />}
                      />
                      <kbd className="hidden rounded bg-gray-100 px-2 py-0.5 text-xs font-light text-gray-300 transition-all duration-75 sm:inline-block">
                        E
                      </kbd>
                    </div>
                  </Tooltip>
                ) : (
                  <button
                    onClick={() => {
                      setOpenPopover(false);
                      setShowAddEditSiteModal(true);
                    }}
                    className="group flex w-full items-center justify-between rounded-md p-2 text-left text-sm font-medium text-gray-500 transition-all duration-75 hover:bg-gray-100"
                  >
                    <IconMenu
                      text="Edit"
                      icon={<Edit3 className="h-4 w-4" />}
                    />
                    <kbd className="hidden rounded bg-gray-100 px-2 py-0.5 text-xs font-light text-gray-500 transition-all duration-75 group-hover:bg-gray-200 sm:inline-block">
                      E
                    </kbd>
                  </button>
                )}
                {workspaceSlug && exceededUsage ? (
                  <Tooltip
                    content={
                      <TooltipContent
                        title="Your project has exceeded its usage limit. We're still collecting data on your existing links, but you need to upgrade to create a new link."
                        cta="Upgrade to Pro"
                        onClick={() => {
                          setOpenPopover(false);
                          setShowUpgradePlanModal(true);
                        }}
                      />
                    }
                  >
                    <div className="flex w-full cursor-not-allowed items-center justify-between p-2 text-left text-sm font-medium text-gray-300 transition-all duration-75">
                      <IconMenu
                        text="Duplicate"
                        icon={<CopyPlus className="h-4 w-4" />}
                      />
                      <kbd className="hidden rounded bg-gray-100 px-2 py-0.5 text-xs font-light text-gray-300 transition-all duration-75 sm:inline-block">
                        D
                      </kbd>
                    </div>
                  </Tooltip>
                ) : (
                  <button
                    onClick={() => {
                      setOpenPopover(false);
                      setShowDuplicateSiteModal(true);
                    }}
                    className="group flex w-full items-center justify-between rounded-md p-2 text-left text-sm font-medium text-gray-500 transition-all duration-75 hover:bg-gray-100"
                  >
                    <IconMenu
                      text="Duplicate"
                      icon={<CopyPlus className="h-4 w-4" />}
                    />
                    <kbd className="hidden rounded bg-gray-100 px-2 py-0.5 text-xs font-light text-gray-500 transition-all duration-75 group-hover:bg-gray-200 sm:inline-block">
                      D
                    </kbd>
                  </button>
                )}
                <button
                  onClick={() => {
                    setOpenPopover(false);
                    setShowSiteQRModal(true);
                  }}
                  className="group flex w-full items-center justify-between rounded-md p-2 text-left text-sm font-medium text-gray-500 transition-all duration-75 hover:bg-gray-100"
                >
                  <IconMenu
                    text="QR Code"
                    icon={<QrCode className="h-4 w-4" />}
                  />
                  <kbd className="hidden rounded bg-gray-100 px-2 py-0.5 text-xs font-light text-gray-500 transition-all duration-75 group-hover:bg-gray-200 sm:inline-block">
                    Q
                  </kbd>
                </button>
                <button
                  onClick={() => {
                    setOpenPopover(false);
                    setShowArchiveSiteModal(true);
                  }}
                  className="group flex w-full items-center justify-between rounded-md p-2 text-left text-sm font-medium text-gray-500 transition-all duration-75 hover:bg-gray-100"
                >
                  <IconMenu
                    text={archived ? "Unarchive" : "Archive"}
                    icon={<Archive className="h-4 w-4" />}
                  />
                  <kbd className="hidden rounded bg-gray-100 px-2 py-0.5 text-xs font-light text-gray-500 transition-all duration-75 group-hover:bg-gray-200 sm:inline-block">
                    A
                  </kbd>
                </button>
                <button
                  onClick={() => {
                    setOpenPopover(false);
                    setShowDeleteSiteModal(true);
                  }}
                  className="group flex w-full items-center justify-between rounded-md p-2 text-left text-sm font-medium text-red-600 transition-all duration-75 hover:bg-red-600 hover:text-white"
                >
                  <IconMenu
                    text="Delete"
                    icon={<Delete className="h-4 w-4" />}
                  />
                  <kbd className="hidden rounded bg-red-100 px-2 py-0.5 text-xs font-light text-red-600 transition-all duration-75 group-hover:bg-red-500 group-hover:text-white sm:inline-block">
                    X
                  </kbd>
                </button>
              </div>
            }
            align="end"
            openPopover={openPopover}
            setOpenPopover={setOpenPopover}
          >
            <button
              type="button"
              onClick={() => {
                setOpenPopover(!openPopover);
              }}
              className="rounded-md px-1 py-2 transition-all duration-75 hover:bg-gray-100 active:bg-gray-200"
            >
              <span className="sr-only">Edit</span>
              <ThreeDots className="h-5 w-5 text-gray-500" />
            </button>
          </Popover>
        </div>
      </div>
    </li>
  );
}
