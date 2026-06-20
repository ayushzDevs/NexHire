import api from "./axiosInstance";

const profileApi = {
  async getProfile() {
    const { data } = await api.get("/api/profile/", {
      headers: { "Content-Type": "application/json" },
    });
    return data; // { message, profile: { resumeUrl, targetRole } }
  },

  async uploadResume(file) {
    const formData = new FormData();
    formData.append("resume", file);

    // don't set Content-Type manually — browser sets the multipart boundary automatically
    const { data } = await api.post("/api/profile/resume", formData);
    return data; // { message, resumeUrl }
  },

  async saveTargetRole(targetRole) {
    const { data } = await api.post(
      "/api/profile/role",
      { targetRole },
      { headers: { "Content-Type": "application/json" } }
    );
    return data; // { message, targetRole }
  },
};

export default profileApi;