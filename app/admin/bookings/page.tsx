"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

/* =========================================================
   TYPES
========================================================= */

type EnquiryStatus =
  | "new"
  | "contacted"
  | "follow_up"
  | "confirmed"
  | "completed"
  | "cancelled";

type Enquiry = {
  id: string;

  tripType?: string;
  vehicleType?: string;

  from?: string;
  to?: string;

  travelDate?: string;
  travelTime?: string;

  name?: string;
  phone?: string;

  status?: string;

  source?: string;
  page?: string;

  enquirySummary?: string;

  createdAt?: any;
  updatedAt?: any;
};

type StatusConfig = {
  value: EnquiryStatus;
  label: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
};

/* =========================================================
   CONSTANTS
========================================================= */

const SUPPORT_PHONE = "9244137353";

const STATUS_OPTIONS: StatusConfig[] = [
  {
    value: "new",
    label: "New",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },

  {
    value: "contacted",
    label: "Contacted",
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
    dot: "bg-violet-500",
  },

  {
    value: "follow_up",
    label: "Follow Up",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },

  {
    value: "confirmed",
    label: "Confirmed",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },

  {
    value: "completed",
    label: "Completed",
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    dot: "bg-slate-500",
  },

  {
    value: "cancelled",
    label: "Cancelled",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
  },
];

const TRIP_TYPES = [
  "All",
  "One Way",
  "Round Trip",
  "Airport Transfer",
  "Local",
  "Outstation",
  "Tour Package",
];

/* =========================================================
   HELPERS
========================================================= */

function normalizeStatus(
  status?: string,
): EnquiryStatus {
  const value = String(
    status || "new",
  )
    .trim()
    .toLowerCase();

  if (value === "contacted") {
    return "contacted";
  }

  if (
    value === "follow_up" ||
    value === "follow-up" ||
    value === "follow up"
  ) {
    return "follow_up";
  }

  if (value === "confirmed") {
    return "confirmed";
  }

  if (value === "completed") {
    return "completed";
  }

  if (
    value === "cancelled" ||
    value === "canceled"
  ) {
    return "cancelled";
  }

  return "new";
}

function getStatus(
  status?: string,
) {
  const normalized =
    normalizeStatus(status);

  return (
    STATUS_OPTIONS.find(
      (item) =>
        item.value === normalized,
    ) || STATUS_OPTIONS[0]
  );
}

function normalizePhone(
  phone?: string,
) {
  return String(phone || "")
    .replace(/\D/g, "")
    .slice(-10);
}

function getInitial(
  name?: string,
) {
  const value = String(
    name || "C",
  ).trim();

  return (
    value.charAt(0).toUpperCase() ||
    "C"
  );
}

function getTimestamp(
  value: any,
) {
  try {
    if (!value) return 0;

    if (
      typeof value?.toMillis ===
      "function"
    ) {
      return value.toMillis();
    }

    if (
      typeof value?.toDate ===
      "function"
    ) {
      return value.toDate().getTime();
    }

    if (value instanceof Date) {
      return value.getTime();
    }

    if (typeof value === "string") {
      const time =
        new Date(value).getTime();

      return Number.isNaN(time)
        ? 0
        : time;
    }

    return 0;
  } catch {
    return 0;
  }
}

function formatDate(
  value?: string,
) {
  if (!value) return "—";

  try {
    const date = new Date(value);

    if (
      Number.isNaN(date.getTime())
    ) {
      return value;
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      },
    );
  } catch {
    return value;
  }
}

function formatCreatedAt(
  value: any,
) {
  if (!value) return "—";

  try {
    let date: Date;

    if (
      typeof value?.toDate ===
      "function"
    ) {
      date = value.toDate();
    } else {
      date = new Date(value);
    }

    if (
      Number.isNaN(date.getTime())
    ) {
      return "—";
    }

    return date.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    );
  } catch {
    return "—";
  }
}

function callCustomer(
  phone?: string,
) {
  const number =
    normalizePhone(phone);

  if (!number) {
    alert(
      "Customer mobile number is not available.",
    );
    return;
  }

  window.location.href =
    `tel:+91${number}`;
}

function openWhatsApp(
  enquiry: Enquiry,
) {
  const number =
    normalizePhone(
      enquiry.phone,
    );

  if (!number) {
    alert(
      "Customer mobile number is not available.",
    );
    return;
  }

  const message = [
    `Hello ${
      enquiry.name ||
      "Customer"
    },`,
    "",
    "Thank you for contacting Khatu Rides Travels Co.",
    "",
    `Trip Type: ${
      enquiry.tripType || "—"
    }`,
    `Vehicle: ${
      enquiry.vehicleType ||
      "Any Suitable Vehicle"
    }`,
    `From: ${
      enquiry.from || "—"
    }`,
    `To: ${
      enquiry.to || "—"
    }`,
    `Travel Date: ${formatDate(
      enquiry.travelDate,
    )}`,
    `Travel Time: ${
      enquiry.travelTime || "—"
    }`,
    "",
    "Our team will assist you with your booking.",
    "",
    "Khatu Rides Travels Co.",
    "+91 92441 37353",
  ].join("\n");

  window.open(
    `https://wa.me/91${number}?text=${encodeURIComponent(
      message,
    )}`,
    "_blank",
    "noopener,noreferrer",
  );
}

/* =========================================================
   ICON SYSTEM
========================================================= */

function Icon({
  name,
  size = 18,
}: {
  name:
    | "dashboard"
    | "mail"
    | "phone"
    | "whatsapp"
    | "search"
    | "refresh"
    | "eye"
    | "trash"
    | "calendar"
    | "route"
    | "car"
    | "user"
    | "clock"
    | "filter"
    | "chevron"
    | "menu"
    | "close"
    | "check"
    | "invoice"
    | "booking"
    | "settings"
    | "report"
    | "payment"
    | "vehicle"
    | "users"
    | "bell"
    | "arrow";
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap:
      "round" as const,
    strokeLinejoin:
      "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "dashboard":
      return (
        <svg {...common}>
          <rect
            x="3"
            y="3"
            width="7"
            height="7"
            rx="1.5"
          />
          <rect
            x="14"
            y="3"
            width="7"
            height="7"
            rx="1.5"
          />
          <rect
            x="3"
            y="14"
            width="7"
            height="7"
            rx="1.5"
          />
          <rect
            x="14"
            y="14"
            width="7"
            height="7"
            rx="1.5"
          />
        </svg>
      );

    case "mail":
      return (
        <svg {...common}>
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="2"
          />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );

    case "phone":
      return (
        <svg {...common}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
        </svg>
      );

    case "whatsapp":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12.04 2C6.5 2 2 6.5 2 12.04c0 1.77.46 3.5 1.34 5.02L2 22l5.08-1.33A10 10 0 1 0 12.04 2Zm0 18.3c-1.57 0-3.11-.42-4.46-1.22l-.32-.19-3.02.79.81-2.95-.21-.32a8.28 8.28 0 1 1 7.2 3.89Zm4.54-6.2c-.25-.13-1.47-.72-1.7-.8-.23-.09-.39-.13-.55.13-.16.25-.63.8-.77.96-.14.17-.28.19-.52.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.22-1.46-1.36-1.71-.14-.25-.01-.39.11-.51.11-.11.25-.28.37-.42.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.13-.55-1.33-.76-1.82-.2-.48-.41-.42-.55-.43h-.47c-.16 0-.42.06-.64.31-.22.25-.84.82-.84 2s.86 2.31.98 2.47c.12.17 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.11.15 1.53.09.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.22-.16-.47-.29Z" />
        </svg>
      );

    case "search":
      return (
        <svg {...common}>
          <circle
            cx="11"
            cy="11"
            r="7"
          />
          <path d="m20 20-4-4" />
        </svg>
      );

    case "refresh":
      return (
        <svg {...common}>
          <path d="M20 11a8.1 8.1 0 0 0-15.5-2" />
          <path d="M4 4v5h5" />
          <path d="M4 13a8.1 8.1 0 0 0 15.5 2" />
          <path d="M20 20v-5h-5" />
        </svg>
      );

    case "eye":
      return (
        <svg {...common}>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
          <circle
            cx="12"
            cy="12"
            r="3"
          />
        </svg>
      );

    case "trash":
      return (
        <svg {...common}>
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="m19 6-1 15H6L5 6" />
          <path d="M10 11v6M14 11v6" />
        </svg>
      );

    case "calendar":
      return (
        <svg {...common}>
          <rect
            x="3"
            y="4"
            width="18"
            height="17"
            rx="2"
          />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      );

    case "route":
      return (
        <svg {...common}>
          <circle
            cx="6"
            cy="5"
            r="2"
          />
          <circle
            cx="18"
            cy="19"
            r="2"
          />
          <path d="M8 5h3a4 4 0 0 1 4 4v2a4 4 0 0 0 4 4" />
          <path d="M6 7v10" />
        </svg>
      );

    case "car":
    case "vehicle":
      return (
        <svg {...common}>
          <path d="m5 17-1-5 2-5h10l2 5-1 5" />
          <path d="M4 12h16" />
          <circle
            cx="7"
            cy="17"
            r="1.5"
          />
          <circle
            cx="17"
            cy="17"
            r="1.5"
          />
        </svg>
      );

    case "user":
      return (
        <svg {...common}>
          <circle
            cx="12"
            cy="8"
            r="4"
          />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      );

    case "clock":
      return (
        <svg {...common}>
          <circle
            cx="12"
            cy="12"
            r="9"
          />
          <path d="M12 7v5l3 2" />
        </svg>
      );

    case "filter":
      return (
        <svg {...common}>
          <path d="M4 6h16M7 12h10M10 18h4" />
        </svg>
      );

    case "chevron":
      return (
        <svg {...common}>
          <path d="m9 18 6-6-6-6" />
        </svg>
      );

    case "menu":
      return (
        <svg {...common}>
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      );

    case "close":
      return (
        <svg {...common}>
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );

    case "invoice":
      return (
        <svg {...common}>
          <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
          <path d="M9 8h6M9 12h6M9 16h4" />
        </svg>
      );

    case "booking":
      return (
        <svg {...common}>
          <rect
            x="3"
            y="4"
            width="18"
            height="17"
            rx="2"
          />
          <path d="M16 2v4M8 2v4M3 10h18" />
          <path d="m8 15 2 2 5-5" />
        </svg>
      );

    case "settings":
      return (
        <svg {...common}>
          <circle
            cx="12"
            cy="12"
            r="3"
          />
          <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.41 1.41-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.55V21h-2v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1 1.55V21h-2v-.5a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06-1.41-1.41.06-.06A1.7 1.7 0 0 0 8.6 15a1.7 1.7 0 0 0-1.55-1H7v-2h.05a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.41-1.41.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1-1.55V6h2v.05a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.41 1.41-.06.06A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.55 1H21v2h-.05a1.7 1.7 0 0 0-1.55 1Z" />
        </svg>
      );

    case "report":
      return (
        <svg {...common}>
          <path d="M4 19V5" />
          <path d="M4 17h16" />
          <path d="m7 14 3-4 3 2 4-6" />
        </svg>
      );

    case "payment":
      return (
        <svg {...common}>
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="2"
          />
          <path d="M3 10h18M7 15h3" />
        </svg>
      );

    case "users":
      return (
        <svg {...common}>
          <circle
            cx="9"
            cy="8"
            r="3"
          />
          <path d="M3 20a6 6 0 0 1 12 0" />
          <path d="M16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 6" />
        </svg>
      );

    case "bell":
      return (
        <svg {...common}>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );

    default:
      return null;
  }
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  status,
}: {
  status?: string;
}) {
  const item = getStatus(status);

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-wide ${item.bg} ${item.text} ${item.border}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${item.dot}`}
      />

      {item.label}
    </span>
  );
}

/* =========================================================
   STATUS SELECT
========================================================= */

function StatusSelect({
  value,
  loading,
  onChange,
}: {
  value?: string;
  loading?: boolean;
  onChange: (
    status: EnquiryStatus,
  ) => void;
}) {
  const item = getStatus(value);

  return (
    <div className="relative">
      <select
        value={normalizeStatus(value)}
        disabled={loading}
        onChange={(event) =>
          onChange(
            event.target
              .value as EnquiryStatus,
          )
        }
        className={`h-10 min-w-[135px] appearance-none rounded-xl border px-3 pr-9 text-[10px] font-black uppercase tracking-wide outline-none transition focus:ring-2 focus:ring-[#063B8F]/10 disabled:cursor-wait disabled:opacity-50 ${item.bg} ${item.text} ${item.border}`}
      >
        {STATUS_OPTIONS.map(
          (option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ),
        )}
      </select>

      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
        <Icon
          name="chevron"
          size={14}
        />
      </span>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  label,
  value,
  subtitle,
  icon,
  tone,
  active,
  onClick,
}: {
  label: string;
  value: number;
  subtitle: string;
  icon: Parameters<
    typeof Icon
  >[0]["name"];
  tone:
    | "blue"
    | "violet"
    | "amber"
    | "green"
    | "slate"
    | "red";
  active?: boolean;
  onClick?: () => void;
}) {
  const toneStyles = {
    blue: {
      icon: "bg-blue-50 text-blue-600",
      glow: "hover:border-blue-200",
    },

    violet: {
      icon: "bg-violet-50 text-violet-600",
      glow: "hover:border-violet-200",
    },

    amber: {
      icon: "bg-amber-50 text-amber-600",
      glow: "hover:border-amber-200",
    },

    green: {
      icon: "bg-emerald-50 text-emerald-600",
      glow: "hover:border-emerald-200",
    },

    slate: {
      icon: "bg-slate-100 text-slate-600",
      glow: "hover:border-slate-300",
    },

    red: {
      icon: "bg-red-50 text-red-600",
      glow: "hover:border-red-200",
    },
  };

  const style =
    toneStyles[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group rounded-[18px] border bg-white p-4 text-left shadow-[0_5px_22px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)] ${style.glow} ${
        active
          ? "border-[#063B8F] ring-2 ring-[#063B8F]/10"
          : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${style.icon}`}
        >
          <Icon
            name={icon}
            size={19}
          />
        </span>

        <span className="text-slate-300 transition group-hover:text-[#063B8F]">
          <Icon
            name="arrow"
            size={15}
          />
        </span>
      </div>

      <p className="mt-3 text-[9px] font-black uppercase tracking-[0.13em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-[28px] font-black leading-none tracking-tight text-[#071A3A]">
        {value}
      </p>

      <p className="mt-1.5 truncate text-[10px] font-semibold text-slate-400">
        {subtitle}
      </p>
    </button>
  );
}

/* =========================================================
   MAIN
========================================================= */

export default function AdminDashboard() {
  const [enquiries, setEnquiries] =
    useState<Enquiry[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [firebaseError, setFirebaseError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<
    "all" | EnquiryStatus
  >("all");

  const [tripFilter, setTripFilter] =
    useState("All");

  const [dateFilter, setDateFilter] =
    useState("");

  const [
    selectedEnquiry,
    setSelectedEnquiry,
  ] = useState<Enquiry | null>(
    null,
  );

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [mobileSidebar, setMobileSidebar] =
    useState(false);

  const [mobileFilters, setMobileFilters] =
    useState(false);

  const [
    sidebarCollapsed,
    setSidebarCollapsed,
  ] = useState(false);

  /*
    IMPORTANT:
    This fixes the hydration mismatch.

    Server render:
    todayLabel = ""

    First browser render:
    todayLabel = ""

    After hydration:
    useEffect sets real date.
  */
  const [todayLabel, setTodayLabel] =
    useState("");

  /* =======================================================
     HYDRATION SAFE INITIALIZATION
  ======================================================= */

  useEffect(() => {
    const saved =
      window.localStorage.getItem(
        "khatu-admin-sidebar-collapsed",
      );

    if (saved === "true") {
      setSidebarCollapsed(true);
    }

    /*
      Date is intentionally generated
      only after hydration.
    */
    const formatter =
      new Intl.DateTimeFormat(
        "en-IN",
        {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        },
      );

    setTodayLabel(
      formatter.format(new Date()),
    );
  }, []);

  /* =======================================================
     FIREBASE LIVE DATA
  ======================================================= */

  useEffect(() => {
    const enquiryRef = collection(
      db,
      "website_enquiries",
    );

    /*
      No orderBy() here intentionally.

      This keeps old documents visible
      even when createdAt is missing.
    */
    const unsubscribe =
      onSnapshot(
        enquiryRef,
        (snapshot) => {
          const rows: Enquiry[] =
            snapshot.docs.map(
              (item) => ({
                id: item.id,
                ...(item.data() as Omit<
                  Enquiry,
                  "id"
                >),
              }),
            );

          rows.sort(
            (a, b) =>
              getTimestamp(
                b.createdAt,
              ) -
              getTimestamp(
                a.createdAt,
              ),
          );

          setEnquiries(rows);
          setLoading(false);
          setFirebaseError("");
        },
        (error) => {
          console.error(
            "Website enquiries:",
            error,
          );

          setLoading(false);

          setFirebaseError(
            "Unable to load website enquiries. Please check Firebase authentication and Firestore rules.",
          );
        },
      );

    return () => unsubscribe();
  }, []);

  /* =======================================================
     SIDEBAR
  ======================================================= */

  function toggleSidebar() {
    setSidebarCollapsed(
      (current) => {
        const next = !current;

        window.localStorage.setItem(
          "khatu-admin-sidebar-collapsed",
          String(next),
        );

        return next;
      },
    );
  }

  /* =======================================================
     COUNTS
  ======================================================= */

  const counts = useMemo(() => {
    const result = {
      total: enquiries.length,
      new: 0,
      contacted: 0,
      follow_up: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };

    enquiries.forEach(
      (enquiry) => {
        const status =
          normalizeStatus(
            enquiry.status,
          );

        result[status] += 1;
      },
    );

    return result;
  }, [enquiries]);

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredEnquiries =
    useMemo(() => {
      const keyword =
        search.trim().toLowerCase();

      return enquiries.filter(
        (item) => {
          const searchable = [
            item.name,
            item.phone,
            item.from,
            item.to,
            item.tripType,
            item.vehicleType,
            item.source,
            item.page,
            item.enquirySummary,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          const matchesSearch =
            !keyword ||
            searchable.includes(
              keyword,
            );

          const matchesStatus =
            statusFilter ===
              "all" ||
            normalizeStatus(
              item.status,
            ) === statusFilter;

          const matchesTrip =
            tripFilter === "All" ||
            String(
              item.tripType || "",
            ).toLowerCase() ===
              tripFilter.toLowerCase();

          const matchesDate =
            !dateFilter ||
            item.travelDate ===
              dateFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesTrip &&
            matchesDate
          );
        },
      );
    }, [
      enquiries,
      search,
      statusFilter,
      tripFilter,
      dateFilter,
    ]);

  /* =======================================================
     STATUS UPDATE
  ======================================================= */

  async function updateStatus(
    enquiry: Enquiry,
    status: EnquiryStatus,
  ) {
    if (
      normalizeStatus(
        enquiry.status,
      ) === status
    ) {
      return;
    }

    setUpdatingId(enquiry.id);

    try {
      await updateDoc(
        doc(
          db,
          "website_enquiries",
          enquiry.id,
        ),
        {
          status,
          updatedAt:
            serverTimestamp(),
        },
      );

      setSelectedEnquiry(
        (current) => {
          if (
            current?.id !==
            enquiry.id
          ) {
            return current;
          }

          return {
            ...current,
            status,
          };
        },
      );
    } catch (error) {
      console.error(
        error,
      );

      alert(
        "Status update failed. Please check your Firebase rules.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  /* =======================================================
     DELETE
  ======================================================= */

  async function deleteEnquiry(
    enquiry: Enquiry,
  ) {
    const confirmed =
      window.confirm(
        `Delete enquiry from ${
          enquiry.name ||
          "this customer"
        }?\n\nThis action cannot be undone.`,
      );

    if (!confirmed) return;

    setDeletingId(enquiry.id);

    try {
      await deleteDoc(
        doc(
          db,
          "website_enquiries",
          enquiry.id,
        ),
      );

      if (
        selectedEnquiry?.id ===
        enquiry.id
      ) {
        setSelectedEnquiry(null);
      }
    } catch (error) {
      console.error(
        error,
      );

      alert(
        "Unable to delete enquiry. Please check Firebase rules.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setTripFilter("All");
    setDateFilter("");
  }

  const hasFilters =
    Boolean(search) ||
    statusFilter !== "all" ||
    tripFilter !== "All" ||
    Boolean(dateFilter);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-900">
      {/* Mobile overlay */}
      {mobileSidebar && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() =>
            setMobileSidebar(false)
          }
          className="fixed inset-0 z-40 bg-[#020B24]/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 border-r border-slate-200 bg-white shadow-[4px_0_30px_rgba(15,23,42,0.04)] transition-all duration-300 ${
          sidebarCollapsed
            ? "w-[76px]"
            : "w-[270px]"
        } ${
          mobileSidebar
            ? "translate-x-0"
            : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div
            className={`flex h-[78px] items-center border-b border-slate-100 transition-all duration-300 ${
              sidebarCollapsed
                ? "justify-center px-2"
                : "justify-between px-5"
            }`}
          >
            {sidebarCollapsed ? (
              <button
                type="button"
                onClick={
                  toggleSidebar
                }
                title="Expand sidebar"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071A3A] shadow-sm transition hover:scale-105"
              >
                <img
                  src="/logo.png"
                  alt="Khatu Rides"
                  className="h-9 w-9 rounded-lg object-contain"
                />
              </button>
            ) : (
              <>
                <img
                  src="/logo.png"
                  alt="Khatu Rides Travels Co."
                  className="h-12 w-auto max-w-[195px] object-contain"
                />

                <button
                  type="button"
                  onClick={
                    toggleSidebar
                  }
                  title="Collapse sidebar"
                  className="hidden h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-[#EEF4FF] hover:text-[#063B8F] lg:flex"
                >
                  <span className="-rotate-180">
                    <Icon
                      name="chevron"
                      size={17}
                    />
                  </span>
                </button>
              </>
            )}
          </div>

          {/* Admin Card */}
          <div
            className={`pt-5 ${
              sidebarCollapsed
                ? "flex justify-center px-2"
                : "px-4"
            }`}
          >
            {sidebarCollapsed ? (
              <button
                type="button"
                onClick={
                  toggleSidebar
                }
                title="Expand sidebar"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F8C515] text-[#071A3A] shadow-[0_8px_20px_rgba(248,197,21,0.25)] transition hover:scale-105"
              >
                <Icon
                  name="dashboard"
                  size={20}
                />
              </button>
            ) : (
              <div className="overflow-hidden rounded-[20px] bg-gradient-to-br from-[#071A3A] to-[#063B8F] p-4 shadow-[0_12px_30px_rgba(7,26,58,0.16)]">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F8C515] text-[#071A3A] shadow-sm">
                    <Icon
                      name="dashboard"
                      size={20}
                    />
                  </span>

                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/45">
                      Admin Panel
                    </p>

                    <p className="mt-1 text-[14px] font-black text-white">
                      Business Dashboard
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="mt-6 flex-1 overflow-y-auto px-3">
            {!sidebarCollapsed && (
              <p className="px-3 pb-2 text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
                Management
              </p>
            )}

            <SidebarLink
              href="/admin/bookings"
              icon="dashboard"
              label="Dashboard"
              active
              collapsed={
                sidebarCollapsed
              }
              onClick={() =>
                setMobileSidebar(
                  false,
                )
              }
            />

            <SidebarLink
              href="/admin/advance-bookings"
              icon="booking"
              label="Advance Bookings"
              collapsed={
                sidebarCollapsed
              }
              onClick={() =>
                setMobileSidebar(
                  false,
                )
              }
            />

            <SidebarLink
              href="/admin/invoices"
              icon="invoice"
              label="Invoices"
              collapsed={
                sidebarCollapsed
              }
              onClick={() =>
                setMobileSidebar(
                  false,
                )
              }
            />

            <SidebarLink
              href="/admin/payments"
              icon="payment"
              label="Payments"
              collapsed={
                sidebarCollapsed
              }
              onClick={() =>
                setMobileSidebar(
                  false,
                )
              }
            />

            <div className="my-5 border-t border-slate-100" />

            {!sidebarCollapsed && (
              <p className="px-3 pb-2 text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
                Business
              </p>
            )}

            <SidebarLink
              href="/admin/customers"
              icon="users"
              label="Customers"
              collapsed={
                sidebarCollapsed
              }
              onClick={() =>
                setMobileSidebar(
                  false,
                )
              }
            />

            <SidebarLink
              href="/admin/vehicles"
              icon="vehicle"
              label="Vehicles"
              collapsed={
                sidebarCollapsed
              }
              onClick={() =>
                setMobileSidebar(
                  false,
                )
              }
            />

            <SidebarLink
              href="/admin/reports"
              icon="report"
              label="Reports"
              collapsed={
                sidebarCollapsed
              }
              onClick={() =>
                setMobileSidebar(
                  false,
                )
              }
            />

            <SidebarLink
              href="/admin/settings"
              icon="settings"
              label="Settings"
              collapsed={
                sidebarCollapsed
              }
              onClick={() =>
                setMobileSidebar(
                  false,
                )
              }
            />
          </nav>

          {/* Support */}
          <div className="border-t border-slate-100 p-3">
            {sidebarCollapsed ? (
              <a
                href={`tel:+91${SUPPORT_PHONE}`}
                title="+91 92441 37353"
                className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#063B8F] transition hover:bg-[#063B8F] hover:text-white"
              >
                <Icon
                  name="phone"
                  size={17}
                />
              </a>
            ) : (
              <div className="rounded-[18px] bg-slate-50 p-4">
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
                  Need Help?
                </p>

                <a
                  href={`tel:+91${SUPPORT_PHONE}`}
                  className="mt-3 flex items-center gap-2.5 text-[13px] font-black text-[#063B8F]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100">
                    <Icon
                      name="phone"
                      size={15}
                    />
                  </span>

                  +91 92441 37353
                </a>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ===================================================
          MAIN
      =================================================== */}

      <div
        className={`min-h-screen transition-all duration-300 ${
          sidebarCollapsed
            ? "lg:pl-[76px]"
            : "lg:pl-[270px]"
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
          <div className="flex h-[72px] items-center gap-3 px-4 sm:px-6 lg:px-8">
            {/* Mobile Menu */}
            <button
              type="button"
              onClick={() =>
                setMobileSidebar(true)
              }
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 lg:hidden"
            >
              <Icon
                name="menu"
                size={19}
              />
            </button>

            {/* Desktop Sidebar Toggle */}
            <button
              type="button"
              onClick={
                toggleSidebar
              }
              title={
                sidebarCollapsed
                  ? "Expand sidebar"
                  : "Collapse sidebar"
              }
              className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-[#063B8F] hover:bg-[#EEF4FF] hover:text-[#063B8F] lg:flex"
            >
              <span
                className={
                  sidebarCollapsed
                    ? ""
                    : "rotate-180"
                }
              >
                <Icon
                  name="chevron"
                  size={17}
                />
              </span>
            </button>

            {/* Search */}
            <div className="relative max-w-[540px] flex-1">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Icon
                  name="search"
                  size={17}
                />
              </span>

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search enquiries, customers, routes..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-[12px] font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#063B8F] focus:bg-white focus:ring-2 focus:ring-[#063B8F]/10"
              />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
                title="Refresh"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-[#063B8F] hover:text-[#063B8F]"
              >
                <Icon
                  name="refresh"
                  size={17}
                />
              </button>

              <button
                type="button"
                className="relative hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 sm:flex"
              >
                <Icon
                  name="bell"
                  size={18}
                />

                {counts.new >
                  0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[8px] font-black text-white">
                    {counts.new >
                    9
                      ? "9+"
                      : counts.new}
                  </span>
                )}
              </button>

              <div className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 sm:flex">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#071A3A] text-[10px] font-black text-white">
                  A
                </span>

                <div className="pr-1">
                  <p className="text-[11px] font-black text-[#071A3A]">
                    Admin
                  </p>

                  <p className="text-[9px] font-semibold text-slate-400">
                    Administrator
                  </p>
                </div>

                <Icon
                  name="chevron"
                  size={14}
                />
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1550px] px-4 py-6 sm:px-6 lg:px-8">
          {/* =================================================
              HERO / WELCOME
          ================================================= */}

          <section className="mb-6 overflow-hidden rounded-[24px] bg-gradient-to-br from-[#071A3A] via-[#063B8F] to-[#0B63D8] p-5 shadow-[0_16px_45px_rgba(6,59,143,0.16)] sm:p-6 lg:p-7">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#F8C515] shadow-[0_0_12px_rgba(248,197,21,0.8)]" />

                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60">
                    Business Control Center
                  </p>
                </div>

                <h1 className="mt-2 text-[28px] font-black leading-tight tracking-tight text-white sm:text-[32px]">
                  Welcome back!
                </h1>

                <p className="mt-1 max-w-[650px] text-[12px] font-medium leading-6 text-white/65 sm:text-[13px]">
                  Manage website enquiries, follow-ups and bookings from one simple dashboard.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8C515] text-[#071A3A]">
                  <Icon
                    name="calendar"
                    size={17}
                  />
                </span>

                <div>
                  <p className="text-[11px] font-black text-white">
                    {todayLabel ||
                      "Today"}
                  </p>

                  <p className="mt-0.5 text-[9px] font-semibold text-white/50">
                    Korba, Chhattisgarh
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              KPI
          ================================================= */}

          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            <StatCard
              label="Total"
              value={
                counts.total
              }
              subtitle="All website leads"
              icon="mail"
              tone="blue"
              active={
                statusFilter ===
                "all"
              }
              onClick={() =>
                setStatusFilter(
                  "all",
                )
              }
            />

            <StatCard
              label="New"
              value={counts.new}
              subtitle="Needs attention"
              icon="mail"
              tone="blue"
              active={
                statusFilter ===
                "new"
              }
              onClick={() =>
                setStatusFilter(
                  "new",
                )
              }
            />

            <StatCard
              label="Contacted"
              value={
                counts.contacted
              }
              subtitle="Customer contacted"
              icon="phone"
              tone="violet"
              active={
                statusFilter ===
                "contacted"
              }
              onClick={() =>
                setStatusFilter(
                  "contacted",
                )
              }
            />

            <StatCard
              label="Follow Up"
              value={
                counts.follow_up
              }
              subtitle="Needs callback"
              icon="clock"
              tone="amber"
              active={
                statusFilter ===
                "follow_up"
              }
              onClick={() =>
                setStatusFilter(
                  "follow_up",
                )
              }
            />

            <StatCard
              label="Confirmed"
              value={
                counts.confirmed
              }
              subtitle="Converted booking"
              icon="check"
              tone="green"
              active={
                statusFilter ===
                "confirmed"
              }
              onClick={() =>
                setStatusFilter(
                  "confirmed",
                )
              }
            />

            <StatCard
              label="Completed"
              value={
                counts.completed
              }
              subtitle="Journey completed"
              icon="check"
              tone="slate"
              active={
                statusFilter ===
                "completed"
              }
              onClick={() =>
                setStatusFilter(
                  "completed",
                )
              }
            />

            <StatCard
              label="Cancelled"
              value={
                counts.cancelled
              }
              subtitle="Cancelled leads"
              icon="close"
              tone="red"
              active={
                statusFilter ===
                "cancelled"
              }
              onClick={() =>
                setStatusFilter(
                  "cancelled",
                )
              }
            />
          </section>

          {/* =================================================
              ENQUIRIES PANEL
          ================================================= */}

          <section className="mt-6 overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
            {/* Header */}
            <div className="border-b border-slate-100 px-4 py-5 sm:px-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-[20px] font-black tracking-tight text-[#071A3A]">
                      Website Enquiries
                    </h2>

                    <span className="rounded-full bg-[#EEF4FF] px-3 py-1 text-[10px] font-black text-[#063B8F]">
                      {
                        filteredEnquiries.length
                      }
                    </span>
                  </div>

                  <p className="mt-1 text-[11px] font-medium text-slate-400">
                    Live enquiries received through your website.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      window.location.reload()
                    }
                    className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[11px] font-black text-slate-700 transition hover:border-[#063B8F] hover:text-[#063B8F]"
                  >
                    <Icon
                      name="refresh"
                      size={15}
                    />
                    Refresh
                  </button>

                  <a
                    href="/admin/advance-bookings/create"
                    className="flex h-10 items-center gap-2 rounded-xl bg-[#063B8F] px-4 text-[11px] font-black text-white shadow-[0_7px_20px_rgba(6,59,143,0.2)] transition hover:-translate-y-0.5 hover:bg-[#052F72]"
                  >
                    <span className="text-[18px] leading-none">
                      +
                    </span>

                    New Booking
                  </a>
                </div>
              </div>

              {/* Filters */}
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() =>
                    setMobileFilters(
                      (value) =>
                        !value,
                    )
                  }
                  className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 text-[11px] font-black text-slate-700 md:hidden"
                >
                  <span className="flex items-center gap-2">
                    <Icon
                      name="filter"
                      size={15}
                    />
                    Filters
                  </span>

                  <span className="text-[10px] text-slate-400">
                    {hasFilters
                      ? "Applied"
                      : "All enquiries"}
                  </span>
                </button>

                <div
                  className={`${
                    mobileFilters
                      ? "grid"
                      : "hidden"
                  } mt-3 gap-2 md:grid md:grid-cols-[minmax(220px,1.5fr)_minmax(150px,0.8fr)_minmax(150px,0.8fr)_minmax(160px,0.8fr)_auto]`}
                >
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Icon
                        name="search"
                        size={15}
                      />
                    </span>

                    <input
                      value={search}
                      onChange={(event) =>
                        setSearch(
                          event.target
                            .value,
                        )
                      }
                      placeholder="Search name, phone, route, vehicle..."
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-[11px] font-semibold outline-none placeholder:text-slate-400 focus:border-[#063B8F] focus:bg-white focus:ring-2 focus:ring-[#063B8F]/10"
                    />
                  </div>

                  <select
                    value={
                      statusFilter
                    }
                    onChange={(event) =>
                      setStatusFilter(
                        event.target
                          .value as
                          | "all"
                          | EnquiryStatus,
                      )
                    }
                    className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[11px] font-black text-slate-700 outline-none focus:border-[#063B8F]"
                  >
                    <option value="all">
                      All Statuses
                    </option>

                    {STATUS_OPTIONS.map(
                      (option) => (
                        <option
                          key={
                            option.value
                          }
                          value={
                            option.value
                          }
                        >
                          {
                            option.label
                          }
                        </option>
                      ),
                    )}
                  </select>

                  <select
                    value={
                      tripFilter
                    }
                    onChange={(event) =>
                      setTripFilter(
                        event.target
                          .value,
                      )
                    }
                    className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[11px] font-black text-slate-700 outline-none focus:border-[#063B8F]"
                  >
                    {TRIP_TYPES.map(
                      (trip) => (
                        <option
                          key={trip}
                          value={trip}
                        >
                          {trip ===
                          "All"
                            ? "All Trip Types"
                            : trip}
                        </option>
                      ),
                    )}
                  </select>

                  <input
                    type="date"
                    value={
                      dateFilter
                    }
                    onChange={(event) =>
                      setDateFilter(
                        event.target
                          .value,
                      )
                    }
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-[11px] font-black text-slate-700 outline-none focus:border-[#063B8F]"
                  />

                  <button
                    type="button"
                    onClick={
                      clearFilters
                    }
                    className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-[11px] font-black text-slate-500 hover:bg-slate-50"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Error */}
            {firebaseError && (
              <div className="m-5 rounded-2xl border border-red-200 bg-red-50 p-4">
                <p className="text-[13px] font-black text-red-700">
                  Firebase Error
                </p>

                <p className="mt-1 text-[11px] font-semibold leading-5 text-red-600">
                  {
                    firebaseError
                  }
                </p>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="space-y-3 p-4">
                {[
                  1, 2, 3,
                ].map(
                  (item) => (
                    <div
                      key={item}
                      className="h-[150px] animate-pulse rounded-2xl bg-slate-100"
                    />
                  ),
                )}
              </div>
            )}

            {/* Empty */}
            {!loading &&
              !firebaseError &&
              filteredEnquiries.length ===
                0 && (
                <EmptyState
                  hasFilters={
                    hasFilters
                  }
                  onClear={
                    clearFilters
                  }
                />
              )}

            {/* Cards */}
            {!loading &&
              !firebaseError &&
              filteredEnquiries.length >
                0 && (
                <div className="space-y-3 p-3 sm:p-4">
                  {filteredEnquiries.map(
                    (enquiry) => (
                      <EnquiryCard
                        key={
                          enquiry.id
                        }
                        enquiry={
                          enquiry
                        }
                        selected={
                          selectedEnquiry?.id ===
                          enquiry.id
                        }
                        updating={
                          updatingId ===
                          enquiry.id
                        }
                        deleting={
                          deletingId ===
                          enquiry.id
                        }
                        onSelect={() =>
                          setSelectedEnquiry(
                            enquiry,
                          )
                        }
                        onStatusChange={(
                          status,
                        ) =>
                          updateStatus(
                            enquiry,
                            status,
                          )
                        }
                        onCall={() =>
                          callCustomer(
                            enquiry.phone,
                          )
                        }
                        onWhatsApp={() =>
                          openWhatsApp(
                            enquiry,
                          )
                        }
                        onDelete={() =>
                          deleteEnquiry(
                            enquiry,
                          )
                        }
                      />
                    ),
                  )}
                </div>
              )}

            {!loading &&
              !firebaseError &&
              filteredEnquiries.length >
                0 && (
                <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/50 px-5 py-3.5 text-[10px] font-semibold text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    Showing{" "}
                    <strong className="font-black text-slate-600">
                      {
                        filteredEnquiries.length
                      }
                    </strong>{" "}
                    of{" "}
                    <strong className="font-black text-slate-600">
                      {
                        enquiries.length
                      }
                    </strong>{" "}
                    enquiries
                  </span>

                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    Live Firebase connection
                  </span>
                </div>
              )}
          </section>
        </main>
      </div>

      {/* ===================================================
          DETAIL DRAWER
      =================================================== */}

      {selectedEnquiry && (
        <>
          <button
            type="button"
            aria-label="Close details"
            onClick={() =>
              setSelectedEnquiry(
                null,
              )
            }
            className="fixed inset-0 z-[60] bg-[#020B24]/45 backdrop-blur-[2px]"
          />

          <aside className="fixed inset-x-0 bottom-0 z-[70] max-h-[92vh] overflow-hidden rounded-t-[26px] border border-slate-200 bg-white shadow-2xl lg:inset-y-0 lg:right-0 lg:left-auto lg:h-full lg:max-h-none lg:w-[440px] lg:rounded-none lg:rounded-l-[26px]">
            <EnquiryDetails
              enquiry={
                selectedEnquiry
              }
              updating={
                updatingId ===
                selectedEnquiry.id
              }
              deleting={
                deletingId ===
                selectedEnquiry.id
              }
              onClose={() =>
                setSelectedEnquiry(
                  null,
                )
              }
              onStatusChange={(
                status,
              ) =>
                updateStatus(
                  selectedEnquiry,
                  status,
                )
              }
              onCall={() =>
                callCustomer(
                  selectedEnquiry.phone,
                )
              }
              onWhatsApp={() =>
                openWhatsApp(
                  selectedEnquiry,
                )
              }
              onDelete={() =>
                deleteEnquiry(
                  selectedEnquiry,
                )
              }
            />
          </aside>
        </>
      )}
    </div>
  );
}

/* =========================================================
   SIDEBAR LINK
========================================================= */

function SidebarLink({
  href,
  icon,
  label,
  active = false,
  collapsed = false,
  onClick,
}: {
  href: string;
  icon: Parameters<
    typeof Icon
  >[0]["name"];
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      title={
        collapsed
          ? label
          : undefined
      }
      className={`group mb-1 flex min-h-[46px] items-center rounded-xl text-[12px] font-black transition ${
        collapsed
          ? "justify-center px-2"
          : "gap-3 px-3.5"
      } ${
        active
          ? "bg-[#EEF4FF] text-[#063B8F] shadow-[inset_3px_0_0_#063B8F]"
          : "text-slate-600 hover:bg-slate-50 hover:text-[#063B8F]"
      }`}
    >
      <span
        className={`shrink-0 ${
          active
            ? "text-[#063B8F]"
            : "text-slate-400 group-hover:text-[#063B8F]"
        }`}
      >
        <Icon
          name={icon}
          size={18}
        />
      </span>

      {!collapsed && (
        <span className="truncate">
          {label}
        </span>
      )}
    </a>
  );
}

/* =========================================================
   ENQUIRY CARD
========================================================= */

function EnquiryCard({
  enquiry,
  selected,
  updating,
  deleting,
  onSelect,
  onStatusChange,
  onCall,
  onWhatsApp,
  onDelete,
}: {
  enquiry: Enquiry;
  selected: boolean;
  updating: boolean;
  deleting: boolean;
  onSelect: () => void;
  onStatusChange: (
    status: EnquiryStatus,
  ) => void;
  onCall: () => void;
  onWhatsApp: () => void;
  onDelete: () => void;
}) {
  return (
    <article
      className={`overflow-hidden rounded-[18px] border bg-white transition ${
        selected
          ? "border-[#063B8F] bg-[#F8FBFF] shadow-[0_8px_30px_rgba(6,59,143,0.09)]"
          : "border-slate-200 hover:border-slate-300 hover:shadow-[0_8px_28px_rgba(15,23,42,0.05)]"
      }`}
    >
      <div className="p-4 sm:p-5">
        {/* Desktop */}
        <div className="hidden lg:grid lg:grid-cols-[minmax(210px,1.1fr)_minmax(260px,1.5fr)_135px_160px_145px_auto] lg:items-center lg:gap-5">
          <CustomerBlock
            enquiry={enquiry}
          />

          <RouteBlock
            enquiry={enquiry}
          />

          <TravelBlock
            enquiry={enquiry}
          />

          <VehicleBlock
            enquiry={enquiry}
          />

          <StatusSelect
            value={enquiry.status}
            loading={updating}
            onChange={
              onStatusChange
            }
          />

          <div className="flex items-center justify-end gap-1.5">
            <ActionButton
              label="Call"
              icon="phone"
              className="bg-blue-50 text-[#063B8F] hover:bg-[#063B8F] hover:text-white"
              onClick={onCall}
            />

            <ActionButton
              label="WhatsApp"
              icon="whatsapp"
              className="bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white"
              onClick={
                onWhatsApp
              }
            />

            <ActionButton
              label="View"
              icon="eye"
              className="bg-slate-100 text-slate-600 hover:bg-[#071A3A] hover:text-white"
              onClick={onSelect}
            />

            <ActionButton
              label="Delete"
              icon="trash"
              className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white"
              onClick={onDelete}
              disabled={deleting}
            />
          </div>
        </div>

        {/* Mobile / Tablet */}
        <div className="lg:hidden">
          <div className="flex items-start justify-between gap-3">
            <CustomerBlock
              enquiry={enquiry}
            />

            <StatusBadge
              status={enquiry.status}
            />
          </div>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
            <RouteBlock
              enquiry={enquiry}
            />

            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-200 pt-4">
              <TravelBlock
                enquiry={enquiry}
              />

              <VehicleBlock
                enquiry={enquiry}
              />
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-[9px] font-black uppercase tracking-[0.13em] text-slate-400">
              Change Status
            </p>

            <StatusSelect
              value={enquiry.status}
              loading={updating}
              onChange={
                onStatusChange
              }
            />
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2">
            <MobileAction
              label="Call"
              icon="phone"
              className="bg-blue-50 text-[#063B8F]"
              onClick={onCall}
            />

            <MobileAction
              label="WhatsApp"
              icon="whatsapp"
              className="bg-emerald-50 text-emerald-600"
              onClick={
                onWhatsApp
              }
            />

            <MobileAction
              label="Details"
              icon="eye"
              className="bg-slate-100 text-slate-700"
              onClick={onSelect}
            />

            <MobileAction
              label="Delete"
              icon="trash"
              className="bg-red-50 text-red-500"
              onClick={onDelete}
              disabled={deleting}
            />
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/60 px-4 py-3 text-[10px] font-semibold text-slate-400 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-x-5 gap-y-1.5">
          <span>
            Source:{" "}
            <strong className="font-black text-slate-500">
              {enquiry.source ||
                "Website"}
            </strong>
          </span>

          <span>
            Page:{" "}
            <strong className="font-black text-slate-500">
              {enquiry.page || "/"}
            </strong>
          </span>
        </div>

        <span>
          Created:{" "}
          <strong className="font-black text-slate-500">
            {formatCreatedAt(
              enquiry.createdAt,
            )}
          </strong>
        </span>
      </div>
    </article>
  );
}

/* =========================================================
   CUSTOMER
========================================================= */

function CustomerBlock({
  enquiry,
}: {
  enquiry: Enquiry;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] bg-gradient-to-br from-[#EEF4FF] to-[#DDEAFF] text-[16px] font-black text-[#063B8F]">
        {getInitial(
          enquiry.name,
        )}
      </div>

      <div className="min-w-0">
        <p className="truncate text-[14px] font-black leading-5 text-[#071A3A]">
          {enquiry.name ||
            "Unknown Customer"}
        </p>

        <a
          href={`tel:+91${normalizePhone(
            enquiry.phone,
          )}`}
          className="mt-1 block text-[11px] font-bold text-slate-500 hover:text-[#063B8F]"
        >
          {enquiry.phone ||
            "Mobile unavailable"}
        </a>

        <p className="mt-1 text-[9px] font-black uppercase tracking-wider text-slate-400">
          {enquiry.tripType ||
            "Trip Enquiry"}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   ROUTE
========================================================= */

function RouteBlock({
  enquiry,
}: {
  enquiry: Enquiry;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
        Journey
      </p>

      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
            From
          </p>

          <p className="mt-0.5 break-words text-[13px] font-black leading-5 text-slate-800">
            {enquiry.from || "—"}
          </p>
        </div>

        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-[#063B8F] shadow-sm ring-1 ring-slate-200">
          <Icon
            name="arrow"
            size={15}
          />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
            To
          </p>

          <p className="mt-0.5 break-words text-[13px] font-black leading-5 text-slate-800">
            {enquiry.to || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   TRAVEL
========================================================= */

function TravelBlock({
  enquiry,
}: {
  enquiry: Enquiry;
}) {
  return (
    <div>
      <p className="mb-2 text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
        Travel
      </p>

      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 text-[#063B8F]">
          <Icon
            name="calendar"
            size={16}
          />
        </span>

        <div>
          <p className="text-[12px] font-black leading-5 text-slate-800">
            {formatDate(
              enquiry.travelDate,
            )}
          </p>

          <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
            {enquiry.travelTime ||
              "Time not set"}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   VEHICLE
========================================================= */

function VehicleBlock({
  enquiry,
}: {
  enquiry: Enquiry;
}) {
  return (
    <div>
      <p className="mb-2 text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
        Vehicle
      </p>

      <div className="inline-flex max-w-full items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-[11px] font-black leading-4 text-slate-700 shadow-sm ring-1 ring-slate-200">
        <Icon
          name="car"
          size={15}
        />

        <span>
          {enquiry.vehicleType ||
            "Any Suitable Vehicle"}
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   ACTION
========================================================= */

function ActionButton({
  label,
  icon,
  className,
  onClick,
  disabled,
}: {
  label: string;
  icon: Parameters<
    typeof Icon
  >[0]["name"];
  className: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition active:scale-95 disabled:cursor-wait disabled:opacity-40 ${className}`}
    >
      <Icon
        name={icon}
        size={16}
      />
    </button>
  );
}

/* =========================================================
   MOBILE ACTION
========================================================= */

function MobileAction({
  label,
  icon,
  className,
  onClick,
  disabled,
}: {
  label: string;
  icon: Parameters<
    typeof Icon
  >[0]["name"];
  className: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-11 items-center justify-center gap-2 rounded-xl text-[10px] font-black transition active:scale-[0.98] disabled:opacity-40 ${className}`}
    >
      <Icon
        name={icon}
        size={15}
      />

      {label}
    </button>
  );
}

/* =========================================================
   DETAIL DRAWER
========================================================= */

function EnquiryDetails({
  enquiry,
  updating,
  deleting,
  onClose,
  onStatusChange,
  onCall,
  onWhatsApp,
  onDelete,
}: {
  enquiry: Enquiry;
  updating: boolean;
  deleting: boolean;
  onClose: () => void;
  onStatusChange: (
    status: EnquiryStatus,
  ) => void;
  onCall: () => void;
  onWhatsApp: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-slate-100 bg-gradient-to-r from-[#071A3A] to-[#063B8F] px-5 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#F8C515]">
              Website Enquiry
            </p>

            <h2 className="mt-1 text-[21px] font-black tracking-tight text-white">
              Enquiry Details
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
          >
            <Icon
              name="close"
              size={18}
            />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="p-5">
          {/* Customer */}
          <div className="flex items-center gap-3.5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[17px] bg-gradient-to-br from-[#EEF4FF] to-[#DDEAFF] text-[19px] font-black text-[#063B8F]">
              {getInitial(
                enquiry.name,
              )}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-[17px] font-black text-[#071A3A]">
                {enquiry.name ||
                  "Unknown Customer"}
              </h3>

              <a
                href={`tel:+91${normalizePhone(
                  enquiry.phone,
                )}`}
                className="mt-1 block text-[12px] font-bold text-slate-500"
              >
                {enquiry.phone ||
                  "Mobile unavailable"}
              </a>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={onCall}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#063B8F] text-[11px] font-black text-white shadow-sm hover:bg-[#052F72]"
            >
              <Icon
                name="phone"
                size={16}
              />
              Call Customer
            </button>

            <button
              type="button"
              onClick={onWhatsApp}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#16A34A] text-[11px] font-black text-white shadow-sm hover:bg-[#15803D]"
            >
              <Icon
                name="whatsapp"
                size={16}
              />
              WhatsApp
            </button>
          </div>

          <DetailSection
            title="Booking Status"
            icon="check"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <StatusBadge
                status={enquiry.status}
              />

              <StatusSelect
                value={enquiry.status}
                loading={updating}
                onChange={
                  onStatusChange
                }
              />
            </div>
          </DetailSection>

          <DetailSection
            title="Customer Information"
            icon="user"
          >
            <div className="grid grid-cols-2 gap-5">
              <DetailInfo
                label="Name"
                value={
                  enquiry.name ||
                  "—"
                }
              />

              <DetailInfo
                label="Mobile"
                value={
                  enquiry.phone ||
                  "—"
                }
              />

              <DetailInfo
                label="Source"
                value={
                  enquiry.source ||
                  "Website"
                }
              />

              <DetailInfo
                label="Page"
                value={
                  enquiry.page ||
                  "/"
                }
              />
            </div>
          </DetailSection>

          <DetailSection
            title="Journey Details"
            icon="route"
          >
            <div className="space-y-4">
              <DetailInfo
                label="Trip Type"
                value={
                  enquiry.tripType ||
                  "—"
                }
              />

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                      From
                    </p>

                    <p className="mt-1 break-words text-[13px] font-black leading-5 text-slate-700">
                      {enquiry.from ||
                        "—"}
                    </p>
                  </div>

                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#063B8F] shadow-sm">
                    <Icon
                      name="arrow"
                      size={14}
                    />
                  </span>

                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                      To
                    </p>

                    <p className="mt-1 break-words text-[13px] font-black leading-5 text-slate-700">
                      {enquiry.to ||
                        "—"}
                    </p>
                  </div>
                </div>
              </div>

              <DetailInfo
                label="Vehicle"
                value={
                  enquiry.vehicleType ||
                  "Any Suitable Vehicle"
                }
              />
            </div>
          </DetailSection>

          <DetailSection
            title="Travel Details"
            icon="calendar"
          >
            <div className="grid grid-cols-2 gap-5">
              <DetailInfo
                label="Travel Date"
                value={formatDate(
                  enquiry.travelDate,
                )}
              />

              <DetailInfo
                label="Travel Time"
                value={
                  enquiry.travelTime ||
                  "—"
                }
              />
            </div>
          </DetailSection>

          <DetailSection
            title="System Information"
            icon="settings"
          >
            <div className="space-y-5">
              <DetailInfo
                label="Enquiry ID"
                value={enquiry.id}
              />

              <DetailInfo
                label="Created"
                value={formatCreatedAt(
                  enquiry.createdAt,
                )}
              />

              <DetailInfo
                label="Updated"
                value={formatCreatedAt(
                  enquiry.updatedAt,
                )}
              />
            </div>
          </DetailSection>

          {enquiry.enquirySummary && (
            <DetailSection
              title="Enquiry Summary"
              icon="mail"
            >
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-[12px] font-medium leading-6 text-slate-600">
                  {
                    enquiry.enquirySummary
                  }
                </p>
              </div>
            </DetailSection>
          )}
        </div>
      </div>

      {/* Drawer footer */}
      <div className="shrink-0 border-t border-slate-100 bg-white p-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={updating}
            onClick={() =>
              onStatusChange(
                "contacted",
              )
            }
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-amber-50 text-[10px] font-black text-amber-700 hover:bg-amber-100 disabled:opacity-50"
          >
            <Icon
              name="phone"
              size={15}
            />
            Mark Contacted
          </button>

          <button
            type="button"
            disabled={updating}
            onClick={() =>
              onStatusChange(
                "confirmed",
              )
            }
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-50 text-[10px] font-black text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
          >
            <Icon
              name="check"
              size={15}
            />
            Confirm Booking
          </button>
        </div>

        <button
          type="button"
          disabled={deleting}
          onClick={onDelete}
          className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 text-[10px] font-black text-red-600 hover:bg-red-100 disabled:opacity-50"
        >
          <Icon
            name="trash"
            size={15}
          />
          Delete Enquiry
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   DETAIL SECTION
========================================================= */

function DetailSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: Parameters<
    typeof Icon
  >[0]["name"];
  children: ReactNode;
}) {
  return (
    <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_18px_rgba(15,23,42,0.025)]">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#063B8F]">
          <Icon
            name={icon}
            size={15}
          />
        </span>

        <h3 className="text-[13px] font-black text-[#071A3A]">
          {title}
        </h3>
      </div>

      {children}
    </section>
  );
}

/* =========================================================
   DETAIL INFO
========================================================= */

function DetailInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 break-words text-[13px] font-black leading-5 text-slate-700">
        {value || "—"}
      </p>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  hasFilters,
  onClear,
}: {
  hasFilters: boolean;
  onClear: () => void;
}) {
  return (
    <div className="flex min-h-[330px] flex-col items-center justify-center px-5 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#EEF4FF] text-[#063B8F]">
        <Icon
          name="mail"
          size={28}
        />
      </div>

      <h3 className="mt-5 text-[18px] font-black text-[#071A3A]">
        {hasFilters
          ? "No matching enquiries"
          : "No website enquiries yet"}
      </h3>

      <p className="mt-2 max-w-md text-[12px] font-medium leading-6 text-slate-400">
        {hasFilters
          ? "Try changing your search or filters to see more enquiries."
          : "New website enquiries will automatically appear here."}
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 rounded-xl bg-[#071A3A] px-5 py-3 text-[11px] font-black text-white transition hover:bg-[#063B8F]"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}