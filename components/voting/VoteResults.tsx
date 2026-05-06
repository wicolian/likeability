interface VoteResultsProps {
  count: number;
}

export function VoteResults({ count }: VoteResultsProps) {
  return (
    <div className="min-w-24 border-3 border-[var(--color-border)] bg-black px-3 py-2 text-center text-[10px] text-[var(--color-green)]">
      {count} VOTES
    </div>
  );
}
