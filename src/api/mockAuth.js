// export const mockLogin = async (email, password) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       if (email === "user@example.com" && password === "password123") {
//         resolve({ success: true, message: "Login Successful!" });
//       } else {
//         reject({ success: false, message: "Invalid email or password." });
//       }
//     }, 1000);
//   });
// };

import apiClient from "../config/axios";

export const mockLogin = async (email, password) => {
  try {
    // Perform the login request using Axios
    const response = await apiClient.post("/auth/login", { email, password });

    console.log("response.data.",response.data)
    localStorage.setItem("token", response.data.data.token);

    // Return success and token
    return { success: true, message: response.data.data.token }; // Assuming the token is in `response.data.token`
  } catch (error) {
    // Handle errors (e.g., API errors)
    const errorMessage =
      error.response?.data?.message || "Login failed. Please try again.";
    return { success: false, message: errorMessage };
  }
};
