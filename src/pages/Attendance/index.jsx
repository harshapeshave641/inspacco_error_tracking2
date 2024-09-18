import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import moment from "moment";

import CalendarIcon from "@heroicons/react/24/solid/CalendarDaysIcon";

import { _getStatusType } from "../../helpers/utils";

import DashboardTopBar from "../../components/common/Dashboard/DashboardTopBar";
import Drilldown from "../../components/common/Cards/Drilldown";

import { GET_ACTIVE_SERVICE_SUBSCRIPTIONS_BY_SOCIETY } from "../../graphql/queries/getActiveServiceSubscriptionsBySociety";
import { GET_MARKED_ATTENDACE } from "../../graphql/queries/getMarkedAttendance";
import { GET_SERVICE_STAFFS } from "../../graphql/queries/getServiceStaffs";

const Attendance = () => {
  let [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  let [selectedSub, setSelectedSub] = useState({});
  let [activeSubs, setActiveSubs] = useState(null);
  const [serviceStaffsData, setServiceStaffsData] = useState(null);

  let { activeAccountId } = useSelector((state) => state.authSlice);

  const [getActiveServiceSubs, { loading: serviceSubsLoading }] = useLazyQuery(
    GET_ACTIVE_SERVICE_SUBSCRIPTIONS_BY_SOCIETY,
    {
      onCompleted: (data) => {
        const res = data?.serviceSubscriptions?.edges || [];
        setActiveSubs(res);
        setSelectedSub(res.length ? res[0]?.node : {});
      },
      skip: !activeAccountId,
    }
  );

  const startDate = moment(dateRange.startDate).startOf("date").toDate();
  const endDate = moment(dateRange.startDate).endOf("date").toDate();

  const [getServiceStaff, { loading: serviceStaffLoading }] = useLazyQuery(
    GET_SERVICE_STAFFS,
    {
      onCompleted: (res) => setServiceStaffsData(res),
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "cache-and-network",
    }
  );

  const [getMarkedAttendance, { data: markedAttendanceData }] = useLazyQuery(
    GET_MARKED_ATTENDACE,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
    }
  );

  useEffect(() => {
    setServiceStaffsData(null);
    getActiveServiceSubs({
      variables: {
        societyId: activeAccountId,
        today: moment().toDate(),
      },
    });
  }, [activeAccountId]);
  function handleChangeInInput() {
    setServiceStaffsData(null);
    getServiceStaff({
      variables: {
        serviceSubscriptionId: selectedSub.objectId,
        date: endDate,
      },
    });
    getMarkedAttendance({
      variables: {
        serviceSubscriptionId: selectedSub.objectId,
        startDate,
        endDate,
      },
    });
  }

  useEffect(() => {
    if (selectedSub.objectId) handleChangeInInput();
  }, [selectedSub.objectId]);

  useEffect(() => {
    handleChangeInInput();
  }, [dateRange.startDate]);

  const filterServiceSubs = ({ text: filterStr }) =>
    activeSubs?.filter(
      ({ node }) =>
        node.service.name.toLowerCase().indexOf(filterStr.toLowerCase()) > -1
    ) || [];

  const refreshDataClicked = () => {
    getActiveServiceSubs();
    getServiceStaff();
    getMarkedAttendance();
  };

  return (
    <div className="p-4 flex flex-col gap-2">
      <DashboardTopBar
        singleDatePicker
        dateRange={dateRange}
        onRefreshDataClicked={refreshDataClicked}
        updateDashboardPeriod={({ startDate, endDate }) =>
          setDateRange({
            startDate: moment(startDate).add(6, "hours"),
            endDate: moment(endDate).add(6, "hours"),
          })
        }
      />
      <Drilldown
        {...{
          source: "attendance",
          itemIcon: <CalendarIcon className="w-6 h-6 text-accent" />,
          leftSideLoading: serviceSubsLoading,
          rightSideLoading: serviceStaffLoading,
          listData: activeSubs,
          listFilterFn: filterServiceSubs,
          onItemSelect: setSelectedSub,
          activeItemDetails: {
            ...selectedSub,
            ...serviceStaffsData,
            ...markedAttendanceData,
            selectedDate: startDate,
          },
        }}
      />
    </div>
  );
};

export default Attendance;
