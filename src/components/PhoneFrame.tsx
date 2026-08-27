export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[19rem] rounded-[2.2rem] border border-border bg-card/50 p-2 shadow-2xl backdrop-blur sm:w-[21rem]">
      <div className="overflow-hidden rounded-[1.7rem] bg-background/80">{children}</div>
    </div>
  );
}
