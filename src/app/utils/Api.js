import AxiosInheritance from "./AxiosInheritance";

//AUTH
export const loginUser = async (username, password) => {
  return await AxiosInheritance.post("/auth/login", { username, password });
};

export const logoutUser = async (token) => {
  return await AxiosInheritance.post(
    "/auth/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

//PRODUCTION DEPARTMENT AND WAREHOUSE DEPARTMENT GET
export const fetchPendingRequests = async () => {
  return await AxiosInheritance.get("/material-requests");
};

//PRODUCTION DEPARTMENT
export const createRequest = async (data) => {
  return await AxiosInheritance.post("/material-requests", data);
};

export const updateRequest = async (requestId, data) => {
  try {
    console.log("Request ID:", requestId);
    console.log("Payload:", data);

    const response = await AxiosInheritance.put(`/material-requests/${requestId}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating request:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteRequest = async (requestId) => {
  return await AxiosInheritance.delete(`/material-requests/${requestId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

//WAREHOUSE DEPARTMENT
export const approveRequest = async (requestId) => {
  return await AxiosInheritance.put(
    `/material-requests/${requestId}/approve`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

export const rejectRequest = async (requestId, reason) => {
  return await AxiosInheritance.put(
    `/material-requests/${requestId}/reject`,
    { reason },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};
