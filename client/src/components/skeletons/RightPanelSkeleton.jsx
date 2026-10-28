import { Skeleton } from "../ui/skeleton";
export function RightPanelSkeleton() {
  return (
    <div className="flex flex-col gap-2 w-52 my-2">
      <div className="flex flex-col items-center">
        <Skeleton className="size-8 rounded-full shrink-0" />
        <div className="flex flex-1 justify-between">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-2 w-12 rounded-full" />
            <Skeleton className="h-2 w-16 rounded-full" />
          </div>
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
}
