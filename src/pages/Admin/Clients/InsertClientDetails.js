import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { ADD_SOCIETIES } from "../../../graphql/mutations/client";
import LocationSearch from "./LocationSearch";
import { toast } from "react-toastify";



export default function InsertClientDetails({ onClose, onBack }) {
  const [addSociety, { error: mutationError }] = useMutation(ADD_SOCIETIES);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [GSTState , setGSTState] = useState("");
  const [GSTNo, setgstNumber] = useState("");
  const [POCMobileNumber, setPOCNumber] = useState("");
  const [POCName , setPOCName] = useState("");
  const [registeredEntityName , setRegisterCompanyName] = useState("");
  const [POCEmail , setPOCEmail] = useState("");
  const [clientPhoneNumber, setClientPhoneNumber] = useState("");
  const [CINNumber, setcinNumber] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [pincode, setPincode] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [societyLat, setSocietyLat] = useState(null);
  const [societyLong, setSocietyLong] = useState(null);
  const [searchLocation, setSearchLocation] = useState("");
  // const [loading , setLoading] = useState(false);

  useEffect(() => {
    const fetchPincodeData = async () => {
      if (pincode.length === 6) {
        try {
          const response = await fetch(
            `https://api.postalpincode.in/pincode/${pincode}`
          );
          const data = await response.json();
          if (data[0].Status === "Success") {
            const { Block, District, State } = data[0].PostOffice[0];
            setArea(Block);
            setCity(District);
            setState(State);

            // Get coordinates based on the pincode
            const geocodeResponse = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?address=${pincode}&key=AIzaSyAY-c_RLQBwu0uWOLoXEl_nandopt5XwMk`
            );
            const geocodeData = await geocodeResponse.json();
            console.log(geocodeData);
            if (geocodeData.status === "OK") {
              const location = geocodeData.results[0].geometry.location;
              setSocietyLat(location.lat);
              setSocietyLong(location.lng);
            }
          } else {
            console.error("Invalid Pincode");
          }
        } catch (error) {
          console.error("Error fetching pincode data:", error);
        }
      }
    };

    fetchPincodeData();
  }, [pincode]);

  const handleAddSociety = async (e) => {
    e.preventDefault();
    try {
      await addSociety({
        variables: {
          name,
          email,
          GSTState,
          GSTNo,
          POCMobileNumber,
          POCName,
          registeredEntityName,
          POCEmail,
          clientPhoneNumber,
          CINNumber,
          address1,
          address2,
          pincode: parseFloat(pincode),
          area,
          city,
          state,
          societyLat: societyLat?.toString(),
          societyLong: societyLong?.toString(),
        },
        // refetchQueries: [{ query: GET_CLIENTS }],
      });
      // setLoading(true);
      setName("");
      setEmail("");
      setGSTState("");
      setgstNumber("");
      setPOCNumber("");
      setPOCName("");
      setPOCEmail("");
      setClientPhoneNumber("");
      setcinNumber("");
      setRegisterCompanyName("");
      setAddress1("");
      setAddress2("");
      setPincode("");
      setArea("");
      setCity("");
      setState("");
      setSocietyLat(null);
      setSocietyLong(null);
      setSearchLocation("");
      toast.success("Clients successfully Added");
      onClose();
    } catch (err) {
      console.error("Error while adding society:", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen rounded-t-3xl">
      <div className="relative flex items-center justify-center flex-1 mb-10 sm:p-8 md:p-12 lg:p-16">
        <form
          className="relative w-full p-8 bg-white rounded-lg shadow-md"
          onSubmit={handleAddSociety}
        >
          <label
            htmlFor="name"
            className="block mb-2 text-lg font-medium text-gray-700"
          >
            Brand Name
          </label>
          <input
            id="name"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label
            htmlFor="email"
            className="block mb-2 text-lg font-medium text-gray-700"
          >
            Client Email
          </label>
          <input
            id="email"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label
            htmlFor="gst-state"
            className="block mb-2 text-lg font-medium text-gray-700"
          >
            GST State
          </label>
          <input
            id="gst-state"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            type="text"
            placeholder="Enter GST State"
            value={GSTState}
            onChange={(e) => setGSTState(e.target.value)}
            required
          />
          <label
            htmlFor="gst-number"
            className="block mb-2 text-lg font-medium text-gray-700"
          >
            GST Number
          </label>
          <input
            id="gst-number"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            type="text"
            placeholder="Enter GST number"
            value={GSTNo}
            onChange={(e) => setgstNumber(e.target.value)}
            required
          />
          <label
            htmlFor="poc-number"
            className="block mb-2 text-lg font-medium text-gray-700"
          >
            POC Number
          </label>
          <input
            id="poc-number"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            type="tel"
            placeholder="Enter POC Number"
            value={POCMobileNumber}
            maxLength={10}
            onChange={(e) => setPOCNumber(e.target.value)}
            required
          />
          <label
            htmlFor="poc-name"
            className="block mb-2 text-lg font-medium text-gray-700"
          >
            POC Name
          </label>
          <input
            id="poc-name"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            type="text"
            placeholder="Enter POC Name"
            value={POCName}
            maxLength={10}
            onChange={(e) => setPOCName(e.target.value)}
            required
          />
          <label
            htmlFor="poc-number"
            className="block mb-2 text-lg font-medium text-gray-700"
          >
            POC Email
          </label>
          <input
            id="poc-email"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            type="text"
            placeholder="Enter POC Email"
            value={POCEmail}
            onChange={(e) => setPOCEmail(e.target.value)}
            required
          />
          <label
            htmlFor="clientPhoneNumber"
            className="block mb-2 text-lg font-medium text-gray-700"
          >
            Clinet Phone Number
          </label>
          <input
            id="clinetPhoneNumber"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            type="tel"
            placeholder="Clinet Phone Number"
            value={clientPhoneNumber}
            maxLength={10}
            onChange={(e) => setClientPhoneNumber(e.target.value)}
            required
          />
          <label
            htmlFor="cin"
            className="block mb-2 text-lg font-medium text-gray-700"
          >
            CIN Number
          </label>
          <input
            id="cin-number"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            type="text"
            placeholder="CIN Number"
            value={CINNumber}
            maxLength={10}
            onChange={(e) => setcinNumber(e.target.value)}
            required
          />
          <label
            htmlFor="cin"
            className="block mb-2 text-lg font-medium text-gray-700"
          >
            Register Company Name
          </label>
          <input
            id="registercompanyname"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            type="text"
            placeholder="Register Company Name"
            value={registeredEntityName}
            onChange={(e) => setRegisterCompanyName(e.target.value)}
            required
          />
          {/* <label
            htmlFor="phone"
            className="block mb-2 text-lg font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            id="phone-number"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            type="tel"
            placeholder="Enter phone number"
            value={phone}
            maxLength={10}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,10}$/.test(value)) {
                setPhone(value);
              }
            }}
            required
          />
          <label
            htmlFor="gst"
            className="block mb-2 text-lg font-medium text-gray-700"
          >
            GST Number
          </label>
          <input
            id="gst-number"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            type="text"
            placeholder="Enter GST number"
            value={gstNumber}
            onChange={(e) => setgstNumber(e.target.value)}
            required
          />
          <label
            htmlFor="cin"
            className="block mb-2 text-lg font-medium text-gray-700"
          >
            CIN Number
          </label>
          <input
            id="cin-number"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            type="text"
            placeholder="Enter CIN number"
            value={cinNumber}
            maxLength={10}
            onChange={(e) => setcinNumber(e.target.value)}
            required
          />
          <label
            htmlFor="cin"
            className="block mb-2 text-lg font-medium text-gray-700"
          >
            POC Name
          </label>
          <input
            id="poc-number"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            type="text"
            placeholder="Enter POC number"
            value={pocName}
            maxLength={10}
            onChange={(e) => setPOCName(e.target.value)}
            required
          />
          <label
            htmlFor="poc-number"
            className="block mb-2 text-lg font-medium text-gray-700"
          >
            POC Number
          </label>
          <input
            id="poc-number"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            type="text"
            placeholder="Enter POC number"
            value={pocNumber}
            maxLength={10}
            onChange={(e) => setPOCNumber(e.target.value)}
            required
          />
          <label
            htmlFor="cin"
            className="block mb-2 text-lg font-medium text-gray-700"
          >
            Register Company Name
          </label>
          <input
            id="cin-number"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            type="text"
            placeholder="Register Company Name"
            value={registerCompanyName}
            maxLength={10}
            onChange={(e) => setRegisterCompanyName(e.target.value)}
            required
          /> */}
          <label
            htmlFor="address1"
            className="block mb-2 text-lg font-medium text-gray-700"
          >
            Address Line 1
          </label>
          <input
            id="address1"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            type="text"
            placeholder="Address Line 1"
            value={address1}
            onChange={(e) => setAddress1(e.target.value)}
            required
          />

          <label
            htmlFor="address2"
            className="block mb-2 text-lg font-medium text-gray-700"
          >
            Address Line 2
          </label>
          <input
            id="address2"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            type="text"
            placeholder="Address Line 2"
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
          />

          <label
            htmlFor="pincode"
            className="block mb-2 text-lg font-medium text-gray-700"
          >
            Pincode
          </label>
          <input
            id="pincode"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            type="text"
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            required
          />

          <label
            htmlFor="area"
            className="block mb-2 text-lg font-medium text-gray-700"
          >
            Area
          </label>
          <input
            id="area"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            type="text"
            placeholder="Area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            required
          />

          <label
            htmlFor="city"
            className="block mb-2 text-lg font-medium text-gray-700"
          >
            City
          </label>
          <input
            id="city"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />

          <label
            htmlFor="state"
            className="block mb-2 text-lg font-medium text-gray-700"
          >
            State
          </label>
          <input
            id="state"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            type="text"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />

          <label
            htmlFor="Location"
            className="block mb-2 text-lg font-medium text-gray-700"
          >
            Search Location
          </label>
          <LocationSearch
            setSocietyLat={setSocietyLat}
            setSocietyLong={setSocietyLong}
            setAddress1={setAddress1}
            setAddress2={setAddress2}
            setPincode={setPincode}
            setArea={setArea}
            setCity={setCity}
            setState={setState}
            setSearchLocation={setSearchLocation}
            societyLat={societyLat}
            societyLong={societyLong}
          />
          <p>Latitude: {societyLat}</p>
          <p>Longitude: {societyLong}</p>

          <div className="flex justify-between">
            <button
            // loading = {loading}
              type="submit"
              className="w-[45%] p-2 text-white transition duration-300 bg-blue-500 rounded hover:bg-blue-600"
            >
              Add Client
            </button>
            <button
              type="button"
              className="w-[45%] p-2 text-white transition duration-300 bg-slate-500 rounded hover:bg-red-600"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
