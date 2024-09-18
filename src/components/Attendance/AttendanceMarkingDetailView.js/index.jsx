import React, { useEffect, useState } from "react";
import moment from "moment";
import { cloneDeep, find } from "lodash";

import StaffAttendance from "../../Staff/StaffAttendanceListItem";
import Button from "../../common/neomorphic/Button";
import FlatList from "../../common/FlatList";
import { MARK_ATTENDANCE } from "../../../graphql/mutations/attendance/MarkAttendance";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import EmptyData from "../../common/EmptyData";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";

export default function AttendanceMarkingDetailView({ selectedRecord }) {
  let [availableStaff, setAvailableStaffs] = useState([]);
  let [attendanceMarkedArray, setAttendanceMarkedArray] = useState([]);

  const [saveAttendanceRecords, { loading }] = useMutation(MARK_ATTENDANCE, {
    onCompleted: onAttendanceCompleted,
  });

  function onAttendanceCompleted() {
    toast.success(
      `${moment(selectedRecord.selectedDate).format(
        "dddd , Do MMMM YYYY"
      )} attendance submitted successfully.`
    );
  }

  async function saveAttendance() {
    const attendanceData = cloneDeep(attendanceMarkedArray);
    if (attendanceData.length) {
      const params = {
        attendances: attendanceData,
        serviceSubscriptionId: selectedRecord.objectId,
      };
      await saveAttendanceRecords({
        variables: { params },
      });
    }
  }

  function markAttendance(action, state, currentStaff) {
    let staffObj = cloneDeep(currentStaff);
    staffObj.isPresent = !state;

    if (action === "checkin") {
      staffObj.inTime = state ? null : new Date();
    } else {
      staffObj.outTime = state ? null : new Date();
    }

    const attendanceObject = {
      date: selectedRecord.selectedDate,
      serviceStaff: staffObj.serviceStaffId,
      attendanceId: staffObj.attendanceId,
      staffId: staffObj.staff.objectId,
      outTime: staffObj.outTime || null,
    };

    if (staffObj?.inTime) {
      (attendanceObject.inTime = staffObj.inTime || state),
        (attendanceObject.isPresent = true);
    }
    if (staffObj?.outTime) {
      (attendanceObject.outTime = staffObj.outTime || state),
        (attendanceObject.isPresent = true);
    }

    const isAttendanceFound = find(attendanceMarkedArray, {
      staffId: staffObj.staff.objectId,
    });

    if (isAttendanceFound) {
      isAttendanceFound.inTime = attendanceObject.inTime;
      isAttendanceFound.outTime = attendanceObject.outTime;
    } else {
      setAttendanceMarkedArray([...attendanceMarkedArray, attendanceObject]);
    }

    // update available staff array

    setAvailableStaffs([
      ...availableStaff.map((staffNode) => {
        if (staffNode.staff.objectId === staffObj.staff.objectId) {
          return {
            ...staffNode,
            inTime: attendanceObject.inTime,
            outTime: attendanceObject.outTime,
          };
        } else return staffNode;
      }),
    ]);
  }

  useEffect(() => {
    let attendanceStaff = [];
    if (selectedRecord.serviceStaffs?.edges?.length) {
      selectedRecord.serviceStaffs?.edges?.forEach((item) => {
        const attendance = selectedRecord?.attendances?.edges?.find(
          ({ node }) => node.serviceStaff.objectId === item.node.objectId
        );

        let attendanceObj = {
          serviceStaff: item.node,
          staff: item?.node?.staff || {},
          attendanceId: attendance?.node?.objectId || null,
          isTemporary: attendance?.node?.isTempoarary || false,
          serviceStaffId: item.node.objectId,
          date: selectedRecord.selectedDate,
          isPresent: attendance?.node?.isPresent,
          mode: attendance?.node?.mode,
          shift: attendance?.node?.shift,
          type: item.type,
          inTime: attendance?.node?.inTime,
          outTime: attendance?.node?.outTime,
        };
        attendanceStaff.push(attendanceObj);
      });
      setAvailableStaffs(attendanceStaff);
    } else setAvailableStaffs([]);
  }, [
    selectedRecord?.attendances?.edges?.length,
    selectedRecord.serviceStaffs?.edges?.length,
  ]);

  return (
    <div className="mt-6">
      {availableStaff?.length ? (
        <>
          <FlatList
            data={availableStaff}
            renderItem={({ item: node }, index) => {
              console.log("node", node);
              return (
                <StaffAttendance
                  {...{
                    markAttendance,
                    attendance: node,
                    image: node.staff.profileImage,
                    desc: node.type,
                    firstName: node.staff.firstName,
                    lastName: node.staff.lastName,
                    mobileNumber: node.staff.mobileNumber,
                  }}
                />
              );
            }}
          />
          <div className="pt-4 text-right">
            <Button
              onClick={saveAttendance}
              loading={loading}
              className="gap-2 rounded-full"
            >
              Save
            </Button>
          </div>
        </>
      ) : (
        <EmptyData
          icon={<UserGroupIcon className="w-6 h-6" />}
          msg="No Staff Available!"
        />
      )}
    </div>
  );
}
