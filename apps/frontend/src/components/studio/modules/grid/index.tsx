import { GridProps } from "@/types";

import GridItem from "./grid-item";

export default function Grid({ data }: { data: GridProps }) {
  const { items } = data ?? {};
  const length = items?.length;

  const css = `grid grid-cols-1 ${
    length === 1
      ? "sm:grid-cols-1"
      : length === 2
        ? "md:grid-cols-2"
        : length === 3
          ? "md:grid-cols-3"
          : length === 4
            ? "sm:grid-cols-2 lg:grid-cols-4"
            : length === 5
              ? "sm:grid-cols-2 lg:grid-cols-3"
              : length === 6
                ? "sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-3"
  } gap-4 sm:gap-6 lg:gap-8`;

  if (!items) {
    return null;
  }
  return (
    <section className={`grid ${css} mx-auto w-full max-w-4xl`}>
      {items &&
        items.map((item) => <GridItem data={item as any} key={item._key} />)}
    </section>
  );
}
