import { ReactNode } from "react";

import { Header } from "@/ui/layout/dashboard/header";
import { Main } from "@/ui/layout/dashboard/main";
import { Shell } from "@/ui/layout/dashboard/shell";
import WorkspaceSettingsNav from "@/ui/workspaces/nav";

export default async function WorkspaceSettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Shell className="h-full">
        <Header heading="Settings" />
        <Main className="flex flex-col">
          <WorkspaceSettingsNav />
          <div className="grid gap-5 md:col-span-4">{children}</div>
        </Main>
      </Shell>
    </>
  );
}

// import { ReactNode } from "react";

// export default function WorkspaceSettingsLayout({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   const tabs = [
//     {
//       name: "General",
//       segment: null,
//     },
//     {
//       name: "Billing",
//       segment: "billing",
//     },
//     {
//       name: "People",
//       segment: "people",
//     },
//   ];

//   return <SettingsLayout tabs={tabs}>{children}</SettingsLayout>;
// }
