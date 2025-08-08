import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-primary mr-2" />
            <span className="text-xl font-bold">WorkflowHub</span>
          </div>
          <div className="flex items-center justify-center mb-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
          </div>
          <CardTitle className="text-2xl">Loading...</CardTitle>
          <CardDescription>
            Please wait while we load your content.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              This should only take a moment.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
