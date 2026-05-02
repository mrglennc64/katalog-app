/**
 * Score 0-100 with the Fortnox-style color coding:
 *   90–100 → green
 *   70–89  → yellow
 *    0–69  → red
 */
export function ScoreNumber({ score }: { score: number }) {
  const tone =
    score >= 90 ? "text-kh-green" : score >= 70 ? "text-[#a86c20]" : "text-kh-red";
  return (
    <p className="text-3xl font-semibold">
      <span className={tone}>{score}</span>{" "}
      <span className="text-base font-normal text-text-muted">/ 100</span>
    </p>
  );
}
