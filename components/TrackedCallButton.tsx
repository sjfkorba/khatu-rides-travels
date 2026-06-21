
"use client";

import React from "react";

interface Props {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export default function TrackedCallButton({
  href,
  className,
  children,
}: Props) {
  const handleClick = () => {
    if (
      typeof window !== "undefined" &&
      typeof (window as any).gtag === "function"
    ) {
      (window as any).gtag(
        "event",
        "conversion",
        {
          send_to:
            "AW-18196199181/1OB8CJ0zTbgcEI3uz-RD",
          value: 1.0,
          currency: "INR",
        }
      );
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}