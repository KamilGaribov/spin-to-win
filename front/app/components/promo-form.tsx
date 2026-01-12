"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

/* =======================
   Prize labels (AZ)
======================= */
const PRIZE_LABELS: Record<string, string> = {
  free_delivery: "Pulsuz çatdırılma",
  discount_5: "5% endirim",
  discount_10: "10% endirim",
  spin_again: "Yenidən fırlat",
  no_prize: "Uduş yoxdur",
  loyalty_card: "Loyallıq kartı",
  discount_3_azn: "3 AZN endirim kuponu",
  discount_10_not_fish: "Kassa arxası məhsullara 10% endirim",
};



/* =======================
   Types
======================= */
type FormData = {
  fullname: string;
  email: string;
  mobilePrefix: string;
  mobileNumber: string;
};



interface PrizeResponse {
  success: boolean;
  promo_code: string;
  spin_id: number;
}

interface Props {
  posterNumber: string;
}

/* =======================
   Component
======================= */
export default function PromoForm({ posterNumber }: Props) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<FormData>();

  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const wheelRef = useRef<HTMLDivElement>(null);

  const [showModal, setShowModal] = useState(false);




  /* =======================
     Submit form
  ======================= */
  const onSubmit = async (data: FormData) => {
    setError(null);

    const payload = {
      fullname: data.fullname,
      email: data.email,
      mobile: `+994(${data.mobilePrefix})${data.mobileNumber}`,
    };

    try {
      const res = await fetch(
        `${API_URL}/api/promo/${posterNumber}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        const message = err.mobile?.[0] || err.message || "Xəta baş verdi";

        setError(message);
        return;
      }

      const response: PrizeResponse = await res.json();
      setPromoCode(response.promo_code);
      reset();
    } catch (e: any) {
      const message = e.mobile?.[0] || e.message || "Xəta baş verdi";

      setError(message);
    }
  };



  /* =======================
     Render
  ======================= */
  return (
    <div className="w-[86%] absolute top-[30%] left-[7%]">

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-80 text-center relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <div className="font-bold mb-2">
              <p className="text-gray-700">
                Təbrik edirik!
                <br />
                Siz bu bina sakinləri üçün nəzərdə tutulmuş 10% endirim qazandınız.
              </p>
              <p className="text-black-700">
                Promo kodunuz: {promoCode}
              </p>
              <p className="text-gray-700">
                <br />
                Əlaqə nömrəsi +994(55)344 73 33
              </p>
              <p className="text-gray-700">
                Bu promo kodu Balique mağazasına yaxınlaşaraq və ya instagram səhifəmizdən online sifariş zamanı 10% endirim əldə edə bilərsiniz.
                <br />
                <a
                  href="https://www.instagram.com/balique.az?igsh=ZGQ5bWxndWoyeTkw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    w-full

                    flex items-center justify-center gap-3
                    rounded-xl
                    bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500
                    px-6 py-3
                    text-white font-semibold
                    transition
                    hover:opacity-90
                    active:scale-[0.98]
                  "
                >
                  {/* Instagram Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M7.75 2h8.5C19.55 2 22 4.45 22 7.75v8.5C22 19.55 19.55 22 16.25 22h-8.5C4.45 22 2 19.55 2 16.25v-8.5C2 4.45 4.45 2 7.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5z" />
                    <path d="M12 7a5 5 0 100 10 5 5 0 000-10zm0 1.5a3.5 3.5 0 110 7 3.5 3.5 0 010-7z" />
                    <circle cx="17.5" cy="6.5" r="1" />
                  </svg>

                  Balique ilə tanış olun
                </a>

                <a
                  href="https://balique.az/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    w-full
                    flex items-center justify-center gap-3
                    rounded-xl
                    bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500
                    px-6 py-3
                    text-white font-semibold
                    transition
                    hover:opacity-90
                    active:scale-[0.98]
                  "
                >
                  {/* Website Icon (globe) */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 1.5a8.5 8.5 0 018.5 8.5 8.5 8.5 0 01-8.5 8.5A8.5 8.5 0 013.5 12 8.5 8.5 0 0112 3.5zm0 1a7.5 7.5 0 00-7.5 7.5 7.5 7.5 0 007.5 7.5 7.5 7.5 0 007.5-7.5 7.5 7.5 0 00-7.5-7.5z" />
                  </svg>

                  Balique.az ilə tanış olun
                </a>

              </p>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Bağla
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-2 mb-4 border rounded bg-red-50 text-red-700">
          {error}
        </div>
      )}

      {promoCode ? (
        <div className="font-bold mb-2 bg-[rgba(255,255,255,0.75)] p-4 rounded-md">
          <p className="text-gray-700">
            Təbrik edirik!
            <br />
            Siz bu bina sakinləri üçün nəzərdə tutulmuş 10% endirim qazandınız.
          </p>
          <p className="text-black-700">
            Promo kodunuz: {promoCode}
          </p>
          <br />
          <p className="text-gray-700">
            Bu promo kodu Balique mağazasına yaxınlaşaraq və ya instagram səhifəmizdən online sifariş zamanı istifadə edə bilərsiniz.
            <br />
          </p>
          <p className="text-gray-700">
            <br />
            Əlaqə nömrəsi: +994(55)344 73 33
          </p>

          <a
            href="https://www.instagram.com/balique.az?igsh=ZGQ5bWxndWoyeTkw"
            target="_blank"
            rel="noopener noreferrer"
            className="
                mt-2
                w-full
                flex items-center justify-center gap-3
                rounded-xl
                bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500
                px-6 py-3
                text-white font-semibold
                transition
                hover:opacity-90
                active:scale-[0.98]
              "
          >
            {/* Instagram Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M7.75 2h8.5C19.55 2 22 4.45 22 7.75v8.5C22 19.55 19.55 22 16.25 22h-8.5C4.45 22 2 19.55 2 16.25v-8.5C2 4.45 4.45 2 7.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5z" />
              <path d="M12 7a5 5 0 100 10 5 5 0 000-10zm0 1.5a3.5 3.5 0 110 7 3.5 3.5 0 010-7z" />
              <circle cx="17.5" cy="6.5" r="1" />
            </svg>

            Balique ilə tanış olun
          </a>
          <br />

          <a
            href="https://balique.az/"
            target="_blank"
            rel="noopener noreferrer"
            className="
              w-full
              flex items-center justify-center gap-2
              rounded-lg
              bg-blue-600
              hover:bg-blue-700
              active:bg-blue-800
              text-white font-semibold
              px-6 py-3
              shadow-md
              transition
              transform
              hover:scale-[1.02]
              active:scale-[0.98]
              bg-gradient-to-r 
      from-[#1c1496] 
      via-[#11118f] 
      to-[#54dcf7]
            "
          >
            {/* Globe Icon */}
            <svg
              id="Website_24"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="24" height="24" stroke="none" fill="#000000" opacity="0" />

              <g transform="matrix(0.91 0 0 0.91 12 12)">
                <path
                  style={{
                    stroke: "none",
                    strokeWidth: 1,
                    strokeDasharray: "none",
                    strokeLinecap: "butt",
                    strokeDashoffset: 0,
                    strokeLinejoin: "miter",
                    strokeMiterlimit: 4,
                    fill: "rgb(255,255,255)",
                    fillRule: "nonzero",
                    opacity: 1,
                  }}
                  transform="translate(-12, -12)"
                  d="M 12 2 C 8.308 2 5.0855156 4.016 3.3535156 7 L 5.7949219 7 C 6.6949219 5.888 7.8693281 5.0079531 9.2363281 4.5019531 C 8.9233281 5.2299531 8.6724688 6.08 8.4804688 7 L 10.537109 7 C 11.016109 5.023 11.687 4 12 4 C 12.313 4 12.983891 5.023 13.462891 7 L 15.519531 7 C 15.327531 6.08 15.075672 5.2299531 14.763672 4.5019531 C 16.129672 5.0079531 17.305078 5.888 18.205078 7 L 20.646484 7 C 18.914484 4.016 15.692 2 12 2 z M 1 9 L 2.2421875 15 L 3.5507812 15 L 4.4003906 11.529297 L 5.2480469 15 L 6.5507812 15 L 7.7929688 9 L 6.2890625 9 L 5.7519531 12.365234 L 4.953125 9 L 3.8398438 9 L 3.0390625 12.371094 L 2.5078125 9 L 1 9 z M 8.6035156 9 L 9.8457031 15 L 11.154297 15 L 12.003906 11.529297 L 12.851562 15 L 14.154297 15 L 15.396484 9 L 13.894531 9 L 13.355469 12.365234 L 12.558594 9 L 11.443359 9 L 10.644531 12.371094 L 10.111328 9 L 8.6035156 9 z M 16.207031 9 L 17.449219 15 L 18.757812 15 L 19.607422 11.529297 L 20.455078 15 L 21.757812 15 L 23 9 L 21.496094 9 L 20.958984 12.365234 L 20.160156 9 L 19.046875 9 L 18.246094 12.371094 L 17.714844 9 L 16.207031 9 z M 3.3535156 17 C 5.0855156 19.984 8.308 22 12 22 C 15.692 22 18.914484 19.984 20.646484 17 L 18.205078 17 C 17.305078 18.112 16.130672 18.992047 14.763672 19.498047 C 15.075672 18.770047 15.325578 17.92 15.517578 17 L 13.460938 17 C 12.981938 18.977 12.311047 20 11.998047 20 C 11.685047 20 11.016109 18.977 10.537109 17 L 8.4804688 17 C 8.6724688 17.92 8.9243281 18.770047 9.2363281 19.498047 C 7.8703281 18.992047 6.6949219 18.112 5.7949219 17 L 3.3535156 17 z"
                  strokeLinecap="round"
                />
              </g>
            </svg>

            balique.az saytına keç
          </a>


        </div>
      ) : (
        /* Form */
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)(e);
          }}
          className="promo-form w-full border1 rounded-md border-[59, 130, 246] p-2"
        >
          <div>
            <label className="block mb-1 font-medium">Ad, soyad</label>
            <input
              {...register("fullname", { required: "Fullname is required" })}
              className="w-full p-2 border rounded"
            />
            {errors.fullname && (
              <p className="text-red-600">{errors.fullname.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              {...register("email", { required: "Email is required" })}
              className="w-full p-2 border rounded"
            />
            {errors.email && (
              <p className="text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Mobil nömrə</label>

            <div className="flex gap-2">
              {/* Prefix select */}
              <select
                {...register("mobilePrefix", { required: true })}
                // defaultValue="50"
                className="w-20 p-1 border rounded"
              >
                <option value="10">10</option>
                <option value="50">50</option>
                <option value="51">51</option>
                <option value="55">55</option>
                <option value="70">70</option>
                <option value="77">77</option>
                <option value="99">99</option>
              </select>

              {/* Mobile number */}
              <input
                {...register("mobileNumber", {
                  required: "Mobile is required",
                  minLength: { value: 7, message: "Minimum 7 rəqəm" },
                })}
                placeholder="1234567"
                className="flex-1 p-2 border rounded"
                inputMode="numeric"
              />
            </div>

            {(errors.mobilePrefix || errors.mobileNumber) && (
              <p className="text-red-600">Mobil nömrə düzgün deyil</p>
            )}
          </div>


          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white p-2 rounded mt-2"
          >
            {isSubmitting ? "Gözləyin..." : "Qeydiyyatdan keç"}
          </button>
        </form>
      )}
    </div>
  );
}
