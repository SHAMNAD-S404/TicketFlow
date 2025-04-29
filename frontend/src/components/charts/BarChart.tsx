"use client";

import { CheckCircle2, TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import React from "react";

interface DepartmentData {
  [department: string]: number;
}

interface BarChartProps {
  title: string;
  departmentData?: DepartmentData;
  isLoading?: boolean;
}

const COLOR_PALETTE = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
  "hsl(var(--chart-7))",
  "hsl(var(--chart-8))",
];

export const BarChartComponent: React.FC<BarChartProps> = ({ title, departmentData, isLoading = false }) => {
  const chartData = React.useMemo(() => {
    if (!departmentData) return [];

    return Object.entries(departmentData).map(([department, count], index) => ({
      department,
      tickets: count,
      fill: COLOR_PALETTE[index % COLOR_PALETTE.length],
    }));
  }, [departmentData]);

  const chartConfig: ChartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      tickets: {
        label: "Tickets",
      },
    };

    if (departmentData) {
      Object.keys(departmentData).forEach((dept, index) => {
        config[dept] = {
          label: dept,
          color: COLOR_PALETTE[index % COLOR_PALETTE.length],
        };
      });
    }

    return config;
  }, [departmentData]);

  // Check if all values are zero or if there's no data
  const hasNoTickets = React.useMemo(() => {
    if (!departmentData) return true;
    return Object.values(departmentData).every((value) => value === 0);
  }, [departmentData]);

  const totalTickets = React.useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.tickets, 0);
  }, [chartData]);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="text-center space-y-2">
          <div className="h-6 w-2/3 mx-auto bg-muted animate-pulse rounded" />
          <div className="h-4 w-1/2 mx-auto bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-[300px] w-full bg-muted animate-pulse rounded" />
        </CardContent>
        <CardFooter className="flex-col items-start gap-2">
          <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
          <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
        </CardFooter>
      </Card>
    );
  }

  if (hasNoTickets) {
    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="font-semibold text-lg">{title}</CardTitle>
          <CardDescription>Department Ticket Distribution</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[300px] text-center">
          <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <p className="text-lg font-medium text-foreground mt-4">No Tickets Found</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-[250px]">
            There are currently no tickets in any department
          </p>
        </CardContent>
        <CardFooter className="flex-col items-center gap-2 text-sm"></CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="font-semibold text-lg">{title}</CardTitle>
        <CardDescription>Department Ticket Distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
              right: 20,
              top: 5,
              bottom: 5,
            }}>
            <YAxis
              dataKey="department"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={150}
              style={{ fontSize: "12px" }}
            />
            <XAxis dataKey="tickets" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey="tickets"
              layout="vertical"
              radius={[0, 5, 5, 0]}
              animationDuration={1000}
              animationBegin={0}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total tickets: {totalTickets}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">Distribution of tickets across departments</div>
      </CardFooter>
    </Card>
  );
};
