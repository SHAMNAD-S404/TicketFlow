import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";


interface ITicketStaticsCards {}

const TicketStaticsCards: React.FC<ITicketStaticsCards> = () => {
  const ticketCards = ["card 1", "card 2", "card 3", "card 4"];

  return (
    <div>
      <div className="flex items-center justify-evenly mt-4">
        {ticketCards.map((card, index) => (
          <Card key={index} className="w-80 bg-white border-none shadow-lg shadow-gray-400">
            <CardHeader>
              <CardTitle></CardTitle>
              <CardDescription>
                <Skeleton className="h-[125px] w-[250px] rounded-xl bg-gray-200 " />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p></p>
              <Skeleton className="h-4 w-[200px]" />
            </CardContent>
            <CardFooter>
              <p></p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TicketStaticsCards;
