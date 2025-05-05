import { fetchCompanyDashboardData, fetchTicketCardStatsForDashboard } from "@/api/services/ticketService";
import TableStaticCards, { IStatsCardData } from "@/components/common/TableStaticCards";
import React, { useEffect, useState } from "react";
import { IoTicketOutline } from "react-icons/io5";
import { GoAlert } from "react-icons/go";
import { IoTimeOutline } from "react-icons/io5";
import { PieChartComponent } from "@/components/charts/PieChart";
import { BarChartComponent } from "@/components/charts/BarChart";
import { PieChartLabelComponent } from "@/components/charts/PieChartLabel";
import LeaderCard from "@/components/common/LeaderCard";
import { RadarChartComponent } from "@/components/charts/RadarChart";
import { LeaderBoardState, ticketDepartmentCount, TicketStatusData } from "@/interfaces/dashboard.interface";
import { toast } from "react-toastify";
import getErrMssg from "@/components/utility/getErrMssg";
import BusinessManImg from "../../../assets/images/businessMan.jpg";
import DepartmentImg from "../../../assets/images/department group.jpg";

const DashHome: React.FC = () => {
  //component states
  const [cardLoading, setCardLoading] = useState<boolean>(true);
  const [cardStats, setCardStats] = useState<IStatsCardData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [ticketData, setTicketData] = useState<TicketStatusData | undefined>();
  const [countByDeptartment, setCountByDepartment] = useState<ticketDepartmentCount | undefined>(undefined);
  const [ticketByPrioriy, setTicketByPriority] = useState<ticketDepartmentCount | undefined>(undefined);
  const [bestEmployee, setBestEmployee] = useState<LeaderBoardState | null>(null);
  const [topDepartment, setTopDepartment] = useState<LeaderBoardState | null>(null);

  //ticket static card data fetch
  useEffect(() => {
    const fetchCardStats = async () => {
      try {
        setIsLoading(true);
        const response = await fetchTicketCardStatsForDashboard();

        const stats: IStatsCardData[] = [
          {
            title: "All tickets",
            value: response.data.totalTickets,
            icon: <IoTicketOutline className="text-xl" />,
          },
          {
            title: "Pending tickets",
            value: response.data.openTickets,
            icon: <IoTicketOutline className="text-xl" />,
          },
          {
            title: "Closed Tickets",
            value: response.data.closedTickets,
            icon: <IoTicketOutline className="text-xl" />,
          },
          {
            title: "High Priority Tickets",
            value: response.data.highPriorityTickets,
            icon: <GoAlert className="text-xl " />,
          },
          {
            title: "Average resolution time",
            value: response.averageResolutionTime,
            icon: <IoTimeOutline className="text-xl " />,
          },
        ];
        setCardStats(stats);
        setCardLoading(false);
      } catch (error) {
        setIsLoading(true);
        console.log(error);
        
      }
    };

    fetchCardStats();
  }, []);

  useEffect(() => {
    const fetchDashbordData = async () => {
      try {
        setIsLoading(true);
        const result = await fetchCompanyDashboardData();

        setTicketData(result.data.ticketCountByStatus);
        setCountByDepartment(result.data.ticketsCountByDepartment);
        setTicketByPriority(result.data.ticketCountByPrioriy);
        setBestEmployee(result.data.topEmployee);
        setTopDepartment(result.data.topDepartment);
      } catch (error) {
        toast.warn(getErrMssg(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashbordData();
  }, []);

  return (
    <>
      <div className="w-full">
        <header>
          <div className="p-1">
            <TableStaticCards loading={cardLoading} data={cardStats} cardNo={5} />
          </div>
        </header>
        <main className="mt-2 p-3 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <section className="w-full">
              <PieChartComponent title="Unresolved tickets by status" isLoading={isLoading} ticketData={ticketData} />
            </section>
            <section className="w-full">
              <BarChartComponent
                title="Tickets by department"
                isLoading={isLoading}
                departmentData={countByDeptartment}
              />
            </section>
            <section className="w-full">
              <PieChartLabelComponent
                title="Unresolved tickets by prioriy"
                isLoading={isLoading}
                priorityData={ticketByPrioriy}
              />
            </section>
          </div>
        </main>
        <footer className="mt-2 p-3 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <section className="w-full">
              <LeaderCard
                name={bestEmployee?.name || ""}
                imageUrl={BusinessManImg}
                title="Leader Board "
                subTitle="Best Performing Employee"
                ticketCount={bestEmployee?.count.toString()!}
              />
            </section>
            <section className="w-full">
              <LeaderCard
                subTitle="Best performing department"
                name={topDepartment?.name || ""}
                imageUrl={DepartmentImg}
                title="Top Department"
                ticketCount={topDepartment?.count.toString()!}
              />
            </section>
            <section className="w-full">
              <RadarChartComponent title="Department wise" isLoading={isLoading} departmentData={countByDeptartment} />
            </section>
          </div>
        </footer>
      </div>
    </>
  );
};

export default DashHome;
