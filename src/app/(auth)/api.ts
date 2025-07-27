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