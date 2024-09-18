import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMutation, useLazyQuery } from "@apollo/client";

import NavigateBack from "../common/NavigateBack";
import OtpInput from "../common/OtpInput";
import { login } from "../../slice/authSlice";

import { GET_USER_ROLES } from "../../graphql/queries/getuserRoles";
import { LOGIN_WITH } from "../../graphql/mutations/authentication/loginwWith";

import { OtpValidator } from "../../helpers/validations";
import { _get, pickupDataFromResponse } from "../../helpers/utils";

export default function OtpVerification({ mobileNo, handleResendOtp }) {
  const [value, setValue] = useState("");
  const [societyIds, setSocietyIds] = useState([]);
  const [otpError, setOtpError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [doLogin] = useMutation(LOGIN_WITH);
  const [getRoles] = useLazyQuery(GET_USER_ROLES);

  const [showResendButton, setShowResendButton] = useState(false);
  const [timer, setTimer] = useState(30);

  const { isNewUser } = useSelector((state) => state.authSlice);

  const resendOtp = () => {
    setShowResendButton(false);
    setTimer(30);
    handleResendOtp();
  };

  useEffect(() => {
    let interval = null;

    if (timer === 0) {
      setShowResendButton(true);
    } else {
      interval = setInterval(() => {
        setTimer((timer) => timer - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer]);

  const handleNewUserRegistration = () => {
    navigate("/register-society");
    return;
  };

  const handleLogin = async () => {
    const checkotpError = OtpValidator(value);

    if (checkotpError) {
      setOtpError(checkotpError);
      setValue(value);
      return;
    }

    const myAuthData = {
      id: mobileNo,
      otp: value,
    };

    try {
      const loginResponse = await doLogin({
        variables: {
          authData: {
            phoneAuth: myAuthData,
          },
        },
      });

      const loginUserDetails = _get(
        loginResponse,
        "data.logInWith.viewer.sessionToken"
      );

      const user = _get(loginResponse, "data.logInWith.viewer.user");
      console.log(user);

      const rolesResponse = await getRoles({
        variables: {
          user: user.objectId,
        },
      });

      const roles = pickupDataFromResponse(rolesResponse);

      const getSocietyDetails = (roleName) => {
        const [activeRole, activeAccountId] = roleName.split("__");
        return { activeAccountId, activeRole };
      };

      let rolesInfo = roles.map((role) => getSocietyDetails(role.name));
      console.log(rolesInfo);

      if (!rolesInfo?.length) {
        dispatch(
          login({
            user,
            sessionToken: loginUserDetails,
            roles: rolesInfo,
          })
        );
        navigate("/register-society");
        return;
      }

      const isSocietyUser = rolesInfo.some((obj) =>
        obj.activeRole.startsWith("SOCIETY")
      );
      const isInspaccoAdmin = rolesInfo.some((obj) =>
        obj.activeRole.startsWith("INSPACCO_ADMIN")
      );
      if (isInspaccoAdmin) {
        dispatch(
          login({
            user,
            sessionToken: loginUserDetails,
            roles: rolesInfo,
            // activeAccountId,
            activeRole: "INSPACCO_ADMIN",
            isAdmin: true,
          })
        );
        navigate("/");
        return;
      }
      const isInspaccoKAM = rolesInfo.some((obj) =>
        obj.activeRole.startsWith("INSPACCO_KAM")
      );
      if (isInspaccoKAM) {
        dispatch(
          login({
            user,
            sessionToken: loginUserDetails,
            roles: rolesInfo,
            // activeAccountId,
            activeRole: "INSPACCO_KAM",
            isAdmin: true,
          })
        );
        navigate("/");
        return;
      }
      if (!isSocietyUser) {
        setOtpError("Your Mobile Number does not belongs to any Society");
        return;
      }

      rolesInfo = rolesInfo.filter((obj) =>
        obj.activeRole.startsWith("SOCIETY")
      );
      // Inspacco admin && Socieyt () & Partner
      const { activeAccountId, activeRole } = rolesInfo[0];
      const societyIds = rolesInfo.map((obj) => obj.activeAccountId);
      setSocietyIds(societyIds);

      console.log(societyIds);

      dispatch(
        login({
          user,
          sessionToken: loginUserDetails,
          roles: rolesInfo,
          activeAccountId,
          activeRole,
        })
      );

      navigate("/");
    } catch (error) {
      console.log("error", error);
      console.log(error.code, error.message, "otp issue");
      setOtpError("Invalid OTP");
    }
  };

  useEffect(() => {
    if (value.length === 4) {
      handleLogin();
    }
  }, [value]);

  return (
    <div>
      <div className="otp-verify w-[90%] mx-auto pb-8">
        <NavigateBack className="mb-8" />
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold text-center card-title">
            Please enter a verification code sent on +91-{mobileNo}
          </h2>
          <OtpInput
            wrapperClass={"otp-inputs mt-12 mb-6"}
            size={4}
            value={value}
            onChange={(val) => setValue(val)}
          />
          <span
            className={`${
              otpError ? "visible" : "invisible"
            }  text-red-500 mb-6 text-xs`}
          >
            {otpError}
          </span>

          <button
            onClick={handleLogin}
            className="rounded-full btn btn-primary btn-wide btn-sm"
          >
            LOGIN
          </button>
          <div className="pt-2">
            {showResendButton ? (
              <a
                onClick={resendOtp}
                className={`cursor-pointer text-primary text-sm hover:underline`}
              >
                Resend OTP
              </a>
            ) : (
              <div className="grid grid-flow-col gap-2 pt-2 text-center auto-cols-max">
                <div className="flex flex-col p-4 bg-gray-400 rounded-box text-primary-content">
                  <span className="font-mono text-lg countdown">
                    00:
                    <span style={{ "--value": timer }} />
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
