import { Modal } from "@phunq/ui";

export default function StatsModal({ params }: { params: { key: string } }) {
  return (
    <Modal className="scrollbar-hide max-h-[calc(100vh-150px)] w-full max-w-screen-xl overflow-auto bg-gray-50">
      f
      {/* <Suspense>
        <Stats staticDomain="dub.sh" staticKey={params.key} modal />
      </Suspense> */}
    </Modal>
  );
}
