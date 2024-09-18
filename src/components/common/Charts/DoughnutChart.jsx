import { useMutation } from "@apollo/client";
import {
  Chart as ChartJS,
  Filler,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { GET_ATTENDNCE_STATS } from "../../../graphql/mutations/analytics/getAttendanceStats";
import { useEffect, useState } from "react";
import moment from "moment";

ChartJS.register(ArcElement, Tooltip, Legend, Tooltip, Filler, Legend);

function DoughnutChart({ startDate, endDate, societyIds = [] ,serviceSubscriptionIds=[]}) {
  const [getAttenanceStats] = useMutation(GET_ATTENDNCE_STATS);
  const [attendanceStats, setAttendanceStats] = useState([]);
  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  async function fetchAttendanceStats(sDate, eDate, sIds,subscriptionids) {
    const res = await getAttenanceStats({
      variables: {
        params: {
          societyIds: sIds,
          startDate: moment(sDate).startOf("date").toDate(),
          endDate: moment(eDate).endOf("date").toDate(),
          serviceSubscriptionIds:subscriptionids
        },
      },
    });

    const attendanceStats = res?.data?.callCloudCode?.result;
    const presentStaffCount = attendanceStats?.counts?.presentStaffCount;
    const absentStaffCount = attendanceStats?.counts?.absentStaffCount;
    const facialPercentage = attendanceStats?.counts?.facialPercentage;
    const manualPercentage = attendanceStats?.counts?.manualPercentage;
    const facialCount = presentStaffCount
      ? (presentStaffCount * facialPercentage) / 100
      : 0;
    const manualCount = presentStaffCount
      ? (presentStaffCount * manualPercentage) / 100
      : 0;
    setAttendanceStats([facialCount, manualCount, absentStaffCount]);
    //  setAttendanceStats([attendanceStats?.counts?.presentStaffCount,attendanceStats?.counts?.absentStaffCount])
    console.log("attendanceStats", attendanceStats);
  }

  useEffect(() => {
    fetchAttendanceStats(startDate, endDate, societyIds,serviceSubscriptionIds);
  }, [startDate, endDate, societyIds,serviceSubscriptionIds]);

  const labels = ["Present Facial", "Present Manual", "Absent"];

  const data = {
    labels,
    datasets: [
      {
        label: "Attendance Count",
        data: attendanceStats,
        backgroundColor: [
          "rgba(54, 162, 7, 0.8)",
          "rgba(54, 120, 235, 0.7)",
          "rgba(255, 99, 132, 0.8)",
        ],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };

  return <Doughnut width={350} height={350} options={options} data={data} />;
}

export default DoughnutChart;
