import api from "./axiosInstance";

const profileApi = {
  async getProfile() {
    const { data } = await api.get("/api/profile/");
    return data; // { message, profile: { resumeUrl, targetRole } }
  },

  async uploadResume(file) {
    const formData = new FormData();
    formData.append("resume", file);

    const { data } = await api.post("/api/profile/resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data; // { message, resumeUrl }
  },

  async saveTargetRole(targetRole) {
    const { data } = await api.post("/api/profile/role", { targetRole });
    return data; // { message, targetRole }
  },
};

export default profileApi;
