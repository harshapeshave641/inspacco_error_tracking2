import React, { useEffect, useState ,useRef} from "react";
import { Link, useLocation } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";

import Input from "../../components/common/neomorphic/Input";

import PhoneIcon from "@heroicons/react/24/solid/PhoneIcon";
import LoginImg from "./../../assets/images/LoginImage.svg";
// import PhoneIcon from "./../../assets/images/TelephoneIcon.svg";
import InspaccoLogo from "./../../assets/images/InspaccoBlueLogo.svg";

import { GET_USERS_BY_MOBILE_NO } from "../../graphql/queries/getUserByMobileId";
import { GENERATE_OTP } from "../../graphql/mutations/authentication/generateOtp";
import { mobileValidator } from "../../helpers/validations";
import { _get, pickupDataFromResponse } from "../../helpers/utils";
import OtpVerification from "../../components/OtpVerification";
import { getOtp } from "../../thunk/authThunk";
import { useDispatch } from "react-redux";
import { logout, setAuthPayload } from "../../slice/authSlice";
import Register from "../Register";
function TestError1() {
  const a=2;
  a.nono();
}
export default function Login() {
  const [mobile, setMobile] = useState({ value: "", error: "" });
  const [showOtpField, setShowOtpField] = useState(false);
  const [showMobilefield, setShowMobilefield] = useState(true);

  const dispatch = useDispatch();
  const location = useLocation();
  const requestOtpRef = useRef();

  const [generateOtp] = useMutation(GENERATE_OTP);
  const [getusersByMobileid] = useLazyQuery(GET_USERS_BY_MOBILE_NO);

  const handleMobileNumberInput = ({ target: { value } }) => {
    const onlyNumber = value.replace(/[^0-9]/g, "");
    if (onlyNumber.length < 10) {
      setMobile({ value: onlyNumber, error: "Enter valid mobile number" });
      return false;
    } else if (onlyNumber.length === 10) {
      const number = onlyNumber.replace(
        "^(+d{1,2}s)?(?d{3})?[s.-]d{3}[s.-]d{4}$"
      );
      setMobile({ value: number, error: "" });
      return true;
    }
  };
  
  const requestOtp = async () => {
    if (mobile.error) return;

    const mobileError = mobileValidator(mobile.value);
    if (mobileError) {
      setMobile({ ...mobile, error: mobileError });
      return;
    }

    const getUserByMobileNo = await getusersByMobileid({
      variables: {
        mobileNumber: `${mobile.value}`,
      },
    });

    const exitingUsers = pickupDataFromResponse(getUserByMobileNo);
    if (!exitingUsers.length) {
      setMobile({
        value: mobile.value,
        error:
          "You are not registered with us, please continue the process using Register Now",
      });
      return;
    }

    const params = { mobileNumber: mobile.value };

    try {
      const generatedOtpRes = await generateOtp({
        variables: { params },
      });

      dispatch(
        setAuthPayload({
          isNewUser: _get(
            generatedOtpRes,
            "data.callCloudCode.result.isNewUser"
          ),
        })
      );

      setShowMobilefield(false);
      setShowOtpField(true);
    } catch (error) {
      setMobile({
        value: mobile.value,
        error: "There was some issue in requesting OTP!",
      });
    }
    return;
  };
  useEffect(()=>{
    dispatch(logout())
  },[])



  // Store the latest requestOtp function in the ref
  useEffect(() => {
    requestOtpRef.current = requestOtp;
  }, [requestOtp]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        requestOtpRef.current();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  
  return (
    <div className="p-4 h-screen bg-[#03386A] text-primary flex justify-center items-center">
      {/* <TestError1/> */}
      <div className="p-8 shadow-xl card lg:card-side bg-base-100">
        <div classname="card-body">
          <div className="text-left">
            <img className="w-52" src={InspaccoLogo} alt="logo" />
          </div>
          <div className="inline-flex">
            <div className="flex-1 px-8 w-96">
              <img src={LoginImg} className="mx-auto" alt="hero" />
            </div>
            <div className="flex-1 border-l-2 border-gray-400">
              {location.pathname === "/login" ? (
                showMobilefield ? (
                  <div className="w-[80%] mx-auto py-10">
                    <h2 className="text-2xl font-semibold text-center card-title">
                      AI Powered Platform to Discover And Manage Services &
                      Staff
                    </h2>
                    <div className="inspacco-login flex flex-col items-center justify-center gap-6 p-8">
                      <Input
                        prefixIcon={
                          <PhoneIcon className="w-6 h-6 pr-2 border-r text-primary border-primary" />
                        }
                        iconWrapperClass="top-3"
                        placeholder="Mobile Number"
                        onChange={handleMobileNumberInput}
                        className={`mobile-number ${mobile.error ? "input-error" : ""}`}
                        value={mobile.value}
                        error={mobile.error}
                      />
                      <div className="card-actions">
                        <button
                          onClick={requestOtp}
                          className="rounded-full btn btn-primary btn-wide btn-sm send-otp"
                        >
                          SEND OTP
                        </button>
                      </div>
                      <Link to="/register">
                        New User?{" "}
                        <span className="font-semibold underline">
                          Register Now
                        </span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <OtpVerification
                    {...{
                      mobileNo: mobile.value,
                      handleResendOtp: generateOtp,
                    }}
                  />
                )
              ) : (
                <Register />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
