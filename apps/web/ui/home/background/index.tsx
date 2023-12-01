"use client";

import { SHOW_BACKGROUND_SEGMENTS } from "@phunq/utils";
import { useSelectedLayoutSegment } from "next/navigation";

import styles from "./background.module.css";

export default function Background() {
  let segment;
  try {
    segment = useSelectedLayoutSegment();
  } catch (e) {
    // this is for /welcome which is still on /pages router
  }

  return !segment || SHOW_BACKGROUND_SEGMENTS.includes(segment) ? (
    <div className={styles.main}>
      <div className={styles.content} />
    </div>
  ) : null;
}
