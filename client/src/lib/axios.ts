import axios from "axios";

const myAxios = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

export default myAxios;
