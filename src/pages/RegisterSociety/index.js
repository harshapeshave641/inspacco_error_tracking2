import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { useMutation } from "@apollo/client";
import * as Yup from "yup";

import Input from "../../components/common/neomorphic/Input";
import { REGISTER_NEW_SCOIETY } from "../../graphql/mutations/society/registerNewSociety";

import RegisterSideImg from "./../../assets/images/registration-side.svg";
import { logout } from "../../slice/authSlice";

export default function RegisterSociety() {
  const { user } = useSelector((state) => state.authSlice);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [registerNewSociety] = useMutation(REGISTER_NEW_SCOIETY);

  const logOut = () => {
    dispatch(logout());
    navigate("/login");
  };

  const onSubmit = async (values, formikHelper) => {
    console.log(values);

    const newSociety = await registerNewSociety({
      variables: {
        clientName: values.societyname,
        clientType: values.clienttype.toLowerCase(),
        email: values.email,
        message: values.desc,
        pincode: values.pincode,
        address: values.address,
      },
    });

    navigate("/");
  };

  return (
    <div className="text-primary p-3.5 bg-[#F5F5F5] flex justify-center items-center">
      <div className="card lg:card-side bg-base-100 shadow-xl h-[95vh] overflow-hidden">
        <div classname="card-body">
          <div className="inline-flex">
            <div className="px-8 w-[40%] bg-[#033364] flex flex-col gap-12 justify-center items-center">
              <label className="text-white text-xl capitalize">
                Hi, {user?.firstName}
              </label>
              <img src={RegisterSideImg} className="mx-auto" alt="hero" />
            </div>
            <div className="w-[60%]">
              <div className="w-[80%] mx-auto py-2">
                <h2 className="card-title text-2xl text-center font-bold">
                  Customer Registation
                </h2>
                <p className="text-sm">
                  Please fill below information to complete the profile. It’s
                  Free!
                </p>
                <Formik
                  initialValues={{
                    clienttype: "",
                    societyname: "",
                    email: "",
                    designation: "",
                    address: "",
                    pincode: "",
                    desc: "",
                  }}
                  onSubmit={onSubmit}
                  validationSchema={Yup.object().shape({
                    clienttype: Yup.string().required("Please enter type!"),
                    societyname: Yup.string()
                      .required("Please enter Name!")
                      .min(2, "Name should not too short!")
                      .max(20, "Name is too long!"),
                    email: Yup.string()
                      .email()
                      .required("Please enter Email!")
                      .typeError("Please enter valid Email"),
                    designation: Yup.string()
                      .required("Please enter Designation!")
                      .min(2, "Designation should not be too short!"),
                    address: Yup.string()
                      .required("Please enter Address!")
                      .min(2, "Address should not be too short!"),
                    pincode: Yup.number()
                      .required("Please enter Pincode!")
                      .min(2, "Pincode should not be too short!")
                      .integer("Pincode must be an integer!"),
                    desc: Yup.string()
                      .required("Please enter Message!")
                      .min(2, "Message should not be too short!"),
                  })}
                >
                  {({ errors, touched, values }) => (
                    <Form>
                      {console.log("values.clienttype", values)}
                      <div className="flex flex-col justify-center items-center gap-3 text-sm py-4">
                        <div>
                          <div className="flex gap-2 py-0.5 justify-start w-full">
                            <Field
                              type="radio"
                              as={(props) => (
                                <div className="text-primary gap-2 flex justify-center items-enter">
                                  <input
                                    type="radio"
                                    name="clienttype"
                                    className="radio radio-primary radio-sm"
                                    {...props}
                                  />
                                  <span>{props.label}</span>
                                </div>
                              )}
                              name="clienttype"
                              label="Corporte"
                              value="corporte"
                            />
                            <Field
                              type="radio"
                              as={(props) => (
                                <div className="text-primary gap-2 flex justify-center items-enter">
                                  <input
                                    type="radio"
                                    name="clienttype"
                                    className="radio radio-primary radio-sm"
                                    {...props}
                                  />
                                  <span>{props.label}</span>
                                </div>
                              )}
                              name="clienttype"
                              label="Residential"
                              value="residential"
                            />
                          </div>
                          <span className="text-error">
                            {errors.clienttype}
                          </span>
                        </div>
                        <Field
                          type="text"
                          as={Input}
                          size="small"
                          label="societyname"
                          placeholder="Society / Company Name"
                          InputProps={{
                            disableUnderline: true,
                          }}
                          name="societyname"
                          required
                          error={
                            Boolean(errors.societyname) &&
                            Boolean(touched.societyname)
                          }
                          helperText={
                            Boolean(touched.societyname) && errors.societyname
                          }
                        />
                        <Field
                          type="email"
                          as={Input}
                          size="small"
                          label="email"
                          placeholder="Email"
                          InputProps={{
                            disableUnderline: true,
                          }}
                          name="email"
                          required
                          error={
                            Boolean(errors.email) && Boolean(touched.email)
                          }
                          helperText={Boolean(touched.email) && errors.email}
                        />
                        <Field
                          type="text"
                          as={Input}
                          size="small"
                          label="designation"
                          placeholder="Designation"
                          InputProps={{
                            disableUnderline: true,
                          }}
                          name="designation"
                          required
                          error={
                            Boolean(errors.designation) &&
                            Boolean(touched.designation)
                          }
                          helperText={
                            Boolean(touched.designation) && errors.designation
                          }
                        />
                        <Field
                          type="text"
                          as={Input}
                          size="small"
                          label="pincode"
                          placeholder="Pincode"
                          InputProps={{
                            disableUnderline: true,
                          }}
                          name="pincode"
                          required
                          error={
                            Boolean(errors.pincode) && Boolean(touched.pincode)
                          }
                          helperText={
                            Boolean(touched.pincode) && errors.pincode
                          }
                        />
                        <Field
                          type="text"
                          as={Input}
                          size="small"
                          label="address"
                          placeholder="Address"
                          InputProps={{
                            disableUnderline: true,
                          }}
                          name="address"
                          required
                          error={
                            Boolean(errors.address) && Boolean(touched.address)
                          }
                          helperText={
                            Boolean(touched.address) && errors.address
                          }
                        />
                        <Field
                          type="text"
                          as={Input}
                          size="small"
                          label="desc"
                          placeholder="What're you looking for?"
                          InputProps={{
                            disableUnderline: true,
                          }}
                          name="desc"
                          required
                          error={Boolean(errors.desc) && Boolean(touched.desc)}
                          helperText={Boolean(touched.desc) && errors.desc}
                        />
                        <div className="card-actions">
                          <div className="flex w-full justify-center">
                            <button
                              type="submit"
                              className="btn btn-primary border border-none my-1 h-auto py-3 bg-[#00A69A] btn-wide btn-sm rounded-full"
                            >
                              Submit
                            </button>
                          </div>
                          <p className="text-xs">
                            Lorem ipsum dolor sit amet, consectetuer adipiscing
                            elit, sed diam. <a onClick={logOut}>Logout</a>
                          </p>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
