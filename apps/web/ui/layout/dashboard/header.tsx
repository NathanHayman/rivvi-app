interface HeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
}

export function Header({ heading, text, children }: HeaderProps) {
  return (
    <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-8">
      <h1 className="text-[28px] font-bold leading-[34px] tracking-[-0.416px]">
        {heading}
      </h1>
      {children}
    </div>
  );
}
