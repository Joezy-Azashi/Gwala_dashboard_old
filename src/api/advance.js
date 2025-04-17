import { toast } from "react-toastify";
import axios from "./request";

export const checkEmployees = async (employees) => {
  try {
    const result = await axios.post("/advances/batch/check", employees);
    if (result.status !== "success") throw result?.message;
    return result?.data;
  } catch (e) {
    throw e;
  }
};
