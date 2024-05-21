import { API } from "../api";

export const BASE_URL = process.env.REACT_APP_BASE_URL;

const buildURL = (path) => {
	const url = new URL(BASE_URL);
	url.pathname += path;

	return url.href;
};

const fetchData = async (path, params) => {
	return API.get(buildURL(path));
	// return await (await fetch(url.href)).json();
};

const postData = async (path, data) => {
	return API.post(buildURL(path), data);
};

const apiService = {
	async get(path, searchParams) {
		return fetchData(path, searchParams);
	},

	async post(path, data) {
		return postData(path, data);
	},
};

export default apiService;
