// TicketStaticsCards.tsx
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export interface IStatsCardData {
  title: string;
  value: string | number;
  description?: string;
  icon : JSX.Element;
}

interface ITableStaticCards {
  loading: boolean;
  data: IStatsCardData[];
}

const TableStaticCards: React.FC<ITableStaticCards> = ({ loading, data }) => {
  return (
    <div className="flex items-center justify-evenly mt-4 flex-wrap gap-4">
      {(loading ? Array(4).fill(null) : data).map((card, index) => (
        <Card key={index} className="w-80  bg-white border-none shadow-lg shadow-gray-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-1 justify-center text-lg text-center font-semibold">
              {loading ? <Skeleton className="h-6 w-32 bg-gray-200" /> :
              <>
              { card?.title}
              { card.icon }
              </>
             }
            </CardTitle>
            <CardDescription>
              {loading ? (
                <Skeleton className="h-[125px] w-[250px] rounded-xl bg-gray-200" />
              ) : (
                <p className="text-4xl text-center font-bold mt-4 text-blue-600 ">  {card?.value}</p>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>{loading ? <Skeleton className="h-4 w-[200px]" /> : card?.description ?? ""}</p>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default TableStaticCards;
