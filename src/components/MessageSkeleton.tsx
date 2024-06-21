import { Skeleton } from "@/components/ui/skeleton"

export function MessageCardSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <div className="space-y-2">
        <Skeleton className="h-28 w-[500px]" />
      </div>
    </div>
  )
}
