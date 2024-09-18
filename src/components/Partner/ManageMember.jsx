import React, { useEffect, useState } from "react";
import FlatList from "../common/FlatList";
import StaffListItem from "../Staff/StaffListItem";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_PARTNER_MEMBERS_BY_TYPE_QUERY } from "../../graphql/queries/getPartnerMembers";
import { pickupDataFromResponse } from "../../helpers/utils";
import Button from "../common/neomorphic/Button";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";
import Modal from "../common/Modal";
import PartnerMemberForm from "./MemberForm";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import ConfirmationBox from "../common/Dialog/ConfirmationBox";
import {
  ADD_PARTNER_MEMBER,
  DELETE_PARTNER_MEMBER,
} from "../../graphql/mutations/partnermember";
import { toast } from "react-toastify";
import { GET_PARTNER_STAFFS_SEARCH } from "../../graphql/queries/getPartnerStaffsByPartnerSearch";
import MemberForm from "./MemberForm";

const QUERY_MAPPING = {
  partner: {
    query: GET_PARTNER_MEMBERS_BY_TYPE_QUERY,
    types: ["PARTNER_ADMIN", "PARTNER_KAM"],
    deleteMutation: DELETE_PARTNER_MEMBER,
    createMutation: ADD_PARTNER_MEMBER,
  },
  staff: {
    query: GET_PARTNER_STAFFS_SEARCH,
    types: ["SOCIETY_ADMIN", "SOCIETY_MANAGER"],
  },
};
function ManageMember({ source = "partner", parentId, onDataReceived }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedPartnerMember] = useState(null);
  const [confirmationBoxOpen, setConfirmationBoxOpen] = useState(false);
  const [getMembers, { data: membersData }] = useLazyQuery(
    QUERY_MAPPING[source]?.query,
    {
      fetchPolicy: "network-only",
      variables: {
        [`${source}Id`]: parentId,
        type: QUERY_MAPPING[source]?.types,
      },
      skip: parentId === null,
    }
  );
  useEffect(() => {
    getMembers();
  }, [parentId]);
  const [deleteMember] = useMutation(QUERY_MAPPING[source]?.deleteMutation);
  const [addMember] = useMutation(QUERY_MAPPING[source]?.createMutation);
  const members = pickupDataFromResponse({ data: membersData });
  useEffect(() => {
    if (onDataReceived) {
      onDataReceived(members);
    }
  }, [members]);

  async function handleDeleteMember() {
    await deleteMember({
      variables: {
        id: selectedMember?.objectId,
      },
    });
    toast.success("Member Deleted");
    getMembers();
  }
  async function handleSubmit(data) {
    const obj = {
      objectId: data?.objectId,
      userId: data?.userId,
      [`${source}Id`]: parentId,
      type: data?.memberType,
      subtype: data?.subType,
    };
    if (!obj?.objectId) {
      await addMember({ variables: obj });
      toast.success("Member added successfully");
    }
    getMembers();
    // onDone();
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
        data={members}
        renderItem={({ item }) => (
          <div className="flex">
            <StaffListItem
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
      {isModalOpen ? (
        <Modal
          title={`${
            selectedMember?.objectId
              ? `Update ${selectedMember?.member?.firstName}`
              : "Add"
          }  Member`}
          closeModal={() => setIsModalOpen(false)}
          showModal={isModalOpen}
          showBtns={false}
          fullscreen={true}
        >
          <MemberForm
            onSubmit={handleSubmit}
            member={selectedMember}
            memberTypes={QUERY_MAPPING[source]?.types}
          />
        </Modal>
      ) : null}
      <ConfirmationBox
        isOpen={confirmationBoxOpen}
        title={`Delete ${selectedMember?.member?.firstName}`}
        message={`Do you want to delete the Member ?`}
        onConfirm={(e) => {
          setConfirmationBoxOpen(false);
          handleDeleteMember();
        }}
        onCancel={(e) => setConfirmationBoxOpen(false)}
      />
    </div>
  );
}

export default ManageMember;
