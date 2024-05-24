import apiService from "./services";

const ActivityService = {
	async getFiles() {
		return apiService.get("/files");
	},

	async upload(data) {
		return apiService.post("/upload", data);
	},
};

export default ActivityService;
