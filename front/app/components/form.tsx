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
  mobilePrefix: string;
  mobileNumber: string;
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
  const [prizeLabel, setPrizeLabel] = useState<string | null>(null);
  const [spinFinished, setSpinFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wheelRef = useRef<HTMLDivElement>(null);
  const [spinning, setSpinning] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const spinSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    spinSoundRef.current = new Audio("/wheel-spin.wav");
    spinSoundRef.current.loop = true; // loop while spinning
  }, []);


  const resetWheel = () => {
    if (!wheelRef.current) return;

    wheelRef.current.style.transition = "none";
    wheelRef.current.style.transform = "rotate(0deg)";

    // force reflow so next animation works
    void wheelRef.current.offsetWidth;

    setSpinFinished(false);
  };


  const spin = () => {
    if (!prizeCode || spinning) return;

    const index = WHEEL_PRIZES.indexOf(prizeCode);
    if (index === -1) return;

    setSpinning(true);
    setSpinFinished(false);

    const angle = getRotationForPrize(index);

    spinSoundRef.current?.play();

    if (wheelRef.current) {
      wheelRef.current.style.transition =
        "transform 4.2s cubic-bezier(0.22, 0.61, 0.36, 1)";
      wheelRef.current.style.transform = `rotate(${angle}deg)`;
    }

    setTimeout(() => {
      setSpinning(false);
      setSpinFinished(true);

      spinSoundRef.current?.pause();
      spinSoundRef.current!.currentTime = 0;

      // 🔁 IF spin again → reset & allow re-spin
      if (prizeCode === "spin_again") {
        setTimeout(() => {
          resetWheel();
          setPrizeCode(null); // 👈 this shows form OR triggers re-submit
        }, 600);
      }
    }, 4200);
  };


  const printLabel = () => {
    return PRIZE_LABELS[prizeCode!];
  }


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
        `${API_URL}:8000/api/qr/${posterNumber}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        console.log("Error response:", err.mobile[0]);
        const message =
          err.mobile?.[0] ||
          "Xəta baş verdi";

        setError(message);
        return;
      }

      const prizeData: PrizeResponse = await res.json();
      setPrizeCode(prizeData.prize.code);
      setPrizeLabel(prizeData.prize.az);
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
     Helpers
  ======================= */
  const isSpinAgain = prizeCode === "spin_again";
  const isNoPrize = prizeCode === "no_prize";
  const disableSpinButton =
    spinFinished && !isSpinAgain;

  useEffect(() => {
    if (spinFinished && prizeCode && !isSpinAgain) {
      console.log("Showing modal for prize:", prizeCode);
      console.log("Prize label:", printLabel());
      setShowModal(true);
    }
  }, [spinFinished, prizeCode, isSpinAgain]);

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


            {!isNoPrize ? (
              <div className="text-2xl font-bold mb-2">
                <p className="text-blue-700">
                  🎉 {printLabel()}
                </p>
                <p className="text-gray-700">
                  Mağazamıza yaxınlaşaraq uduşunuzu ala bilərsiniz
                </p>
              </div>
            ) : (
              <div className="text-2xl font-bold mb-2">😞 Təəssüf ki, uduşunuz yoxdur</div>
            )}

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

      {prizeCode ? (
        <>
          {/* Wheel */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-80 h-80">
              {/* Wheel */}
              <div
                ref={wheelRef}
                className="w-[76%] h-[76%] top-[12%] left-[12%] absolute rounded-full"
                style={{
                  backgroundImage: "url(/spin-new.png)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              {/* Overlapping Carcas */}
              <div
                className="absolute top-0 left-0 w-full h-full"
                style={{
                  backgroundImage: "url(/wave.png)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  pointerEvents: "none", // optional: allow clicks to go through
                }}
              />
            </div>


            <button
              onClick={spin}
              disabled={spinning || disableSpinButton}
              className="px-5 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {spinning ? "Fırlanır..." : "Fırlat"}
            </button>

            {/* Result text AFTER spin */}
            {/* {spinFinished && (
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
            )} */}
          </div>
        </>
      ) : (
        /* Form */
        <form onSubmit={handleSubmit(onSubmit)} className="w-full border1 rounded-md border-[59, 130, 246] p-2 bg-[rgba(59,130,246,0.2)]">
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
