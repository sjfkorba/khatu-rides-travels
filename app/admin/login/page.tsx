"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CarFront,
  CheckCircle2,
  Eye,
  EyeOff,
  Fingerprint,
  Gauge,
  Headset,
  LockKeyhole,
  Mail,
  MapPinned,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Zap,
  Loader2,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email address and password.");
      return;
    }

    setLoading(true);

    try {
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      const { auth } = await import("@/lib/firebase");

      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/admin");
    } catch (err: unknown) {
      console.error("ADMIN LOGIN ERROR:", err);

      const errorCode =
        typeof err === "object" && err !== null && "code" in err
          ? String((err as { code?: unknown }).code)
          : "";

      const messages: Record<string, string> = {
        "auth/invalid-credential": "Email ya password sahi nahi hai. Dobara check karein.",
        "auth/user-not-found": "Is email se koi admin account nahi mila.",
        "auth/wrong-password": "Password galat hai. Dobara try karein.",
        "auth/invalid-email": "Valid email address enter karein.",
        "auth/too-many-requests": "Bahut attempts ho chuke hain. Thodi der baad try karein.",
        "auth/network-request-failed": "Network connection check karke dobara try karein.",
        "auth/user-disabled": "Yeh account disabled hai. Administrator se contact karein.",
      };

      setError(
        messages[errorCode] ||
          "Login nahi ho paya. Credentials aur internet connection check karein."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#f5f7fb] px-4 py-6 text-slate-900 sm:px-6 lg:px-10 lg:py-10">
      {/* Soft background accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-36 h-96 w-96 rounded-full bg-orange-200/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-blue-200/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80 lg:block"
      />

      <div className="relative mx-auto flex min-h-[calc(100svh-3rem)] w-full max-w-7xl items-center justify-center lg:min-h-[calc(100svh-5rem)]">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-[0_28px_90px_-35px_rgba(15,23,42,0.28)] backdrop-blur-xl lg:min-h-[690px] lg:grid-cols-[1.02fr_0.98fr]">
          {/* Brand / product panel */}
          <section className="relative hidden flex-col justify-between overflow-hidden bg-[#111827] p-10 text-white lg:flex xl:p-14">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(249,115,22,0.32),transparent_34%),radial-gradient(circle_at_90%_85%,rgba(59,130,246,0.22),transparent_35%)]"
            />
            <div
              aria-hidden="true"
              className="absolute -right-28 top-24 h-80 w-80 rounded-full border border-white/10"
            />
            <div
              aria-hidden="true"
              className="absolute -right-16 top-36 h-56 w-56 rounded-full border border-white/10"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-orange-500/10 blur-2xl"
            />

            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-950/40 ring-1 ring-white/20">
                  <CarFront size={25} strokeWidth={2.4} />
                </div>
                <div>
                  <p className="text-lg font-extrabold tracking-tight">Khatu Rides</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-orange-300">
                    Travels Co. · Control Center
                  </p>
                </div>
              </div>

              <div className="mt-20 max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/20 bg-orange-400/10 px-3 py-1.5 text-xs font-semibold text-orange-200">
                  <Sparkles size={14} />
                  Your business, in control
                </div>
                <h1 className="mt-6 text-5xl font-black leading-[1.08] tracking-tight xl:text-[3.6rem]">
                  Every ride.
                  <br />
                  Every lead.
                  <br />
                  <span className="bg-gradient-to-r from-orange-300 to-amber-100 bg-clip-text text-transparent">
                    One command center.
                  </span>
                </h1>
                <p className="mt-6 max-w-md text-base leading-8 text-slate-300">
                  Manage bookings, customers, partners and daily operations
                  through one simple workspace built for your travel business.
                </p>
              </div>
            </div>

            <div className="relative z-10">
              <div className="grid grid-cols-3 gap-3">
                <FeatureTile icon={<Gauge size={18} />} title="Live overview" detail="Business activity" />
                <FeatureTile icon={<UsersRound size={18} />} title="Lead control" detail="Customer follow-up" />
                <FeatureTile icon={<MapPinned size={18} />} title="Trip operations" detail="Booking workflow" />
              </div>
              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5 text-xs text-slate-400">
                <span>© {new Date().getFullYear()} Khatu Rides Travels Co.</span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                  Admin workspace
                </span>
              </div>
            </div>
          </section>

          {/* Login panel */}
          <section className="flex items-center justify-center px-5 py-8 sm:px-10 sm:py-12 lg:px-12 xl:px-16">
            <div className="w-full max-w-md">
              {/* Mobile brand header */}
              <div className="mb-10 flex items-center gap-3 lg:hidden">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-200">
                  <CarFront size={25} strokeWidth={2.4} />
                </div>
                <div>
                  <p className="text-lg font-extrabold tracking-tight">Khatu Rides</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-600">
                    Travels Co. · Admin
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 ring-1 ring-orange-100">
                  <Fingerprint size={23} />
                </div>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-orange-600">
                  Secure access
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-[2.15rem]">
                  Welcome back
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Sign in to open your Khatu Rides admin workspace.
                </p>
              </div>

              <form
                className="space-y-5"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!loading) void login();
                }}
              >
                <div>
                  <label
                    htmlFor="admin-email"
                    className="mb-2 block text-xs font-bold text-slate-700"
                  >
                    Email address
                  </label>
                  <div className="group flex h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 transition focus-within:border-orange-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100">
                    <Mail
                      size={18}
                      className="shrink-0 text-slate-400 transition group-focus-within:text-orange-500"
                    />
                    <input
                      id="admin-email"
                      name="email"
                      type="email"
                      autoComplete="username"
                      inputMode="email"
                      required
                      disabled={loading}
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="h-full min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400 disabled:opacity-60"
                    />
                    {email.includes("@") && (
                      <CheckCircle2 size={17} className="text-emerald-500" />
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="admin-password"
                    className="mb-2 block text-xs font-bold text-slate-700"
                  >
                    Password
                  </label>
                  <div className="group flex h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 transition focus-within:border-orange-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100">
                    <LockKeyhole
                      size={18}
                      className="shrink-0 text-slate-400 transition group-focus-within:text-orange-500"
                    />
                    <input
                      id="admin-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      disabled={loading}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="h-full min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400 disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      disabled={loading}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-700"
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email.trim() || !password}
                  className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 text-sm font-extrabold text-white shadow-lg shadow-orange-200/80 transition hover:-translate-y-0.5 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl hover:shadow-orange-200/80 focus:outline-none focus:ring-4 focus:ring-orange-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Signing you in...
                    </>
                  ) : (
                    <>
                      Login to dashboard
                      <ArrowRight
                        size={18}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-7 flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                  <ShieldCheck size={19} />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-800">
                    Protected admin access
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Authorized Khatu Rides team members only. Never share your
                    login credentials with anyone.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-center gap-2 text-[11px] font-medium text-slate-400">
                <Headset size={13} />
                Need access? Contact your system administrator.
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-300 lg:hidden">
                <Zap size={12} className="text-orange-400" />
                Khatu Rides Control Center
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function FeatureTile({
  icon,
  title,
  detail,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-orange-400/15 text-orange-300">
        {icon}
      </div>
      <p className="text-xs font-bold text-white">{title}</p>
      <p className="mt-1 text-[10px] leading-4 text-slate-400">{detail}</p>
    </div>
  );
}
