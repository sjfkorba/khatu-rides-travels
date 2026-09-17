"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ConfirmationResult,
  RecaptchaVerifier,
  onAuthStateChanged,
  signInWithPhoneNumber,
  signOut,
} from "firebase/auth";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Car,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Download,
  FileText,
  IndianRupee,
  Loader2,
  LogOut,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  Ticket,
  User,
  X,
} from "lucide-react";

import { auth, db } from "@/lib/firebase";

import {
  generateTravelInvoicePdf,
} from "@/lib/generateInvoicePdf";

import {
  downloadAdvanceBookingPdf,
} from "@/lib/generateAdvanceBookingPdf";

/* ================================================================
   CONSTANTS
================================================================ */

const PHONE = "9244137353";
const PHONE_DISPLAY = "+91 92441 37353";
const WHATSAPP = "919244137353";

/* ================================================================
   TYPES
================================================================ */

interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  customerName: string;
  customerMobile: string;
  pickupLocation: string;
  dropLocation: string;
  pickupTime: string;
  dropTime: string;
  vehicleNumber: string;
  vehicleType: string;
  remarks: string;
  amount: number;
  createdAt?: any;
}

interface AdvanceVehicle {
  vehicleType?: string;
  variant?: string;
  quantity?: number | string;
  ratePerVehicle?: number | string;
  total?: number | string;
}

interface AdvanceBooking {
  id: string;
  bookingNumber: string;
  bookingType: string;
  bookingDate: string;
  journeyDate: string;
  pickupTime: string;
  customerName: string;
  customerMobile: string;
  pickupLocation: string;
  dropLocation: string;
  vehicles: AdvanceVehicle[];
  totalVehicles: number;
  totalAmount: number;
  advanceAmount: number;
  balanceAmount: number;
  status: string;
  remarks: string;
  source?: string;
  createdAt?: any;
  updatedAt?: any;
}

type DocumentType = "invoice" | "advance";

type SelectedDocument =
  | {
      type: "invoice";
      data: Invoice;
    }
  | {
      type: "advance";
      data: AdvanceBooking;
    };

/* ================================================================
   HELPERS
================================================================ */

function normalizeMobile(value: string) {
  return value.replace(/\D/g, "").slice(-10);
}

function formatCurrency(value: number | string | undefined) {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateLong(value?: string) {
  if (!value) return "—";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatTime(value?: string) {
  if (!value) return "—";

  const parts = value.split(":");

  if (parts.length < 2) return value;

  const hour = Number(parts[0]);
  const minute = Number(parts[1]);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return value;
  }

  const suffix = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;

  return `${String(formattedHour).padStart(2, "0")}:${String(
    minute
  ).padStart(2, "0")} ${suffix}`;
}

function getFirebaseErrorMessage(error: any) {
  const code = error?.code || "";

  switch (code) {
    case "auth/invalid-phone-number":
      return "Please enter a valid 10-digit Indian mobile number.";

    case "auth/too-many-requests":
      return "Too many OTP attempts. Please wait for some time and try again.";

    case "auth/quota-exceeded":
      return "OTP service limit has been reached. Please try again later.";

    case "auth/invalid-app-credential":
      return "Security verification failed. Please complete the reCAPTCHA verification again.";

    case "auth/captcha-check-failed":
      return "Security verification failed. Please complete the reCAPTCHA verification again.";

    case "auth/operation-not-allowed":
      return "Phone OTP login is not enabled in Firebase Authentication.";

    case "auth/unauthorized-domain":
      return "This website domain is not authorized in Firebase Authentication.";

    case "auth/code-expired":
      return "This OTP has expired. Please request a new OTP.";

    case "auth/invalid-verification-code":
      return "Incorrect OTP. Please check the OTP and try again.";

    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";

    default:
      return (
        error?.message ||
        "Something went wrong. Please try again."
      );
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case "Confirmed":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "Partially Paid":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "Pending":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "Completed":
      return "border-slate-200 bg-slate-100 text-slate-700";

    case "Cancelled":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-slate-200 bg-slate-100 text-slate-600";
  }
}

/* ================================================================
   MAIN PAGE
================================================================ */

export default function MyInvoicesPage() {
  /* --------------------------------------------------------------
     AUTH
  -------------------------------------------------------------- */

  const [currentUser, setCurrentUser] =
    useState<any>(null);

  const [authLoading, setAuthLoading] =
    useState(true);

  /* --------------------------------------------------------------
     MOBILE / OTP
  -------------------------------------------------------------- */

  const [phone, setPhone] = useState("");

  const [otp, setOtp] = useState("");

  const [otpStep, setOtpStep] =
    useState(false);

  const [otpLoading, setOtpLoading] =
    useState(false);

  const [otpVerifying, setOtpVerifying] =
    useState(false);

  const [error, setError] = useState("");

  const [infoMessage, setInfoMessage] =
    useState("");

  /* --------------------------------------------------------------
     RECAPTCHA
  -------------------------------------------------------------- */

  const recaptchaVerifierRef =
    useRef<RecaptchaVerifier | null>(null);

  const confirmationResultRef =
    useRef<ConfirmationResult | null>(null);

  const [recaptchaReady, setRecaptchaReady] =
    useState(false);

  /* --------------------------------------------------------------
     DOCUMENT DATA
  -------------------------------------------------------------- */

  const [invoices, setInvoices] =
    useState<Invoice[]>([]);

  const [advanceBookings, setAdvanceBookings] =
    useState<AdvanceBooking[]>([]);

  const [documentsLoading, setDocumentsLoading] =
    useState(false);

  /* --------------------------------------------------------------
     UI
  -------------------------------------------------------------- */

  const [activeTab, setActiveTab] =
    useState<"all" | DocumentType>("all");

  const [search, setSearch] = useState("");

  const [selectedDocument, setSelectedDocument] =
    useState<SelectedDocument | null>(null);

  const [downloadingId, setDownloadingId] =
    useState<string | null>(null);

  /* ==============================================================
     AUTH STATE LISTENER
  ============================================================== */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setCurrentUser(user);
        setAuthLoading(false);

        if (user?.phoneNumber) {
          const normalized =
            normalizeMobile(user.phoneNumber);

          if (normalized.length === 10) {
            setPhone(normalized);
          }
        }
      }
    );

    return () => unsubscribe();
  }, []);

  /* ==============================================================
     RECAPTCHA CLEANUP
  ============================================================== */

  const clearRecaptcha = useCallback(() => {
    try {
      recaptchaVerifierRef.current?.clear();
    } catch (error) {
      console.warn(
        "reCAPTCHA cleanup warning:",
        error
      );
    }

    recaptchaVerifierRef.current = null;
    setRecaptchaReady(false);
  }, []);

  useEffect(() => {
    return () => {
      clearRecaptcha();
    };
  }, [clearRecaptcha]);

  /* ==============================================================
     CREATE RECAPTCHA
  ============================================================== */

  const setupRecaptcha = useCallback(async () => {
    if (typeof window === "undefined") {
      return null;
    }

    const container =
      document.getElementById(
        "recaptcha-container"
      );

    if (!container) {
      console.error(
        "reCAPTCHA container not found."
      );

      return null;
    }

    if (recaptchaVerifierRef.current) {
      return recaptchaVerifierRef.current;
    }

    try {
      container.innerHTML = "";

      const verifier =
        new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "normal",

            callback: () => {
              setRecaptchaReady(true);
              setError("");
            },

            "expired-callback": () => {
              setRecaptchaReady(false);

              setError(
                "Security verification expired. Please verify again."
              );
            },

            "error-callback": () => {
              setRecaptchaReady(false);

              setError(
                "Security verification failed. Please verify again."
              );
            },
          }
        );

      recaptchaVerifierRef.current =
        verifier;

      await verifier.render();

      setRecaptchaReady(true);

      return verifier;
    } catch (error) {
      console.error(
        "reCAPTCHA setup error:",
        error
      );

      clearRecaptcha();

      return null;
    }
  }, [clearRecaptcha]);

  /* ==============================================================
     INITIALIZE RECAPTCHA
  ============================================================== */

  useEffect(() => {
    if (authLoading) return;

    if (currentUser) return;

    if (otpStep) return;

    const timer = window.setTimeout(() => {
      setupRecaptcha();
    }, 350);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    authLoading,
    currentUser,
    otpStep,
    setupRecaptcha,
  ]);

  /* ==============================================================
     SEND OTP
  ============================================================== */

  const sendOtp = async () => {
    setError("");
    setInfoMessage("");

    const cleanedPhone =
      normalizeMobile(phone);

    if (
      !/^[6-9]\d{9}$/.test(
        cleanedPhone
      )
    ) {
      setError(
        "Please enter a valid 10-digit Indian mobile number."
      );

      return;
    }

    if (otpLoading) return;

    setPhone(cleanedPhone);

    setOtpLoading(true);

    try {
      const phoneNumber =
        `+91${cleanedPhone}`;

      let verifier =
        recaptchaVerifierRef.current;

      if (!verifier) {
        verifier =
          await setupRecaptcha();
      }

      if (!verifier) {
        throw new Error(
          "Security verification could not be initialized."
        );
      }

      /*
       * IMPORTANT:
       *
       * Do NOT call verifier.verify() manually here.
       *
       * signInWithPhoneNumber() handles the
       * application verifier flow.
       */

      const confirmation =
        await signInWithPhoneNumber(
          auth,
          phoneNumber,
          verifier
        );

      confirmationResultRef.current =
        confirmation;

      setOtpStep(true);
      setOtp("");
      setError("");

      setInfoMessage(
        `OTP sent to +91 ${cleanedPhone}`
      );

    } catch (error: any) {
      console.error(
        "Firebase OTP Error:",
        {
          code: error?.code,
          message: error?.message,
          name: error?.name,
        }
      );

      setError(
        getFirebaseErrorMessage(error)
      );

      /*
       * IMPORTANT:
       * Always destroy the old verifier
       * after an app-credential/captcha failure.
       */

      clearRecaptcha();

      /*
       * Re-create a fresh verifier after
       * React has rendered the container again.
       */

      window.setTimeout(() => {
        setupRecaptcha();
      }, 250);

    } finally {
      setOtpLoading(false);
    }
  };

  /* ==============================================================
     VERIFY OTP
  ============================================================== */

  const verifyOtp = async () => {
    setError("");
    setInfoMessage("");

    const code =
      otp.replace(/\D/g, "");

    if (code.length !== 6) {
      setError(
        "Please enter the 6-digit OTP."
      );

      return;
    }

    if (otpVerifying) return;

    const confirmation =
      confirmationResultRef.current;

    if (!confirmation) {
      setError(
        "OTP session expired. Please request a new OTP."
      );

      setOtpStep(false);

      return;
    }

    setOtpVerifying(true);

    try {
      await confirmation.confirm(code);

      confirmationResultRef.current =
        null;

      setOtpStep(false);
      setOtp("");
      setError("");
      setInfoMessage(
        "Mobile number verified successfully."
      );

      clearRecaptcha();

    } catch (error: any) {
      console.error(
        "OTP verification error:",
        error
      );

      setError(
        getFirebaseErrorMessage(error)
      );

      if (
        error?.code ===
        "auth/code-expired"
      ) {
        confirmationResultRef.current =
          null;
      }

    } finally {
      setOtpVerifying(false);
    }
  };

  /* ==============================================================
     CHANGE MOBILE
  ============================================================== */

  const changeMobile = () => {
    confirmationResultRef.current =
      null;

    setOtp("");
    setOtpStep(false);
    setError("");
    setInfoMessage("");

    clearRecaptcha();

    window.setTimeout(() => {
      setupRecaptcha();
    }, 250);
  };

  /* ==============================================================
     LOAD CUSTOMER DOCUMENTS
  ============================================================== */

  const loadDocuments = useCallback(
    async (mobile: string) => {
      const normalized =
        normalizeMobile(mobile);

      if (
        !/^[6-9]\d{9}$/.test(
          normalized
        )
      ) {
        return;
      }

      setDocumentsLoading(true);
      setError("");

      try {
        /*
         * --------------------------------------------------------
         * NORMAL INVOICES
         * --------------------------------------------------------
         */

        const invoiceQuery = query(
          collection(db, "invoices"),
          where(
            "customerMobile",
            "==",
            normalized
          )
        );

        /*
         * --------------------------------------------------------
         * ADVANCE BOOKINGS
         * --------------------------------------------------------
         */

        const advanceQuery = query(
          collection(
            db,
            "advance_bookings"
          ),
          where(
            "customerMobile",
            "==",
            normalized
          )
        );

        const [
          invoiceSnapshot,
          advanceSnapshot,
        ] = await Promise.all([
          getDocs(invoiceQuery),
          getDocs(advanceQuery),
        ]);

        const invoiceData: Invoice[] =
          invoiceSnapshot.docs.map(
            (docSnap) => {
              const data =
                docSnap.data();

              return {
                id: docSnap.id,
                invoiceNumber:
                  data.invoiceNumber ||
                  "Invoice",

                invoiceDate:
                  data.invoiceDate ||
                  "",

                customerName:
                  data.customerName ||
                  "",

                customerMobile:
                  data.customerMobile ||
                  normalized,

                pickupLocation:
                  data.pickupLocation ||
                  "",

                dropLocation:
                  data.dropLocation ||
                  "",

                pickupTime:
                  data.pickupTime ||
                  "",

                dropTime:
                  data.dropTime ||
                  "",

                vehicleNumber:
                  data.vehicleNumber ||
                  "",

                vehicleType:
                  data.vehicleType ||
                  "",

                remarks:
                  data.remarks ||
                  "",

                amount:
                  Number(data.amount || 0),

                createdAt:
                  data.createdAt || null,
              };
            }
          );

        const advanceData: AdvanceBooking[] =
          advanceSnapshot.docs.map(
            (docSnap) => {
              const data =
                docSnap.data();

              const vehicles =
                Array.isArray(
                  data.vehicles
                )
                  ? data.vehicles
                  : [];

              return {
                id: docSnap.id,

                bookingNumber:
                  data.bookingNumber ||
                  "Advance Booking",

                bookingType:
                  data.bookingType ||
                  "Advance Booking",

                bookingDate:
                  data.bookingDate ||
                  "",

                journeyDate:
                  data.journeyDate ||
                  "",

                pickupTime:
                  data.pickupTime ||
                  "",

                customerName:
                  data.customerName ||
                  "",

                customerMobile:
                  data.customerMobile ||
                  normalized,

                pickupLocation:
                  data.pickupLocation ||
                  "",

                dropLocation:
                  data.dropLocation ||
                  "",

                vehicles,

                totalVehicles:
                  Number(
                    data.totalVehicles ||
                      0
                  ),

                totalAmount:
                  Number(
                    data.totalAmount ||
                      0
                  ),

                advanceAmount:
                  Number(
                    data.advanceAmount ||
                      0
                  ),

                balanceAmount:
                  Number(
                    data.balanceAmount ||
                      0
                  ),

                status:
                  data.status ||
                  "Pending",

                remarks:
                  data.remarks ||
                  "",

                source:
                  data.source ||
                  "",

                createdAt:
                  data.createdAt ||
                  null,

                updatedAt:
                  data.updatedAt ||
                  null,
              };
            }
          );

        /*
         * Sort newest first on client.
         *
         * No orderBy() is used intentionally,
         * so you don't need a Firestore composite
         * index for this portal.
         */

        invoiceData.sort(
          (a, b) =>
            String(
              b.invoiceDate || ""
            ).localeCompare(
              String(
                a.invoiceDate || ""
              )
            )
        );

        advanceData.sort(
          (a, b) =>
            String(
              b.journeyDate || ""
            ).localeCompare(
              String(
                a.journeyDate || ""
              )
            )
        );

        setInvoices(invoiceData);
        setAdvanceBookings(
          advanceData
        );

      } catch (error: any) {
        console.error(
          "Document loading error:",
          error
        );

        setError(
          error?.message ||
            "Unable to load your travel documents."
        );
      } finally {
        setDocumentsLoading(false);
      }
    },
    []
  );

  /* ==============================================================
     LOAD DOCUMENTS AFTER AUTH
  ============================================================== */

  useEffect(() => {
    if (!currentUser) {
      setInvoices([]);
      setAdvanceBookings([]);
      return;
    }

    const mobile =
      currentUser.phoneNumber ||
      phone;

    const normalized =
      normalizeMobile(mobile);

    if (
      /^[6-9]\d{9}$/.test(
        normalized
      )
    ) {
      loadDocuments(normalized);
    }
  }, [
    currentUser,
    phone,
    loadDocuments,
  ]);

  /* ==============================================================
     REFRESH
  ============================================================== */

  const refreshDocuments = async () => {
    if (!currentUser) return;

    const mobile =
      normalizeMobile(
        currentUser.phoneNumber ||
          phone
      );

    await loadDocuments(mobile);
  };

  /* ==============================================================
     LOGOUT
  ============================================================== */

  const logout = async () => {
    try {
      await signOut(auth);

      setInvoices([]);
      setAdvanceBookings([]);
      setSelectedDocument(null);

      setOtp("");
      setOtpStep(false);
      setError("");
      setInfoMessage("");

      clearRecaptcha();

      window.setTimeout(() => {
        setupRecaptcha();
      }, 250);

    } catch (error: any) {
      console.error(
        "Logout error:",
        error
      );

      setError(
        "Unable to sign out. Please try again."
      );
    }
  };

  /* ==============================================================
     FILTER DOCUMENTS
  ============================================================== */

  const filteredInvoices =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase();

      if (!term) {
        return invoices;
      }

      return invoices.filter(
        (invoice) =>
          invoice.invoiceNumber
            .toLowerCase()
            .includes(term) ||
          invoice.customerName
            .toLowerCase()
            .includes(term) ||
          invoice.pickupLocation
            .toLowerCase()
            .includes(term) ||
          invoice.dropLocation
            .toLowerCase()
            .includes(term) ||
          invoice.vehicleType
            .toLowerCase()
            .includes(term)
      );
    }, [
      invoices,
      search,
    ]);

  const filteredAdvanceBookings =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase();

      if (!term) {
        return advanceBookings;
      }

      return advanceBookings.filter(
        (booking) =>
          booking.bookingNumber
            .toLowerCase()
            .includes(term) ||
          booking.customerName
            .toLowerCase()
            .includes(term) ||
          booking.pickupLocation
            .toLowerCase()
            .includes(term) ||
          booking.dropLocation
            .toLowerCase()
            .includes(term) ||
          booking.bookingType
            .toLowerCase()
            .includes(term) ||
          booking.status
            .toLowerCase()
            .includes(term)
      );
    }, [
      advanceBookings,
      search,
    ]);

  /* ==============================================================
     TOTAL DOCUMENTS
  ============================================================== */

  const totalDocuments =
    invoices.length +
    advanceBookings.length;

  /* ==============================================================
     DOWNLOAD NORMAL INVOICE
  ============================================================== */

  const downloadInvoice = async (
    invoice: Invoice
  ) => {
    if (downloadingId) return;

    setDownloadingId(
      `invoice-${invoice.id}`
    );

    setError("");

    try {
      const receiptData = {
        invoiceNumber:
          invoice.invoiceNumber,

        invoiceDate:
          invoice.invoiceDate,

        customerName:
          invoice.customerName,

        customerMobile:
          invoice.customerMobile,

        pickupLocation:
          invoice.pickupLocation,

        dropLocation:
          invoice.dropLocation,

        pickupTime:
          invoice.pickupTime,

        dropTime:
          invoice.dropTime,

        vehicleNumber:
          invoice.vehicleNumber,

        vehicleType:
          invoice.vehicleType,

        remarks:
          invoice.remarks,

        amount:
          Number(invoice.amount || 0),
      };

      /*
       * IMPORTANT:
       *
       * Your existing generator returns VOID
       * and performs the download itself.
       *
       * Therefore:
       *
       * NO pdf.output()
       * NO Blob conversion
       * NO URL.createObjectURL()
       */

      await generateTravelInvoicePdf(
        receiptData
      );

    } catch (error: any) {
      console.error(
        "Invoice PDF error:",
        error
      );

      setError(
        error?.message ||
          "Unable to download invoice PDF."
      );
    } finally {
      setDownloadingId(null);
    }
  };

  /* ==============================================================
     DOWNLOAD ADVANCE BOOKING PDF
  ============================================================== */

  const downloadAdvanceBooking =
    async (
      booking: AdvanceBooking
    ) => {
      if (downloadingId) return;

      setDownloadingId(
        `advance-${booking.id}`
      );

      setError("");

      try {
        const pdfData = {
          bookingNumber:
            booking.bookingNumber,

          bookingType:
            booking.bookingType,

          bookingDate:
            booking.bookingDate,

          journeyDate:
            booking.journeyDate,

          pickupTime:
            booking.pickupTime,

          customerName:
            booking.customerName,

          customerMobile:
            booking.customerMobile,

          pickupLocation:
            booking.pickupLocation,

          dropLocation:
            booking.dropLocation,

          vehicles:
            booking.vehicles,

          totalVehicles:
            booking.totalVehicles,

          totalAmount:
            booking.totalAmount,

          advanceAmount:
            booking.advanceAmount,

          balanceAmount:
            booking.balanceAmount,

          status:
            booking.status,

          remarks:
            booking.remarks,
        };

        /*
         * Advance booking PDF generator is
         * expected to handle its own download.
         */

        await downloadAdvanceBookingPdf(
          pdfData
        );

      } catch (error: any) {
        console.error(
          "Advance booking PDF error:",
          error
        );

        setError(
          error?.message ||
            "Unable to download booking PDF."
        );
      } finally {
        setDownloadingId(null);
      }
    };

  /* ==============================================================
     WHATSAPP
  ============================================================== */

  const openWhatsApp = () => {
    const message =
      "Hello Khatu Rides, I need help with my travel invoice / booking document.";

    window.open(
      `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
        message
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* ==============================================================
     AUTH LOADING
  ============================================================== */

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F7FB]">
        <div className="flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#071B33] shadow-xl">
            <Loader2 className="h-7 w-7 animate-spin text-amber-400" />
          </div>

          <p className="mt-5 text-sm font-black text-slate-700">
            Loading customer portal...
          </p>

          <p className="mt-1 text-xs font-medium text-slate-400">
            Please wait
          </p>
        </div>
      </main>
    );
  }

  /* ==============================================================
     LOGIN SCREEN
  ============================================================== */

  if (!currentUser) {
    return (
      <main className="min-h-screen bg-[#F4F7FB] px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-40px)] max-w-[1050px] items-center justify-center">
          <div className="grid w-full overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_30px_100px_rgba(7,27,51,0.13)] lg:grid-cols-[44%_56%]">

            {/* ==================================================
                LEFT PANEL
            ================================================== */}

            <section className="relative hidden overflow-hidden bg-gradient-to-br from-[#061936] via-[#0A2D68] to-[#063B8F] p-10 text-white lg:block">

              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />

              <div className="pointer-events-none absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-amber-400/15 blur-3xl" />

              <div className="relative z-10 flex h-full flex-col">

                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white p-2 shadow-lg">
                  <img
                    src="/logo.png"
                    alt="Khatu Rides Travels Co."
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="mt-8">
                  <div className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-400">
                    Customer Portal
                  </div>

                  <h1 className="mt-5 max-w-[380px] text-[3.1rem] font-black leading-[1.02] tracking-[-0.04em]">
                    Your travel documents,
                    <br />
                    always with you.
                  </h1>

                  <p className="mt-6 max-w-[380px] text-sm font-medium leading-6 text-blue-100/75">
                    Securely access your Khatu Rides
                    travel invoices and advance booking
                    documents using your registered
                    mobile number.
                  </p>
                </div>

                <div className="mt-auto space-y-3 pt-10">

                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300">
                      <ShieldCheck className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-xs font-black">
                        Mobile OTP Verification
                      </p>

                      <p className="mt-0.5 text-[10px] font-medium text-white/50">
                        Secure customer access
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300">
                      <Download className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-xs font-black">
                        Download PDF Documents
                      </p>

                      <p className="mt-0.5 text-[10px] font-medium text-white/50">
                        Invoices and advance bookings
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-400/15 text-blue-200">
                      <FileText className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-xs font-black">
                        View Your Travel History
                      </p>

                      <p className="mt-0.5 text-[10px] font-medium text-white/50">
                        Previous travel documents
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* ==================================================
                RIGHT PANEL
            ================================================== */}

            <section className="relative p-5 sm:p-8 lg:p-11">

              <div className="mx-auto max-w-[500px]">

                {/* MOBILE LOGO */}

                <div className="flex items-center justify-between lg:hidden">
                  <img
                    src="/logo.png"
                    alt="Khatu Rides Travels Co."
                    className="h-12 w-auto object-contain"
                  />

                  <a
                    href={`tel:${PHONE}`}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500 text-white shadow-lg"
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                </div>

                {/* HEADING */}

                <div className="mt-7 lg:mt-2">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#1749D1]">
                    <Phone className="h-5 w-5" />
                  </div>

                  <div className="mt-5 text-[10px] font-black uppercase tracking-[0.16em] text-[#1749D1]">
                    My Travel Documents
                  </div>

                  <h2 className="mt-2 text-[2.25rem] font-black leading-[1.03] tracking-[-0.045em] text-[#050B18] sm:text-5xl">
                    {otpStep
                      ? "Verify your mobile"
                      : "Find your invoices"}
                  </h2>

                  <p className="mt-4 max-w-[450px] text-sm font-medium leading-6 text-slate-500">
                    {otpStep
                      ? `Enter the 6-digit OTP sent to +91 ${normalizeMobile(
                          phone
                        )}.`
                      : "Enter the mobile number registered with your Khatu Rides booking."}
                  </p>

                </div>

                {/* ERROR */}

                {error && (
                  <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-700">

                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                    <p className="text-xs font-bold leading-5">
                      {error}
                    </p>

                  </div>
                )}

                {/* INFO */}

                {infoMessage && !error && (
                  <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-700">

                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />

                    <p className="text-xs font-bold leading-5">
                      {infoMessage}
                    </p>

                  </div>
                )}

                {/* =================================================
                    PHONE STEP
                ================================================= */}

                {!otpStep ? (
                  <div className="mt-7">

                    <label className="mb-2 block text-[9px] font-black uppercase tracking-[0.13em] text-slate-500">
                      Registered Mobile Number
                    </label>

                    <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition focus-within:border-[#1749D1] focus-within:ring-4 focus-within:ring-blue-50">

                      <div className="flex items-center gap-2 border-r border-slate-200 bg-slate-50 px-4">
                        <span className="text-[10px] font-black text-slate-500">
                          IN
                        </span>

                        <span className="text-sm font-black text-slate-700">
                          +91
                        </span>
                      </div>

                      <input
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) =>
                          setPhone(
                            e.target.value
                              .replace(
                                /\D/g,
                                ""
                              )
                              .slice(
                                0,
                                10
                              )
                          )
                        }
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter"
                          ) {
                            sendOtp();
                          }
                        }}
                        placeholder="Enter 10-digit mobile"
                        className="min-w-0 flex-1 bg-transparent px-4 py-4 text-base font-black text-slate-900 outline-none placeholder:text-slate-300"
                      />

                    </div>

                    {/* RECAPTCHA */}

                    <div className="mt-5">

                      <div
                        id="recaptcha-container"
                        className="flex min-h-[78px] justify-center overflow-hidden rounded-xl"
                      />

                    </div>

                    <button
                      type="button"
                      onClick={sendOtp}
                      disabled={
                        otpLoading
                      }
                      className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#071B33] px-5 text-sm font-black text-white shadow-[0_15px_35px_rgba(7,27,51,0.20)] transition hover:-translate-y-0.5 hover:bg-[#063B8F] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {otpLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending OTP...
                        </>
                      ) : (
                        <>
                          Send OTP
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>

                    <p className="mt-5 text-center text-[9px] font-medium leading-4 text-slate-400">
                      By continuing, you verify that
                      this mobile number belongs to you
                      and is associated with your Khatu
                      Rides booking.
                    </p>

                  </div>
                ) : (

                  /* =================================================
                     OTP STEP
                  ================================================= */

                  <div className="mt-7">

                    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#1749D1] shadow-sm">
                          <Phone className="h-4 w-4" />
                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="text-[9px] font-black uppercase tracking-wider text-[#1749D1]">
                            OTP sent to
                          </p>

                          <p className="mt-1 text-sm font-black text-slate-800">
                            +91{" "}
                            {normalizeMobile(
                              phone
                            )}
                          </p>

                        </div>

                        <button
                          type="button"
                          onClick={
                            changeMobile
                          }
                          className="text-[9px] font-black uppercase tracking-wider text-[#1749D1] hover:underline"
                        >
                          Change
                        </button>

                      </div>

                    </div>

                    <label className="mt-6 mb-2 block text-[9px] font-black uppercase tracking-[0.13em] text-slate-500">
                      Enter OTP
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      value={otp}
                      onChange={(e) =>
                        setOtp(
                          e.target.value
                            .replace(
                              /\D/g,
                              ""
                            )
                            .slice(
                              0,
                              6
                            )
                        )
                      }
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter"
                        ) {
                          verifyOtp();
                        }
                      }}
                      placeholder="••••••"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-5 text-center text-2xl font-black tracking-[0.55em] text-slate-900 outline-none transition focus:border-[#1749D1] focus:ring-4 focus:ring-blue-50"
                    />

                    <button
                      type="button"
                      onClick={
                        verifyOtp
                      }
                      disabled={
                        otpVerifying
                      }
                      className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#071B33] px-5 text-sm font-black text-white shadow-[0_15px_35px_rgba(7,27,51,0.20)] transition hover:-translate-y-0.5 hover:bg-[#063B8F] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {otpVerifying ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          Verify & Continue
                          <CheckCircle2 className="h-4 w-4" />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={
                        changeMobile
                      }
                      className="mt-4 flex w-full items-center justify-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-500 hover:text-[#1749D1]"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      Back to mobile number
                    </button>

                  </div>
                )}

                {/* SUPPORT */}

                <div className="mt-8 border-t border-slate-100 pt-6">

                  <p className="text-center text-[9px] font-bold text-slate-400">
                    Need help finding your document?
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-2">

                    <a
                      href={`tel:${PHONE}`}
                      className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-50 text-[9px] font-black uppercase tracking-wider text-red-600 transition hover:bg-red-500 hover:text-white"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      Call Support
                    </a>

                    <button
                      type="button"
                      onClick={
                        openWhatsApp
                      }
                      className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-50 text-[9px] font-black uppercase tracking-wider text-emerald-600 transition hover:bg-emerald-500 hover:text-white"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      WhatsApp
                    </button>

                  </div>

                </div>

              </div>

            </section>

          </div>
        </div>
      </main>
    );
  }

  /* ================================================================
     CUSTOMER DASHBOARD
  ================================================================ */

  return (
    <main className="min-h-screen bg-[#F4F7FB] text-slate-900">

      {/* ==========================================================
          HEADER
      ========================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl">

        <div className="mx-auto flex min-h-[68px] max-w-[1250px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">

          <a
            href="/"
            className="flex shrink-0 items-center"
          >
            <img
              src="/logo.png"
              alt="Khatu Rides Travels Co."
              className="h-10 w-auto object-contain sm:h-12"
            />
          </a>

          <div className="flex items-center gap-2">

            <div className="hidden items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 sm:flex">

              <CheckCircle2 className="h-4 w-4 text-emerald-600" />

              <div>
                <p className="text-[8px] font-black uppercase tracking-wider text-emerald-700">
                  Mobile Verified
                </p>

                <p className="text-[8px] font-bold text-emerald-600/70">
                  +91{" "}
                  {normalizeMobile(
                    currentUser.phoneNumber ||
                      phone
                  )}
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={
                refreshDocuments
              }
              disabled={
                documentsLoading
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  documentsLoading
                    ? "animate-spin"
                    : ""
                }`}
              />
            </button>

            <button
              type="button"
              onClick={logout}
              className="flex h-10 items-center gap-2 rounded-xl bg-slate-100 px-3 text-[9px] font-black uppercase tracking-wider text-slate-600 transition hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:block">
                Logout
              </span>
            </button>

          </div>

        </div>

      </header>

      {/* ==========================================================
          MAIN
      ========================================================== */}

      <div className="mx-auto max-w-[1250px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        {/* ========================================================
            WELCOME
        ======================================================== */}

        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#061936] via-[#0A2D68] to-[#063B8F] p-5 text-white shadow-[0_20px_60px_rgba(6,59,143,0.18)] sm:p-7 lg:p-9">

          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between gap-7 lg:flex-row lg:items-end">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.15em] text-blue-100 backdrop-blur">
                <ShieldCheck className="h-3 w-3 text-emerald-300" />
                Secure Customer Portal
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                My Travel Documents
              </h1>

              <p className="mt-3 max-w-2xl text-xs font-medium leading-5 text-blue-100/70 sm:text-sm">
                View and download your Khatu Rides
                invoices and advance booking
                documents in one place.
              </p>

              <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-white/60">
                <Phone className="h-3.5 w-3.5 text-amber-300" />

                +91{" "}
                {normalizeMobile(
                  currentUser.phoneNumber ||
                    phone
                )}

                <span className="text-white/20">
                  •
                </span>

                <span className="text-emerald-300">
                  Verified
                </span>
              </div>

            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">

              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur sm:min-w-[100px] sm:p-4">

                <div className="text-xl font-black text-amber-400 sm:text-2xl">
                  {totalDocuments}
                </div>

                <p className="mt-1 text-[8px] font-black uppercase tracking-wider text-white/50">
                  Documents
                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur sm:min-w-[100px] sm:p-4">

                <div className="text-xl font-black text-amber-400 sm:text-2xl">
                  {invoices.length}
                </div>

                <p className="mt-1 text-[8px] font-black uppercase tracking-wider text-white/50">
                  Invoices
                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur sm:min-w-[100px] sm:p-4">

                <div className="text-xl font-black text-amber-400 sm:text-2xl">
                  {advanceBookings.length}
                </div>

                <p className="mt-1 text-[8px] font-black uppercase tracking-wider text-white/50">
                  Bookings
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* ========================================================
            ERROR
        ======================================================== */}

        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-700">

            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

            <div className="min-w-0 flex-1">

              <p className="text-xs font-black">
                Something went wrong
              </p>

              <p className="mt-1 text-[10px] font-medium leading-4">
                {error}
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
              className="text-red-400 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </button>

          </div>
        )}

        {/* ========================================================
            FILTER / SEARCH
        ======================================================== */}

        <section className="mt-6 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex gap-2 overflow-x-auto pb-1">

              <button
                type="button"
                onClick={() =>
                  setActiveTab("all")
                }
                className={`flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-4 text-[9px] font-black uppercase tracking-wider transition ${
                  activeTab === "all"
                    ? "bg-[#071B33] text-white shadow-md"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                All Documents
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveTab(
                    "invoice"
                  )
                }
                className={`flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-4 text-[9px] font-black uppercase tracking-wider transition ${
                  activeTab ===
                  "invoice"
                    ? "bg-[#071B33] text-white shadow-md"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                Invoices
                <span className="rounded-full bg-white/10 px-1.5 py-0.5">
                  {invoices.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveTab(
                    "advance"
                  )
                }
                className={`flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-4 text-[9px] font-black uppercase tracking-wider transition ${
                  activeTab ===
                  "advance"
                    ? "bg-[#071B33] text-white shadow-md"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                }`}
              >
                <Ticket className="h-3.5 w-3.5" />
                Advance Bookings
                <span className="rounded-full bg-white/10 px-1.5 py-0.5">
                  {advanceBookings.length}
                </span>
              </button>

            </div>

            <div className="relative w-full lg:max-w-[320px]">

              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search invoice, route, booking..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs font-bold text-slate-800 outline-none transition focus:border-[#1749D1] focus:bg-white focus:ring-4 focus:ring-blue-50"
              />

            </div>

          </div>

        </section>

        {/* ========================================================
            LOADING
        ======================================================== */}

        {documentsLoading ? (
          <div className="mt-6 flex min-h-[260px] items-center justify-center rounded-[24px] border border-slate-200 bg-white">

            <div className="flex flex-col items-center">

              <Loader2 className="h-8 w-8 animate-spin text-[#1749D1]" />

              <p className="mt-4 text-sm font-black text-slate-700">
                Loading your documents...
              </p>

              <p className="mt-1 text-[10px] font-medium text-slate-400">
                Please wait
              </p>

            </div>

          </div>
        ) : (

          <div className="mt-6 space-y-8">

            {/* ====================================================
                NORMAL INVOICES
            ==================================================== */}

            {(activeTab === "all" ||
              activeTab ===
                "invoice") && (
              <section>

                <div className="mb-4 flex items-end justify-between gap-3">

                  <div>
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.16em] text-[#1749D1]">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      Travel Invoices
                    </div>

                    <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                      Your Invoices
                    </h2>
                  </div>

                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                    {filteredInvoices.length}{" "}
                    found
                  </span>

                </div>

                {filteredInvoices.length >
                0 ? (
                  <div className="grid gap-4 lg:grid-cols-2">

                    {filteredInvoices.map(
                      (invoice) => {
                        const downloadId =
                          `invoice-${invoice.id}`;

                        return (
                          <article
                            key={
                              invoice.id
                            }
                            className="group overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_20px_50px_rgba(15,23,42,0.10)]"
                          >

                            <div className="border-b border-slate-100 p-5">

                              <div className="flex items-start justify-between gap-4">

                                <div className="flex min-w-0 items-center gap-3">

                                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1749D1]">
                                    <FileText className="h-5 w-5" />
                                  </div>

                                  <div className="min-w-0">

                                    <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                                      Invoice
                                    </p>

                                    <h3 className="mt-0.5 truncate text-sm font-black text-slate-900">
                                      {
                                        invoice.invoiceNumber
                                      }
                                    </h3>

                                  </div>

                                </div>

                                <div className="shrink-0 rounded-xl bg-emerald-50 px-3 py-2 text-right">

                                  <p className="text-[7px] font-black uppercase tracking-wider text-emerald-500">
                                    Amount
                                  </p>

                                  <p className="mt-0.5 text-sm font-black text-emerald-700">
                                    {formatCurrency(
                                      invoice.amount
                                    )}
                                  </p>

                                </div>

                              </div>

                              <div className="mt-5 grid grid-cols-2 gap-3">

                                <div className="rounded-xl bg-slate-50 p-3">

                                  <div className="flex items-center gap-2 text-slate-400">
                                    <CalendarDays className="h-3.5 w-3.5" />

                                    <span className="text-[8px] font-black uppercase tracking-wider">
                                      Invoice Date
                                    </span>
                                  </div>

                                  <p className="mt-1.5 text-xs font-black text-slate-700">
                                    {formatDate(
                                      invoice.invoiceDate
                                    )}
                                  </p>

                                </div>

                                <div className="rounded-xl bg-slate-50 p-3">

                                  <div className="flex items-center gap-2 text-slate-400">
                                    <Car className="h-3.5 w-3.5" />

                                    <span className="text-[8px] font-black uppercase tracking-wider">
                                      Vehicle
                                    </span>
                                  </div>

                                  <p className="mt-1.5 truncate text-xs font-black text-slate-700">
                                    {invoice.vehicleType ||
                                      "Cab"}
                                  </p>

                                </div>

                              </div>

                              <div className="mt-3 grid gap-2 sm:grid-cols-2">

                                <div className="flex min-w-0 items-start gap-2 rounded-xl border border-slate-100 bg-white p-3">

                                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1749D1]" />

                                  <div className="min-w-0">

                                    <p className="text-[7px] font-black uppercase tracking-wider text-slate-400">
                                      From
                                    </p>

                                    <p className="mt-1 truncate text-[10px] font-black text-slate-700">
                                      {invoice.pickupLocation ||
                                        "—"}
                                    </p>

                                  </div>

                                </div>

                                <div className="flex min-w-0 items-start gap-2 rounded-xl border border-slate-100 bg-white p-3">

                                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />

                                  <div className="min-w-0">

                                    <p className="text-[7px] font-black uppercase tracking-wider text-slate-400">
                                      To
                                    </p>

                                    <p className="mt-1 truncate text-[10px] font-black text-slate-700">
                                      {invoice.dropLocation ||
                                        "—"}
                                    </p>

                                  </div>

                                </div>

                              </div>

                            </div>

                            <div className="flex flex-col gap-2 bg-slate-50/70 p-4 sm:flex-row">

                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedDocument(
                                    {
                                      type: "invoice",
                                      data: invoice,
                                    }
                                  )
                                }
                                className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-white px-4 text-[9px] font-black uppercase tracking-wider text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100"
                              >
                                <FileText className="h-3.5 w-3.5" />
                                View Invoice
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  downloadInvoice(
                                    invoice
                                  )
                                }
                                disabled={
                                  !!downloadingId
                                }
                                className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#071B33] px-4 text-[9px] font-black uppercase tracking-wider text-white shadow-sm transition hover:bg-[#063B8F] disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {downloadingId ===
                                downloadId ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Download className="h-3.5 w-3.5" />
                                )}

                                {downloadingId ===
                                downloadId
                                  ? "Preparing..."
                                  : "Download PDF"}
                              </button>

                            </div>

                          </article>
                        );
                      }
                    )}

                  </div>
                ) : (
                  <EmptyState
                    icon={
                      <FileText className="h-6 w-6" />
                    }
                    title="No invoices found"
                    description={
                      search
                        ? "No invoice matches your search."
                        : "There are no travel invoices linked to this mobile number."
                    }
                  />
                )}

              </section>
            )}

            {/* ====================================================
                ADVANCE BOOKINGS
            ==================================================== */}

            {(activeTab === "all" ||
              activeTab ===
                "advance") && (
              <section>

                <div className="mb-4 flex items-end justify-between gap-3">

                  <div>
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.16em] text-amber-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      Advance & Pre Bookings
                    </div>

                    <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                      Your Bookings
                    </h2>
                  </div>

                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                    {filteredAdvanceBookings.length}{" "}
                    found
                  </span>

                </div>

                {filteredAdvanceBookings.length >
                0 ? (
                  <div className="grid gap-4 lg:grid-cols-2">

                    {filteredAdvanceBookings.map(
                      (booking) => {
                        const downloadId =
                          `advance-${booking.id}`;

                        return (
                          <article
                            key={
                              booking.id
                            }
                            className="group overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-[0_20px_50px_rgba(15,23,42,0.10)]"
                          >

                            <div className="border-b border-slate-100 p-5">

                              <div className="flex items-start justify-between gap-4">

                                <div className="flex min-w-0 items-center gap-3">

                                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                    <Ticket className="h-5 w-5" />
                                  </div>

                                  <div className="min-w-0">

                                    <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                                      {
                                        booking.bookingType
                                      }
                                    </p>

                                    <h3 className="mt-0.5 truncate text-sm font-black text-slate-900">
                                      {
                                        booking.bookingNumber
                                      }
                                    </h3>

                                  </div>

                                </div>

                                <span
                                  className={`shrink-0 rounded-full border px-3 py-1.5 text-[7px] font-black uppercase tracking-wider ${getStatusClass(
                                    booking.status
                                  )}`}
                                >
                                  {
                                    booking.status
                                  }
                                </span>

                              </div>

                              <div className="mt-5 grid grid-cols-2 gap-3">

                                <div className="rounded-xl bg-slate-50 p-3">

                                  <div className="flex items-center gap-2 text-slate-400">
                                    <CalendarDays className="h-3.5 w-3.5" />

                                    <span className="text-[8px] font-black uppercase tracking-wider">
                                      Journey
                                    </span>
                                  </div>

                                  <p className="mt-1.5 text-xs font-black text-slate-700">
                                    {formatDate(
                                      booking.journeyDate
                                    )}
                                  </p>

                                </div>

                                <div className="rounded-xl bg-slate-50 p-3">

                                  <div className="flex items-center gap-2 text-slate-400">
                                    <Clock3 className="h-3.5 w-3.5" />

                                    <span className="text-[8px] font-black uppercase tracking-wider">
                                      Pickup
                                    </span>
                                  </div>

                                  <p className="mt-1.5 text-xs font-black text-slate-700">
                                    {formatTime(
                                      booking.pickupTime
                                    )}
                                  </p>

                                </div>

                              </div>

                              <div className="mt-3 grid gap-2 sm:grid-cols-2">

                                <div className="flex min-w-0 items-start gap-2 rounded-xl border border-slate-100 bg-white p-3">

                                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1749D1]" />

                                  <div className="min-w-0">

                                    <p className="text-[7px] font-black uppercase tracking-wider text-slate-400">
                                      Pickup
                                    </p>

                                    <p className="mt-1 truncate text-[10px] font-black text-slate-700">
                                      {booking.pickupLocation ||
                                        "—"}
                                    </p>

                                  </div>

                                </div>

                                <div className="flex min-w-0 items-start gap-2 rounded-xl border border-slate-100 bg-white p-3">

                                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />

                                  <div className="min-w-0">

                                    <p className="text-[7px] font-black uppercase tracking-wider text-slate-400">
                                      Destination
                                    </p>

                                    <p className="mt-1 truncate text-[10px] font-black text-slate-700">
                                      {booking.dropLocation ||
                                        "—"}
                                    </p>

                                  </div>

                                </div>

                              </div>

                              <div className="mt-3 grid grid-cols-3 gap-2">

                                <div className="rounded-xl border border-slate-100 bg-white p-3">

                                  <p className="text-[7px] font-black uppercase tracking-wider text-slate-400">
                                    Vehicles
                                  </p>

                                  <p className="mt-1 text-sm font-black text-slate-800">
                                    {
                                      booking.totalVehicles
                                    }
                                  </p>

                                </div>

                                <div className="rounded-xl border border-slate-100 bg-white p-3">

                                  <p className="text-[7px] font-black uppercase tracking-wider text-slate-400">
                                    Advance
                                  </p>

                                  <p className="mt-1 text-xs font-black text-emerald-600">
                                    {formatCurrency(
                                      booking.advanceAmount
                                    )}
                                  </p>

                                </div>

                                <div className="rounded-xl border border-slate-100 bg-white p-3">

                                  <p className="text-[7px] font-black uppercase tracking-wider text-slate-400">
                                    Balance
                                  </p>

                                  <p className="mt-1 text-xs font-black text-amber-600">
                                    {formatCurrency(
                                      booking.balanceAmount
                                    )}
                                  </p>

                                </div>

                              </div>

                              <div className="mt-3 flex items-center justify-between rounded-xl bg-[#071B33] px-4 py-3 text-white">

                                <span className="text-[8px] font-black uppercase tracking-wider text-white/50">
                                  Total Booking Amount
                                </span>

                                <span className="text-sm font-black text-amber-400">
                                  {formatCurrency(
                                    booking.totalAmount
                                  )}
                                </span>

                              </div>

                            </div>

                            <div className="flex flex-col gap-2 bg-slate-50/70 p-4 sm:flex-row">

                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedDocument(
                                    {
                                      type: "advance",
                                      data: booking,
                                    }
                                  )
                                }
                                className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-white px-4 text-[9px] font-black uppercase tracking-wider text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100"
                              >
                                <FileText className="h-3.5 w-3.5" />
                                View Booking
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  downloadAdvanceBooking(
                                    booking
                                  )
                                }
                                disabled={
                                  !!downloadingId
                                }
                                className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#071B33] px-4 text-[9px] font-black uppercase tracking-wider text-white shadow-sm transition hover:bg-[#063B8F] disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {downloadingId ===
                                downloadId ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Download className="h-3.5 w-3.5" />
                                )}

                                {downloadingId ===
                                downloadId
                                  ? "Preparing..."
                                  : "Download PDF"}
                              </button>

                            </div>

                          </article>
                        );
                      }
                    )}

                  </div>
                ) : (
                  <EmptyState
                    icon={
                      <Ticket className="h-6 w-6" />
                    }
                    title="No advance bookings found"
                    description={
                      search
                        ? "No booking matches your search."
                        : "There are no advance bookings linked to this mobile number."
                    }
                  />
                )}

              </section>
            )}

            {/* ====================================================
                NOTHING AT ALL
            ==================================================== */}

            {totalDocuments ===
              0 &&
              !search && (
                <section className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <FileText className="h-7 w-7" />
                  </div>

                  <h2 className="mt-5 text-xl font-black text-slate-900">
                    No travel documents found
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-xs font-medium leading-5 text-slate-500">
                    We couldn't find any invoice or
                    advance booking associated with
                    this mobile number.
                  </p>

                  <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">

                    <a
                      href={`tel:${PHONE}`}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#071B33] px-5 text-[9px] font-black uppercase tracking-wider text-white"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      Call Support
                    </a>

                    <button
                      type="button"
                      onClick={
                        openWhatsApp
                      }
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 text-[9px] font-black uppercase tracking-wider text-white"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      WhatsApp
                    </button>

                  </div>

                </section>
              )}

          </div>
        )}

        {/* ========================================================
            FOOTER SUPPORT
        ======================================================== */}

        <section className="mt-8 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-black text-slate-800">
                  Need help with your document?
                </p>

                <p className="mt-0.5 text-[9px] font-medium text-slate-400">
                  Our booking team is available for assistance.
                </p>
              </div>

            </div>

            <div className="grid grid-cols-2 gap-2">

              <a
                href={`tel:${PHONE}`}
                className="flex min-h-10 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 text-[8px] font-black uppercase tracking-wider text-white shadow-sm transition hover:bg-red-600"
              >
                <Phone className="h-3.5 w-3.5" />
                Call
              </a>

              <button
                type="button"
                onClick={
                  openWhatsApp
                }
                className="flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#18C964] px-4 text-[8px] font-black uppercase tracking-wider text-white shadow-sm transition hover:bg-[#12B457]"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </button>

            </div>

          </div>

        </section>

        <footer className="py-8 text-center">

          <p className="text-[9px] font-medium text-slate-400">
            © {new Date().getFullYear()} Khatu Rides
            Travels Co. · Safe Journey · Blessed
            Destinations
          </p>

        </footer>

      </div>

      {/* ==========================================================
          DOCUMENT VIEW MODAL
      ========================================================== */}

      {selectedDocument && (
        <DocumentModal
          document={selectedDocument}
          onClose={() =>
            setSelectedDocument(
              null
            )
          }
          onDownload={() => {
            if (
              selectedDocument.type ===
              "invoice"
            ) {
              downloadInvoice(
                selectedDocument.data
              );
            } else {
              downloadAdvanceBooking(
                selectedDocument.data
              );
            }
          }}
          downloading={
            !!downloadingId
          }
        />
      )}

      {/* ==========================================================
          MOBILE FLOATING SUPPORT
      ========================================================== */}

      <div className="fixed bottom-4 right-4 z-[80] flex gap-2 lg:hidden">

        <a
          href={`tel:${PHONE}`}
          aria-label="Call Khatu Rides"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-[0_12px_30px_rgba(239,68,68,0.35)]"
        >
          <Phone className="h-5 w-5" />
        </a>

        <button
          type="button"
          onClick={
            openWhatsApp
          }
          aria-label="WhatsApp Khatu Rides"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#18C964] text-white shadow-[0_12px_30px_rgba(24,201,100,0.35)]"
        >
          <MessageCircle className="h-5 w-5" />
        </button>

      </div>

    </main>
  );
}

/* ================================================================
   EMPTY STATE
================================================================ */

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-8 text-center shadow-sm">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        {icon}
      </div>

      <h3 className="mt-4 text-base font-black text-slate-800">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-[10px] font-medium leading-5 text-slate-400">
        {description}
      </p>

    </div>
  );
}

/* ================================================================
   DOCUMENT MODAL
================================================================ */

function DocumentModal({
  document,
  onClose,
  onDownload,
  downloading,
}: {
  document: SelectedDocument;
  onClose: () => void;
  onDownload: () => void;
  downloading: boolean;
}) {
  const isInvoice =
    document.type ===
    "invoice";

  const invoice = isInvoice
    ? document.data
    : null;

  const booking =
    !isInvoice
      ? document.data
      : null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-[#020817]/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (
          e.target ===
          e.currentTarget
        ) {
          onClose();
        }
      }}
    >

      <div className="max-h-[92vh] w-full max-w-[700px] overflow-hidden rounded-t-[28px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.25)] sm:rounded-[28px]">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">

          <div className="flex items-center gap-3">

            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                isInvoice
                  ? "bg-blue-50 text-[#1749D1]"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              {isInvoice ? (
                <FileText className="h-5 w-5" />
              ) : (
                <Ticket className="h-5 w-5" />
              )}
            </div>

            <div>

              <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                {isInvoice
                  ? "Travel Invoice"
                  : "Advance Booking"}
              </p>

              <h2 className="text-sm font-black text-slate-900">
                {isInvoice
                  ? invoice?.invoiceNumber
                  : booking?.bookingNumber}
              </h2>

            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </button>

        </div>

        {/* CONTENT */}

        <div className="max-h-[calc(92vh-145px)] overflow-y-auto p-5 sm:p-6">

          {isInvoice &&
            invoice && (
              <div className="space-y-4">

                {/* CUSTOMER */}

                <DetailBlock
                  title="Customer"
                  icon={
                    <User className="h-4 w-4" />
                  }
                >

                  <DetailRow
                    label="Name"
                    value={
                      invoice.customerName ||
                      "—"
                    }
                  />

                  <DetailRow
                    label="Mobile"
                    value={
                      invoice.customerMobile ||
                      "—"
                    }
                  />

                </DetailBlock>

                {/* JOURNEY */}

                <DetailBlock
                  title="Journey"
                  icon={
                    <MapPin className="h-4 w-4" />
                  }
                >

                  <DetailRow
                    label="Pickup"
                    value={
                      invoice.pickupLocation ||
                      "—"
                    }
                  />

                  <DetailRow
                    label="Drop"
                    value={
                      invoice.dropLocation ||
                      "—"
                    }
                  />

                  <DetailRow
                    label="Pickup Time"
                    value={
                      formatTime(
                        invoice.pickupTime
                      )
                    }
                  />

                  <DetailRow
                    label="Drop Time"
                    value={
                      formatTime(
                        invoice.dropTime
                      )
                    }
                  />

                </DetailBlock>

                {/* VEHICLE */}

                <DetailBlock
                  title="Vehicle"
                  icon={
                    <Car className="h-4 w-4" />
                  }
                >

                  <DetailRow
                    label="Vehicle Type"
                    value={
                      invoice.vehicleType ||
                      "—"
                    }
                  />

                  <DetailRow
                    label="Vehicle Number"
                    value={
                      invoice.vehicleNumber ||
                      "—"
                    }
                  />

                </DetailBlock>

                {/* AMOUNT */}

                <div className="rounded-2xl bg-[#071B33] p-5 text-white">

                  <div className="flex items-center justify-between">

                    <span className="text-[9px] font-black uppercase tracking-wider text-white/50">
                      Invoice Amount
                    </span>

                    <IndianRupee className="h-4 w-4 text-amber-400" />

                  </div>

                  <p className="mt-2 text-3xl font-black text-amber-400">
                    {formatCurrency(
                      invoice.amount
                    )}
                  </p>

                </div>

                {/* REMARKS */}

                {invoice.remarks && (
                  <DetailBlock
                    title="Remarks"
                    icon={
                      <FileText className="h-4 w-4" />
                    }
                  >
                    <p className="text-xs font-medium leading-5 text-slate-600">
                      {invoice.remarks}
                    </p>
                  </DetailBlock>
                )}

              </div>
            )}

          {!isInvoice &&
            booking && (
              <div className="space-y-4">

                {/* BOOKING INFO */}

                <DetailBlock
                  title="Booking Details"
                  icon={
                    <Ticket className="h-4 w-4" />
                  }
                >

                  <DetailRow
                    label="Booking Number"
                    value={
                      booking.bookingNumber
                    }
                  />

                  <DetailRow
                    label="Booking Type"
                    value={
                      booking.bookingType
                    }
                  />

                  <DetailRow
                    label="Status"
                    value={
                      booking.status
                    }
                  />

                  <DetailRow
                    label="Booking Date"
                    value={
                      formatDateLong(
                        booking.bookingDate
                      )
                    }
                  />

                </DetailBlock>

                {/* CUSTOMER */}

                <DetailBlock
                  title="Customer"
                  icon={
                    <User className="h-4 w-4" />
                  }
                >

                  <DetailRow
                    label="Name"
                    value={
                      booking.customerName ||
                      "—"
                    }
                  />

                  <DetailRow
                    label="Mobile"
                    value={
                      booking.customerMobile ||
                      "—"
                    }
                  />

                </DetailBlock>

                {/* JOURNEY */}

                <DetailBlock
                  title="Journey"
                  icon={
                    <MapPin className="h-4 w-4" />
                  }
                >

                  <DetailRow
                    label="Journey Date"
                    value={
                      formatDateLong(
                        booking.journeyDate
                      )
                    }
                  />

                  <DetailRow
                    label="Pickup Time"
                    value={
                      formatTime(
                        booking.pickupTime
                      )
                    }
                  />

                  <DetailRow
                    label="Pickup"
                    value={
                      booking.pickupLocation ||
                      "—"
                    }
                  />

                  <DetailRow
                    label="Destination"
                    value={
                      booking.dropLocation ||
                      "—"
                    }
                  />

                </DetailBlock>

                {/* VEHICLES */}

                <DetailBlock
                  title="Vehicles"
                  icon={
                    <Car className="h-4 w-4" />
                  }
                >

                  <div className="space-y-2">

                    {booking.vehicles
                      .length > 0 ? (
                      booking.vehicles.map(
                        (
                          vehicle,
                          index
                        ) => (
                          <div
                            key={`${vehicle.vehicleType}-${index}`}
                            className="rounded-xl bg-slate-50 p-3"
                          >

                            <div className="flex items-center justify-between gap-3">

                              <div className="min-w-0">

                                <p className="text-xs font-black text-slate-800">
                                  {vehicle.vehicleType ||
                                    "Vehicle"}
                                </p>

                                {vehicle.variant && (
                                  <p className="mt-0.5 text-[9px] font-medium text-slate-400">
                                    {
                                      vehicle.variant
                                    }
                                  </p>
                                )}

                              </div>

                              <div className="text-right">

                                <p className="text-xs font-black text-slate-800">
                                  ×
                                  {Number(
                                    vehicle.quantity ||
                                      0
                                  )}
                                </p>

                                <p className="mt-0.5 text-[9px] font-bold text-slate-400">
                                  {formatCurrency(
                                    Number(
                                      vehicle.total ||
                                        0
                                    )
                                  )}
                                </p>

                              </div>

                            </div>

                          </div>
                        )
                      )
                    ) : (
                      <p className="text-xs text-slate-400">
                        No vehicle details available.
                      </p>
                    )}

                  </div>

                </DetailBlock>

                {/* PAYMENT */}

                <div className="overflow-hidden rounded-2xl bg-[#071B33] text-white">

                  <div className="p-5">

                    <div className="flex items-center justify-between">

                      <span className="text-[9px] font-black uppercase tracking-wider text-white/50">
                        Total Amount
                      </span>

                      <span className="text-lg font-black text-amber-400">
                        {formatCurrency(
                          booking.totalAmount
                        )}
                      </span>

                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">

                      <div className="rounded-xl bg-white/5 p-3">

                        <p className="text-[7px] font-black uppercase tracking-wider text-white/40">
                          Advance Paid
                        </p>

                        <p className="mt-1 text-sm font-black text-emerald-300">
                          {formatCurrency(
                            booking.advanceAmount
                          )}
                        </p>

                      </div>

                      <div className="rounded-xl bg-white/5 p-3">

                        <p className="text-[7px] font-black uppercase tracking-wider text-white/40">
                          Balance
                        </p>

                        <p className="mt-1 text-sm font-black text-amber-300">
                          {formatCurrency(
                            booking.balanceAmount
                          )}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

                {booking.remarks && (
                  <DetailBlock
                    title="Remarks"
                    icon={
                      <FileText className="h-4 w-4" />
                    }
                  >
                    <p className="text-xs font-medium leading-5 text-slate-600">
                      {booking.remarks}
                    </p>
                  </DetailBlock>
                )}

              </div>
            )}

        </div>

        {/* FOOTER */}

        <div className="border-t border-slate-100 bg-slate-50 p-4 sm:p-5">

          <div className="flex gap-2">

            <button
              type="button"
              onClick={onClose}
              className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-white px-4 text-[9px] font-black uppercase tracking-wider text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-100"
            >
              Close
            </button>

            <button
              type="button"
              onClick={onDownload}
              disabled={downloading}
              className="flex min-h-12 flex-[1.5] items-center justify-center gap-2 rounded-xl bg-[#071B33] px-4 text-[9px] font-black uppercase tracking-wider text-white shadow-sm transition hover:bg-[#063B8F] disabled:cursor-not-allowed disabled:opacity-60"
            >

              {downloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}

              {downloading
                ? "Preparing PDF..."
                : "Download PDF"}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

/* ================================================================
   DETAIL BLOCK
================================================================ */

function DetailBlock({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">

      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">

        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          {icon}
        </span>

        <h3 className="text-[9px] font-black uppercase tracking-[0.13em] text-slate-500">
          {title}
        </h3>

      </div>

      <div className="mt-3 space-y-3">
        {children}
      </div>

    </div>
  );
}

/* ================================================================
   DETAIL ROW
================================================================ */

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">

      <span className="shrink-0 text-[9px] font-bold text-slate-400">
        {label}
      </span>

      <span className="text-right text-[10px] font-black text-slate-700">
        {value}
      </span>

    </div>
  );
}