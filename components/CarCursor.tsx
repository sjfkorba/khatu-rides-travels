"use client";

import { useEffect, useState } from "react";


export default function CarCursor() {
  const [position, setPosition] = useState({
    x: -200,
    y: -200,
  });

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({
        x: event.clientX,
        y: event.clientY,
      });

      setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.documentElement.addEventListener(
      "mouseleave",
      handleMouseLeave
    );

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        fixed
        left-0
        top-0
        z-[1000000]
        hidden
        lg:block
      "
      style={{
        transform:
          "translate3d(" +
          position.x +
          "px, " +
          position.y +
          "px, 0)",
        opacity: visible ? 1 : 0,
        transition:
          "transform 70ms linear, opacity 150ms ease",
      }}
    >
      <div
        className="
          relative
          -translate-x-[12%]
          -translate-y-[50%]
        "
      >
        {/* Soft glow */}

        <div
          className="
            absolute
            -inset-4
            rounded-full
            bg-orange-400/10
            blur-xl
          "
        />

        {/* Car */}

        <img
          src="/splash-car.png"
          alt=""
          draggable={false}
          className="
            relative
            h-auto
            w-[58px]
            select-none
            object-contain
            drop-shadow-[0_5px_8px_rgba(0,0,0,0.45)]
          "
        />
      </div>
    </div>
  );
}