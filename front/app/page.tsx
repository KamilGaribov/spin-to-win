"use client";

import { useSearchParams } from "next/navigation";
import SpinForm from "./components/form";

export default function PosterPage() {
  const searchParams = useSearchParams();
  const posterNumber = searchParams.get("poster") ?? "";

  return (
    <div className="w-1/2 h-1/2 bg-blue-400 m-auto mt-20">
      <h1>Poster Page</h1>
      <p>Poster number: {posterNumber}</p>
      <SpinForm posterNumber={posterNumber} />
    </div>
  );
}