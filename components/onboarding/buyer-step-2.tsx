"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Chrome,
  Mail,
  MessageSquare,
  FileText,
  Calendar,
  Zap,
  Github,
  Slack,
  FileText as Notion,
  Palette as Figma,
  Trello,
  Building as Asana,
} from "lucide-react";

interface BuyerStep2Props {
  onNext: (data: any) => void;
  onPrevious: () => void;
  isSaving: boolean;
}

const integrations = [
  {
    id: "google",
    name: "Google Workspace",
    icon: Chrome,
    description: "Gmail, Drive, Calendar",
  },
  {
    id: "slack",
    name: "Slack",
    icon: Slack,
    description: "Team communication",
  },
  {
    id: "notion",
    name: "Notion",
    icon: Notion,
    description: "Notes and documentation",
  },
  {
    id: "github",
    name: "GitHub",
    icon: Github,
    description: "Code repositories",
  },
  {
    id: "figma",
    name: "Figma",
    icon: Figma,
    description: "Design and prototyping",
  },
  {
    id: "trello",
    name: "Trello",
    icon: Trello,
    description: "Project management",
  },
  {
    id: "asana",
    name: "Asana",
    icon: Asana,
    description: "Task and project management",
  },
  {
    id: "zapier",
    name: "Zapier",
    icon: Zap,
    description: "Workflow automation",
  },
];

export default function BuyerStep2({
  onNext,
  onPrevious,
  isSaving,
}: BuyerStep2Props) {
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>(
    []
  );

  const toggleIntegration = (integrationId: string) => {
    setSelectedIntegrations((prev) =>
      prev.includes(integrationId)
        ? prev.filter((id) => id !== integrationId)
        : [...prev, integrationId]
    );
  };

  const handleNext = () => {
    onNext({
      step: "buyer-2",
      integrations: selectedIntegrations,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Connect Your Tools</h3>
        <p className="text-muted-foreground">
          Connect your favorite tools to get personalized workflow
          recommendations. This step is optional.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          const isSelected = selectedIntegrations.includes(integration.id);

          return (
            <Card
              key={integration.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? "ring-2 ring-primary bg-primary/5"
                  : "hover:bg-muted/50"
              }`}
              onClick={() => toggleIntegration(integration.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={isSelected}
                    onChange={() => toggleIntegration(integration.id)}
                    className="mt-0"
                  />
                  <Icon
                    className={`h-6 w-6 ${
                      isSelected ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{integration.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {integration.description}
                    </p>
                  </div>
                  {isSelected && (
                    <Badge variant="secondary" className="text-xs">
                      Connected
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-muted/50 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <h4 className="font-medium text-sm mb-1">
              Why connect integrations?
            </h4>
            <p className="text-sm text-muted-foreground">
              Connecting your tools helps us recommend workflows that work
              seamlessly with your existing setup. You can always connect more
              tools later from your dashboard.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4">
        <Button variant="outline" onClick={onPrevious} disabled={isSaving}>
          Previous
        </Button>

        <Button
          onClick={handleNext}
          disabled={isSaving}
          className="min-w-[100px]"
        >
          {isSaving ? "Saving..." : "Next"}
        </Button>
      </div>
    </div>
  );
}
