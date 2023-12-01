("");

export const setColor = (primary: string) => {
  const root = document.documentElement;
  root.style.setProperty("--primary-color", primary);
};
