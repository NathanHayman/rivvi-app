"use client";

import { NextStudio } from "next-sanity/studio";
import { useEffect, useState } from "react";

import _config from "@/../sanity.config";

export default function Studio() {
  const [config, setConfig] = useState(_config);

  useEffect(
    () =>
      void import(
        /* webpackIgnore: true */ "https://themer.sanity.build/api/hues?default=4c6c8c;600&primary=0b87b6&transparent=516c87;600&positive=43d675;300&caution=fbd024;200&lightest=fcfcfd&darkest=0d1115" as any
      ).then(({ theme }) => setConfig((config) => ({ ...config, theme }))),
    [],
  );

  return <NextStudio config={config} />;
}
