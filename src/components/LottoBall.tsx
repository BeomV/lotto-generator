"use client";

interface LottoBallProps {
  number: number;
  size?: "sm" | "md" | "lg";
  isBonus?: boolean;
  delay?: number;
  animate?: boolean;
}

function getBallGradient(num: number): string {
  if (num <= 10) return "linear-gradient(145deg, #fde047, #eab308)";
  if (num <= 20) return "linear-gradient(145deg, #67e8f9, #0891b2)";
  if (num <= 30) return "linear-gradient(145deg, #fca5a5, #dc2626)";
  if (num <= 40) return "linear-gradient(145deg, #d4d4d8, #71717a)";
  return "linear-gradient(145deg, #bef264, #65a30d)";
}

const sizeMap = {
  sm: { width: 30, height: 30, fontSize: 11 },
  md: { width: 44, height: 44, fontSize: 14 },
  lg: { width: 56, height: 56, fontSize: 18 },
};

export default function LottoBall({
  number,
  size = "md",
  isBonus = false,
  delay = 0,
  animate = false,
}: LottoBallProps) {
  const s = sizeMap[size];

  return (
    <div className="flex items-center gap-1">
      {isBonus && (
        <span className="text-white/30 text-xs font-medium mr-0.5">+</span>
      )}
      <div
        className={`lotto-ball ${animate ? "ball-pop" : ""}`}
        style={{
          width: s.width,
          height: s.height,
          fontSize: s.fontSize,
          background: getBallGradient(number),
          animationDelay: animate ? `${delay}ms` : undefined,
        }}
      >
        {number}
      </div>
    </div>
  );
}
