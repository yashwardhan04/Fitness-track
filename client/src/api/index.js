import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/",
});

export const UserSignUp = async (data) => API.post("/user/signup", data);
export const UserSignIn = async (data) => API.post("/user/signin", data);

export const getDashboardDetails = async (token) =>
  API.get("/user/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getWorkouts = async (token, date) =>
  await API.get(`/user/workout${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getWorkoutsList = async (token, params) =>
  await API.get(`/user/workouts`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

export const updateWorkout = async (token, id, data) =>
  await API.put(`/user/workout/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteWorkout = async (token, id) =>
  await API.delete(`/user/workout/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addWorkout = async (token, data) =>
  await API.post(`/user/workout`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

  export const sendContactMessage = async (token, data) =>
    await API.post(`/contact`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
  export const getMyContacts = async (token, params) =>
    await API.get(`/contact/my`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
  
  export const getAllContacts = async (token, params) =>
    await API.get(`/contact`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
  
  export const updateContactStatus = async (token, id, status) =>
    await API.patch(`/contact/${id}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` },
    });

// PRs API
export const listPRs = async (token, params) =>
  await API.get(`/prs`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

export const createPR = async (token, data) =>
  await API.post(`/prs`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deletePRApi = async (token, id) =>
  await API.delete(`/prs/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });