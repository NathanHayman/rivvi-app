"use client";

import { ThemeProps } from "@/types";

export default function SectionTheme({
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
      className="bg-sec-bg-main text-sec-text-main w-full py-8 font-sans lg:py-16"
      style={
        {
          "--sec-bg": theme.bg,
          "--sec-text": theme.text,
          "--sec-btn-bg": theme.buttonBg,
          "--sec-btn-text": theme.buttonTxt,
          "--sec-outline-btn": theme.outlineBtn,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
