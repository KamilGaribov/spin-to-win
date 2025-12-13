"use client";

// import { useSearchParams } from "next/navigation";
import SpinForm from "./components/form";
import { Suspense } from "react";


export default function PosterPage() {
  // const searchParams = useSearchParams();
  // const posterNumber = searchParams.get("poster") ?? "";

  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <div className="w-1/2 h-1/2 bg-blue-400 m-auto mt-20">
        <h1>Poster Page</h1>
        <SpinForm />
      </div>
    </Suspense>
  );
}