import axiosInstance from "../axiosIntance";

export const getAllboards = async () => {
  try {
    const res = await axiosInstance.get(`/articles`);
    console.log("API Response:", res.data); // Log the response data
    return res.data;
  } catch (e) {
    console.error("API Error:", e); // Log the error
    throw e; // Throw the error to be handled in the component
  }
};
