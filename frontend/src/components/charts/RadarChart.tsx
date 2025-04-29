"use client";

import { CheckCircle2, TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import React from "react";

interface DepartmentData {
  [department: string]: number;
}

interface RadarChartProps {
  title?: string;
  departmentData?: DepartmentData;
  isLoading?: boolean;
  currentTime?: string;
  currentUser?: string;
}

const CHART_COLORS = [
  "#2563eb", // Blue
  "#16a34a", // Green
  "#ea580c", // Orange
  "#8b5cf6", // Purple
  "#06b6d4", // Cyan
];

const CustomTick = (props: any) => {
  const { x, y, payload } = props;
  const words = payload.value.split(" ");

  return (
    <g transform={`translate(${x},${y})`}>
      {words.map((word: string, index: number) => (
        <text key={index} x={0} y={index * 12} textAnchor="middle" fill="currentColor" fontSize={12} fontWeight={500}>
          {word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()}
        </text>
      ))}
    </g>
  );
};

export function RadarChartComponent({
  title = "Department Ticket Distribution",
  departmentData,
  isLoading = false,
  currentTime = "2025-04-29 01:21:00",
  currentUser = "SHAMNAD-S404",
}: RadarChartProps) {
  // Check if all values are zero or if there's no data
  const hasNoTickets = React.useMemo(() => {
    if (!departmentData) return true;
    return Object.values(departmentData).every((value) => value === 0);
  }, [departmentData]);

  const chartData = React.useMemo(() => {
    if (!departmentData) return [];

    return Object.entries(departmentData).map(([dept, count]) => ({
      department: dept,
      value: count,
    }));
  }, [departmentData]);

  const chartConfig: ChartConfig = React.useMemo(() => {
    const config: ChartConfig = {};

    Object.keys(departmentData || {}).forEach((dept, index) => {
      config[dept] = {
        label: dept,
        color: CHART_COLORS[index % CHART_COLORS.length],
      };
    });

    return config;
  }, [departmentData]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="items-center pb-4">
          <div className="h-6 w-2/3 bg-muted animate-pulse rounded" />
          <div className="h-4 w-1/2 bg-muted animate-pulse rounded mt-2" />
        </CardHeader>
        <CardContent className="pb-0">
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
      <Card>
        <CardHeader className="items-center pb-4">
          <CardTitle>{title}</CardTitle>
          <CardDescription>Ticket department distribution</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[350px] text-center">
          <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <p className="text-lg font-medium text-foreground mt-4">No Department Data</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-[250px]">
            There are currently no tickets distributed across departments
          </p>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm"></CardFooter>
      </Card>
    );
  }

  const totalTickets = Object.values(departmentData || {}).reduce((sum, count) => sum + count, 0);

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>{title}</CardTitle>
        <CardDescription>Ticket department distribution</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent formatter={(value: any) => `${value} tickets`} />}
            />
            <PolarGrid stroke="var(--border)" strokeOpacity={0.5} />
            <PolarAngleAxis dataKey="department" tick={CustomTick} tickLine={false} axisLine={false} dy={4} />
            <Radar
              name="Tickets"
              dataKey="value"
              stroke="hsl(var(--chart-1))"
              fill="hsl(var(--chart-1))"
              fillOpacity={0.4}
              dot={{
                r: 4,
                fill: "hsl(var(--chart-1))",
                strokeWidth: 0,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Total Tickets: {totalTickets}
          <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
