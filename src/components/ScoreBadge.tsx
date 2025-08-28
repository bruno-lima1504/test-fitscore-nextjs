import { Badge } from "@/src/components/ui/badge";
import { Classification } from "@/src/lib/types";

interface ScoreBadgeProps {
  classification: Classification;
  score?: number;
  showScore?: boolean;
}

export function ScoreBadge({
  classification,
  score,
  showScore = false,
}: ScoreBadgeProps) {
  const getVariantAndColor = (classification: Classification) => {
    switch (classification) {
      case "Fit Altíssimo":
        return {
          className: "bg-green-500 text-white hover:bg-green-600",
          variant: "default" as const,
        };
      case "Fit Aprovado":
        return {
          className: "bg-blue-500 text-white hover:bg-blue-600",
          variant: "default" as const,
        };
      case "Fit Questionável":
        return {
          className: "bg-yellow-500 text-white hover:bg-yellow-600",
          variant: "default" as const,
        };
      case "Fora do Perfil":
        return {
          className: "bg-red-500 text-white hover:bg-red-600",
          variant: "default" as const,
        };
      default:
        return {
          className: "bg-gray-500 text-white hover:bg-gray-600",
          variant: "secondary" as const,
        };
    }
  };

  const { className, variant } = getVariantAndColor(classification);

  return (
    <Badge variant={variant} className={className}>
      {classification}
      {showScore && score !== undefined && ` (${score})`}
    </Badge>
  );
}
