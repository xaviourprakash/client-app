/** @format */

import axios, { AxiosResponse } from 'axios';
import { history } from '../..';
import { IActivity } from './../models/activity';
import { toast } from 'react-toastify';

axios.defaults.baseURL = 'https://localhost:44382/api';

//To intercept error response from API
axios.interceptors.response.use(undefined, (error) => {
	if (error.message === 'Network Error' && !error.response) {
		toast.error('Network error - make sure API is running!');
	}

	const { status, data, config } = error.response;
	if (status === 404) {
		history.push('/notfound');
	}
	if (
		status === 400 &&
		config.method === 'get' &&
		data.errors.hasOwnProperty('id')
	) {
		history.push('/notfound');
	}
	if (status === 500) {
		toast.error('Server error - check the terminal for more information!');
	}
});

const responseBody = (response: AxiosResponse) => response.data;
const sleep = (ms: number) => (response: AxiosResponse) =>
	new Promise<AxiosResponse>((resolve) =>
		setTimeout(() => resolve(response), ms),
	);

const requests = {
	get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
	post: (url: string, body: {}) =>
		axios.post(url, body).then(sleep(1000)).then(responseBody),
	put: (url: string, body: {}) =>
		axios.put(url, body).then(sleep(1000)).then(responseBody),
	del: (url: string) => axios.delete(url).then(sleep(1000)).then(responseBody),
};

const Activities = {
	list: (): Promise<IActivity[]> => requests.get('/activities/getactivities'),
	details: (id: string): Promise<IActivity> =>
		requests.get(`/activities/getactivity/${id}`),
	create: (activity: IActivity): Promise<IActivity> =>
		requests.post('/activities/saveactivity', activity),
	update: (activity: IActivity): Promise<IActivity> =>
		requests.put(`/activities/updateactivity/${activity.id}`, activity),
	delete: (id: string): Promise<IActivity> =>
		requests.del(`/activities/removeactivity/${id}`),
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { Activities };