import { useState } from "react";
import { CREATE_USER } from "../../../graphql/mutations/user/createUser";
import FileSelector from "../../fileSelector";
import { UPDATE_USER } from "../../../graphql/mutations/user/user";
import { useMutation } from "@apollo/client";
import SelectProfileImage from "../SelectProfileImage";
import Input from "../neomorphic/Input";
import Button from "../neomorphic/Button";
import Modal from "../Modal";
import { toast } from "react-toastify";

const UserForm = ({ user = {}, onDone }) => {
  const [createnewUser] = useMutation(CREATE_USER);
  const [updateUser] = useMutation(UPDATE_USER);
  const [profileImage, setProfileImage] = useState(null);
  const [showImageSelectorModal, setShowImageSelectorModal] = useState(false);
  let defaultFormData = {
    firstName: user?.firstName,
    lastName: user?.lastName,
    mobileNumber: user?.mobileNumber,
    address: user?.fulladdress,
  };

  let [userFormData, setUserFormData] = useState(defaultFormData);

  const _handleAddUser = async (mode) => {
    console.log("profileImage", userFormData);
    let data = userFormData;
    const variablesData = {
      userId: data?.objectId,
      //   objectId: data?.objectId,
      firstname: data.firstName,
      username: data?.mobileNumber,
      lastname: data.lastName,
      mobilenumber: data.mobileNumber || "NA",
      fulladdress: data.address,
      profilepicture: profileImage?.imageName,
    };
    try {
      let userRes = null;
      if (variablesData?.userId) {
        userRes = await updateUser({
          variables: variablesData,
        });
      } else {
        userRes = await createnewUser({
          variables: variablesData,
        });
      }
      // toast.success("Partner staff saved successfully");
      console.log(userRes);
      if (onDone) onDone(userRes?.data?.createUser?.user);
      else
        toast.success(
          `User ${variablesData?.userId ? "Updated" : "Added"} successfully`
        );
      performCleanup();
    } catch (e) {
      console.log("Error", e);
      toast.error(e?.message);
    }
  };

  const performCleanup = () => {
    setUserFormData(defaultFormData);
    setShowImageSelectorModal(false);
    setProfileImage(null);
  };

  const data = userFormData;

  return (
    <div className="w-full pt-2 items-center text-center flex flex-col gap-y-4 mx-6">
      <div className="form-control sm:w-full md:w-full lg:w-1/2 mx-6">
        <SelectProfileImage
          onClick={() => setShowImageSelectorModal(true)}
          url={profileImage?.uploadedFile?.data?.createFile?.fileInfo?.name}
        />
        <label className="label-text text-lg font-medium pb-1">Profile</label>
      </div>
      <div className="form-control sm:w-full md:w-full lg:w-1/2 mx-6">
        <Input
          type="text"
          value={data.firstName}
          onChange={({ target: { value } }) =>
            setUserFormData({ ...data, firstName: value })
          }
          placeholder="First Name"
          className="input input-md input-bordered w-full h-12"
        />
      </div>
      <div className="form-control sm:w-full md:w-full lg:w-1/2 mx-6">
        <Input
          type="text"
          value={data.lastName}
          onChange={({ target: { value } }) =>
            setUserFormData({ ...data, lastName: value })
          }
          placeholder="Last Name"
          className="input input-md input-bordered w-full h-12"
        />
      </div>
      <div className="form-control sm:w-full md:w-full lg:w-1/2 mx-6">
        <Input
          type="number"
          value={data.mobileNumber}
          onChange={({ target: { value } }) => {
            if (value.length > 10) return;
            setUserFormData({ ...data, mobileNumber: value });
          }}
          maxlength={11}
          placeholder="Mobile Number"
          className="input input-md input-bordered w-full h-12"
        />
      </div>
      <div className="form-control sm:w-full md:w-full lg:w-1/2 mx-6">
        <textarea
          type="text"
          value={data.address}
          onChange={({ target: { value } }) =>
            setUserFormData({ ...data, address: value })
          }
          placeholder="Address"
          className="input input-md input-bordered w-full h-12"
        />
      </div>
      <div className="flex justify-end gap-4 mt-8">
        <Button
          type="accent"
          //   loading={loading}
          disabled={
            !data.firstName ||
            !data.lastName ||
            !data.mobileNumber ||
            !data.address
          }
          onClick={() => _handleAddUser("CREATE")}
        >
          Create User
        </Button>
        {/* <Button onClick={performCleanup}>Close</Button> */}
      </div>
      <Modal
        title="Upload Files"
        closeModal={() => setShowImageSelectorModal(false)}
        showModal={showImageSelectorModal}
        showBtns={false}
      >
        {showImageSelectorModal && (
          <FileSelector
            onImageSelected={(profileImage) => {
              setProfileImage(profileImage);
              setShowImageSelectorModal(false);
            }}
          />
        )}
      </Modal>
    </div>
  );
};
export default UserForm;
