import api from "./axiosInstance";

const analyzeApi = {
  async runAnalysis() {
    const { data } = await api.post("/api/analyze");
    return data; // { message, report }
  },

  async getAnalysis() {
    const { data } = await api.get("/api/analyze");
    return data; // { message, report }
  },
};

export default analyzeApi;