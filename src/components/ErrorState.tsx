import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = "Algo deu errado",
  description = "Ocorreu um erro ao carregar os dados. Tente novamente.",
  onRetry,
  retryLabel = "Tentar novamente",
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-red-50 p-4">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-red-900">{title}</h3>
      <p className="mt-2 text-sm text-red-600 max-w-sm">{description}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
