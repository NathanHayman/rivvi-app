import { Badge } from "@phunq/ui";

import { PlanProps } from "@/lib/types";

export default function PlanBadge({ plan }: { plan: PlanProps }) {
  return (
    <Badge
      variant={
        plan === "enterprise" ? "default" : plan === "pro" ? "blue" : "gray"
      }
    >
      {plan}
    </Badge>
  );
}
