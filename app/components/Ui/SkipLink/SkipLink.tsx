"use client";

import { useEffect, useState } from "react";
import styles from "./skipLink.module.css";

export default function SkipLink() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show skip link when Tab is pressed (keyboard navigation)
      if (e.key === "Tab" && !e.shiftKey) {
        setIsVisible(true);
      }
    };

    const handleClick = () => {
      setIsVisible(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <a href="#main-content" className={styles.skipLink}>
      Skip to main content
    </a>
  );
}


