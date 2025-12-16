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
   Wheel config
======================= */
export const WHEEL_PRIZES = [
  "discount_3_azn",
  "loyalty_card",
  "discount_10",
  "discount_10_not_fish",
  "spin_again",
  "discount_5",
  "no_prize",
  "free_delivery",
] as const;

export const SEGMENT_ANGLE = 360 / WHEEL_PRIZES.length;

export function getRotationForPrize(index: number) {
  const FULL_SPINS = 6 * 360;
  const segmentCenter = index * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
  return FULL_SPINS + (360 - segmentCenter);
}

/* =======================
   Types
======================= */
type FormData = {
  fullname: string;
  email: string;
  mobile: string;
};

type PrizeCode = typeof WHEEL_PRIZES[number];

interface PrizeResponse {
  success: boolean;
  prize: {
    code: PrizeCode;
    az: string;
  };
  spin_id: number;
}

interface Props {
  posterNumber: string;
}

/* =======================
   Component
======================= */
export default function SpinForm({ posterNumber }: Props) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<FormData>();

  const [prizeCode, setPrizeCode] = useState<PrizeCode | null>(null);
  const [spinFinished, setSpinFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wheelRef = useRef<HTMLDivElement>(null);
  const [spinning, setSpinning] = useState(false);

  const spinSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    spinSoundRef.current = new Audio("/wheel-spin.wav");
    spinSoundRef.current.loop = true; // loop while spinning
  }, []);

  /* =======================
     Spin animation
  ======================= */
  const spin = () => {
    if (!prizeCode || spinning) return;

    const index = WHEEL_PRIZES.indexOf(prizeCode);
    if (index === -1) return;

    setSpinning(true);
    setSpinFinished(false);

    const angle = getRotationForPrize(index);

    // start sound
    spinSoundRef.current?.play();

    if (wheelRef.current) {
      // 🎯 spin to result
      wheelRef.current.style.transition =
        "transform 4.2s cubic-bezier(0.22, 0.61, 0.36, 1)";
      wheelRef.current.style.transform = `rotate(${angle}deg)`;
    }

    setTimeout(() => {
      setSpinning(false);
      setSpinFinished(true);

      // 🔁 IF spin again → reset wheel to start
      if (prizeCode === "spin_again" && wheelRef.current) {
        setTimeout(() => {
          if (!wheelRef.current) return;

          // remove animation
          wheelRef.current.style.transition = "none";
          wheelRef.current.style.transform = "rotate(0deg)";

          // force reflow (important for next animation)
          void wheelRef.current.offsetWidth;
        }, 4000);
      }

      // stop sound
      spinSoundRef.current?.pause();
      spinSoundRef.current!.currentTime = 0;
    }, 3000);
  };


  /* =======================
     Submit form
  ======================= */
  const onSubmit = async (data: FormData) => {
    setError(null);

    try {
      const res = await fetch(
        `${API_URL}:8000/api/qr/${posterNumber}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        setError(JSON.stringify(err));
        return;
      }

      const prizeData: PrizeResponse = await res.json();

      setPrizeCode(prizeData.prize.code);
      reset();
    } catch (e: any) {
      setError(e.message || "Xəta baş verdi");
    }
  };

  /* =======================
     Helpers
  ======================= */
  const isSpinAgain = prizeCode === "spin_again";
  const isNoPrize = prizeCode === "no_prize";
  const disableSpinButton =
    spinFinished && !isSpinAgain;

  /* =======================
     Render
  ======================= */
  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Spin to Win</h2>

      {error && (
        <div className="p-2 mb-4 border rounded bg-red-50 text-red-700">
          {error}
        </div>
      )}

      {prizeCode ? (
        <>
          {/* Wheel */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-80 h-80">
              <div
                ref={wheelRef}
                className="w-full h-full rounded-full"
                style={{
                  backgroundImage: "url(/spin.png)",
                  backgroundSize: "cover",
                }}
              />

              <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xl">
                ▼
              </div>
            </div>

            <button
              onClick={spin}
              disabled={spinning || disableSpinButton}
              className="px-5 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {spinning ? "Fırlanır..." : "Fırlat"}
            </button>

            {/* Result text AFTER spin */}
            {spinFinished && (
              <div className="text-center mt-4 space-y-2">
                <div className="text-lg font-semibold">
                  🎉 {PRIZE_LABELS[prizeCode]}
                </div>

                {!isNoPrize && !isSpinAgain && (
                  <p className="">
                    Mağazamıza yaxınlaşaraq uduşunuzu ala bilərsiniz
                  </p>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        /* Form */
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Fullname</label>
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
            <label className="block mb-1 font-medium">Mobile</label>
            <input
              {...register("mobile", { required: "Mobile is required" })}
              className="w-full p-2 border rounded"
            />
            {errors.mobile && (
              <p className="text-red-600">{errors.mobile.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            {isSubmitting ? "Gözləyin..." : "Qeydiyyatdan keç"}
          </button>
        </form>
      )}
    </div>
  );
}
