import React, { useState , useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Formik, Field } from "formik";
import { useLazyQuery, useMutation } from "@apollo/client";
import * as Yup from "yup";

import { CREATE_USER } from "../../graphql/mutations/user/createUser";
import { GET_USERS_BY_MOBILE_NO } from "../../graphql/queries/getUserByMobileId";
import { GENERATE_OTP } from "../../graphql/mutations/authentication/generateOtp";

import OtpVerification from "../../components/OtpVerification";
import Input from "../../components/common/neomorphic/Input";
import { _get, pickupDataFromResponse } from "../../helpers/utils";

export default function Register() {
  const [message, setMessage] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    mobilenumber: "",
  });

  const initialValues = {
    name: "",
    contact: "",
  };

  const [createnewUser] = useMutation(CREATE_USER, { onError: onApiError });
  const [generateOtp] = useMutation(GENERATE_OTP);
  const [getusersByMobileid] = useLazyQuery(GET_USERS_BY_MOBILE_NO);

  function onApiError(error) {
    console.log({
      message: "User already available!",
      type: "danger",
    });
    console.log(error, "something is wrong!");
  }

  const onSubmit = async (values, formikHelper) => {
    console.log(values);
    var firstName = values.name.split(" ").slice(0, -1).join(" ");
    var lastName = values.name.split(" ").slice(-1).join(" ");
    const params = {
      username: values.contact+'',
      firstname: firstName,
      lastname: lastName,
      mobilenumber: values.contact+'',
    };

    setUserData(params);

    const getUserByMobileNo = await getusersByMobileid({
      variables: {
        mobileNumber: values.contact+'',
      },
    });

    const exitingUsers = pickupDataFromResponse(getUserByMobileNo);
    if (exitingUsers.length) {
      setMessage("User already exists!");
      return;
    }

    const newResponse = await createnewUser({ variables: params });

    if (newResponse.error) {
      setMessage("Somthing went wrong!");
      return;
    }
    setMessage("Registered successfully!");
    console.log(newResponse, "user created successfully!");
    setTimeout(() => {
      setMessage("");
    }, 5000);

    try {
      const generatedOtpRes = await generateOtp({
        variables: { params: { mobileNumber: params.mobilenumber } },
      });
      let isNewUser = _get(
        generatedOtpRes,
        "data.callCloudCode.result.isNewUser"
      );
      setShowOtpField(true);
    } catch (error) {
      console.log({ error: "There was some issue in requesting OTP" });
    }
    return;
  };

  const sendOtp = async () => {
    await generateOtp({
      variables: { userData },
    });
  };



  return (
    <>
      {!showOtpField ? (
        <div className="flex-1">
          <div className="py-10 text-center">
            <h2 className="text-2xl font-bold text-center">
              Register New User
            </h2>
            <div className="output">
              <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={Yup.object().shape({
                  name: Yup.string()
                    .required("Please enter name")
                    .min(2, "Name should not too short")
                    .max(20, "Name is To long"),
                  contact: Yup.number()
                    .required("Please enter contact number")
                    .typeError("Please enter valid phone number")
                    .integer("Phone number must be an integer"),
                  // .min(1000000000, "Phone number must be 10 digits")
                  // .max(9999999999, "Phone number must be 10 digits"),
                })}
              >
                {({ errors, touched, values }) => (
                  <Form>
                    <div className="flex flex-col items-center justify-center gap-6 p-8">
                      <Field
                        type="text"
                        as={Input}
                        size="small"
                        label="name"
                        placeholder="Name"
                        InputProps={{
                          disableUnderline: true,
                        }}
                        name="name"
                        required
                        error={Boolean(errors.name) && Boolean(touched.name)}
                        helperText={Boolean(touched.name) && errors.name}
                      />
                      <Field
                        type="tel"
                        as={Input}
                        placeholder="Contact"
                        size="small"
                        label="contact"
                        InputProps={{
                          disableUnderline: true,
                        }}
                        name="contact"
                        required
                        error={
                          Boolean(errors.contact) && Boolean(touched.contact)
                        }
                        helperText={Boolean(touched.contact) && errors.contact}
                      />
                      <div className="justify-center card-actions">
                        {message && (
                          <span className="font-bold text-red-500">
                            {message}
                          </span>
                        )}
                        <button
                          type="submit"
                          className="rounded-full btn btn-primary btn-wide btn-sm"
                        >
                          Register
                        </button>
                      </div>
                      <Link to="/login">
                        Already Registered?
                        <span className="font-bold"> Login</span>
                      </Link>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      ) : (
        <OtpVerification
          {...{
            mobileNo: userData.mobilenumber,
            handleResendOtp: sendOtp,
          }}
        />
      )}
    </>
  );
}
