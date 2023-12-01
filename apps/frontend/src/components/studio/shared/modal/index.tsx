"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export type ModalProps = {
  size: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  backdrop: "static" | "blur" | "transparent";
  escape: boolean;
  isOpen: boolean;
  isDismissable: boolean;
  onOpenChange: (open: boolean) => void;
  placement: "top" | "right" | "bottom" | "left" | "center" | "auto";
  radius: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "pill";
};

interface thisModalProps {
  data: ModalProps;
}

export default function UseModal({ data }: thisModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // upsell?type=open-modal&upsell-1-modal
  const params = useSearchParams();
  const type = params.get("type");
  console.log("type", type);

  useEffect(() => {
    if (type === "open-modal") {
      onOpen();
    }
  }, [type, onOpen]);

  const { size, backdrop, isDismissable, placement, radius } =
    data as ModalProps;

  return (
    <>
      <Button onPress={onOpen} color="secondary" className="focus:ring-2">
        Open Modal
      </Button>
      <Modal
        size={size as typeof data.size}
        className="bg-white"
        backdrop={backdrop as any}
        isOpen={isOpen as any}
        isDismissable={isDismissable}
        onOpenChange={onOpenChange}
        placement={placement as any}
        radius={radius as any}
      >
        <ModalContent className="rounded-2xl border bg-white p-4 shadow-lg sm:p-6 lg:p-8 lg:pb-4">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center">
                <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                  Wait! How Would You Like To...
                </p>
                <h2 className="mx-auto text-center text-3xl font-bold md:max-w-2xl">
                  Secure a huge discount on Hormone Guard... but with 3 bottles
                  instead of 6!
                </h2>
              </ModalHeader>
              <ModalBody>
                Hi there, it’s Dr. Anthony Capasso here, and I want to thank you
              </ModalBody>
              <ModalFooter className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button color="default" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  className="w-full bg-[#6f4ef2] text-white shadow-lg shadow-indigo-500/20"
                  onPress={onClose}
                >
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
