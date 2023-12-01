import { Button, Input, Label, Logo, Modal } from "@phunq/ui";
import va from "@vercel/analytics";
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

import useWorkspace from "@/lib/swr/use-workspace";
import { BlurImage } from "@/ui/shared/blur-image";

function InviteTeammateModal({
  showInviteTeammateModal,
  setShowInviteTeammateModal,
}: {
  showInviteTeammateModal: boolean;
  setShowInviteTeammateModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { workspaceSlug } = useParams() as { workspaceSlug: string };
  const [inviting, setInviting] = useState(false);
  const [email, setEmail] = useState("");
  const { logo } = useWorkspace();

  return (
    <Modal
      showModal={showInviteTeammateModal}
      setShowModal={setShowInviteTeammateModal}
    >
      <div className="border-border flex w-fit flex-col items-center justify-center space-y-3 border-b px-4 py-4 pt-8 sm:px-16">
        {logo ? (
          <BlurImage
            src={logo}
            alt={"Invite Teammate"}
            className="h-10 w-10 rounded-full"
            width={20}
            height={20}
          />
        ) : (
          <Logo />
        )}
        <h3 className="text-lg font-medium">Invite Teammate</h3>
        <p className="text-muted-foreground text-center text-sm">
          Invite a teammate to join your workspace. Invitations will be valid
          for 14 days.
        </p>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setInviting(true);
          fetch(`/api/workspaces/${workspaceSlug}/invites`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          }).then(async (res) => {
            if (res.status === 200) {
              await mutate(`/api/workspaces/${workspaceSlug}/invites`);
              toast.success("Invitation sent!");
              va.track("User invited teammate", {
                workspace: workspaceSlug,
              });
              setShowInviteTeammateModal(false);
            } else {
              const error = await res.text();
              toast.error(error);
            }
            setInviting(false);
          });
        }}
        className="bg-background flex w-full flex-col space-y-4 px-4 py-8 pt-4 sm:px-16"
      >
        <div>
          <Label htmlFor="email" className="text-foreground block text-sm">
            Email
          </Label>
          <div className="relative mt-2 rounded-md shadow-sm">
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="panic@thedis.co"
              autoFocus
              autoComplete="off"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <Button loading={inviting} text="Send invite" />
      </form>
    </Modal>
  );
}

export function useInviteTeammateModal() {
  const [showInviteTeammateModal, setShowInviteTeammateModal] = useState(false);

  const InviteTeammateModalCallback = useCallback(() => {
    return (
      <InviteTeammateModal
        showInviteTeammateModal={showInviteTeammateModal}
        setShowInviteTeammateModal={setShowInviteTeammateModal}
      />
    );
  }, [showInviteTeammateModal, setShowInviteTeammateModal]);

  return useMemo(
    () => ({
      setShowInviteTeammateModal,
      InviteTeammateModal: InviteTeammateModalCallback,
    }),
    [setShowInviteTeammateModal, InviteTeammateModalCallback],
  );
}
