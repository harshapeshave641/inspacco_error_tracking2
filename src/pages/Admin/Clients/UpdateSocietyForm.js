
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_SOCIETY } from "../../../graphql/mutations/client";
import { GET_SOCIETIES } from "../../../graphql/queries/clients";
import LocationSearch from "./LocationSearch";
import { toast } from "react-toastify";

export default function UpdateSocietyForm({ society, onClose }) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    GSTState: "",
    GSTNo: "",
    POCMobileNumber: "",
    POCName: "",
    registeredEntityName: "",
    POCEmail: "",
    clientPhoneNumber: "",
    CINNumber: "",
    addressLine1: "",
    addressLine2: "",
    pincode: "",
    area: "",
    city: "",
    state: "",
    status: "Active",
    societyLat: "",
    societyLong: "",
  });

  const [originalData , setoriginalData] = useState({});


  const [updateSociety] = useMutation(UPDATE_SOCIETY);


  useEffect(() => {
    if (society) {
      const data = {
        id: society.id,
        name: society.name,
        email: society.email,
        GSTState: society.GSTState,
        GSTNo: society.GSTNo,
        POCMobileNumber: society.POCMobileNumber,
        POCName: society.POCName,
        registeredEntityName: society.registeredEntityName,
        POCEmail: society.POCEmail,
        clientPhoneNumber: society.clientPhoneNumber,
        CINNumber: society.CINNumber,
        addressLine1: society.addressLine1,
        addressLine2: society.addressLine2,
        pincode: society.pincode,
        area: society.area,
        city: society.city,
        state: society.state,
        status: society.status,
        societyLat: society.societyLat,
        societyLong: society.societyLong,
      };
      setFormData(data);
      setoriginalData(data);
    }
  }, [society]);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    if (name === "pincode" && value.length === 6) {
      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${value}`
        );
        const data = await response.json();
        console.log(data);
        if (data[0].Status === "Success") {
          const { Block, District, State } = data[0].PostOffice[0];
          setFormData((prevFormData) => ({
            ...prevFormData,
            area: Block,
            city: District,
            state: State,
          }));

          const geocodeResponse = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${value}&key=AIzaSyAY-c_RLQBwu0uWOLoXEl_nandopt5XwMk`
          );
          const geocodeData = await geocodeResponse.json();
          if (geocodeData.status === "OK") {
            const location = geocodeData.results[0].geometry.location;
            setFormData((prevFormData) => ({
              ...prevFormData,
              societyLat: location.lat,
              societyLong: location.lng,
            }));
          }
        } else {
          console.error("Invalid Pincode");
        }
      } catch (error) {
        console.error("Error fetching pincode data:", error);
      }
    } else {
      if (
        ["addressLine1", "addressLine2", "area", "city", "state"].includes(name)
      ) {
        updateLatLngOnAddressChange();
      }
    }
  };

  const updateLatLngOnAddressChange = async () => {
    try {
      const address = `${formData.addressLine1}, ${formData.addressLine2}, ${formData.city}, ${formData.state}, ${formData.pincode}`;
      const geocodeResponse = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=AIzaSyAY-c_RLQBwu0uWOLoXEl_nandopt5XwMk`
      );
      const geocodeData = await geocodeResponse.json();
      if (geocodeData.status === "OK") {
        const location = geocodeData.results[0].geometry.location;
        setFormData((prevFormData) => ({
          ...prevFormData,

          societyLat: location.lat,
          societyLong: location.lng,
        }));
      }
    } catch (error) {
      console.error("Error fetching geocode data:", error);
    }
  };

  const handleSaveClick = async (e) => {
    e.preventDefault();
    console.log("This is Updated data: " ,{
      id: formData.id,
          name: formData.name,
          email: formData.email,
          GSTState: formData.GSTState,
          GSTNo: formData.GSTNo,
          POCMobileNumber: formData.POCMobileNumber,
          POCName: formData.POCName,
          registeredEntityName: formData.registeredEntityName,
          POCEmail: formData.POCEmail,
          clientPhoneNumber: formData.clientPhoneNumber,
          CINNumber: formData.CINNumber,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          pincode: parseInt(formData.pincode),
          area: formData.area,
          city: formData.city,
          state: formData.state,
          status: formData.status,
          societyLat: formData.societyLat.toString(),
          societyLong: formData.societyLong.toString(),
    })
    try {
      const { data } = await updateSociety({
        variables: {
          id: formData.id,
          name: formData.name,
          email: formData.email,
          GSTState: formData.GSTState,
          GSTNo: formData.GSTNo,
          POCMobileNumber: formData.POCMobileNumber,
          POCName: formData.POCName,
          registeredEntityName: formData.registeredEntityName,
          POCEmail: formData.POCEmail,
          clientPhoneNumber: formData.clientPhoneNumber,
          CINNumber: formData.CINNumber,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          pincode: parseInt(formData.pincode),
          area: formData.area,
          city: formData.city,
          state: formData.state,
          status: formData.status,
          societyLat: formData.societyLat.toString(),
          societyLong: formData.societyLong.toString(),
        },
        refetchQueries: [{ query: GET_SOCIETIES }],
      });

      toast.success("Society successfully updated");

      onClose();
    } catch (err) {
      console.error("Error while updating society:", err);
    }
  };
  const handleCancel = (e) => {
    // onClose();
    setFormData(originalData);
  };
 

  

  return (
    <div className="flex flex-col min-h-screen rounded-t-3xl">
      <div className="relative flex items-center justify-center flex-1 mb-10 sm:p-8 md:p-12 lg:p-16">
      <form onSubmit={handleSaveClick}
      className="relative w-full p-8 bg-white rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700" htmlFor="email">
            Client Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
            <label
              className="block mb-2 font-bold text-gray-700"
              htmlFor="GSTState"
            >
              GST State
            </label>
            <input
              type="text"
              id="GSTState"
              name="GSTState"
              value={formData.GSTState}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              className="block mb-2 font-bold text-gray-700"
              htmlFor="GSTNo"
            >
              GST No
            </label>
            <input
              type="text"
              id="GSTNo"
              name="GSTNo"
              value={formData.GSTNo}
              maxLength={10}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              className="block mb-2 font-bold text-gray-700"
              htmlFor="POCMobileNumber"
            >
              POC Mobile Number
            </label>
            <input
              type="text"
              id="POCMobileNumber"
              name="POCMobileNumber"
              value={formData.POCMobileNumber}
              maxLength={10}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              className="block mb-2 font-bold text-gray-700"
              htmlFor="POCName"
            >
              POC Name
            </label>
            <input
              type="text"
              id="POCName"
              name="POCName"
              value={formData.POCName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              className="block mb-2 font-bold text-gray-700"
              htmlFor="registeredEntityName"
            >
              Registered Entity Name
            </label>
            <input
              type="text"
              id="registeredEntityName"
              name="registeredEntityName"
              value={formData.registeredEntityName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              className="block mb-2 font-bold text-gray-700"
              htmlFor="POCEmail"
            >
              POC Email
            </label>
            <input
              type="email"
              id="POCEmail"
              name="POCEmail"
              value={formData.POCEmail}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              className="block mb-2 font-bold text-gray-700"
              htmlFor="clientPhoneNumber"
            >
              Client Phone Number
            </label>
            <input
              type="text"
              id="clientPhoneNumber"
              name="clientPhoneNumber"
              value={formData.clientPhoneNumber}
              maxLength={10}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              className="block mb-2 font-bold text-gray-700"
              htmlFor="CINNumber"
            >
              CIN Number
            </label>
            <input
              type="text"
              id="CINNumber"
              name="CINNumber"
              value={formData.CINNumber}
              maxLength={10}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        <div className="mb-4">
          <label
            className="block mb-2 font-bold text-gray-700"
            htmlFor="addressLine1"
          >
            Address Line 1
          </label>
          <input
            type="text"
            id="addressLine1"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block mb-2 font-bold text-gray-700"
            htmlFor="addressLine2"
          >
            Address Line 2
          </label>
          <input
            type="text"
            id="addressLine2"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            className="block mb-2 font-bold text-gray-700"
            htmlFor="pincode"
          >
            Pincode
          </label>
          <input
            type="text"
            id="pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700" htmlFor="area">
            Area
          </label>
          <input
            type="text"
            id="area"
            name="area"
            value={formData.area}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700" htmlFor="city">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700" htmlFor="state">
            State
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block mb-2 font-bold text-gray-700"
            htmlFor="status"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="mb-4">
          <label
            className="block mb-2 font-bold text-gray-700"
            htmlFor="status"
          >
            Search Location
          </label>
          <LocationSearch
            setSocietyLat={(lat) =>
              setFormData((prev) => ({ ...prev, societyLat: lat }))
            }
            setSocietyLong={(lng) =>
              setFormData((prev) => ({ ...prev, societyLong: lng }))
            }
            setAddress1={(value) =>
              setFormData((prev) => ({ ...prev, addressLine1: value }))
            }
            setAddress2={(value) =>
              setFormData((prev) => ({ ...prev, addressLine2: value }))
            }
            setPincode={(value) =>
              setFormData((prev) => ({ ...prev, pincode: value }))
            }
            setArea={(value) =>
              setFormData((prev) => ({ ...prev, area: value }))
            }
            setCity={(value) =>
              setFormData((prev) => ({ ...prev, city: value }))
            }
            setState={(value) =>
              setFormData((prev) => ({ ...prev, state: value }))
            }
          />
        </div>
        <p className="mt-2 text-gray-600">Latitude: {formData.societyLat}</p>
        <p className="text-gray-600">Longitude: {formData.societyLong}</p>
        <div className="mb-4 space-x-4">
        <button
          type="submit"
          className="px-8 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-700"
        >
          Save
        </button>
        <button
        type="button"
        className="px-8 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-700"
        onClick={handleCancel}
        >
        
          cancel
        </button>
        </div>
      </form>
    </div>
    </div>
  );
}