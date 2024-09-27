import { useMutation, useQuery } from "@apollo/client";
import { GET_SOCIETIES } from "../../../graphql/queries/clients";
import { useState, useEffect, useCallback } from "react";
import InsertClientDetails from "../../../pages/Admin/Clients/InsertClientDetails";
import UpdateSocietyForm from "../../../pages/Admin/Clients/UpdateSocietyForm";
import Modal from "../../../components/common/Modal";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import Button from "../../../components/common/neomorphic/Button";
import { pickupDataFromResponse } from "../../../helpers/utils";
import Loader from "../../../components/common/Loader";
import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import BulkClientFacility from "./BulkUploadClientFacilty";
import { ArrowUpOnSquareStackIcon } from "@heroicons/react/24/outline";
import ManageClientFacility from "./ManageClientFacility";
import ManageClientSetting from "./ManageClientSetting";
import { UPDATE_SOCIETY, UPDATE_SOCIETY_SETTINGS } from "../../../graphql/mutations/client";
import { toast } from "react-toastify";

const AdminClients = () => {
  // const { error, data, refetch } = useQuery(GET_SOCIETIES);
  const { error, data, refetch } = useQuery(GET_SOCIETIES, {
    onCompleted: () => setLoading(false),
  });
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSociety, setSelectedSociety] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [updateSocietySettings] = useMutation(UPDATE_SOCIETY_SETTINGS);
  const handleSearch = useCallback(() => {
    setLoading(true);
    refetch().finally(() => {
      setLoading(false); // Ensure loading is turned off once refetch is complete
    });
  }, [refetch]);

  // useEffect(() => {
  //   if (searchQuery) {
  //     handleSearch();
  //   }
  // }, [searchQuery]);

  const [showManageClientFacility, setShowManageClientFacility] = useState(false);
  const [showClientSettings, setShowClientSettings] = useState(false);
  const toggleModalAdd = () => setIsAdding(!isAdding);
  const toggleModalEdit = () => setIsEditing(!isEditing);

  const handleSocietyClick = (society) => {
    setSelectedSociety(society);
  };

  // const handleSearch = () => {
  //   refetch(); // Refetch data to apply the search filter
  // };




  async function handleSettingsChange(settings = {}) {
    console.log('settings', settings)
    const updateSocietyRes = await updateSocietySettings({
      variables: {
        id: selectedSociety.objectId,
        settings: settings
      }
    })
    console.log('updateSocietyRes', updateSocietyRes?.data?.updateSociety?.society)
    const settingsObj = updateSocietyRes?.data?.updateSociety?.society?.settings || {}
    setSelectedSociety({ ...selectedSociety, settings: settingsObj })
    toast.success('Client settings updated successfully');
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Filter and sort clients based on search query
  const clients = pickupDataFromResponse({ data }) || [];
  const filteredClients = clients
    .filter((client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const searchLower = searchQuery.toLowerCase();
      const nameALower = a.name.toLowerCase();
      const nameBLower = b.name.toLowerCase();

      if (
        nameALower.startsWith(searchLower) &&
        !nameBLower.startsWith(searchLower)
      ) {
        return -1;
      }
      if (
        !nameALower.startsWith(searchLower) &&
        nameBLower.startsWith(searchLower)
      ) {
        return 1;
      }
      return nameALower.localeCompare(nameBLower);
    });


    function TestError1() {
      const a=2;
      a.nono();
    }

  return (
    <div className="flex flex-col h-[100%] overflow-hidden">
      <TestError1/>
      <nav className="flex items-center justify-between p-4 text-black bg-white">
        <h2 className="h-10 text-2xl font-bold">List of All Clients</h2>
        <div className="mx-4 space-x-4">
          <Button
            className="p-2 text-white bg-blue-500 rounded hover:bg-blue-700"
            onClick={() => setIsAdding(true)}
          >
            <PlusCircleIcon className="w-4 h-4" />
            Add client
          </Button>
          <Button
            className="p-2 text-white bg-blue-500 rounded hover:bg-blue-700"
            onClick={() => setIsEditing(true)}
          >
            <PlusCircleIcon className="w-4 h-4" />
            Update Client
          </Button>
        </div>
      </nav>

      <div className="flex flex-grow mb-12 overflow-hidden">
        <div className="overflow-y-auto md:w-1/2">

          <div className="sticky top-0 z-10 flex items-center w-full h-16 px-4 mt-0 bg-gray-100 shadow-md">
            <input
              type="search"
              placeholder="Search client"
              className="w-full h-8 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
            <Button
              className="flex items-center px-4 ml-4 w-30"
              onClick={handleSearch}
            >
              {loading ? (
                <Loader className="w-4 h-4" /> // Ensure Loader has the same size as the icon
              ) : (
                <>
                  <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
                </>
              )}
              Search
            </Button>
          </div>

          <div className="flex flex-col w-full h-full mt-4 space-y-4">
            {filteredClients.length > 0 ? (
              filteredClients.map((obj) => (
                <div
                  key={obj.id}
                  className="flex flex-col p-4 bg-gray-200 rounded-lg shadow-md cursor-pointer"
                  onClick={() => handleSocietyClick(obj)}
                >
                  <div className="flex justify-between">
                    <h2 className="text-xl font-bold">{obj.name}</h2>
                    <div className="text-xl font-bold">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 cursor-pointer"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 22s-8-5.5-8-12a8 8 0 0 1 16 0c0 6.5-8 12-8 12z"
                        />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p>
                        <strong>State:</strong> {obj.state}
                      </p>
                      <p>
                        <strong>Pincode:</strong> {obj.pincode}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>City:</strong> {obj.city}
                      </p>
                      <p>
                        <strong>Address:</strong> {obj.addressLine1}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No clients found</p>
            )}
          </div>
        </div>

        <div className="top-0 p-4 py-10 overflow-y-auto md:w-1/2">
          <h2 className="top-0 h-10 mb-10 text-2xl font-bold">
            Clients Details
          </h2>
          <div className="mb-3 text-right">
            <Button
              disabled={!selectedSociety?.objectId}
              paddingClass="0"
              onClick={(e) => {
                setShowClientSettings(true);
              }}
              className="gap-2 ml-2 capitalize tracking-[0.30px] font-medium btn-sm text-sm"
            >
              <ArrowUpOnSquareStackIcon className="w-4 h-4" />
              Manage Client Configurations
            </Button>
            <Button
              disabled={!selectedSociety?.objectId}
              paddingClass="0"
              onClick={(e) => {
                setShowManageClientFacility(true);
              }}
              className="gap-2 ml-2 capitalize tracking-[0.30px] font-medium btn-sm text-sm"
            >
              <ArrowUpOnSquareStackIcon className="w-4 h-4" />
              Manage Client Facilities
            </Button>
          </div>
          {selectedSociety ? (
            <div className="h-[80%] p-6 bg-white rounded-lg shadow-md">
              <div className="grid grid-cols-1 gap-4 mb-48 md:grid-cols-2">
                <div>
                  <p className="mb-4">
                    <strong>Name:</strong> {selectedSociety.name}
                  </p>
                  <p className="mb-4">
                    <strong>Email:</strong> {selectedSociety.email}
                  </p>
                  <p className="mb-4">
                    <strong>State:</strong> {selectedSociety.state}
                  </p>
                  <p className="mb-4">
                    <strong>Pincode:</strong> {selectedSociety.pincode}
                  </p>
                </div>
                <div>
                  <p className="mb-4">
                    <strong>City:</strong> {selectedSociety.city}
                  </p>
                  <p className="mb-4">
                    <strong>Address Line 1:</strong>{" "}
                    {selectedSociety.addressLine1}
                  </p>
                  <p className="mb-4">
                    <strong>Address Line 2:</strong>{" "}
                    {selectedSociety.addressLine2}
                  </p>
                  <p className="mb-4">
                    <strong>Area:</strong> {selectedSociety.area}
                  </p>
                </div>
                <div>
                  <p className="mb-4">
                    <strong>Latitude:</strong> {selectedSociety.societyLat}
                  </p>
                </div>
                <div>
                  <p className="mb-4">
                    <strong>Longitude:</strong> {selectedSociety.societyLong}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p>Select a client to view details</p>
          )}
        </div>
      </div>

      {isAdding ? (
        <Modal
          title="Add New Client"
          closeModal={toggleModalAdd}
          showModal={isAdding}
          showBtns={false}
          fullscreen={true}
        >
          <InsertClientDetails onClose={toggleModalAdd} refetch={refetch} />
        </Modal>
      ) : null}
      {showManageClientFacility && (
        <Modal
          title="Manage Client Facilities"
          closeModal={() => {
            setShowManageClientFacility(false);
            // window.location.reload();
          }}
          showModal={showManageClientFacility}
          showBtns={false}
          fullscreen={true}
        // onSubmit={handleCreateNewSR}
        >
          <ManageClientFacility activeSociety={selectedSociety} />
          {/* <BulkClientFacility  activeSociety={selectedSociety} /> */}
        </Modal>
      )}
      {showClientSettings && (
        <Modal
          title="Manage Client Configuration"
          closeModal={() => {
            setShowClientSettings(false);
            // window.location.reload();
          }}
          showModal={showClientSettings}
          showBtns={false}
          fullscreen={true}
        // onSubmit={handleCreateNewSR}
        >
          <ManageClientSetting activeSociety={selectedSociety} onChange={handleSettingsChange} />
          {/* <BulkClientFacility  activeSociety={selectedSociety} /> */}
        </Modal>
      )}
      {isEditing && selectedSociety ? (
        <Modal
          title="Update the selected Client"
          closeModal={toggleModalEdit}
          showModal={isEditing}
          showBtns={false}
          fullscreen={true}
        >
          <UpdateSocietyForm
            society={selectedSociety}
            onClose={toggleModalEdit}
          />
        </Modal>
      ) : null}
    </div>
  );
};

export default AdminClients;
