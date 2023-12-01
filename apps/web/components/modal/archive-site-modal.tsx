import { Button, Modal } from "@phunq/ui";
import { linkConstructor } from "@phunq/utils";
import { type Site as SiteProps } from "@prisma/client";
import { useParams } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { mutate } from "swr";

function ArchiveSiteModal({
  showArchiveSiteModal,
  setShowArchiveSiteModal,
  props,
  archived,
}: {
  showArchiveSiteModal: boolean;
  setShowArchiveSiteModal: Dispatch<SetStateAction<boolean>>;
  props: SiteProps;
  archived: boolean;
}) {
  const params = useParams() as { workspaceSlug?: string };
  const { workspaceSlug } = params;
  const [archiving, setArchiving] = useState(false);

  const { key, domain } = props as { key: string; domain: string };

  const shortSiteUrl = useMemo(() => {
    return linkConstructor({
      key,
      domain,
      pretty: true,
    });
  }, [key, domain]);

  return (
    <Modal
      showModal={showArchiveSiteModal}
      setShowModal={setShowArchiveSiteModal}
    >
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 px-4 py-4 pt-8 text-center sm:px-16">
        <h3 className="text-lg font-medium">
          {archived ? "Archive" : "Unarchive"} {shortSiteUrl}
        </h3>
        <p className="text-sm text-gray-500">
          {archived
            ? "Archived sites will still work - they just won't show up on your main dashboard."
            : "By unarchiving this site, it will show up on your main dashboard again."}
        </p>
      </div>

      <div className="flex flex-col space-y-6 bg-gray-50 px-4 py-8 text-left sm:px-16">
        <Button
          onClick={async (e) => {
            e.preventDefault();
            setArchiving(true);
            fetch(
              `/api${
                workspaceSlug ? `/workspaces/${workspaceSlug}` : ""
              }/sites/${props.id}/archive`,
              {
                method: archived ? "POST" : "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              },
            ).then(async (res) => {
              if (res.status === 200) {
                await Promise.all([
                  mutate(
                    (key) =>
                      typeof key === "string" &&
                      key.startsWith(
                        `/api${
                          workspaceSlug
                            ? `/workspaces/${workspaceSlug}/sites`
                            : "/sites"
                        }`,
                      ),
                  ),
                  mutate(
                    (key) =>
                      typeof key === "string" &&
                      key.startsWith(
                        `/api${
                          workspaceSlug ? `/workspaces/${workspaceSlug}` : ""
                        }/sites/count`,
                      ),
                    undefined,
                    { revalidate: true },
                  ),
                ]);
                setShowArchiveSiteModal(false);
                toast.success(
                  `Successfully ${
                    archived ? "archived" : "unarchived"
                  } site!`,
                );
              } else {
                toast.error(res.statusText);
              }
              setArchiving(false);
            });
          }}
          autoFocus
          loading={archiving}
          text={`Confirm ${archived ? "archive" : "unarchive"}`}
        />
      </div>
    </Modal>
  );
}

export function useArchiveSiteModal({
  props,
  archived = true,
}: {
  props: SiteProps;
  archived: boolean;
}) {
  const [showArchiveSiteModal, setShowArchiveSiteModal] = useState(false);

  const ArchiveSiteModalCallback = useCallback(() => {
    return props ? (
      <ArchiveSiteModal
        showArchiveSiteModal={showArchiveSiteModal}
        setShowArchiveSiteModal={setShowArchiveSiteModal}
        props={props}
        archived={archived}
      />
    ) : null;
  }, [showArchiveSiteModal, setShowArchiveSiteModal]);

  return useMemo(
    () => ({
      setShowArchiveSiteModal,
      ArchiveSiteModal: ArchiveSiteModalCallback,
    }),
    [setShowArchiveSiteModal, ArchiveSiteModalCallback],
  );
}
