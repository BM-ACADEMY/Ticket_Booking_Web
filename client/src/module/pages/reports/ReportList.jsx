import ReportCard from "./ReportCard"
import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "@/module/context/AuthContext"
import { toast } from "react-toastify"

const ReportList = () => {
  const [reports, setReports] = useState([])
    const {user}=useAuth();
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/reports/fetch-all-report?adminId=${user?._id}`,
            { withCredentials: true }
        )
        toast.success(res.data.message || "Reports loaded successfully")
        setReports(res.data.reports || [])
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load reports")
        console.error("Error loading reports", err)
      }
    }

    if (user?._id) fetchReports()
  }, [user?._id])

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {reports.length > 0 ? (
        reports.map((report) => <ReportCard key={report._id} report={report} />)
      ) : (
        <div className="col-span-full text-center text-muted-foreground">No reports found.</div>
      )}
    </div>
  )
}

export default ReportList
