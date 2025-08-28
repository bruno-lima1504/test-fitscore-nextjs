import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL,
  withCredentials: true, // CRÍTICO: Envia cookies automaticamente
  validateStatus: (status) => status < 500, // Não trata 4xx como erro
  headers: {
    "Content-Type": "application/json",
  },
});
