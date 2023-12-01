import { Avatar, Button, Logo, Modal } from "@phunq/ui";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { mutate } from "swr";

import useWorkspace from "@/lib/swr/use-workspace";
import { UserProps } from "@/lib/types";
import { BlurImage } from "@/ui/shared/blur-image";

function RemoveTeammateModal({
  showRemoveTeammateModal,
  setShowRemoveTeammateModal,
  user,
  invite,
}: {
  showRemoveTeammateModal: boolean;
  setShowRemoveTeammateModal: Dispatch<SetStateAction<boolean>>;
  user: UserProps;
  invite?: boolean;
}) {
  const router = useRouter();
  const { workspaceSlug } = useParams() as { workspaceSlug: string };
  const [removing, setRemoving] = useState(false);
  const { name: workspaceName, logo } = useWorkspace();
  const { data: session } = useSession();
  const { id, name, email } = user;

  return (
    <Modal
      showModal={showRemoveTeammateModal}
      setShowModal={setShowRemoveTeammateModal}
    >
      <div className="border-border flex flex-col items-center justify-center space-y-3 border-b px-4 py-4 pt-8 sm:px-12">
        {logo ? (
          <BlurImage
            src={logo}
            alt="Workspace logo"
            className="h-10 w-10 rounded-full"
            width={20}
            height={20}
          />
        ) : (
          <Logo />
        )}
        <h3 className="text-lg font-medium">
          {invite
            ? "Revoke Invitation"
            : session?.user?.email === email
              ? "Leave Workspace"
              : "Remove Teammate"}
        </h3>
        <p className="text-muted-foreground text-center text-sm">
          {invite
            ? "This will revoke "
            : session?.user?.email === email
              ? "You're about to leave "
              : "This will remove "}
          <span className="text-primary font-semibold">
            {session?.user?.email === email ? workspaceName : name || email}
          </span>
          {invite
            ? "'s invitation to join your Workspace. "
            : session?.user?.email === email
              ? ". You will lose all access to this Workspace. "
              : " from your Workspace. "}
          Are you sure you want to continue?
        </p>
      </div>

      <div className="bg-background flex flex-col space-y-4 px-4 py-8 pt-4 text-left sm:px-12">
        <div className="border-border bg-secondary flex items-center space-x-3 rounded-md border p-3">
          <Avatar user={user} />
          <div className="flex flex-col">
            <h3 className="text-sm font-medium">{name || email}</h3>
            <p className="text-muted-foreground text-xs">{email}</p>
          </div>
        </div>
        <Button
          text="Confirm"
          variant="destructive"
          autoFocus
          loading={removing}
          onClick={() => {
            setRemoving(true);
            fetch(
              `/api/workspaces/${workspaceSlug}/${
                invite ? `invites?email=${email}` : `users?userId=${id}`
              }`,
              {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
              },
            ).then(async (res) => {
              if (res.status === 200) {
                await mutate(
                  `/api/workspaces/${workspaceSlug}/${
                    invite ? "invites" : "users"
                  }`,
                );
                if (session?.user?.email === email) {
                  router.refresh();
                  router.push("/");
                } else {
                  setShowRemoveTeammateModal(false);
                }
                toast.success(
                  session?.user?.email === email
                    ? "You have left the Workspace!"
                    : invite
                      ? "Successfully revoked invitation!"
                      : "Successfully removed teammate!",
                );
              } else {
                const error = await res.text();
                toast.error(error);
              }
              setRemoving(false);
            });
          }}
        />
      </div>
    </Modal>
  );
}

export function useRemoveTeammateModal({
  user,
  invite,
}: {
  user: UserProps;
  invite?: boolean;
}) {
  const [showRemoveTeammateModal, setShowRemoveTeammateModal] = useState(false);

  const RemoveTeammateModalCallback = useCallback(() => {
    return (
      <RemoveTeammateModal
        showRemoveTeammateModal={showRemoveTeammateModal}
        setShowRemoveTeammateModal={setShowRemoveTeammateModal}
        user={user}
        invite={invite}
      />
    );
  }, [showRemoveTeammateModal, setShowRemoveTeammateModal]);

  return useMemo(
    () => ({
      setShowRemoveTeammateModal,
      RemoveTeammateModal: RemoveTeammateModalCallback,
    }),
    [setShowRemoveTeammateModal, RemoveTeammateModalCallback],
  );
}
