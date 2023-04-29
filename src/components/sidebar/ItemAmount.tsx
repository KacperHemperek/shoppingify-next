export function ItemAmount({ amount }: { amount: number }) {
  return (
    <div className="w-max rounded-full border-2 border-primary px-4 py-1 text-sm ">
      <span className="font-semibold">{amount}</span> psc
    </div>
  );
}
