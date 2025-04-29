// TicketStaticsCards.tsx
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export interface IStatsCardData {
  title: string;
  value: string | number;
  description?: string;
  icon? : JSX.Element;
}

interface ITableStaticCards {
  loading: boolean;
  data: IStatsCardData[];
  cardNo ? : number;
}

const TableStaticCards: React.FC<ITableStaticCards> = ({ loading, data , cardNo = 4 }) => {
  return (
    <div className="flex items-center justify-evenly mt-4 flex-wrap gap-4">
      {(loading ? Array(cardNo).fill(null) : data).map((card, index) => (
        <Card key={index} className="w-72 h-40 bg-white border-none shadow-lg shadow-gray-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-center text-lg text-center font-semibold">
              {loading ? <Skeleton className="h-6 w-full bg-gray-200" /> :
              <>
              { card?.title}
              { card.icon }
              </>
             }
            </CardTitle>
            <CardDescription>
              {loading ? (
                <Skeleton className="h-[90px] w-full rounded-xl bg-gray-200" />
              ) : (
                <p className="text-4xl text-center font-bold mt-4 text-blue-600 font-mono ">  {card?.value}</p>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>{loading ? "" : card?.description ?? ""}</p>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default TableStaticCards;
