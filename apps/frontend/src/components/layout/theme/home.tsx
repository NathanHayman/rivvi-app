import { ThemeProps } from "@/types";

export default function HomeTheme({
  data,
  children,
}: {
  data: ThemeProps;
  children: React.ReactNode;
}) {
  const { background, text, buttonBackground, buttonText, outlineButton } =
    data ?? {};

  const theme = {
    bg: background?.hex,
    text: text?.hex,
    buttonBg: buttonBackground?.hex,
    buttonTxt: buttonText?.hex,
    outlineBtn: outlineButton?.hex,
  };

  return (
    <div
      className="bg-home-background-main text-home-text-main font-sans"
      style={
        {
          "--home-bg": theme.bg,
          "--home-text": theme.text,
          "--home-btn-bg": theme.buttonBg,
          "--home-btn-text": theme.buttonTxt,
          "--home-outline-btn": theme.outlineBtn,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
