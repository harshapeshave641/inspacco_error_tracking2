import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useMutation } from "@apollo/client";
import moment from "moment";
import _ from "lodash";
import _debounce from "lodash/debounce";

import { ClockIcon } from "@heroicons/react/20/solid";

import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/neomorphic/Button";
import CustomDropdown from "../../../components/common/CustomDropdown";
import Select from "../../../components/common/neomorphic/Select";
import Modal from "../../../components/common/Modal";
import ActivityHistory from "../../../components/common/ActivityHistory";
import {
  _getPriorityType,
  _getStatusType,
  getHumanReadableDateTime,
} from "../../../helpers/utils";
import {
  priorityOptions,
  SERVICE_REQUEST_STATUS_OPTIONS,
} from "../../../constants";
import EditableSelect from "../../../components/common/EditableSelect";
import { UPDATE_SERVICE_QUOTATION_PARTNER_BY_ID } from "../../../graphql/mutations/serviceQuotation/updateServiceQuotationStatus";
// import { useTranslation } from "react-i18next";

const DetailsHeader = ({
  data: selectedRecord,
  selectedServicePartners,
  icon,
  onSubmit,
}) => {
  // const [status, setStatus] = useState(null);
  const [visitDate, setVisitDate] = useState();
  const [assignedPartner, setAssignedPartner] = useState(null);
  const [showActivityHistoryModal, setShowActivityHistoryModal] =
    useState(false);
  // const { t } = useTranslation();

  const [updateServiceQuotation] = useMutation(
    UPDATE_SERVICE_QUOTATION_PARTNER_BY_ID
  );

  const { isAdmin } = useSelector((state) => state.authSlice);

  function handleStatusChange(status) {
    onSubmit({ ...selectedRecord, status });
  }

  // let onChangeDebounce = useCallback(
  //   _debounce((value) => {
  //     onSubmit({
  //       ...selectedRecord,
  //       status: "VISIT_SCHEDULED",
  //       visitDate: value,
  //     });
  //   }, 500),
  //   [selectedRecord]
  // );

  useEffect(() => {
    setAssignedPartner(null);
  }, [selectedRecord.partner]);

  const _handleAssignPartner = async () => {
    if (selectedRecord.quotations.edges?.length) {
      const activeQuotation = selectedRecord.quotations.edges[0].node;
      await updateServiceQuotation({
        variables: {
          id: activeQuotation.objectId,
          partner: assignedPartner.value,
        },
      });
    }
    onSubmit({
      partner: { link: assignedPartner.value },
    });
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        {icon}
        <div className="text-lg text-accent">
          SR #{selectedRecord.displayId} - {selectedRecord.service.name}
        </div>
        <Button
          disabled={!selectedRecord?.id}
          className="inline-flex gap-2 btn-ghost btn-sm"
          onClick={(e) => setShowActivityHistoryModal(true)}
        >
          <ClockIcon className="w-3 h-3" />
          <span>History</span>
        </Button>{" "}
        {!isAdmin ? (
          <CustomDropdown
            className="ml-2"
            label="Actions"
            // disabled={selectedSR}
            // items={SERVICE_REQUEST_STATUS_OPTIONS?.filter(a=>[''])}
            items={[
              {
                label: "To Be Worked Upon",
                action: () => handleStatusChange("TO_BE_WORKED_UPON"),
                disabled: !(
                  selectedRecord?.status == "ORDER_ON_HOLD" ||
                  selectedRecord?.status == "ORDER_LOST"
                ),
              },
              // {
              //   label: "Quote Approved",
              //   action: () => handleStatusChange("QUOTATION_APPROVED"),
              //   disabled:
              //     selectedRecord?.status !== "QUOTATION_APPROVAL_PENDING",
              // },
              // {
              //   label: "Send Revised Quote",
              //   action: () => handleStatusChange("REVISED_QUOTATION_PENDING"),
              //   disabled:
              //     selectedRecord?.status !== "QUOTATION_APPROVAL_PENDING",
              // },
              {
                label: "Order on Hold",
                action: () => handleStatusChange("ORDER_ON_HOLD"),
                disabled:
                  !selectedRecord?.objectId ||
                  selectedRecord?.status == "ORDER_ON_HOLD",
              },
              {
                label: "Order Lost",
                action: () => handleStatusChange("ORDER_LOST"),
                disabled:
                  !selectedRecord?.objectId ||
                  selectedRecord?.status == "ORDER_LOST",
              },
            ]}
          />
        ) : null}
        {/* <ConfirmationWrapper
          onConfirm={() => {
            handleDeleteServiceRequest();
          }}
          confirmationMessage={`Are you Sure you want Delete Service Request ?`}
        >
          <Button
            disabled={!selectedRecord?.id}
            className="ml-1 btn-error btn-sm"
          >
            <TrashIcon className="w-3 h-3" /> &nbsp;{t("general.delete")}
          </Button>
        </ConfirmationWrapper> */}
      </div>
      <div className="flex items-center justify-between gap-2 mt-2 mb-2">
        <div className="inline-flex items-center justify-center gap-2">
          {isAdmin ? (
            <Badge
              text={selectedRecord.priority}
              color={_getPriorityType(selectedRecord.priority)}
            />
          ) : (
            <Select
              native={true}
              className={`btn-sm w-40 }` + ""}
              onChange={(v) => onSubmit({ ...selectedRecord, priority: v })}
              options={priorityOptions}
              value={selectedRecord?.priority}
            />
          )}
        </div>
        <div className="items-center gap-5">
          {selectedRecord.status && (
            <div
              style={{
                color: "white",
                // width: 160,
                float: "right",
                position: "relative",
              }}
              className="gap-2 "
            >
              {!isAdmin ? (
                <Badge
                  text={selectedRecord.status
                    ?.split("_")
                    ?.join(" ")
                    ?.replace("SENT", "RECEIVED")}
                  color={_getStatusType(selectedRecord.status)}
                />
              ) : (
                <Select
                  native={true}
                  className={`btn-sm btn-outline`}
                  options={SERVICE_REQUEST_STATUS_OPTIONS}
                  onChange={handleStatusChange}
                  value={selectedRecord?.status}
                />
              )}
            </div>
          )}
        </div>

        {isAdmin ? (
          <div className="ml-2 mr-2 flex items-center">
            <label htmlFor="datetime-local-input" className="text-xs mr-2">
              Visit Date
            </label>
            <input
              id="datetime-local-input"
              placeholder="Visit Date"
              min={new Date().toISOString()}
              className="ml-4 input text-accent h-[30px] input-sm input-bordered"
              value={visitDate}
              type="datetime-local"
              onChange={(e) => {
                setVisitDate(e?.target?.value);
              }}
            />
            <Button
              disabled={!visitDate}
              onClick={(e) => {
                onSubmit({
                  ...selectedRecord,
                  status: "VISIT_SCHEDULED",
                  visitDate: moment(visitDate, "YYYY-MM-DDTHH:mm")?.toDate(),
                });
                setVisitDate("");
              }}
              // type="ghost"
              className="ml-2 text-white btn btn-sm hover:dark:text-accent"
            >
              SET
            </Button>
            {/* <Datepicker
              asSingle={true}
              value={visitDate}
              theme={"light"}
              minDate={moment().toDate()}
              placeholder="Select Visit Date"
              inputClassName="text-xs h-8 input input-bordered w-52"
              containerClassName="w-52 h-8"
              popoverDirection={"down"}
              toggleClassName="invisible"
              onChange={handleChangeVisitDate}
              showShortcuts={false}
              primaryColor={"white"}
            /> */}
          </div>
        ) : null}
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="">
          <label className="">
            <span className="label-text">Requester</span>
          </label>
          <div className="text-sm font-medium">
            {selectedRecord.requester?.firstName}{" "}
            {selectedRecord.requester?.lastName}
          </div>
        </div>
        <div className="">
          <label className="">
            <span className="label-text">Society</span>
          </label>
          <div className="text-sm font-medium">
            {selectedRecord?.society?.name}
          </div>
        </div>
        <div>
          <label className="">
            <span className="label-text">Visit Date</span>
          </label>
          <div className={`text-sm font-medium`}>
            {getHumanReadableDateTime(selectedRecord?.visitDate)}
          </div>
        </div>
        <div className="">
          <label className="">
            <span className="label-text">Updated On</span>
          </label>
          <div className="text-sm font-medium">
            {getHumanReadableDateTime(selectedRecord.updatedAt)}
          </div>
        </div>
        <div>
          <label className="">
            <span className="label-text">Visit requirement</span>
          </label>
          <div className="text-sm font-medium">
            {selectedRecord?.visitRequirement || "-"}
          </div>
        </div>
        <div>
          <label className="">
            <span className="label-text">Assigned Partner</span>
          </label>
          <div className="text-sm flex items-center gap-4 font-medium">
            <EditableSelect
              menuPlacement="auto"
              menuPortalTarget={".w-screen"}
              options={selectedServicePartners || []}
              onChange={(obj) => setAssignedPartner(obj)}
              value={assignedPartner || selectedRecord.partner?.name}
            />
            {assignedPartner && (
              <Button
                onClick={_handleAssignPartner}
                className="ml-2 text-white btn btn-xs hover:dark:text-accent"
              >
                SET
              </Button>
            )}
          </div>
        </div>
        {selectedRecord?.subService ? (
          <div>
            <label className="">
              <span className="label-text">Sub Service</span>
            </label>
            <div className="text-sm font-medium">
              {selectedRecord?.subService || "-"}
            </div>
          </div>
        ) : null}
      </div>
      {showActivityHistoryModal && (
        <Modal
          title={"Service Request Activity History"}
          closeModal={(e) => setShowActivityHistoryModal(false)}
          showModal={showActivityHistoryModal}
          showBtns={false}
        >
          <ActivityHistory
            activities={selectedRecord?.activityHistory?.edges?.map(
              (a) => a.node
            )}
          />
        </Modal>
      )}
    </div>
  );
};
export default DetailsHeader;
