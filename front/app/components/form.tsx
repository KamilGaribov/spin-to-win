"use client";

const API_URL = process.env.API_URL;

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";


type FormData = {
  fullname: string;
  email: string;
  mobile: string;
};

interface PrizeResponse {
  success: boolean;
  customer: any;
  prize: {
    code: string;
    az: string;
  };
  spin_id: number;
}

interface Props {
  posterNumber: string; // QR koddan gələn poster_number
}

export default function SpinForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>();
  const [result, setResult] = useState<PrizeResponse | null>(null);
  const searchParams = useSearchParams();
  const posterNumber = searchParams.get("poster") ?? "";
  console.log("Poster Number in Form:", posterNumber);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      const res = await fetch(`${API_URL}:8000/api/qr/${posterNumber}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(JSON.stringify(err));
        return;
      }

      const prizeData: PrizeResponse = await res.json();
      setResult(prizeData);
      reset();
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Spin to Win</h2>

      {result ? (
        <div className="text-black p-4 mb-4 border rounded bg-green-50">
          <h3 className="font-semibold">Uduşunuz:</h3>
          <p>
            Code: {result.prize.code} <br />
            Azərbaycan: {result.prize.az}
          </p>
        </div>
      ) : null}

      {error && (
        <div className="p-2 mb-4 border rounded bg-red-50 text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Fullname</label>
          <input
            type="text"
            {...register("fullname", { required: "Fullname is required" })}
            className="w-full p-2 border rounded"
          />
          {errors.fullname && <p className="text-red-600">{errors.fullname.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full p-2 border rounded"
          />
          {errors.email && <p className="text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Mobile</label>
          <input
            type="text"
            {...register("mobile", { required: "Mobile is required" })}
            className="w-full p-2 border rounded"
          />
          {errors.mobile && <p className="text-red-600">{errors.mobile.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {isSubmitting ? "Gözləyin..." : "Qeydiyyatdan keç"}
        </button>
      </form>
    </div>
  );
}
