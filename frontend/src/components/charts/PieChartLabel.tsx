"use client";

import { CheckCircle2, TrendingUp } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import React from "react";

interface PriorityData {
  [priority: string]: number;
}

interface PieChartLabelProps {
  title: string;
  priorityData?: PriorityData;
  isLoading?: boolean;
}

const COLOR_PALETTE = [
  "hsl(var(--chart-1))", // High priority - Red
  "hsl(var(--chart-2))", // Medium priority - Orange
  "hsl(var(--chart-3))", // Low priority - Green
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export const PieChartLabelComponent: React.FC<PieChartLabelProps> = ({ title, priorityData, isLoading = false }) => {
  const chartData = React.useMemo(() => {
    if (!priorityData) return [];

    return Object.entries(priorityData).map(([priority, count], index) => ({
      priority,
      count,
      fill: COLOR_PALETTE[index % COLOR_PALETTE.length],
    }));
  }, [priorityData]);

  const chartConfig: ChartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      count: {
        label: "Tickets",
      },
    };

    if (priorityData) {
      Object.keys(priorityData).forEach((priority, index) => {
        config[priority] = {
          label: priority
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          color: COLOR_PALETTE[index % COLOR_PALETTE.length],
        };
      });
    }

    return config;
  }, [priorityData]);

  const totalTickets = React.useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.count, 0);
  }, [chartData]);

  // Check if all values are zero or if there's no data
  const hasNoTickets = React.useMemo(() => {
    if (!priorityData) return true;
    return Object.values(priorityData).every((value) => value === 0);
  }, [priorityData]);

  if (isLoading) {
    return (
      <Card className="flex flex-col w-full h-full">
        <CardHeader className="items-center pb-0 space-y-2">
          <div className="h-6 w-2/3 bg-muted animate-pulse rounded" />
          <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="aspect-square max-h-[250px] w-full bg-muted animate-pulse rounded-full mx-auto" />
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
          <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
        </CardFooter>
      </Card>
    );
  }

  if (hasNoTickets) {
    return (
      <Card className="flex flex-col w-full h-full">
        <CardHeader className="items-center pb-0">
          <CardTitle className="font-semibold text-lg">{title}</CardTitle>
          <CardDescription>Priority Distribution</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[250px] text-center">
          <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <p className="text-lg font-medium text-foreground mt-4">No Priority Tickets</p>
          <p className="text-sm text-muted-foreground mt-1">There are currently no tickets assigned with priorities</p>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="leading-none text-muted-foreground">All caught up with priority assignments</div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col w-full h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle className="font-semibold text-lg">{title}</CardTitle>
        <CardDescription>Priority Distribution</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] w-full [&_.recharts-text]:fill-background">
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="count" hideLabel formatter={(value: any) => `${value} tickets`} />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="priority"
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius="80%"
              paddingAngle={2}
              animationDuration={1000}
              animationBegin={0}>
              <LabelList
                dataKey="priority"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: string) =>
                  value
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Total Tickets: {totalTickets}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">Distribution of tickets by priority level</div>
      </CardFooter>
    </Card>
  );
};
