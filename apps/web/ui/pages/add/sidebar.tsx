function AddPagesToFunnelSidebar({ children }: { children: React.ReactNode }) {
  // page data is title, slug, etc
  return (
    <aside className="border-border bg-background z-[999] mt-12 flex h-full w-[600px] max-w-[600px] flex-grow flex-col gap-2 overflow-y-auto p-4">
      <p className="text-foreground mb-6 text-xl font-bold">
        Add Pages to Funnel
      </p>
      {children}
    </aside>
  );
}

export default AddPagesToFunnelSidebar;
