"use client";

type RepositoryErrorAlertProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
};

export function RepositoryErrorAlert({
  title = "Something went wrong",
  message,
  onRetry,
}: RepositoryErrorAlertProps) {
  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-red-500">
          !
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-red-600 dark:text-red-400">
            {title}
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            {message}
          </p>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 rounded-md border px-3 py-1.5 text-sm font-medium transition hover:bg-muted"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}