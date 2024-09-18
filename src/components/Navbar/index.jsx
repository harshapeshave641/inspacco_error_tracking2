import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useNavigate } from "react-router";
import { useLazyQuery, useMutation } from "@apollo/client";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
import { logout, setClientSelectionModal } from "../../slice/authSlice";
import { changeSociety } from "./../../slice/authSlice";
import { toast } from "react-toastify";

import { getBlobResponseFromFile, getFileUrl } from "./../../helpers/utils";

import InspaccoLogo from "./../../assets/images/InspaccoWhiteLogo.png";
// import ProfilePic from "./../../assets/images/profilePic.svg";
import SettingsIcon from "./../../assets/images/SettingsIcon.svg";

import RewardStarIcon from "./../../assets/images/RewardStarIcon.svg";
import BellIcon from "@heroicons/react/24/outline/BellIcon";
import UserCircleIcon from "@heroicons/react/24/solid/UserCircleIcon";
import Cog6ToothIcon from "@heroicons/react/24/solid/Cog6ToothIcon";
import CogIcon from "@heroicons/react/24/solid/CogIcon";
import LogoutIcon from "@heroicons/react/24/solid/PowerIcon";
import PhoneIcon from "@heroicons/react/24/outline/PhoneIcon";
import PhotoIcon from "@heroicons/react/24/solid/PhotoIcon";
import PencilSquareIcon from "@heroicons/react/24/outline/PencilSquareIcon";
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";
import EnvelopeIcon from "@heroicons/react/24/outline/EnvelopeIcon";
import BuildingOffice2Icon from "@heroicons/react/24/outline/BuildingOffice2Icon";
import ChevronDownIcon from "@heroicons/react/24/outline/ChevronDownIcon";
import MapPinIcon from "@heroicons/react/24/outline/MapPinIcon";
import PaperClipIcon from "@heroicons/react/20/solid/PaperClipIcon";

import ThemeToggle from "../common/ThemeToggle";
import Button from "../common/neomorphic/Button";
import Modal from "../common/Modal";
import HoverIcon from "../common/HoverIcon";

import { UPLOAD_FILE } from "../../graphql/mutations/attachment/uploadFile";
import { UPDATE_SOCIETY_DETAILS } from "../../graphql/mutations/society/updateSociety";
import VenueSelect from "../common/VenueSelect";
import {
  setNotifRefetchFlag,
  toggleRightDrawer,
} from "../../slice/rightDrawerSlice";
import { GET_NOTIFICATION_COUNT } from "../../graphql/queries/getNotificationCount";
import moment from "moment";
import SelectProfileImage from "../common/SelectProfileImage";
import Subtitle from "../common/Typography/Subtitle";
import LanguageSwitcher from "./LanagueSwitcher";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [editMode, seteditMode] = useState(false);
  const [uploadFile] = useMutation(UPLOAD_FILE);
  const [updateSocietyDetails] = useMutation(UPDATE_SOCIETY_DETAILS);
  const [clientSettingModalOpen, setClientSettingModalOpen] = useState(false);

  const currentDate = null;

  const {
    user,
    activeRole,
    activeSociety,
    activeAccountId,
    isClientSelectionModalOpen,
  } = useSelector((state) => state.authSlice);
  const { refetchNotifFlag } = useSelector((state) => state.rightDrawer);

  const [clientDescription, setClientDescription] = useState(
    activeSociety.description
  );
  const [notificationCount, setNotificationCount] = useState(null);

  const [getCount] = useLazyQuery(GET_NOTIFICATION_COUNT, {
    onCompleted: (data) => setNotificationCount(data.notificationCount?.count),
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const _getNotificationCount = () =>
    getCount({
      variables: {
        userId: user.objectId,
        createdAt: currentDate
          ? moment(currentDate).toDate()
          : moment().set("year", 2000).toDate(),
      },
    });

  useEffect(() => {
    if (refetchNotifFlag) {
      _getNotificationCount();
      dispatch(setNotifRefetchFlag(false));
    }
  }, [refetchNotifFlag]);

  useEffect(() => {
    _getNotificationCount();
  }, []);

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    setClientDescription(activeSociety.description);
  }, [activeSociety]);

  function closeModal() {
    dispatch(
      setClientSelectionModal({
        isClientSelectionModalOpen: false,
      })
    );
  }

  function handleUploadLogo(e) {
    console.log("files", e.target.files.length);
    if (e.target.files && e.target.files.length) {
      setSelectedLogo(e.target.files[0]);
    }
  }

  async function handleUpdateProjectSetting() {
    let logo = activeSociety?.logo;

    if (selectedLogo) {
      console.log("handleUpdateProjectSetting", selectedLogo);
      const file = await getBlobResponseFromFile(selectedLogo);
      const uploadedFileRes = await uploadFile({ variables: { file } });
      if (uploadedFileRes.data?.errors) {
        toast.error(`File upload failed.`);
        return;
      }
      console.log("uploadLogo", uploadedFileRes);
      logo = uploadedFileRes?.data?.createFile?.fileInfo.name;
    }

    await updateSocietyDetails({
      variables: {
        logo,
        description: clientDescription,
        id: activeSociety.objectId,
      },
    });
    dispatch(
      changeSociety({
        activeSociety: {
          ...activeSociety,
          logo,
          description: clientDescription,
        },
        activeAccountId,
        activeRole,
      })
    );
    toast.success("Client Detail Updated Sucessfully");
    setClientSettingModalOpen(!clientSettingModalOpen);
    seteditMode(false);
  }

  function openSocietySelectionModal() {
    dispatch(
      setClientSelectionModal({
        isClientSelectionModalOpen: true,
      })
    );
  }

  const toggleNotifPanel = () => dispatch(toggleRightDrawer());

  return (
    <div>
      <div className="navbar relative z-[999] transition-all duration-300 bg-primary dark:bg-base-100 text-base-100 drop-shadow-lg">
        <div className="navbar-start w-50 ">
          <div className="navbar-left px-4 text-white inline-block">
            {activeSociety?.logo ? (
              <img
                className="h-10"
                src={getFileUrl(activeSociety?.logo)}
                alt="logo"
              />
            ) : (
              <img className="w-40" src={InspaccoLogo} alt="logo" />
            )}
          </div>
        </div>
        <div className="navbar-center">
          <Button
            type="ghost"
            className="gap-2 text-white hover:!text-[#04B3FF]"
            onClick={(e) => setClientSettingModalOpen(!clientSettingModalOpen)}
          >
            <Cog6ToothIcon className="w-5 h-5" />
            Project Info
          </Button>
          <div>
            <label
              onClick={openSocietySelectionModal}
              tabIndex={0}
              // ref={dropdownRef}
              className="btn btn-ghost hover:text-[#04B3FF] transition-all m-0 rounded-lg text-white"
            >
              <MapPinIcon className="w-5 h-5" />
              <span className="px-2 text-sm font-semibold text-ellipsis overflow-hidden">
                {activeSociety?.name || "Select"}
              </span>
              <ChevronDownIcon className="w-5 h-5" />
            </label>
          </div>
        </div>
        <div className="navbar-end w-1/2">
          {window.location.hostname !== "portal.inspacco.com" ? (
            <LanguageSwitcher />
          ) : null}
          <ThemeToggle />
          <button
            className="btn btn-ghost mx-2 dark:text-gray-400 btn-circle"
            onClick={toggleNotifPanel}
          >
            <div className="indicator">
              <BellIcon className="w-6 h-6" />
              <span className="badge badge-xs badge-error indicator-item">
                {notificationCount}
              </span>
            </div>
          </button>
          <label className="btn btn-ghost text-white text-md mr-1">
            Hi, {user?.firstName}
          </label>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <UserCircleIcon className="w-8 h-8 text-white" />
            </label>
            <div
              style={{
                position: "fixed",
                right: 5,
                top: 60,
                zIndex: 9999,
              }}
              className="menu dropdown-content shadow bg-base-100 overflow-hidden rounded-box w-80 mt-4"
            >
              <div className="flex justify-between items-center bg-primary p-2">
                <Button
                  type="ghost"
                  className="gap-2 text-white hover:dark:text-accent"
                >
                  <CogIcon className="w-5 h-5" />
                  Profile
                </Button>
                <Button
                  onClick={logoutHandler}
                  type="ghost"
                  className="gap-2 text-white hover:dark:text-accent"
                >
                  <LogoutIcon className="w-5 h-5" />
                  Logout
                </Button>
              </div>
              <div className="flex justify-center items-center gap-4 p-4">
                <div className="avatar online placeholder">
                  <div className="bg-neutral-focus text-neutral-content rounded-full w-16">
                    <span className="text-xl">{`${user?.firstName.charAt(
                      0
                    )}${user?.lastName.charAt(0)}`}</span>
                  </div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-accent">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-xs font-semibold text-accent">
                    {activeRole?.replace(/_/g, " ")}
                  </div>
                  {/* <div className="gap-2 text-secondary py-1.5 text-sm flex items-center">
                    <img src={TelephoneIcon} className="w-3 h-3" alt="phone" />
                    <a className="mb-1" href={`te<l:${user.mobileNumber}`}>
                      <span className="font-semibold">Phone: </span>
                      {user.mobileNumber}
                    </a>
                  </div> */}
                </div>
              </div>
              <div className="m-2 p-1 rounded-xl gap-2 text-sm text-primary dark:text-accent bg-accent bg-opacity-20 flex justify-center items-center">
                <img
                  src={RewardStarIcon}
                  className="w-5 h-5 dark:invert"
                  alt="reward"
                />
                <label>You have {user?.totalRewardPoints} Reward Points</label>
              </div>
              <div className="p-2 ml-2 grid grid-cols-2 justify-items-start">
                <div className="gap-2 text-xs dark:text-white text-primary pb-1.5 text-sm flex items-center">
                  <BuildingOffice2Icon className="h-4 w-4" />
                  <div>
                    <span className="font-semibold">Client: </span>
                    <p>{activeSociety.name || "-"}</p>
                  </div>
                </div>
                <div className="dark:text-white text-xs text-primary text-sm">
                  <a
                    className="mb-1 gap-2 flex items-start"
                    href={`tel:${user?.mobileNumber}`}
                  >
                    <PhoneIcon className="h-4 w-4" />
                    <div>
                      <span className="font-semibold">Phone: </span>
                      <p>{user?.mobileNumber || "-"}</p>
                    </div>
                  </a>
                </div>
                <div className="dark:text-white text-primary text-sm">
                  <a
                    className="mb-1 text-xs gap-2 text-overflow ellipsis flex items-start"
                    href={`to:${user?.email}`}
                  >
                    <EnvelopeIcon className="h-4 w-4" />
                    <div>
                      <span className="font-semibold">Email: </span>
                      <p>{user?.email || "-"}</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {clientSettingModalOpen ? (
        <Modal
          showModal={clientSettingModalOpen}
          closeModal={(e) => {
            setClientDescription(activeSociety.description);
            setClientSettingModalOpen(!clientSettingModalOpen);
            seteditMode(false);
          }}
          showBtns={editMode}
          onSubmit={handleUpdateProjectSetting}
          title={"Project Info"}
        >
          <div className="flex justify-end">
            <div className="">
              <label
                className="cursor-pointer inline-block"
                style={{ textAlign: "right" }}
                onClick={(e) => seteditMode(!editMode)}
              >
                {editMode ? (
                  <>
                    <EyeIcon className="h-6 w-6 inline-block" />
                  </>
                ) : (
                  <>
                    Edit &nbsp;
                    <PencilSquareIcon className="h-6 w-6 inline-block" />
                  </>
                )}
              </label>
            </div>
          </div>
          <div className="flex justify-center mt-4 h-auto">
            <div className="w-1/6">
              {editMode ? (
                <div>
                  <div className="text-center w-40">
                    <label htmlFor="imagepicker">
                      <div className=" p-12 bg-base-200 hover:bg-base-300 transition-all duration-300 cursor-pointer rounded-lg">
                        {/* <PhotoIcon className="w-8 h-8" /> */}
                        <HoverIcon
                          icon={<PaperClipIcon className="w-4 h-4" />}
                        />
                      </div>
                      <label>Upload Logo</label>
                      <div>
                        <div className="badge badge-ghost">Max Size: 20 MB</div>
                      </div>
                    </label>
                    <input
                      id="imagepicker"
                      type="file"
                      multiple
                      maxSize="20MB"
                      className="invisible h-0 w-0"
                      accept=".svg, .png, .jpg, .png"
                      onChange={handleUploadLogo}
                    />
                  </div>
                  <div className="">
                    {selectedLogo ? (
                      <img
                        className="w-auto h-auto"
                        src={URL.createObjectURL(selectedLogo)}
                        alt="logo"
                      />
                    ) : null}
                  </div>
                </div>
              ) : (
                <>
                  {" "}
                  {activeSociety?.logo?.trim() ? (
                    <div className="rounded-lg">
                      <SelectProfileImage
                        absoluteImageUrl
                        onClick={(e) => seteditMode(!editMode)}
                        url={getFileUrl(activeSociety.logo)}
                      />
                    </div>
                  ) : (
                    <div className=" p-14 w-40 h-30 bg-base-200 rounded-lg text-center ">
                      <PhotoIcon className="w-10 h-10" />
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="w-1/2 h-50">
              {editMode ? null : (
                // <ReactQuill
                //   className="text-color"
                //   style={{ height: "80%" }}
                //   theme="snow"
                //   value={clientDescription}
                //   onChange={setClientDescription}
                // />
                <div className="flex flex-col gap-1">
                  <div>
                    <sub>Name</sub>
                    <Subtitle>{activeSociety?.name}</Subtitle>
                  </div>
                  <div>
                    <sub>Description</sub>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: clientDescription || `N/A`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal>
      ) : null}
      <Modal
        showModal={isClientSelectionModalOpen}
        closeModal={closeModal}
        showBtns={false}
        type="floating"
        title={"Select Client"}
      >
        <div className="mt-5">
          <VenueSelect onSelectionDone={closeModal} />
        </div>
      </Modal>
    </div>
  );
}
