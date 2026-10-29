import { Skeleton } from "../ui/skeleton";

export function ProfileHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-2 w-full my-2 p-4">
      <div className="flex gap-2 items-center">
        <div className="flex flex-1 gap-1">
          <div className="flex flex-col gap-1 w-full">
            <Skeleton className="h-4 w-12 rounded-full" />
            <Skeleton className="h-4 w-16 rounded-full" />
            <Skeleton className="h-40 w-full relative">
              <Skeleton className="h-20 w-20 rounded-full border absolute -bottom-10 left-3" />
            </Skeleton>
            <Skeleton className="h-6 mt-4 w-24 ml-auto rounded-full" />
            <Skeleton className="h-4 w-14 rounded-full mt-4" />
            <Skeleton className="h-4 w-20 rounded-full" />
            <Skeleton className="h-4 w-2/3 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
