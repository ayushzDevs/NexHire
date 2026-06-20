import api from "./axiosInstance";

const resumeApi = {
  async generateAtsResume() {
    const { data } = await api.post("/api/resume/generate");
    return data; // { message, resumeUrl, correctedText }
  },
};

export default resumeApi;