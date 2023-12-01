import { HomeIcon } from "@sanity/icons";
import { Button, Container, Flex, Stack } from "@sanity/ui";
import { PlugIcon } from "lucide-react";
import { useRouter } from "next/router";
import { NavbarProps, ToolLink, ToolMenuProps } from "sanity";

export function CustomNavbar(props: NavbarProps & ToolMenuProps) {
  // render the default, minus the right side of the nav which has the users name and logout button
  const { slug } = useRouter().query as { slug: string };
  const { activeToolName, context } = props;
  const isSidebar = context === "sidebar";

  // Change flex direction depending on context
  const direction = isSidebar ? "column" : "row";

  const tools = [
    {
      name: "desk",
      title: "Desk",
      icon: HomeIcon,
    },
    {
      name: "media",
      title: "Media",
      icon: HomeIcon,
    },
  ];

  return (
    <Stack space={3}>
      <Container width={1}>
        <Flex gap={1} direction={direction} justify="center">
          {tools.map((tool) => (
            <Button
              as={ToolLink}
              icon={tool.icon || PlugIcon}
              key={tool.name}
              name={tool.name}
              padding={3}
              selected={tool.name === activeToolName}
              text={tool.title || tool.name}
              tone="primary"
            />
          ))}
        </Flex>
      </Container>
      {props.renderDefault(props)} {/* Render the default navbar */}
    </Stack>
  );
}
