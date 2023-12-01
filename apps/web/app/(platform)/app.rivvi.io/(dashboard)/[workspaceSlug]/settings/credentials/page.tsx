import { Form } from "@phunq/ui";

import { GetWorkspaceStudioKey } from "@/lib/actions/workspace";

export default async function WorkspaceSettingsCredentials({
  params,
}: {
  params: { workspaceSlug: string };
}) {
  const studioKey = (await GetWorkspaceStudioKey(params.workspaceSlug)) as
    | string
    | null;
  return (
    <div className="flex flex-col space-y-6">
      <Form
        title="Studio Key"
        description="The Studio Key is used to identify your workspace when you send data to PHUNQ."
        inputLabel="Your studio key is assigned automatically."
        inputData={{
          name: "studioKey",
          defaultValue: studioKey as string,
        }}
      />
    </div>
  );
}
