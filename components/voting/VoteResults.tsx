interface VoteResultsProps {
  count: number;
}

export function VoteResults({ count }: VoteResultsProps) {
  return (
    <div className="vote-pill">
      {count} <span style={{ opacity: 0.7 }}>votes</span>
    </div>
  );
}
