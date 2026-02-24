"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Cinzel } from "next/font/google";
import { Cormorant_Upright } from "next/font/google";
import { Mulish } from "next/font/google";
import { useSession, signIn, signOut } from "next-auth/react";


const API_URL = process.env.NEXT_PUBLIC_API_URL;
const UI_URL = process.env.NEXT_PUBLIC_UI_URL

export const mulish = Mulish({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const cormorantUpright = Cormorant_Upright({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

type FormData = {
  fullname: string;
  phone: string;
  email?: string;
  details?: string;
  interests?: string[];
};

type PrizeResponse = {
  success: boolean;
};

export default function PriveForm({ success2, onSuccess }: { success2?: boolean; onSuccess?: () => void }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
    setValue
  } = useForm<FormData>();

  const { data: session } = useSession();

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user) return;

    if (session.user.name) setValue("fullname", session.user.name);
    if (session.user.email) setValue("email", session.user.email);
  }, [session, setValue]);

  const submit = async (data: FormData) => {
    setError(null);

    const payload = {
      fullname: data.fullname,
      email: data.email || "",
      mobile: data.phone,
      interested_in: data.interests || [],
      message: data.details || "",
    };

    try {
      // const res = await fetch(`${API_URL}/api/prive-register/`, {
        const res = await fetch(`/api/prive-register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = err?.mobile?.[0] || err?.email?.[0] || err?.message || "Xəta baş verdi";
        setError(msg);
        return;
      }

      const response: PrizeResponse = await res.json();
      if (response.success) {
        setSuccess(true);
        onSuccess?.(); // ✅ swap bg
        reset();
      } else {
        setError("Qeydiyyat uğursuz oldu");
      }
    } catch (e: any) {
      setError(e?.message || "Xəta baş verdi");
    }
  };

  const continueWithGoogle = async () => {
    setError(null);
    await signIn("google", { callbackUrl: `${UI_URL}/google-registration` });
  };

  useEffect(() => {
    if (!session?.user) return;

    const sendGoogleUser = async () => {
      try {
        await fetch(`${API_URL}/api/prive-register/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullname: session!.user!.name,
            email: session!.user!.email,
            mobile: "994", // or null if optional
            interested_in: [],
            message: "",
          }),
        });

        setSuccess(true);

        // Optional: clear session (register-only page)
        await signOut({ redirect: false });

      } catch (err) {
        console.error(err);
      }
    };

    sendGoogleUser();

  }, [session]);

  // ===== Success screen (Frame 7) =====
  if (success || success2) {
    return (
      // <div className="mx-auto w-[80%] max-h-[100vh] max-w-[820px] pt-15 text-white bg-black/[0.42] border1 border-white">
      // <div className="h-full w-full flex items-center justify-center">
      <div className="w-[80%] mx-auto full py-20">

        <div className="flex justify-center">
          <img src="/logo.png" alt="Balique logo" width={140} height={140} />
        </div>

        <div className="mt-10 border1 border-white">
          {/* Center card-ish block */}
          <div className="mt-[20px] w-full rounded-[28px] bg-black/25 px-6 py-10 text-center backdrop-blur-[2px]">
            <h1 className={`
              text-[28px]
              leading-[100%]
              tracking-[0]
              font-normal
              text-center
              uppercase ${cinzel.className}`}
            >
              ACCESS REQUEST
              <br />
              RECEIVED
            </h1>

            <p className={`
              ${cormorantUpright.className}
              mt-[20px]
              text-[20px]
              leading-[110%]
              tracking-[0]
              font-normal
              text-center
              weight-300
            `}
            >
              Thank you for your interest in
              <br />
              Balique Privé.
            </p>

            <p className={`
              ${cormorantUpright.className}
              mt-[20px]
              text-[20px]
              leading-[110%]
              tracking-[0]
              font-normal
              text-center
              weight-300
            `}
            >
              Our team will personally
              <br />
              connect with selected guests.
            </p>
          </div>
        </div>

      </div>
    );
  }

  // ===== Form screen (Frame 6) =====
  return (
    <div className="mx-auto w-[80%] max-w-[820px] relative top-20 pt-10 text-white bg-black/[0.42] border1 border-white">
      {/* Top hero text */}
      <div className="text-center ">
        <h1 className={`
          text-[28px]
          leading-[100%]
          tracking-[0]
          font-normal
          text-center
          uppercase ${cinzel.className}`}
        >
          JOIN BALIQUE PRIVÉ
        </h1>

        <p className={`
          ${cormorantUpright.className}
          mt-[20px]
          text-[20px]
          leading-[110%]
          tracking-[0]
          font-normal
          text-center
          weight-300
        `}
        >
          Private Seafood &amp; Caviar Experiences
          <br />
          By Invitation Only
        </p>

        <div className="mx-auto w-[70%] mt-2 h-[1px] bg-white/35" />

        <p className="mx-auto mt-5 w-[80%] text-[14px] leading-[1.35] text-white/80 font-serif">
          Request access for private gatherings and
          <br />
          exclusive hospitality services.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-auto mt-10 max-w-[720px] rounded-xl border border-red-200/30 bg-red-950/40 p-3 text-red-100">
          {error}
        </div>
      )}

      {/* Form content block */}
      <form
        onSubmit={handleSubmit(submit)}
        className={`
          ${mulish.className}
          mx-auto mt-[50px] w-[90%] max-w-[760px] h-[70vh]
          flex flex-col
          border1 border-blue-500
        `}
      >
        {/* Inputs */}
        <div className="space-y-[22px]">
          <input
            {...register("fullname", { required: true })}
            placeholder="Full Name"
            className="w-full h-[32px] rounded-[3px] bg-white/92 px-[12px] text-black/80 placeholder:text-black/30 outline-none"
          />
          <input
            {...register("phone", { required: true })}
            placeholder="Phone number"
            className="w-full h-[32px] rounded-[3px] bg-white/92 px-[12px] text-black/80 placeholder:text-black/30 outline-none"
          />
          <input
            {...register("email")}
            placeholder="E-mail (optional)"
            className="w-full h-[32px] rounded-[3px] bg-white/92 px-[12px] text-black/80 placeholder:text-black/30 outline-none"
          />
        </div>

        {/* Interests */}
        <div className="mt-[34px]">
          <div className="text-white/90">
            <div className="text-[18px] font-semibold">I am interested in:</div>
            <div className="text-[13px] text-white/60">Multiple Choice</div>
          </div>

          <div className="mt-[18px] space-y-[18px] text-[14px] text-white/90">
            {[
              "Private home receptions",
              "Gala & corporate events",
              "Wedding celebrations",
              "Exclusive product access",
              "Personal consultation",
            ].map((label) => (
              <label key={label} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={label}
                  {...register("interests")}
                  className="h-[14px] w-[14px] appearance-none rounded-[3px] border border-white/55 bg-transparent
                             checked:bg-white checked:border-white
                             checked:after:content-[''] checked:after:block checked:after:h-[14px] checked:after:w-[14px]
                             checked:after:rounded-[3px] checked:after:bg-black checked:after:mx-auto checked:after:mt-[14px]"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>

          <div className="mt-[26px] h-px w-full bg-white/25" />
        </div>

        {/* Textarea */}
        <div className="w-full mt-[22px] rounded-[3px] text-black/80 relative rounded-[3px] bg-white/92">
          <textarea
            {...register("details")}
            placeholder="Share a few details (optional)"
            maxLength={500}
            rows={5}
            className="w-full h-full bg-white p-2 resize-none bg-transparent text-[14px] rounded-[3px] bg-white/92 outline-none placeholder:text-black/30"
          />

          <div className="absolute bottom-3 right-1 text-right text-[12px] text-black/35 bg-white/20 px-2">
            max 500 characters
          </div>
        </div>

        <div className="mt-[18px] text-[14px] text-white/70">
          If you are planning a specific occasion, feel free to share details here.
        </div>

        {/* Button (bottom right like screenshot) */}
        <div className="mt-[30px] flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-[36px] w-[140px] rounded-[3px] bg-white text-[14px] font-semibold text-black
                       shadow-sm transition active:scale-[0.99] disabled:opacity-60"
          >
            {isSubmitting ? "..." : "Sign up"}
          </button>
        </div>

        <div className="mt-[22px] pb-[52px]">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/25" />
            <div className="text-[12px] text-white/70">or</div>
            <div className="h-px flex-1 bg-white/25" />
          </div>

          <div className="mt-[14px]">
            <button
              type="button"
              onClick={continueWithGoogle}
              className="h-[36px] w-full rounded-[3px] bg-white/92 text-[14px] font-semibold text-black
               shadow-sm transition active:scale-[0.99]
               flex items-center justify-center gap-2"
            >
              {/* Google Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="h-[16px] w-[16px]"
              >
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3C33.7 32.1 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 
        11-11c2.8 0 5.3 1 7.3 2.7l6-6C33.5 6.1 29 4 24 4 12.9 4 4 12.9 4 24s8.9 
        20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.7 16 18.9 13 24 13c2.8 0 5.3 1 7.3 
        2.7l6-6C33.5 6.1 29 4 24 4c-7.7 0-14.3 4.4-17.7 10.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.1C29.3 35 26.8 
        36 24 36c-5.2 0-9.6-3.5-11.2-8.3l-6.5 5C9.7 39.4 16.3 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-1 3-3.4 5.3-6.1 
        6.7l6.2 5.1C39.5 36.6 44 30.9 44 24c0-1.3-.1-2.7-.4-3.5z"
                />
              </svg>

              Continue with Google
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}