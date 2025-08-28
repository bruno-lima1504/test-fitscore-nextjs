import { FileX, Search } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  type?: "no-data" | "no-results";
}

export function EmptyState({
  title,
  description,
  type = "no-data",
}: EmptyStateProps) {
  const Icon = type === "no-results" ? Search : FileX;

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        {description}
      </p>
    </div>
  );
}
