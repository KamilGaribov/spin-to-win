// import SpinForm from "./components/form";

// type PageProps = {
//   searchParams: Promise<{
//     poster?: string;
//   }>;
// };

// export default async function PosterPage({ searchParams }: PageProps) {
//   const { poster } = await searchParams;
//   const posterNumber = poster ?? "";

//   return (
//     <div id="spin-page" className="min-h-screen w-full bg-spin bg-cover bg-center">
//       <SpinForm posterNumber={posterNumber} />
//     </div>
//   );
// }


import Head from "next/head";
import PromoForm from "./components/promo-form";
import PriveForm from "./components/prive/form";
import PriveWrapper from "./components/prive/prive-wrapper";

export const metadata = {
  title: "Balique.az - Prive",
  description: "Prive invitation at Balique.az",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function PrivePage() {
  return <PriveWrapper />
}
