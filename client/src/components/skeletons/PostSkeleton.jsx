import { Skeleton } from "../ui/skeleton";

export function PostSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full p-4">
      <div className="flex gap-4 items-center">
        <Skeleton className="size-10 rounded-full shrink-0" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-2 w-12 rounded-full" />
          <Skeleton className="h-2 w-24 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-40 w-full" />
    </div>
  );
}
