import { FormError, Option } from '@interfaces/common';
import { validateForm } from '@utils/validateUtils';
import { validatePrimaryQr, validateRestarant } from '@utils/validator';
import axios from 'axios';
import { useMutation, useQuery } from 'react-query';

export type AddQrRequest = {
	restaurant_id: string | Option;
	qr_ids: string[];
	primary_qr: string;
};

export const validateQrFields = (fieldName: keyof AddQrRequest, formData: AddQrRequest): string => {
	switch (fieldName) {
		case 'restaurant_id':
			return validateRestarant(formData[fieldName] as Option);
		case 'primary_qr':
			return validatePrimaryQr(formData[fieldName]);
		default:
			return '';
	}
};

export const validateQrForm = (formData: AddQrRequest): FormError<AddQrRequest> =>
	validateForm(formData, validateQrFields);

export type SubAdminQrDashoardResponse = {
	dashboard_data: {
		total_qr_assigned_count: number;
		qr_assigned_count: number;
		available_qr_count: number;
	};
	restaurants: {
		restaurant_id: string;
		restaurant_name: string;
		address: string;
		'added date': string;
		'assigned qr': string;
	}[];
};

export const useGetSubAdminQrDashboardApi = () => {
	return useQuery(['dashboard_and_assign_qr_restaurant'], () =>
		axios<SubAdminQrDashoardResponse>({
			method: 'GET',
			url: `/dashboard_and_assign_qr_restaurant/`,
		})
	);
};

export const useAssignQrIdApi = () =>
	useMutation((info: { request: Partial<AddQrRequest> }) =>
		axios({
			method: 'POST',
			url: `/assign_qr_id/`,
			data: info.request,
		})
	);

export const useGetSubAdminRestaurants = () => {
	return useQuery(['get_restaurant_name'], () =>
		axios<{
			restaurant_list: {
				restaurant_id: string;
				restaurant_name: string;
				address: string;
				primary_qr: string;
			}[];
		}>({
			method: 'GET',
			url: `/get_restaurant_name/`,
		})
	);
};
