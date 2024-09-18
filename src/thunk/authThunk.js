import { createAsyncThunk } from "@reduxjs/toolkit";
import { useMutation } from "@apollo/client";
import { GENERATE_OTP } from "../graphql/mutations/authentication/generateOtp";

export const getOtp = createAsyncThunk(
  "auth/generateOtp",
  async (params, thunkAPI) => {
    const [generateOtp] = useMutation(GENERATE_OTP);

    const response = await generateOtp({
      variables: { params },
    });

    console.log("response", response);

    return response;
  }
);
