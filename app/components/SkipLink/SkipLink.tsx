"use client";

import { useEffect, useRef } from "react";
import styles from "./skipLink.module.css";

export default function SkipLink() {
  const skipLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show skip link when Tab is pressed
      if (e.key === "Tab" && skipLinkRef.current) {
        skipLinkRef.current.classList.add(styles.visible);
      }
    };

    const handleClick = () => {
      // Hide skip link after clicking
      if (skipLinkRef.current) {
        setTimeout(() => {
          skipLinkRef.current?.classList.remove(styles.visible);
        }, 100);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const skipLink = skipLinkRef.current;
    if (skipLink) {
      skipLink.addEventListener("click", handleClick);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (skipLink) {
        skipLink.removeEventListener("click", handleClick);
      }
    };
  }, []);

  return (
    <a
      href="#main-content"
      ref={skipLinkRef}
      className={styles.skipLink}
      aria-label="Skip to main content"
    >
      Skip to main content
    </a>
  );
}

