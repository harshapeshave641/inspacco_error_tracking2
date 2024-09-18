import React, { useEffect, useState } from "react";
import FlatList from "../common/FlatList";
import StaffListItem from "../Staff/StaffListItem";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { pickupDataFromResponse } from "../../helpers/utils";
import { GET_PARTNER_STAFFS_SEARCH } from "../../graphql/queries/getPartnerStaffsByPartnerSearch";
import Button from "../common/neomorphic/Button";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";
import Modal from "../common/Modal";
import { UPDATE_PARTNER_STAFF_BY_ID } from "../../graphql/mutations/partnerStaff/updatePartnerStaff";
import { CREATE_PARTNER_STAFF } from "../../graphql/mutations/partnerStaff/createPartnerStaff";
import SelectProfileImage from "../common/SelectProfileImage";
import Input from "../common/neomorphic/Input";
import { GET_ATTACHMENTS } from "../../graphql/queries/getAttachments";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import CloudArrowUpIcon from "@heroicons/react/24/outline/CloudArrowUpIcon";
import DocumentManager from "../common/DocumentManager";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import FileSelector from "../fileSelector";
import { toast } from "react-toastify";
import ConfirmationBox from "../common/Dialog/ConfirmationBox";
import { DELETE_PARTNER_STAFF } from "../../graphql/mutations/partnerStaff/deletePartnerStaff";


function ManagePartnerStaff({ partnerId, onDataReceived }) {
  const [showAddPartnerStaff, setShowAddPartnerStaff] = useState(false);
  const [showStaffDetails, setShowStaffDetails] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState({});
  const [confirmationBoxOpen, setConfirmationBoxOpen] = useState(false);
  const [
    getPartnerStaffs,
    { data: partnerStaffsData, loading, refetch: refetchPartnerStaff },
  ] = useLazyQuery(GET_PARTNER_STAFFS_SEARCH, {
    fetchPolicy: "network-only",
    variables: {
      partnerId: partnerId,
      type: ["PARTNER_ADMIN", "PARTNER_KAM"],
    },
    skip: partnerId === null,
  });
  useEffect(() => {
    getPartnerStaffs();
  }, [partnerId]);
  const [deleteStaff] = useMutation(DELETE_PARTNER_STAFF);
  const partnerStaffs = pickupDataFromResponse({ data: partnerStaffsData });
  useEffect(() => {
    if (onDataReceived) {
      onDataReceived(partnerStaffs);
    }
  }, [partnerStaffs]);
  const togglePartnerStaffModal = () =>
    setShowAddPartnerStaff(!showAddPartnerStaff);
  async function handleDeletePartnerStaff() {
    await deleteStaff({
      variables: {
        id: selectedStaff?.objectId,
      },
    });
    toast.success("partner staff Deleted");
    getPartnerStaffs();
  }


  return (
    <div>
      <div className="flex justify-end">
        <Button
          type="accent"
          className="float-right mb-2 btn-sm"
          onClick={togglePartnerStaffModal}
        >
          <div className="flex items-center justify-center">
            <PlusCircleIcon className="w-4 h-4 mr-1" />
            <span>Add Staff</span>
          </div>
        </Button>
      </div>
      <FlatList
        data={partnerStaffs}
        renderItem={({ item }) => (
          <div className="flex">
            <StaffListItem
              className="w-11/12"
              onClick={() => {
                setSelectedStaff(item);
                setShowStaffDetails(true);
              }}
              image={item?.user?.profilePicture}
              desc={item?.type?.split("_").join(" ")}
              firstName={item?.user?.firstName}
              lastName={item?.user?.lastName}
              mobileNumber={item?.user?.mobileNumber}
            />
            <div className="pl-2 cursor-pointer text-danger pt-9">
              <TrashIcon
                onClick={(e) => {
                  //    e?.stopPropogation();
                  e.stopPropagation();
                  setConfirmationBoxOpen(true);
                  setSelectedStaff(item);
                }}
                className="w-5 h-5 ml-1 text-error "
              />
            </div>
          </div>
        )}
      />
      <Modal
        title="Add Partner Staff"
        closeModal={togglePartnerStaffModal}
        showModal={showAddPartnerStaff}
        showBtns={false}
      >
        {showAddPartnerStaff && (
          <div className="mt-5">
            <AddPartnerStaffForm
              closeParentModal={togglePartnerStaffModal}
              //   staffList={partnerStaffData?.partnerStaffs?.edges}
              partnerId={partnerId}
              onDone={refetchPartnerStaff}
            />
          </div>
        )}
      </Modal>
      <Modal
        showBtns={false}
        title="Staff Details"
        closeModal={() => setShowStaffDetails(false)}
        showModal={showStaffDetails}
      >
        {showStaffDetails && (
          <StaffDetails
            {...{
              currentStaff: selectedStaff,
              closeParentModal: () => {
                setShowStaffDetails(false);
                refetchPartnerStaff();
              },
            }}
          />
        )}
      </Modal>
      <ConfirmationBox
        isOpen={confirmationBoxOpen}
        title={`Delete ${selectedStaff?.user?.firstName} ${selectedStaff?.user?.lastName}`}
        message={`Do you want to delete the Staff ?`}
        onConfirm={(e) => {
          setConfirmationBoxOpen(false);
          handleDeletePartnerStaff();
        }}
        onCancel={(e) => setConfirmationBoxOpen(false)}
      />
    </div>
  );
}
const AddPartnerStaffForm = ({ closeParentModal, partnerId, onDone }) => {
  let [partnerProfileImage, setPartnerProfileImage] = useState(null);
  let [showImageSelectorModal, setShowImageSelectorModal] = useState(false);

  return (
    <>
      <AddStaffForm
        {...{
          profileImage: partnerProfileImage,
          openImageSelector: () => setShowImageSelectorModal(true),
          handleClose: closeParentModal,
          partnerId,
          onDone: onDone,
        }}
      />
      <Modal
        title="Upload Files"
        closeModal={() => setShowImageSelectorModal(false)}
        showModal={showImageSelectorModal}
        showBtns={false}
      >
        {showImageSelectorModal && (
          <FileSelector
            onImageSelected={(profileImage) => {
              setPartnerProfileImage(profileImage);
              setShowImageSelectorModal(false);
            }}
          />
        )}
      </Modal>
    </>
  );
};

const StaffDetails = ({ currentStaff, closeParentModal }) => {
  console.log("currentStaff===>", currentStaff);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editStaffProfile, setEditStaffProfile] = useState({ ...currentStaff });
  const [showImageSelectorModal, setShowImageSelectorModal] = useState(false);
  const onStaffEditClick = () => setIsEditMode((prevState) => !prevState);
  const [updatePartnerStaff, { loading: staffUpdating }] = useMutation(
    UPDATE_PARTNER_STAFF_BY_ID
  );
  const onDiscardClick = () => {
    onStaffEditClick();
    setEditStaffProfile({});
  };

  const performCleanup = () => {
    onDiscardClick();
    closeParentModal();
  };

  const _handleUpdateStaffDetails = async () => {
    await updatePartnerStaff({
      variables: {
        firstName: editStaffProfile.firstName,
        lastName: editStaffProfile.lastName,
        mobileNumber: editStaffProfile.mobileNumber,
        profileImage:
          editStaffProfile.profileImage?.uploadedFile?.data?.createFile
            ?.fileInfo?.name,
        address: editStaffProfile.address,
        id: currentStaff?.objectId,
      },
    });

    performCleanup();
    toast.success("Staff Updated Successfully!");
  };

  return (
    <div className="mt-5">
      <div className="w-[70%] mx-auto pt-2 items-center text-center flex flex-col gap-y-4 px-2">
        <div className="w-full text-right">
          {isEditMode && (
            <Button
              onClick={onDiscardClick}
              type="outline"
              disabled={staffUpdating}
              className="gap-2 mr-2 btn-sm btn-error"
            >
              <TrashIcon className="w-4 h-4" />
              Discard
            </Button>
          )}
          <Button
            onClick={isEditMode ? _handleUpdateStaffDetails : onStaffEditClick}
            type="outline"
            loading={staffUpdating}
            className={`btn-sm btn-info gap-2 ${
              isEditMode ? "btn-active" : ""
            }`}
          >
            {!isEditMode ? (
              <>
                <PencilIcon className="w-4 h-4" />
                Edit
              </>
            ) : (
              <>
                <CloudArrowUpIcon className="w-4 h-4" />
                Save
              </>
            )}
          </Button>
        </div>
        <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
          <SelectProfileImage
            onClick={() => setShowImageSelectorModal(true)}
            showEdit={isEditMode}
            url={
              editStaffProfile.profileImage?.uploadedFile?.data?.createFile
                ?.fileInfo?.name || currentStaff?.profileImage
            }
          />
          <label className="py-2 text-lg font-medium label-text">
            {isEditMode
              ? "Editing Staff Details"
              : `${currentStaff?.firstName} ${currentStaff?.lastName}`}
          </label>
        </div>
        <div className="w-full p-4 text-left">
          <div className="py-2 font-medium text-left">
            {isEditMode ? (
              <Input
                type="text"
                value={
                  isEditMode && "firstName" in editStaffProfile
                    ? editStaffProfile.firstName
                    : currentStaff?.firstName
                }
                onChange={({ target: { value } }) =>
                  setEditStaffProfile({ firstName: value })
                }
                placeholder="First Name"
                className="w-full h-12 input input-md input-bordered"
              />
            ) : (
              <>
                <label className="label-text text-md">First Name</label>
                <label className="block text-lg label-text">
                  {editStaffProfile.firstName || currentStaff?.firstName}
                </label>
              </>
            )}
          </div>
          <div className="py-2 font-medium text-left">
            {isEditMode ? (
              <Input
                type="text"
                value={
                  isEditMode && "lastName" in editStaffProfile
                    ? editStaffProfile.lastName
                    : currentStaff?.lastName
                }
                onChange={({ target: { value } }) =>
                  setEditStaffProfile({ ...editStaffProfile, lastName: value })
                }
                placeholder="Last Name"
                className="w-full h-12 input input-md input-bordered"
              />
            ) : (
              <>
                <label className="label-text text-md">Last Name</label>
                <label className="block text-lg label-text">
                  {editStaffProfile.lastName || currentStaff?.lastName}
                </label>
              </>
            )}
          </div>
          <div className="py-2 font-medium text-left">
            {isEditMode ? (
              <Input
                type="text"
                value={
                  isEditMode && "mobileNumber" in editStaffProfile
                    ? editStaffProfile.mobileNumber
                    : currentStaff?.mobileNumber
                }
                onChange={({ target: { value } }) =>
                  setEditStaffProfile({
                    ...editStaffProfile,
                    mobileNumber: value,
                  })
                }
                placeholder="Mobile Number"
                className="w-full h-12 input input-md input-bordered"
              />
            ) : (
              <>
                <label className="label-text text-md">Mobile Number</label>
                <label className="block text-lg label-text">
                  {editStaffProfile.mobileNumber || currentStaff?.mobileNumber}
                </label>
              </>
            )}
          </div>
          <div className="py-2 font-medium text-left">
            {isEditMode ? (
              <Input
                type="text"
                value={
                  isEditMode && "address" in editStaffProfile
                    ? editStaffProfile.address
                    : currentStaff?.address
                }
                onChange={({ target: { value } }) =>
                  setEditStaffProfile({ ...editStaffProfile, address: value })
                }
                placeholder="Address"
                className="w-full h-12 input input-md input-bordered"
              />
            ) : (
              <>
                <label className="label-text text-md">Address</label>
                <label className="block text-lg label-text">
                  {editStaffProfile.address || currentStaff?.address || "-"}
                </label>
              </>
            )}
          </div>
          <div className="py-2 font-medium text-left">
            <>
              <DocumentManager
                module={"PartnerStaff"}
                parentId={currentStaff?.objectId}
                permissionGroupId={`PARTNER_${currentStaff?.partner?.objectId}`}
              />
            </>
          </div>
        </div>
      </div>
      <Modal
        title="Upload Profile Image"
        closeModal={() => setShowImageSelectorModal(false)}
        showModal={showImageSelectorModal}
        showBtns={false}
      >
        {showImageSelectorModal && (
          <FileSelector
            onImageSelected={(profileImage) => {
              setEditStaffProfile({ ...editStaffProfile, profileImage });
              setShowImageSelectorModal(false);
            }}
          />
        )}
      </Modal>
    </div>
  );
};
const AddStaffForm = ({
  openImageSelector,
  profileImage,
  partnerId,
  handleClose,
  onDone,
}) => {
  const [createPartnerStaff, { loading }] = useMutation(CREATE_PARTNER_STAFF);

  let defaultFormData = {
    firstName: null,
    lastName: null,
    mobileNumber: null,
    address: null,
  };

  let [addStaffProfile, setAddStaffProfile] = useState(defaultFormData);

  const _handleAddPartnerStaff = async (mode) => {
    let data = addStaffProfile;
    const partnerStaffInputData = {
      partnerId: partnerId,
      firstName: data.firstName,
      lastName: data.lastName,
      mobileNumber: data.mobileNumber || "NA",
      address: data.address,
      status: data.status,
      profileImage:
        profileImage?.uploadedFile?.data?.createFile?.fileInfo?.name,
    };
    try {
      await createPartnerStaff({
        variables: partnerStaffInputData,
      });
      toast.success("Partner staff saved successfully");
      if (onDone) onDone();
      performCleanup();
    } catch (e) {
      toast.error(e.message || "Something went wrong. Please try again.");
    }
  };

  const performCleanup = () => {
    setAddStaffProfile(defaultFormData);
    handleClose();
  };

  const data = addStaffProfile;

  return (
    <div className="flex flex-col items-center w-full pt-2 mx-6 text-center gap-y-4">
      <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
        <SelectProfileImage
          onClick={openImageSelector}
          url={profileImage?.uploadedFile?.data?.createFile?.fileInfo?.name}
        />
        <label className="pb-1 text-lg font-medium label-text">
          Staff Profile
        </label>
      </div>
      <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
        <Input
          type="text"
          value={data.firstName}
          onChange={({ target: { value } }) =>
            setAddStaffProfile({ ...data, firstName: value })
          }
          placeholder="First Name"
          className="w-full h-12 input input-md input-bordered"
        />
      </div>
      <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
        <Input
          type="text"
          value={data.lastName}
          onChange={({ target: { value } }) =>
            setAddStaffProfile({ ...data, lastName: value })
          }
          placeholder="Last Name"
          className="w-full h-12 input input-md input-bordered"
        />
      </div>
      <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
        <Input
          type="number"
          value={data.mobileNumber}
          onChange={({ target: { value } }) => {
            if (value.length > 10) return;
            setAddStaffProfile({ ...data, mobileNumber: value });
          }}
          maxlength={11}
          placeholder="Mobile Number"
          className="w-full h-12 input input-md input-bordered"
        />
      </div>
      <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
        <textarea
          type="text"
          value={data.address}
          onChange={({ target: { value } }) =>
            setAddStaffProfile({ ...data, address: value })
          }
          placeholder="Address"
          className="w-full h-12 input input-md input-bordered"
        />
      </div>
      <div className="flex justify-end gap-4 mt-8">
        <Button
          type="accent"
          loading={loading}
          disabled={
            !data.firstName ||
            !data.lastName ||
            !data.mobileNumber ||
            !data.address
          }
          onClick={() => _handleAddPartnerStaff("CREATE")}
        >
          Add Partner Staff
        </Button>
        <Button onClick={performCleanup}>Close</Button>
      </div>
    </div>
  );
};
export default ManagePartnerStaff;
