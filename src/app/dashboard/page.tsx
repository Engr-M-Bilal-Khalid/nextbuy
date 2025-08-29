import type { Metadata } from "next";
import DemographicCard from "./components/overview/DemographicCard";
import MonthlySalesChart from "./components/overview/MonthlySalesChart";
import MonthlyTarget from "./components/overview/MonthlyTarget";
import { OverviewMetrics } from "./components/overview/OverviewMetrics";
import RecentOrders from "./components/overview/RecentOrders";
import StatisticsChart from "./components/overview/StatisticsChart";


export default function Page() {
    return (
        <div className="grid grid-cols-12 gap-4 md:gap-6 p-5 lg:p-10">
            <div className="col-span-12 space-y-6 xl:col-span-7">
                <OverviewMetrics />

                <MonthlySalesChart />
            </div>

            <div className="col-span-12 xl:col-span-5">
                <MonthlyTarget />
            </div>

            <div className="col-span-12">
                <StatisticsChart />
            </div>

            <div className="col-span-12 xl:col-span-5">
                <DemographicCard />
            </div>

            <div className="col-span-12 xl:col-span-7">
                <RecentOrders />
            </div>

        </div>
    );
}
