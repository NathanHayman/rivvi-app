import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CircleIcon,
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";

export const labels = [
  {
    value: "funnel-page",
    label: "Funnel Page",
  },
  {
    value: "standalone-page",
    label: "Standalone Page",
  },
  {
    value: "draft",
    label: "Documentation",
  },
];

export const statuses = [
  {
    value: "published",
    label: "Published",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "draft",
    label: "Draft",
    icon: CircleIcon,
  },
];

export const types = [
  {
    value: "custom",
    label: "Custom",
  },
  {
    value: "studio",
    label: "Studio",
  },
];

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownIcon,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightIcon,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpIcon,
  },
];
