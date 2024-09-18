import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import moment from "moment";
import { Bar } from "react-chartjs-2";
import { GET_SERVICEREQUESTS_STAT } from "../../../graphql/mutations/analytics/getServiceRequestStat";
import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
// import TitleCard from "../../../components/Cards/TitleCard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function ServiceRequestsBarChart({
  startDate,
  endDate,
  societyIds = [],
  selectedServices = [],
}) {
  console.log("barchart==", selectedServices);
  const [getServiceRequestStat] = useMutation(GET_SERVICEREQUESTS_STAT);
  const [serviceRequestCount, setserviceRequestCount] = useState([]);
  const [labels, setLabels] = useState([]);
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };
  async function fetchServiceRequestCount(sDate, eDate, sIds, sServices) {
    console.log("sServices", sServices);
    console.log("calling getServiceRequestStat");
    const params = {
      societyIds: sIds,
      startDate: moment(sDate).startOf("date").toDate(),
      endDate: moment(eDate).endOf("date").toDate(),
    };
    if (sServices?.filter((a) => a?.service?.objectId).length) {
      params["serviceIds"] =
        sServices?.filter((a) => a?.service).map((a) => a?.service?.objectId) ||
        [];
    }
    const res = await getServiceRequestStat({
      variables: {
        params,
      },
      skip: !sServices?.filter((a) => a?.service !== null).length,
    });
    const serviceRequestRes = res?.data?.callCloudCode?.result;
    const labelNames = Object.keys(serviceRequestRes);
    const valueNames = Object.values(serviceRequestRes);
    setLabels(labelNames);
    setserviceRequestCount(valueNames);
    console.log("serviceRequestRes", serviceRequestRes, labelNames, valueNames);
  }
  useEffect(() => {
    fetchServiceRequestCount(startDate, endDate, societyIds, selectedServices);
  }, [startDate, endDate, societyIds, selectedServices]);
  // const labels = [
  //   "January",
  //   "February",
  //   "March",
  //   "April",
  //   "May",
  //   "June",
  //   "July",
  // ];

  const data = {
    labels,
    datasets: [
      {
        label: "Service Requests",
        data: serviceRequestCount,
        backgroundColor: "rgba(53, 162, 235, 1)",
      },
    ],
  };

  return <Bar options={options} data={data} />;
}

export default ServiceRequestsBarChart;
