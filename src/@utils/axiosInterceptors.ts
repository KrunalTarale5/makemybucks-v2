import { setDirty } from '_store/actions/ui-actions';
import { store } from '_store/store';
import Axios, { AxiosError } from 'axios';

Axios.interceptors.request.use((config) => {
	config.url = `${String(process.env.REACT_APP_GATEWAY_API)}${String(config.url)}`;

	const token: string | null = store.getState()?.richPenny?.token;
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

Axios.interceptors.response.use(
	(response) => {
		return response;
	},
	(error: AxiosError) => {
		if (error.response?.status === 402) {
			store.dispatch(setDirty(true));
		}

		return Promise.reject(error);
	}
);
