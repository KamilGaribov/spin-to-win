import SpinForm from "./components/form";

type PageProps = {
  searchParams: {
    poster?: string;
  };
};

export default function PosterPage({ searchParams }: PageProps) {
  const posterNumber = searchParams.poster ?? "";

  return (
    <div className="w-1/2 h-1/2 bg-blue-400 m-auto mt-20">
      <h1>Poster Page</h1>
      <SpinForm posterNumber={posterNumber} />
    </div>
  );
}
