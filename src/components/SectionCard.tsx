import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { cn } from "@/src/lib/utils";

interface SectionCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  completed?: boolean;
}

export function SectionCard({
  title,
  description,
  children,
  className,
  completed = false,
}: SectionCardProps) {
  return (
    <Card
      className={cn(
        "transition-all duration-200",
        completed && "ring-2 ring-green-500 ring-opacity-50",
        className
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{title}</CardTitle>
          {completed && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
              <svg
                className="h-3 w-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
