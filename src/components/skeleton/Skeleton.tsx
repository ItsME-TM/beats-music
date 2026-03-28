"use client";

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = "" }: SkeletonProps) {
  const hasRounded = /\brounded(?:-|$)/.test(className);

  return (
    <div
      className={`animate-pulse bg-white/5 ${hasRounded ? "" : "rounded-md"} ${className}`}
    />
  );
}
