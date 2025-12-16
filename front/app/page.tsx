import SpinForm from "./components/form";

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
      <SpinForm posterNumber={posterNumber} />
    </div>
  );
}
