import axios from 'axios';
import { useMutation, useQuery } from 'react-query';

export type RestaurantTypeResponse = {
	id: string;
	type_name: string;
	type_added_datetime: string;
	type_updated_datetime: string;
};

export const useGetRestaurantTypeApi = () => {
	return useQuery(['get_restaurant_type'], () =>
		axios<{ restaurantTypeData: RestaurantTypeResponse[] }>({
			method: 'GET',
			url: `/get_restaurant_type/`,
		})
	);
};

export const useAddRestaurantTypeApi = () => {
	return useMutation((info: { request: { type_name: string } }) =>
		axios({
			method: 'POST',
			url: `/add_restaurant_type/`,
			data: info.request,
		})
	);
};

export const useUpdateRestaurantTypeApi = () => {
	return useMutation((info: { request: { new_type_name: string }; id: string }) =>
		axios({
			method: 'PUT',
			url: `/update_restaurant_type/${info.id}/`,
			data: info.request,
		})
	);
};

export type CuisineTypeResponse = {
	id: string;
	cuisine_name: string;
	cuisine_added_datetime: string;
	cuisine_updated_datetime: string;
};

export const useGetCuisineTypeApi = () => {
	return useQuery(['get_Cuisine_type'], () =>
		axios<{ cuisineData: CuisineTypeResponse[] }>({
			method: 'GET',
			url: `/get_cuisine_type/`,
		})
	);
};

export const useAddCuisineTypeApi = () => {
	return useMutation((info: { request: { cuisine_name: string } }) =>
		axios({
			method: 'POST',
			url: `/add_cuisine_type/`,
			data: info.request,
		})
	);
};

export const useUpdateCuisineTypeApi = () => {
	return useMutation((info: { request: { new_cuisine_name: string }; id: string }) =>
		axios({
			method: 'PUT',
			url: `/update_cuisine_type/${info.id}/`,
			data: info.request,
		})
	);
};

export type AgreementPeriodResponse = {
	id: string;
	period: string;
	period_added_datetime: string;
	period_updated_datetime: string;
};

export const useGetAgreementPeriodApi = () => {
	return useQuery(['get_onbording_period'], () =>
		axios<{ onbordingPeriodsData: AgreementPeriodResponse[] }>({
			method: 'GET',
			url: `/get_onbording_periods/`,
		})
	);
};

export const useAddAgreementPeriodApi = () => {
	return useMutation((info: { request: { period: string } }) =>
		axios({
			method: 'POST',
			url: `/add_onbording_period/`,
			data: info.request,
		})
	);
};

export const useUpdateAgreementPeriodApi = () => {
	return useMutation((info: { request: { new_period_name: string }; id: string }) =>
		axios({
			method: 'PUT',
			url: `/update_onbording_period/${info.id}/`,
			data: info.request,
		})
	);
};

export type AssignLocationTypeResponse = {
	id: string;
	location_name: string;
	location_added_datetime: string;
	location_updated_datetime: string;
};

export const useGetAssignLocationTypeApi = () => {
	return useQuery(['get_location'], () =>
		axios<{ onbordingLocationData: AssignLocationTypeResponse[] }>({
			method: 'GET',
			url: `/get_location/`,
		})
	);
};

export const useAddAssignLocationTypeApi = () => {
	return useMutation((info: { request: { location: string } }) =>
		axios({
			method: 'POST',
			url: `/add_location/`,
			data: info.request,
		})
	);
};

export const useUpdateAssignLocationTypeApi = () => {
	return useMutation((info: { request: { new_location: string }; id: string }) =>
		axios({
			method: 'POST',
			url: `/update_location/${info.id}/`,
			data: info.request,
		})
	);
};

export type NotificationCategoryResponse = {
	msg_category_id: string;
	message_category: string;
	added_datetime: string;
	updated_datetime: string;
};

export const useGetNotificationCategoryApi = () => {
	return useQuery(['get_msg_category'], () =>
		axios<{ categoryData: NotificationCategoryResponse[] }>({
			method: 'GET',
			url: `/get_msg_category/`,
		})
	);
};

export const useAddNotificationCategoryApi = () => {
	return useMutation((info: { request: { message_category: string } }) =>
		axios({
			method: 'POST',
			url: `/add_msg_category/`,
			data: info.request,
		})
	);
};

export const useUpdateNotificationCategoryApi = () => {
	return useMutation((info: { request: { new_message_category: string }; id: string }) =>
		axios({
			method: 'PUT',
			url: `/update_msg_category/${info.id}/`,
			data: info.request,
		})
	);
};

export type RejectedReasonResponse = {
	id: number;
	reject_reason: string;
	added_datetime: string;
	updated_datetime: string;
};

export const useGetRejectedReasonApi = () => {
	return useQuery(['get_rejection_reason'], () =>
		axios<{ reject_reason_data: RejectedReasonResponse[] }>({
			method: 'GET',
			url: `/get_rejection_reason/`,
		})
	);
};

export const useAddRejectedReasonApi = () => {
	return useMutation((info: { request: { reject_reason: string } }) =>
		axios({
			method: 'POST',
			url: `/add_rejection_reason/`,
			data: info.request,
		})
	);
};

export const useUpdateRejectedReasonApi = () => {
	return useMutation((info: { request: { new_reject_reason: string }; id: string }) =>
		axios({
			method: 'PUT',
			url: `/update_rejection_reason/${info.id}/`,
			data: info.request,
		})
	);
};
