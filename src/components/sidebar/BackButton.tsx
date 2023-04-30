export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="flex w-fit font-semibold text-primary" onClick={onClick}>
      <div className="mr-2">&#8592;</div>
      <div>back</div>
    </button>
  );
}
