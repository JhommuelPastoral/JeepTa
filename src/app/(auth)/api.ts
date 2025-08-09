import axios, { isAxiosError } from "axios"

export const createUser = async (data:{email:string, password:string}) => {
  try {
    const res = await axios.post("/api/auth/user/create", data);
    return res.data;
  } catch (error) {
    if(isAxiosError(error)) throw new Error(error.response?.data.message) || "Something went wrong";
    throw "Something went wrong";
  }
}

export const createGoogleUser = async (data:{email:string}) => {
  try {
    const res = await axios.post("/api/auth/user/googleSignUp", data);
    return res.data;
  } catch (error) {
    if(isAxiosError(error)) throw new Error(error.response?.data.message) || "Something went wrong";
    throw new Error("Unexpected error occurred");
  }
}



export const sendOTP = async (data:{to:string}) => {
  try {
    const res = await axios.post("/api/auth/send-otp", data);
    return res.data;
  } catch (error) {
    if(isAxiosError(error)) throw new Error(error.response?.data.message) || "Something went wrong";
    throw new Error("Unexpected error occurred");
  }
}

export const verifyOTP = async (data:{email:string, otpCode:string}) => {
  try {
    const res = await axios.post("/api/auth/verify-otp", data);
    return res.data;
  } catch (error) {
    if(isAxiosError(error)) throw new Error(error.response?.data.message) || "Something went wrong";
    throw new Error("Unexpected error occurred");
  }
}

export const login = async (data:{email:string, password:string}) => {
  try {
    const res = await axios.post("/api/auth/user/login", data);
    return res.data;
  } catch (error) {
    if(isAxiosError(error)) throw new Error(error.response?.data.message) || "Something went wrong";
    throw new Error("Unexpected error occurred");
  }
}

export const googleLogin = async (data:{email:string}) => {
  try {
    const res = await axios.post("/api/auth/user/googleSignIn", data);
    return res.data;
  } catch (error) {
    if(isAxiosError(error)) throw new Error(error.response?.data.message) || "Something went wrong";
    throw new Error("Unexpected error occurred");
  }
}

export const resetPassword = async (data:{id:string, password:string}) => {
  try {
    const res = await axios.post("/api/auth/user/new-password", data);
    return res.data;
  } catch (error) {
    if(isAxiosError(error)) throw new Error(error.response?.data.message) || "Something went wrong";
    throw new Error("Unexpected error occurred");
  }
}