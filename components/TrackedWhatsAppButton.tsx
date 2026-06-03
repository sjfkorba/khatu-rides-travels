"use client";

interface Props {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export default function TrackedWhatsAppButton({
  href,
  className,
  children,
}: Props) {
  const handleClick = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-18196199181/1OB8CJ0zTbgcEI3uz-RD",
        value: 1.0,
        currency: "INR",
      });
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}