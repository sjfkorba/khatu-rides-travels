import { Phone } from "lucide-react";

function WhatsAppIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M16 3.2C9 3.2 3.3 8.8 3.3 15.8c0 2.2.6 4.4 1.7 6.3L3.2 28.8l6.9-1.8c1.8 1 3.8 1.5 5.9 1.5 7 0 12.7-5.7 12.7-12.7S23 3.2 16 3.2Zm0 23.1c-1.9 0-3.7-.5-5.3-1.5l-.4-.2-4.1 1.1 1.1-4-.3-.4a10.6 10.6 0 0 1-1.6-5.5C5.4 10.9 10.2 6.1 16 6.1s10.6 4.8 10.6 10.7S21.8 26.3 16 26.3Zm5.8-7.9c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-1.9-.9-3.1-1.7-4.3-3.7-.3-.5.3-.5.9-1.6.1-.2.1-.4 0-.6-.1-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.1 1.4 3.3c.2.2 2.3 3.6 5.7 5 2.1.9 2.9 1 4 .8.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4 0-.2-.2-.3-.5-.5Z"
      />
    </svg>
  );
}

export default function Icon({ name, size = 24 }: { name: string; size?: number }) {
  if (name === "phone") {
    return <Phone size={size} />;
  }
  if (name === "whatsapp") {
    return <WhatsAppIcon size={size} />;
  }
  return null;
}