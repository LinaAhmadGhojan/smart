import { Card, CardContent, CardHeader } from "./ui/card";

export function ProductSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="h-64 bg-gray-200 animate-pulse" />
      
      <CardHeader className="space-y-4">
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
        </div>
        
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
          <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
        </div>

        <div className="h-7 bg-gray-300 rounded animate-pulse w-1/3" />
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
      </CardContent>

      <div className="px-6 pb-6">
        <div className="h-10 bg-gray-200 rounded animate-pulse mb-3" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3 mx-auto" />
      </div>
    </Card>
  );
}
