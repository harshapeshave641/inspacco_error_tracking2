import React, { useEffect, useState } from "react";
import FlatList from "../common/FlatList";
import StaffListItem from "../Staff/StaffListItem";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_PARTNER_MEMBERS_BY_TYPE_QUERY } from "../../graphql/queries/getPartnerMembers";
import { pickupDataFromResponse } from "../../helpers/utils";
import Button from "../common/neomorphic/Button";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";
import CommonForm from "../common/CommonForm";
import Modal from "../common/Modal";
import PartnerMemberForm from "./MemberForm";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import ConfirmationBox from "../common/Dialog/ConfirmationBox";
import { DELETE_PARTNER_MEMBER } from "../../graphql/mutations/partnermember";
import { toast } from "react-toastify";

function ManagePartnerMember({ partnerId, onDataReceived }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartnerMember, setSelectedPartnerMember] = useState(null);
  const [confirmationBoxOpen, setConfirmationBoxOpen] = useState(false);
  const [getPartnerMembers, { data: partnerMembersData }] = useLazyQuery(
    GET_PARTNER_MEMBERS_BY_TYPE_QUERY,
    {
      fetchPolicy: "network-only",
      variables: {
        partnerId: partnerId,
        type: ["PARTNER_ADMIN", "PARTNER_KAM"],
      },
      skip: partnerId === null,
    }
  );
  useEffect(() => {
    getPartnerMembers();
  }, [partnerId]);
  const [deletePartnerMember] = useMutation(DELETE_PARTNER_MEMBER);
  const partnerMembers = pickupDataFromResponse({ data: partnerMembersData });
  useEffect(() => {
    if (onDataReceived) {
      onDataReceived(partnerMembers);
    }
  }, [partnerMembers]);
  function handleAddPartnerMember() {
    console.log("handleAddPartnerMember");
  }
  async function handleDeletePartnerMember() {
    await deletePartnerMember({
      variables: {
        id: selectedPartnerMember?.objectId,
      },
    });
    toast.success("Member Deleted");
    getPartnerMembers();
  }
  return (
    <div>
      <div className="flex justify-end mb-2">
        <Button
          type="accent"
          className="btn-sm float-right"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="flex justify-center items-center ">
            <PlusCircleIcon className="w-4 h-4 mr-1" />
            <span>Add Partner Member</span>
          </div>
        </Button>
      </div>
      <FlatList
        data={partnerMembers}
        renderItem={({ item }) => (
          <div className="flex">
            <StaffListItem
            //   onClick={() => {
            //     setSelectedPartnerMember(item);
            //     setIsModalOpen(true);
            //   }}
              className="w-11/12"
              image={item?.member?.profilePicture}
              desc={item?.type?.split("_").join(" ")}
              firstName={item?.member?.firstName}
              lastName={item?.member?.lastName}
              mobileNumber={item?.member?.mobileNumber}
            />
            <div className="text-danger pl-2 pt-9 cursor-pointer">
              <TrashIcon
                onClick={(e) => {
                  //    e?.stopPropogation();
                  e.stopPropagation();
                  setConfirmationBoxOpen(true);
                  setSelectedPartnerMember(item);
                }}
                className="ml-1 w-5 h-5 text-error "
              />
            </div>
          </div>
        )}
      />
      <Modal
        title={`${
          selectedPartnerMember?.objectId
            ? `Update ${selectedPartnerMember?.member?.firstName}`
            : "Add"
        } Partner Member`}
        closeModal={() => setIsModalOpen(false)}
        showModal={isModalOpen}
        showBtns={false}
        fullscreen={true}
      >
        <PartnerMemberForm
          partnerId={partnerId}
          partnerMember={selectedPartnerMember}
          onDone={() => getPartnerMembers()}
        />
      </Modal>
      <ConfirmationBox
        isOpen={confirmationBoxOpen}
        title={`Delete ${selectedPartnerMember?.member?.firstName}`}
        message={`Do you want to delete the Member ?`}
        onConfirm={(e) => {
          setConfirmationBoxOpen(false);
          handleDeletePartnerMember();
        }}
        onCancel={(e) => setConfirmationBoxOpen(false)}
      />
    </div>
  );
}

export default ManagePartnerMember;
