import { ThemeProps } from "@/types";

export default function PageTheme({
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
      className="bg-page-background-main text-page-text-main font-sans"
      style={
        {
          "--page-bg": theme.bg,
          "--page-text": theme.text,
          "--page-btn-bg": theme.buttonBg,
          "--page-btn-text": theme.buttonTxt,
          "--page-outline-btn": theme.outlineBtn,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
