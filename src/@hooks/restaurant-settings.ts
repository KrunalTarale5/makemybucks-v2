import { RestaurantProfileStatus, WeekDays } from '@interfaces/common';
import axios from 'axios';
import { useMutation, useQuery } from 'react-query';

export type RestaurantProfileResponse = {
	restaurant_details: {
		restaurant_id: string;
		restaurant_name: string;
		address: string;
		location: string;
		status: string;
		restaurant_status: string;
		restaurant_profile: string;
		restaurant_banner: string;
	};
};

export const useGetRestaurentProfileApi = () => {
	return useQuery(['get_restaurant_profile'], () =>
		axios<RestaurantProfileResponse>({
			method: 'GET',
			url: `/get_restaurant_profile/`,
		})
	);
};

export type RestaurantProfileUpdateResponse = {
	message: any;
	data: {
		restaurant_id: string;
		status: RestaurantProfileStatus;
		restaurant_profile: string;
		restaurant_banner: string;
	};
};

export type RestaurentUpdateProfileRequest = {
	status: RestaurantProfileStatus;
	restaurant_banner: FileList;
	restaurant_profile: FileList;
};
export const useGetRestaurentProfileUpdateApi = () => {
	return useMutation((info: { request: Partial<RestaurentUpdateProfileRequest> }) => {
		const formData = new FormData();
		Object.keys(info.request).forEach((l) => {
			if (!(l === 'restaurant_banner' || l === 'restaurant_profile')) {
				formData.append(l, info.request[l as keyof RestaurentUpdateProfileRequest] as string);
			}
		});
		if (info.request.restaurant_banner && typeof info.request.restaurant_banner !== 'string')
			formData.append(
				'restaurant_banner',
				info.request.restaurant_banner[0],
				info.request.restaurant_banner[0].name
			);
		if (info.request.restaurant_profile && typeof info.request.restaurant_profile !== 'string')
			formData.append(
				'restaurant_profile',
				info.request.restaurant_profile[0],
				info.request.restaurant_profile[0].name
			);

		return axios<RestaurantProfileUpdateResponse>({
			method: 'POST',
			url: `/update_restaurant_profile/`,
			data: formData,
		});
	});
};

export type OperationalTiming = {
	hr: number;
	min: number;
	ampm: string;
};
export type RestaurentTimingRequest = {
	[key in WeekDays]: {
		days_status: boolean;
		opening_time: OperationalTiming;
		closing_time: OperationalTiming;
	};
};

export const useGetRestaurentTimingApi = () => {
	return useQuery(['get_restaurant_timming'], () =>
		axios<{ restaurant_timing: RestaurentTimingRequest }>({
			method: 'GET',
			url: `/get_restaurant_timming/`,
		})
	);
};

export const useUpdateRestaurentTimingApi = () => {
	return useMutation((info: { request: RestaurentTimingRequest }) =>
		axios({
			method: 'PUT',
			url: `/update_restaurant_time_days/`,
			data: info.request,
		})
	);
};
