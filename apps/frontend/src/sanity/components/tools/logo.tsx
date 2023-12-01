import { Text } from "@sanity/ui";
import { LogoProps } from "sanity";

export function CustomLogo(props: LogoProps) {
  return (
    <Text style={{ color: "white" }} weight="bold">
      {props.title}
    </Text>
  );
}
