import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Ticket, IndianRupee, BadgeInfo } from "lucide-react";
import { format } from "date-fns";

const ReportCard = ({ report }) => {
  return (
    <Card className="bg-white shadow-md">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center w-full justify-between">
            <span className="text-sm text-muted-foreground">
              {format(new Date(report.report_date), "dd MMM yyyy")}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-purple-600" />
              <span>Total Tickets:</span>
              <span className="font-semibold">{report.total_tickets_sold}</span>
            </div>

            <div className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-green-600" />
              <span>Total Earned:</span>
              <span className="font-semibold">₹{report.total_amount_earned}</span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-blue-600" />
              <span>Shows Booked:</span>
              <span className="font-semibold">{report.total_shows_booked}</span>
            </div>

            <div className="flex items-center gap-2">
              <BadgeInfo className="h-5 w-5 text-orange-500" />
              <span>Admin:</span>
              <span className="font-semibold">{report.admin_id?.name}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCard;