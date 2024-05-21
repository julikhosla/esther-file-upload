import apiService from "./services";

const ActivityService = {
	async getActivities() {
		return apiService.get("/activities");
	},

	async getActivitiesByContactId(id) {
		return apiService.get(`/activities/${id}`);
	},

	async upload(data) {
		console.log(data);
		return apiService.post("/upload", data);
	},
};

export default ActivityService;
