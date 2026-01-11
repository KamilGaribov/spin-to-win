import Head from "next/head";
import PromoForm from "../components/promo-form";

export const metadata = {
  title: "Promo kod qazan - Balique.az",
  description: "Get your promo code at Balique.az",
};

type PageProps = {
  searchParams: Promise<{
    poster?: string;
  }>;
};

export default async function PromoCodePage({ searchParams }: PageProps) {
  const { poster } = await searchParams;
  const posterNumber = poster ?? "";

  return (
    <>
      <Head>
        <title>Promo kod qazan - Balique.az</title>
        <meta name="description" content="Get your promo code at Balique.az" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        id="promo-page"
        className="relative min-h-screen bg-promo bg-cover bg-center"
      >
        <PromoForm posterNumber={posterNumber} />
      </div>
    </>
  );
}
