import { Card, CardContent, CardHeader } from "../ui/card";

export const ShimmerCard = () => (
  <Card className="border-border/50 animate-pulse">
    <CardHeader className="pb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="h-16 w-16 bg-muted rounded-full" />
        <div className="h-6 w-24 bg-muted rounded" />
      </div>
      <div className="h-6 w-32 bg-muted rounded mb-2" />
      <div className="h-5 w-20 bg-muted rounded" />
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="space-y-2">
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-3/4 bg-muted rounded" />
        <div className="h-4 w-1/2 bg-muted rounded" />
      </div>
      <div className="pt-3 border-t border-border">
        <div className="h-4 w-full bg-muted rounded mb-2" />
        <div className="h-4 w-5/6 bg-muted rounded" />
      </div>
      <div className="flex gap-2 pt-3 border-t border-border">
        <div className="h-9 flex-1 bg-muted rounded" />
      </div>
    </CardContent>
  </Card>
);
export const StatsCardShimmer = () => (
  <Card className="border-border/50 animate-pulse">
    <CardHeader className="pb-3">
      <div className="h-4 w-24 bg-muted rounded mb-2" />
      <div className="h-8 w-16 bg-muted rounded" />
    </CardHeader>
    <CardContent>
      <div className="h-4 w-32 bg-muted rounded" />
    </CardContent>
  </Card>
);
