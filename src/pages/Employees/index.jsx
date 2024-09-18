import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";

import Input from "../../components/common/neomorphic/Input";
import Subtitle from "../../components/common/Typography/Subtitle";
import StaffListItem from "../../components/Staff/StaffListItem";
import FlatList from "../../components/common/FlatList";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/neomorphic/Button";

import { _isEmpty, pickupDataFromResponse } from "../../helpers/utils";
import { CREATE_SOCIETY_STAFF } from "../../graphql/mutations/societyStaff/createSocietyStaff";
import {
  GET_SOCIETY_STAFFS,
  GET_SOCIETY_STAFF_SEARCH_QUERY,
} from "../../graphql/queries/getSocietystaffBySocietyId";

import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import CloudArrowUpIcon from "@heroicons/react/24/outline/CloudArrowUpIcon";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";
import PlusCircleIcon from "@heroicons/react/24/solid/PlusCircleIcon";
import { UPDATE_SOCIETY_STAFF } from "../../graphql/mutations/societyStaff/updateSocietyStaff";

export default function Employees() {
  const [staffFilterText, setStaffFilterText] = useState(null);
  const [showAddServiceStaff, setShowAddServiceStaff] = useState(false);
  const [showStaffDetails, setShowStaffDetails] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState({});

  let { activeAccountId } = useSelector((state) => state.authSlice);

  const {
    data,
    loading,
    refetch: getPartnerStaffs,
  } = useQuery(GET_SOCIETY_STAFFS, {
    fetchPolicy: "no-cache",
    variables: { societyId: activeAccountId },
    skip: !activeAccountId,
  });

  const [getPartnerStaffsSearch, { data: searchRes }] = useLazyQuery(
    GET_SOCIETY_STAFF_SEARCH_QUERY,
    {
      fetchPolicy: "network-only",
    }
  );

  const onChangeStaffFilter = async ({ target: { value } }) => {
    setStaffFilterText(value);
    if (value.length >= 3) {
      getPartnerStaffsSearch({
        variables: {
          societyId: activeAccountId,
          searchString: value,
        },
      });
    }
  };

  const toggleAddStaffModal = (flag) => setShowAddServiceStaff(flag);
  const toggleDetailsModal = (flag) => setShowStaffDetails(flag);

  const handleAddServiceStaff = () => {
    toggleAddStaffModal(false);
    getPartnerStaffs();
  };

  const employees = pickupDataFromResponse({ data });
  const searchEmployees = pickupDataFromResponse({ data: searchRes });

  return (
    <div className="mx-4">
      <div className="flex justify-between mt-3">
        <Subtitle>Employee Management</Subtitle>
        <div className="text-right">
          <Button
            type="accent"
            className="btn-sm"
            onClick={() => toggleAddStaffModal(true)}
          >
            <PlusCircleIcon className="w-4 h-4 mr-1" />
            <span>Add Employee</span>
          </Button>
        </div>
      </div>
      <div className="mt-3">
        <Input
          value={staffFilterText}
          onChange={onChangeStaffFilter}
          prefixIcon={<MagnifyingGlassIcon className="w-4 h-4" />}
          className={"w-full"}
          iconWrapperClass={"!top-4"}
          placeholder="Search Employees"
        />
        <FlatList
          data={staffFilterText ? searchEmployees : employees}
          renderItem={({ item }) => (
            <StaffListItem
              {...{
                onClick: () => {
                  setShowStaffDetails(true);
                  setSelectedStaff({
                    ...item?.user,
                    employeeId: item?.employeeId,
                    department: item?.department,
                    objectId: item?.objectId,
                  });
                },
                image: item?.user?.profilePicture,
                desc: `(${item?.department})`,
                firstName: item?.user?.firstName,
                lastName: item?.user?.lastName,
                mobileNumber: item?.user?.mobileNumber,
              }}
            />
          )}
        />
        {showAddServiceStaff && (
          <Modal
            title={"Add Employee"}
            closeModal={() => toggleAddStaffModal(false)}
            showModal={showAddServiceStaff}
            showBtns={false}
            fullscreen
          >
            <div className="mt-5">
              <AddServiceStaffForm
                currentStaff={selectedStaff}
                closeParentModal={handleAddServiceStaff}
              />
            </div>
          </Modal>
        )}
        {showStaffDetails && (
          <Modal
            title="Employee Details"
            closeModal={() => {
              setSelectedStaff({});
              toggleDetailsModal(false);
            }}
            showModal={showStaffDetails}
            showBtns={false}
            fullscreen
          >
            <div className="mt-5">
              <StaffDetails
                currentStaff={selectedStaff}
                closeParentModal={() => {
                  setTimeout(() => getPartnerStaffs(), 1000);
                  toggleDetailsModal(false);
                }}
              />
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

const StaffDetails = ({ currentStaff, closeParentModal }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editStaffProfile, setEditStaffProfile] = useState({ ...currentStaff });

  const [updateSocietyStaff, { loading: staffUpdating }] =
    useMutation(UPDATE_SOCIETY_STAFF);
  const onStaffEditClick = () => setIsEditMode((prevState) => !prevState);

  const onDiscardClick = () => {
    onStaffEditClick();
    setEditStaffProfile({});
  };

  const performCleanup = () => {
    onDiscardClick();
    closeParentModal();
  };

  const _handleUpdateStaffDetails = async () => {
    await updateSocietyStaff({
      variables: {
        department: editStaffProfile.department,
        employeeId: editStaffProfile.employeeId,
        id: currentStaff.objectId,
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
                helperText="First Name"
                className="w-full h-12 input input-md input-bordered"
                readOnly
                disabled
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
                helperText="Last Name"
                className="w-full h-12 input input-md input-bordered"
                readOnly
                disabled
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
                helperText="Mobile Number"
                className="w-full h-12 input input-md input-bordered"
                readOnly
                disabled
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
                  isEditMode && "department" in editStaffProfile
                    ? editStaffProfile.department
                    : currentStaff?.department
                }
                onChange={({ target: { value } }) =>
                  setEditStaffProfile({
                    ...editStaffProfile,
                    department: value,
                  })
                }
                helperText="Department"
                placeholder="Department"
                className="w-full h-12 input input-md input-bordered"
              />
            ) : (
              <>
                <label className="label-text text-md">Department</label>
                <label className="block text-lg label-text">
                  {editStaffProfile.department ||
                    currentStaff?.department ||
                    "-"}
                </label>
              </>
            )}
          </div>
          <div className="py-2 font-medium text-left">
            {isEditMode ? (
              <Input
                type="text"
                value={
                  isEditMode && "employeeId" in editStaffProfile
                    ? editStaffProfile.employeeId
                    : currentStaff?.employeeId
                }
                onChange={({ target: { value } }) =>
                  setEditStaffProfile({
                    ...editStaffProfile,
                    employeeId: value,
                  })
                }
                helperText="Employee ID"
                placeholder="Employee ID"
                className="w-full h-12 input input-md input-bordered"
              />
            ) : (
              <>
                <label className="label-text text-md">Employee ID</label>
                <label className="block text-lg label-text">
                  {editStaffProfile.employeeId || currentStaff?.employeeId}
                </label>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AddServiceStaffForm = ({ closeParentModal, currentStaff = {} }) => {
  const [data, setFormData] = useState(currentStaff);

  const { activeAccountId } = useSelector((state) => state.authSlice);

  const [
    createServiceStaff,
    { loading: createServiceStaffLoading, error: createServiceStaffErrors },
  ] = useMutation(CREATE_SOCIETY_STAFF);

  const _handleAddStaffToService = async () => {
    let createPartnerStarffResponse = null;
    try {
      createPartnerStarffResponse = await createServiceStaff({
        variables: {
          firstName: data.firstName,
          lastName: data.lastName,
          department: data.department,
          mobileNumber: data.mobileNumber,
          employeeId: data.employeeId,
          societyId: activeAccountId,
        },
      });

      performCleanup();

      if (createServiceStaffErrors) toast.error("error");
      if (createPartnerStarffResponse.errors?.length)
        toast.error(createPartnerStarffResponse.errors?.[0]?.message);
      else toast.success("Employee Added successfully!");
    } catch {
      toast.error("error");
    }
  };

  const performCleanup = () => {
    // setCurrentStaff({});
    setFormData({});
    closeParentModal();
  };

  return (
    <>
      <div className="flex flex-col items-center w-full pt-2 mx-6 text-center gap-y-4">
        <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
          <Input
            type="text"
            value={data.firstName}
            onChange={({ target: { value } }) =>
              setFormData({ ...data, firstName: value })
            }
            placeholder="Enter First Name"
            helperText="Enter First Name"
            className="w-full h-12 input input-md input-bordered"
          />
        </div>
        <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
          <Input
            type="text"
            value={data.lastName}
            onChange={({ target: { value } }) =>
              setFormData({ ...data, lastName: value })
            }
            placeholder="Enter Last Name"
            helperText="Enter Last Name"
            className="w-full h-12 input input-md input-bordered"
          />
        </div>
        <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
          <Input
            type="text"
            value={data.department}
            onChange={({ target: { value } }) =>
              setFormData({ ...data, department: value })
            }
            placeholder="Enter Department"
            helperText="Enter Department"
            className="w-full h-12 input input-md input-bordered"
          />
        </div>
        <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
          <Input
            type="text"
            value={data.mobileNumber}
            onChange={({ target: { value } }) =>
              setFormData({ ...data, mobileNumber: value })
            }
            placeholder="Enter Mobile No."
            helperText="Enter Mobile No."
            className="w-full h-12 input input-md input-bordered"
          />
        </div>
        <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
          <Input
            type="text"
            value={data.employeeId}
            onChange={({ target: { value } }) =>
              setFormData({ ...data, employeeId: value })
            }
            placeholder="Enter Employee ID"
            helperText="Enter Employee ID"
            className="w-full h-12 input input-md input-bordered"
          />
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-8">
        <Button
          type="accent"
          loading={createServiceStaffLoading}
          disabled={
            !(
              data.firstName &&
              data.lastName &&
              data.department &&
              data.mobileNumber &&
              data.employeeId &&
              activeAccountId
            )
          }
          onClick={() => _handleAddStaffToService()}
        >
          {"Save"}
        </Button>
        <Button onClick={performCleanup}>Close</Button>
      </div>
    </>
  );
};
