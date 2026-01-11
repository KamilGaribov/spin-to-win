import Head from 'next/head';

type PageProps = {
  searchParams: Promise<{
    poster?: string;
  }>;
};

export default async function PosterPage({ searchParams }: PageProps) {
  const { poster } = await searchParams;
  const posterNumber = poster ?? "";

  return (
    <div className="w-full h-full">
        salam
    </div>
  );
}
