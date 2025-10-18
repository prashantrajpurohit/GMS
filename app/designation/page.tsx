import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { DASHBOARD_DUMMY } from "@/lib/constants";
export default function Page() {
  console.log("[Desgination] Rendered at:", new Date().toISOString());
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 ">
          <SectionCards />
          <div className="">
            <ChartAreaInteractive />
          </div>
          <DataTable data={DASHBOARD_DUMMY} />
        </div>
      </div>
    </div>
  );
}
