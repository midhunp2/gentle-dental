"use client";

import React from "react";
import styles from "./skeleton.module.css";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
  variant?: "text" | "rectangular" | "circular";
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  borderRadius,
  className = "",
  variant = "rectangular",
  lines,
}) => {
  const style: React.CSSProperties = {
    width: width || "100%",
    height: height || "1em",
    borderRadius: borderRadius || (variant === "circular" ? "50%" : "4px"),
  };

  if (lines && lines > 1) {
    return (
      <div className={`${styles.skeletonContainer} ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${styles.skeleton} ${styles[variant]}`}
            style={{
              ...style,
              width: index === lines - 1 ? "80%" : "100%",
              marginBottom: index < lines - 1 ? "8px" : "0",
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${styles.skeleton} ${styles[variant]} ${className}`}
      style={style}
    />
  );
};

// Pre-built skeleton components for common use cases
export const SkeletonText: React.FC<{
  lines?: number;
  className?: string;
  height?: string | number;
  width?: string | number;
}> = ({ lines = 1, className = "", height, width }) => (
  <Skeleton variant="text" lines={lines} className={className} height={height} width={width} />
);

export const SkeletonBox: React.FC<{
  width?: string | number;
  height?: string | number;
  className?: string;
}> = ({ width, height, className = "" }) => (
  <Skeleton
    variant="rectangular"
    width={width}
    height={height}
    className={className}
  />
);

export const SkeletonCircle: React.FC<{
  size?: string | number;
  className?: string;
}> = ({ size = 40, className = "" }) => (
  <Skeleton
    variant="circular"
    width={size}
    height={size}
    className={className}
  />
);

// Appointment Scheduler Skeleton
export const AppointmentSchedulerSkeleton: React.FC = () => {
  return (
    <div className={styles.appointmentSkeleton}>
      <SkeletonBox height={60} className={styles.skeletonHeader} />
      <div className={styles.skeletonCalendar}>
        <SkeletonBox height={40} className={styles.skeletonCalendarHeader} />
        <div className={styles.skeletonCalendarGrid}>
          {Array.from({ length: 35 }).map((_, index) => (
            <SkeletonBox
              key={index}
              height={50}
              className={styles.skeletonCalendarDay}
            />
          ))}
        </div>
      </div>
      <div className={styles.skeletonForm}>
        <SkeletonText lines={3} className={styles.skeletonFormField} />
        <SkeletonBox height={50} className={styles.skeletonButton} />
      </div>
    </div>
  );
};

// Hero Banner Skeleton
export const HeroBannerSkeleton: React.FC = () => {
  return (
    <div className={styles.heroSkeleton}>
      <SkeletonText
        lines={1}
        className={styles.skeletonTitle}
        height={30}
      />
      <SkeletonText
        lines={2}
        className={styles.skeletonSubtitle}
        height={54}
      />
      <SkeletonBox height={81} className={styles.skeletonSearchBar} />
    </div>
  );
};

