"use client";

import { useState, useEffect, useRef } from "react";

interface AnimatedNumberProps {
  value: string | number;
  startValue?: string | number;
  duration?: number;
  className?: string;
  "aria-label"?: string;
}

export default function AnimatedNumber({
  value,
  startValue,
  duration = 2000,
  className,
  "aria-label": ariaLabel,
}: AnimatedNumberProps) {
  // Parse the value - handle both string and number, and extract numeric value
  const parseValue = (val: string | number): number => {
    if (typeof val === "number") {
      return val;
    }
    // Remove any non-numeric characters except decimal point
    const numericString = val.toString().replace(/[^\d.]/g, "");
    const parsed = parseFloat(numericString);
    return isNaN(parsed) ? 0 : parsed;
  };

  const targetValue = parseValue(value);
  const initialValue = startValue !== undefined ? parseValue(startValue) : 0;
  const originalValue = typeof value === "string" ? value : value.toString();

  // Initialize display value with initial value
  const [displayValue, setDisplayValue] = useState(initialValue);
  const [isVisible, setIsVisible] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const hasAnimatedRef = useRef(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  // Intersection Observer to trigger animation when element is visible
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Animation effect
  useEffect(() => {
    if (!isVisible) {
      setDisplayValue(initialValue);
      return;
    }

    // Reset animation state when value changes
    hasAnimatedRef.current = false;
    setDisplayValue(initialValue);
    startTimeRef.current = null;

    const animate = (currentTime: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      // Interpolate from initialValue to targetValue
      const currentValue = initialValue + (targetValue - initialValue) * easeOut;

      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetValue);
        hasAnimatedRef.current = true;
      }
    };

    // Start animation when element becomes visible
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetValue, initialValue, duration, isVisible]);

  // Format the display value to match the original format
  const formatDisplayValue = (): string => {
    if (hasAnimatedRef.current) {
      return originalValue;
    }

    // Check if original value has special formatting (like "$79", "50+", or "1,000")
    if (typeof value === "string") {
      // Check for currency symbol (like $)
      const hasCurrencyPrefix = /^[^\d]*\$/.test(value);
      const currencyPrefix = hasCurrencyPrefix ? "$" : "";
      
      // If it contains non-numeric characters, preserve them
      const hasSuffix = /[^\d.,$]/.test(value);
      if (hasSuffix && !hasCurrencyPrefix) {
        const suffix = value.replace(/[\d.,]/g, "");
        const rounded = Math.round(displayValue);
        return `${rounded}${suffix}`;
      }
      
      // If it has commas, format with commas
      if (value.includes(",")) {
        return `${currencyPrefix}${Math.round(displayValue).toLocaleString()}`;
      }
      
      // Handle currency formatting
      if (hasCurrencyPrefix) {
        return `${currencyPrefix}${Math.round(displayValue)}`;
      }
    }

    // Default: round to nearest integer
    return Math.round(displayValue).toString();
  };

  return (
    <span ref={elementRef} className={className} aria-label={ariaLabel}>
      {formatDisplayValue()}
    </span>
  );
}

