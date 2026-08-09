"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomerLoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [needsPhoneModal, setNeedsPhoneModal] = useState(false);
  const [pendingUser, setPendingUser] = useState<any>(null);

  const [errorMessage, setErrorMessage] = useState("");

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const result = await signInWithPopup(auth, googleProvider);

      const user = result.user;

      /*
       * We intentionally don't create the customer document
       * directly from the browser.
       *
       * First-time customer profile + ₹1,101 welcome bonus
       * will be handled securely by our API.
       */

      setPendingUser(user);
      setNeedsPhoneModal(true);

    } catch (error: any) {
      console.error("Google login error:", error);

      setErrorMessage(
        error?.message || "Google login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  const handleSavePhoneAndProceed = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setErrorMessage("");

    const cleanPhone = phoneInput.replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!pendingUser) {
      setErrorMessage("Session expired. Please login again.");
      return;
    }

    try {
      setLoading(true);

      /*
       * Get Firebase ID token.
       * Server will verify this token before creating
       * customer profile or wallet bonus.
       */
      const idToken = await pendingUser.getIdToken();

      const response = await fetch("/api/customer/profile", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },

        body: JSON.stringify({
          phone: cleanPhone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to create customer profile."
        );
      }

      /*
       * Customer successfully created.
       * If this was a first-time customer,
       * API has already credited ₹1,101.
       */

      router.replace("/dashboard");

    } catch (error: any) {
      console.error("Customer profile error:", error);

      setErrorMessage(
        error?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-gradient-to-br
        from-slate-50
        via-white
        to-orange-50
        px-4
        py-6
        sm:flex
        sm:items-center
        sm:justify-center
        sm:px-6
      "
    >

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div
          className="
            absolute
            -right-32
            -top-32
            h-80
            w-80
            rounded-full
            bg-orange-200/40
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-40
            -left-32
            h-96
            w-96
            rounded-full
            bg-amber-200/30
            blur-3xl
          "
        />

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-64
            w-64
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-orange-100/40
            blur-3xl
          "
        />

      </div>


      {/* =====================================================
          MAIN LOGIN CONTAINER
      ===================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.45,
        }}
        className="
          relative
          z-10
          w-full
          max-w-5xl
          overflow-hidden
          rounded-[30px]
          border
          border-slate-200
          bg-white
          shadow-[0_25px_80px_rgba(15,23,42,0.12)]
        "
      >

        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">


          {/* =================================================
              LEFT BRAND PANEL
          ================================================= */}

          <div
            className="
              relative
              hidden
              overflow-hidden
              bg-gradient-to-br
              from-slate-950
              via-slate-900
              to-slate-800
              p-8
              lg:flex
              lg:min-h-[610px]
              lg:flex-col
              lg:justify-between
            "
          >

            {/* Decorative Glow */}

            <div
              className="
                absolute
                -right-20
                -top-20
                h-64
                w-64
                rounded-full
                bg-orange-600/20
                blur-3xl
              "
            />

            <div
              className="
                absolute
                -bottom-20
                -left-20
                h-64
                w-64
                rounded-full
                bg-amber-500/10
                blur-3xl
              "
            />


            {/* Brand */}

            <div className="relative">

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    bg-gradient-to-br
                    from-orange-500
                    to-orange-700
                    text-2xl
                    shadow-lg
                    shadow-orange-600/20
                  "
                >
                  🚕
                </div>

                <div>

                  <h1
                    className="
                      text-2xl
                      font-black
                      tracking-tight
                      text-white
                    "
                  >
                    Khatu<span className="text-orange-500">Rides</span>
                  </h1>

                  <p
                    className="
                      text-[8px]
                      font-black
                      uppercase
                      tracking-[0.28em]
                      text-slate-400
                    "
                  >
                    Travels Co.
                  </p>

                </div>

              </div>

            </div>


            {/* Main Message */}

            <div className="relative">

              <div
                className="
                  mb-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-orange-500/20
                  bg-orange-500/10
                  px-3
                  py-1.5
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.18em]
                  text-orange-400
                "
              >
                <span>✦</span>
                Your Journey Starts Here
              </div>


              <h2
                className="
                  max-w-sm
                  text-4xl
                  font-black
                  leading-[1.05]
                  tracking-tight
                  text-white
                "
              >
                Travel smarter.
                <br />
                <span className="text-orange-500">
                  Book easier.
                </span>
              </h2>


              <p
                className="
                  mt-4
                  max-w-sm
                  text-sm
                  font-medium
                  leading-relaxed
                  text-slate-400
                "
              >
                Manage your taxi bookings, access your wallet,
                receive trip updates and get faster support —
                all from one place.
              </p>


              {/* BENEFITS */}

              <div className="mt-7 space-y-3">

                {[
                  ["✓", "Fast & transparent cab booking"],
                  ["✓", "Verified drivers & vehicles"],
                  ["✓", "24×7 customer support"],
                  ["✓", "Exclusive wallet benefits"],
                ].map(([icon, text]) => (

                  <div
                    key={text}
                    className="flex items-center gap-3"
                  >

                    <span
                      className="
                        flex
                        h-7
                        w-7
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-white/10
                        text-xs
                        font-black
                        text-orange-400
                      "
                    >
                      {icon}
                    </span>

                    <span
                      className="
                        text-[11px]
                        font-bold
                        text-slate-300
                      "
                    >
                      {text}
                    </span>

                  </div>

                ))}

              </div>

            </div>


            {/* Bottom */}

            <div
              className="
                relative
                flex
                items-center
                justify-between
                border-t
                border-white/10
                pt-5
              "
            >

              <span
                className="
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.18em]
                  text-slate-500
                "
              >
                Chhattisgarh • MP
              </span>

              <span
                className="
                  flex
                  items-center
                  gap-1.5
                  text-[8px]
                  font-black
                  uppercase
                  tracking-wider
                  text-emerald-400
                "
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                24×7 Support
              </span>

            </div>

          </div>


          {/* =================================================
              RIGHT LOGIN PANEL
          ================================================= */}

          <div className="p-5 sm:p-8 lg:p-12">

            {/* MOBILE BRAND */}

            <div className="mb-7 text-center lg:hidden">

              <div
                className="
                  mx-auto
                  mb-3
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gradient-to-br
                  from-orange-500
                  to-orange-700
                  text-2xl
                  shadow-lg
                  shadow-orange-500/20
                "
              >
                🚕
              </div>

              <h1 className="text-2xl font-black tracking-tight text-slate-950">
                Khatu<span className="text-orange-600">Rides</span>
              </h1>

              <p
                className="
                  mt-1
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.25em]
                  text-slate-400
                "
              >
                Travels Co.
              </p>

            </div>


            <AnimatePresence mode="wait">

              {!needsPhoneModal ? (

                <motion.div
                  key="login"
                  initial={{
                    opacity: 0,
                    x: 15,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -15,
                  }}
                >

                  {/* Header */}

                  <div className="mb-7">

                    <div
                      className="
                        mb-3
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-orange-200
                        bg-orange-50
                        px-3
                        py-1.5
                        text-[8px]
                        font-black
                        uppercase
                        tracking-[0.18em]
                        text-orange-700
                      "
                    >
                      🔐 Secure Customer Login
                    </div>

                    <h2
                      className="
                        text-2xl
                        font-black
                        tracking-tight
                        text-slate-950
                        sm:text-3xl
                      "
                    >
                      Welcome to
                      <br />
                      <span className="text-orange-600">
                        Khatu Rides
                      </span>
                    </h2>

                    <p
                      className="
                        mt-2
                        max-w-md
                        text-xs
                        font-medium
                        leading-relaxed
                        text-slate-500
                      "
                    >
                      Sign in to book cabs, manage trips and
                      access exclusive customer benefits.
                    </p>

                  </div>


                  {/* WELCOME BONUS */}

                  <div
                    className="
                      relative
                      mb-6
                      overflow-hidden
                      rounded-2xl
                      border
                      border-orange-200
                      bg-gradient-to-r
                      from-orange-50
                      via-amber-50
                      to-orange-50
                      p-4
                    "
                  >

                    <div
                      className="
                        absolute
                        -right-5
                        -top-8
                        h-24
                        w-24
                        rounded-full
                        bg-orange-200/50
                        blur-xl
                      "
                    />

                    <div className="relative flex items-center gap-3">

                      <div
                        className="
                          flex
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-gradient-to-br
                          from-orange-500
                          to-amber-500
                          text-xl
                          shadow-md
                        "
                      >
                        🎁
                      </div>

                      <div>

                        <p
                          className="
                            text-[8px]
                            font-black
                            uppercase
                            tracking-[0.15em]
                            text-orange-700
                          "
                        >
                          New Customer Welcome
                        </p>

                        <p
                          className="
                            mt-0.5
                            text-sm
                            font-black
                            text-slate-950
                          "
                        >
                          Get ₹1,101 Welcome Bonus
                        </p>

                        <p
                          className="
                            mt-0.5
                            text-[9px]
                            font-medium
                            text-slate-500
                          "
                        >
                          Credited to your Khatu Rides wallet
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* ERROR */}

                  {errorMessage && (
                    <div
                      className="
                        mb-4
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        px-4
                        py-3
                        text-[10px]
                        font-bold
                        text-red-600
                      "
                    >
                      {errorMessage}
                    </div>
                  )}


                  {/* GOOGLE BUTTON */}

                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="
                      group
                      flex
                      h-14
                      w-full
                      items-center
                      justify-center
                      gap-3
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      text-xs
                      font-black
                      text-slate-800
                      shadow-[0_8px_25px_rgba(15,23,42,0.07)]
                      transition-all
                      hover:-translate-y-0.5
                      hover:border-slate-300
                      hover:shadow-lg
                      active:scale-[0.98]
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >

                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      className="h-5 w-5"
                      alt="Google"
                    />

                    {loading
                      ? "Connecting securely..."
                      : "Continue with Google"}

                  </button>


                  {/* TRUST */}

                  <div
                    className="
                      mt-6
                      grid
                      grid-cols-3
                      gap-2
                    "
                  >

                    <div className="rounded-xl bg-slate-50 px-2 py-3 text-center">
                      <div className="text-sm">🛡️</div>
                      <p className="mt-1 text-[7px] font-black uppercase tracking-wider text-slate-500">
                        Secure
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 px-2 py-3 text-center">
                      <div className="text-sm">🚕</div>
                      <p className="mt-1 text-[7px] font-black uppercase tracking-wider text-slate-500">
                        Reliable
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 px-2 py-3 text-center">
                      <div className="text-sm">🎧</div>
                      <p className="mt-1 text-[7px] font-black uppercase tracking-wider text-slate-500">
                        24×7
                      </p>
                    </div>

                  </div>

                </motion.div>

              ) : (

                <motion.div
                  key="phone"
                  initial={{
                    opacity: 0,
                    x: 15,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                >

                  {/* PHONE HEADER */}

                  <div className="mb-6">

                    <div
                      className="
                        mb-4
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-2xl
                        bg-orange-50
                        text-xl
                      "
                    >
                      📱
                    </div>

                    <h2
                      className="
                        text-2xl
                        font-black
                        tracking-tight
                        text-slate-950
                      "
                    >
                      One last step
                    </h2>

                    <p
                      className="
                        mt-2
                        text-xs
                        font-medium
                        leading-relaxed
                        text-slate-500
                      "
                    >
                      Add your mobile number to complete your
                      customer profile and activate your welcome benefits.
                    </p>

                  </div>


                  {/* BONUS CONFIRMATION */}

                  <div
                    className="
                      mb-5
                      flex
                      items-center
                      gap-3
                      rounded-2xl
                      border
                      border-emerald-200
                      bg-emerald-50
                      p-4
                    "
                  >

                    <div className="text-xl">
                      🎁
                    </div>

                    <div>

                      <p
                        className="
                          text-[8px]
                          font-black
                          uppercase
                          tracking-wider
                          text-emerald-700
                        "
                      >
                        Welcome Reward
                      </p>

                      <p
                        className="
                          text-sm
                          font-black
                          text-slate-950
                        "
                      >
                        ₹1,101 Wallet Bonus
                      </p>

                    </div>

                  </div>


                  {/* ERROR */}

                  {errorMessage && (
                    <div
                      className="
                        mb-4
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        px-4
                        py-3
                        text-[10px]
                        font-bold
                        text-red-600
                      "
                    >
                      {errorMessage}
                    </div>
                  )}


                  {/* FORM */}

                  <form
                    onSubmit={handleSavePhoneAndProceed}
                    className="space-y-5"
                  >

                    <div>

                      <label
                        className="
                          mb-2
                          block
                          text-[9px]
                          font-black
                          uppercase
                          tracking-[0.16em]
                          text-slate-500
                        "
                      >
                        Mobile Number
                      </label>

                      <div
                        className="
                          flex
                          h-14
                          overflow-hidden
                          rounded-2xl
                          border
                          border-slate-200
                          bg-slate-50
                          transition
                          focus-within:border-orange-500
                          focus-within:bg-white
                          focus-within:ring-4
                          focus-within:ring-orange-500/10
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            border-r
                            border-slate-200
                            bg-slate-100
                            px-4
                            text-xs
                            font-black
                            text-slate-600
                          "
                        >
                          +91
                        </div>

                        <input
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          autoFocus
                          placeholder="Enter mobile number"
                          value={phoneInput}
                          onChange={(e) =>
                            setPhoneInput(
                              e.target.value.replace(/\D/g, "")
                            )
                          }
                          className="
                            w-full
                            bg-transparent
                            px-4
                            text-sm
                            font-bold
                            text-slate-900
                            outline-none
                            placeholder:text-slate-400
                          "
                          required
                        />

                      </div>

                      <p
                        className="
                          mt-2
                          text-[9px]
                          font-medium
                          text-slate-400
                        "
                      >
                        Used for booking confirmations and driver updates.
                      </p>

                    </div>


                    <button
                      type="submit"
                      disabled={
                        loading ||
                        phoneInput.replace(/\D/g, "").length !== 10
                      }
                      className="
                        flex
                        h-14
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-2xl
                        bg-gradient-to-r
                        from-orange-600
                        to-amber-500
                        text-xs
                        font-black
                        uppercase
                        tracking-[0.12em]
                        text-white
                        shadow-lg
                        shadow-orange-600/20
                        transition-all
                        hover:from-orange-700
                        hover:to-orange-600
                        active:scale-[0.98]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >

                      {loading ? (
                        <>
                          <span
                            className="
                              h-4
                              w-4
                              animate-spin
                              rounded-full
                              border-2
                              border-white/30
                              border-t-white
                            "
                          />
                          Activating Account...
                        </>
                      ) : (
                        <>
                          Complete Signup
                          <span>→</span>
                        </>
                      )}

                    </button>

                  </form>


                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setNeedsPhoneModal(false);
                      setPhoneInput("");
                      setErrorMessage("");
                    }}
                    className="
                      mt-4
                      w-full
                      text-center
                      text-[9px]
                      font-black
                      uppercase
                      tracking-wider
                      text-slate-400
                      transition
                      hover:text-slate-700
                    "
                  >
                    ← Back to Google Login
                  </button>

                </motion.div>

              )}

            </AnimatePresence>


            {/* FOOTER */}

            <div
              className="
                mt-8
                flex
                items-center
                justify-between
                border-t
                border-slate-100
                pt-5
              "
            >

              <a
                href="/"
                className="
                  text-[9px]
                  font-black
                  text-slate-400
                  transition
                  hover:text-orange-600
                "
              >
                ← Back to Home
              </a>

              <a
                href="tel:+919244137353"
                className="
                  text-[9px]
                  font-black
                  text-orange-600
                  hover:underline
                "
              >
                Need Help?
              </a>

            </div>


            <p
              className="
                mt-4
                text-center
                text-[8px]
                font-medium
                leading-relaxed
                text-slate-400
              "
            >
              By continuing, you agree to Khatu Rides
              {" "}
              <a href="/terms" className="underline">
                Terms & Conditions
              </a>
              {" "}and{" "}
              <a href="/privacy-policy" className="underline">
                Privacy Policy
              </a>.
            </p>

          </div>

        </div>

      </motion.div>

    </main>
  );
}