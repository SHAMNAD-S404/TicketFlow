"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CheckCircle2 } from "lucide-react"; // Import CheckCircle2 icon for the empty state

interface TicketStatusData {
  pending: number;
  "in-progress": number;
  "re-opened": number;
}

interface PieChartProps {
  title: string;
  ticketData?: TicketStatusData;
  isLoading?: boolean;
}

const statusColors = {
  pending: "hsl(var(--chart-1))",
  "in-progress": "hsl(var(--chart-2))",
  "re-opened": "hsl(var(--chart-3))",
};

export const PieChartComponent: React.FC<PieChartProps> = ({ title, ticketData, isLoading }) => {
  // Transform ticket data for the chart
  const chartData = React.useMemo(() => {
    if (!ticketData) return [];

    return Object.entries(ticketData).map(([status, count]) => ({
      status,
      count,
      fill: statusColors[status as keyof typeof statusColors],
    }));
  }, [ticketData]);

  // Calculate total tickets
  const totalTickets = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  // Check if all values are zero
  const hasNoTickets = React.useMemo(() => {
    if (!ticketData) return true;
    return Object.values(ticketData).every((value) => value === 0);
  }, [ticketData]);

  // Chart configuration
  const chartConfig: ChartConfig = {
    count: {
      label: "Tickets",
    },
    pending: {
      label: "Pending",
      color: statusColors.pending,
    },
    "in-progress": {
      label: "In Progress",
      color: statusColors["in-progress"],
    },
    "re-opened": {
      label: "Re-opened",
      color: statusColors["re-opened"],
    },
  };

  if (isLoading) {
    return (
      <Card className="flex flex-col w-full h-full">
        <CardHeader className="items-center pb-0">
          <CardTitle className="font-semibold text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[350px]">
          <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-primary" />
        </CardContent>
      </Card>
    );
  }

  if (hasNoTickets) {
    return (
      <Card className="flex flex-col w-full h-full">
        <CardHeader className="items-center pb-0">
          <CardTitle className="font-semibold text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[350px] text-center">
          <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
          <p className="text-lg font-medium text-foreground">No Unresolved Tickets</p>
          <p className="text-sm text-muted-foreground mt-1">All tickets have been resolved. Great work!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col w-full h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle className="font-semibold text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px] w-full">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} animationDuration={300} />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={300}
              animationEasing="ease-in-out">
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                          {totalTickets}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          Total Tickets
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">Distribution of unresolved tickets by status</div>
      </CardFooter>
    </Card>
  );
};
