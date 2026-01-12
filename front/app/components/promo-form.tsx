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
      console.log("Submitting promo form with payload:", posterNumber);
      const res = await fetch(
        `${API_URL}:8000/api/promo/${posterNumber}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        const message =
          err.mobile?.[0] ||
          "Xəta baş verdi";

        setError(message);
        return;
      }

      const response: PrizeResponse = await res.json();
      setPromoCode(response.promo_code);
      reset();
    } catch (e: any) {
      const message =
        Array.isArray(e?.mobile)
          ? e.mobile[0]
          : "Xəta baş verdi.";

      setError(message);

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

                  Balique ilə tanış olunaaa
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

        </div>
      ) : (
        /* Form */
        <form onSubmit={handleSubmit(onSubmit)} className="promo-form w-full border1 rounded-md border-[59, 130, 246] p-2">
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
