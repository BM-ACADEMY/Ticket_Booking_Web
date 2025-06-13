import { useRef, useEffect, useState } from "react";
import { useAuth } from "@/module/context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import ReportCard from "./ReportCard";

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const { user } = useAuth();
  const calledOnceRef = useRef(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/reports/fetch-all-report?adminId=${user?._id}`,
          { withCredentials: true }
        );
        console.log("API Response:", res.data.reports);
        setReports(res.data.reports || []);
        calledOnceRef.current = true;
      } catch (err) {
        console.error("Error loading reports:", err);
      }
    };

    if (user?._id && !calledOnceRef.current) {
      fetchReports();
    }
  }, [user?._id]);

  return (
    <div className="p-4">
      {reports.length > 0 && (
        <h2
          className="text-xl font-semibold mb-4 text-center text-white p-2 rounded-sm"
          style={{ backgroundColor: "#030049" }}
        >
          Daily Reports
        </h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.length > 0 ? (
          reports.flatMap((report) => [
            <ReportCard key={`${report._id}-1`} report={report} />,
            // <ReportCard key={`${report._id}-2`} report={report} />,
          ])
        ) : (
          <div className="col-span-full text-center text-muted-foreground">
            No reports found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportList;