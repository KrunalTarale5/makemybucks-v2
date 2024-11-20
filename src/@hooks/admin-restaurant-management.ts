import {
	FormError,
	PageRequest,
	PaginationResponse,
	RestaurantStatus,
	SortRequest,
	Status,
	WeekDays,
} from '@interfaces/common';
import axios from 'axios';
import { useMutation, useQuery } from 'react-query';
import {
	validateAccountHolderName,
	validateEmail,
	validateName,
	validateOfferList,
	validatePhoneNumber,
} from '@utils/validator';
import { validateForm } from '@utils/validateUtils';

export type RestaurantResponse = {
	restaurant_id: string;
	restaurant_name: string;
	location: string;
	address: string;
	added_by: string;
	active_offer: string;
	qr_assign: string;
	status: RestaurantStatus;
};

export const useGetRestaurentsApi = (request: PageRequest & SortRequest & { search?: string }) => {
	return useQuery(['get_restaurents', request], () =>
		axios<PaginationResponse<RestaurantResponse>>({
			method: 'GET',
			url: `/get_restaurant_detail/`,
			params: request,
		})
	);
};

export type RestaurentsDetailsResponse = {
	owner_email: string;
	OBD: string;
	added_by: string;
	address: string;
	agreed_percentage: string;
	bank_acc_no: string;
	bank_branch: string;
	bank_cheque_url_pic: string;
	bank_name: string;
	city: string;
	cuisine: string;
	fssai_lic_no: string;
	fssai_lic_no_url_pic: string;
	future_date: string;
	ifsc_no: string;
	latitude: string;
	longitude: string;
	manager_email: string;
	manager_name: string;
	manager_no: string;
	offer_list: string;
	owner_id: string;
	pan_no: string;
	pincode: string;
	qr_assign: string;
	restaurant_added_date_time: string;
	restaurant_id: string;
	restaurant_name: string;
	restaurant_profile: string;
	restaurant_type: string;
	res_acc_holder_name: string;
	state: string;
	status: RestaurantStatus;
	location: string;
};

export const useGetRestaurentsDetailsApi = (id: string) => {
	return useQuery(
		['get_restaurents_details', id],
		() =>
			axios<{ data: RestaurentsDetailsResponse }>({
				method: 'GET',
				url: `/get_restaurant_detail/${id}/`,
			}),
		{ cacheTime: 0 }
	);
};

export type RestaurantCountResponse = {
	data: {
		active_restaurant_count: number;
		added_restaurant_count: number;
		pending_activation_count: number;
		pending_approval_count: number;
		settlement_amount: number;
		total_investment: number;
	};
};

export const useGetRestaurentsCountApi = () => {
	return useQuery(['get_restaurents_count'], () =>
		axios<RestaurantCountResponse>({
			method: 'GET',
			url: `/dashboard_restaurant_count/`,
		})
	);
};

export type RestaurantOtherDetailResponse = {
	other_details: {
		restaurant_id: string;
		restaurant_name: string;
		contact_no: string;
		restaurant_type: string;
		cuisine: string;
		address: string;
		status: RestaurantStatus;
		qr_assign: string;
		added_by: string;
		offer_list: string;
		restaurant_added_date_time: string;
		future_date: string;
		manager_name: string;
	};
	owner_details: {
		owner_name: string;
		owner_no: string;
		owner_email: string;
		agreed_percentage: string;
		agreement_period: string;
		agreement_type: string;
		payment_type: string;
	};
	document_details: {
		fssai_lic_no: string;
		fssai_lic_no_url_pic: string;
		fssai_status: Status;
	};
	bank_details: {
		res_acc_holder_name: string;
		bank_name: string;
		bank_acc_no: string;
		bank_branch: string;
		ifsc_no: string;
		bank_details_status: Status;
		bank_cheque_url_pic: string;
	};
	applicable_days: typeof WeekDays;
};

export const useGetRestaurentsOtherDetailApi = (id: string) => {
	return useQuery(['get_restaurant_other_detail'], () =>
		axios<RestaurantOtherDetailResponse>({
			method: 'GET',
			url: `/get_restaurant_other_detail/${id}/`,
		})
	);
};

export const useSetDocumentStatusApi = () => {
	return useMutation(
		(info: {
			request: { restaurant_id: string; status: string; type: string; reject_reason: string };
		}) =>
			axios({
				method: 'POST',
				url: `/update_document_status/`,
				data: info.request,
			})
	);
};

export const useChangeStatusApi = () => {
	return useMutation((info: { request: { restaurant_id: string; status: string } }) =>
		axios({
			method: 'POST',
			url: `/change_onboarding_status/`,
			data: info.request,
		})
	);
};

export const useChangeRestaurantStatusApi = () => {
	return useMutation((info: { request: { restaurant_id: string; status: string } }) =>
		axios({
			method: 'POST',
			url: `/change_restaurant_status/`,
			data: info.request,
		})
	);
};

export const useUpdateRestaurantDetailsApi = () => {
	return useMutation(
		(info: {
			request: Partial<RestaurentsDetailsResponse & { applicable_days: typeof WeekDays }>;
			id: string;
		}) => {
			const formData = new FormData();
			Object.keys(info.request).forEach((l) => {
				if (!(l === 'applicable_days')) {
					formData.append(l, info.request[l as keyof RestaurentsDetailsResponse] as string);
				}
			});
			if (info.request.applicable_days)
				formData.append('applicable_days', JSON.stringify(info.request.applicable_days));

			return axios({
				method: 'POST',
				url: `/update_restaurant/${info.id}/`,
				data: formData,
			});
		}
	);
};

export const useChangeOnboardingStatusApi = () => {
	return useMutation(
		(info: { request: { restaurant_id: string; status: string } }) =>
			axios({
				method: 'POST',
				url: `/change_onboarding_status/`,
				data: info.request,
			}),
		{}
	);
};

export type RestaurantMenuResponse = {
	menu_id: string;
	cat_id: string;
	restaurant_id: string;
	type_id: string;
	cat_name: string;
	type_name: string;
	cat_status: string;
	menu_name: string;
	menu_desc: string;
	price: string;
	recomended_status: string;
	menu_img: string;
	menu_type_icon: string;
	menu_status: string;
	menu_added_datetime: string;
	menu_update_datetime: string;
};
export const useGetRestaurentsMenusApi = (id: string, request: PageRequest & SortRequest) => {
	return useQuery(['get_menu_list_admin', id, request], () =>
		axios<PaginationResponse<RestaurantMenuResponse>>({
			method: 'GET',
			url: `/get_menu_list_admin/${id}/`,
			params: request,
		})
	);
};

export const validateAddRestoFields = (
	fieldName: keyof Partial<RestaurentsDetailsResponse>,
	formData: Partial<RestaurentsDetailsResponse>
): string => {
	switch (fieldName) {
		case 'res_acc_holder_name':
			return validateAccountHolderName(formData[fieldName] as string);
		case 'manager_name':
			return validateName(formData[fieldName] as string);
		case 'manager_no':
			return validatePhoneNumber(formData[fieldName] as string);
		case 'owner_email':
			return validateEmail(formData[fieldName] as string);
		case 'offer_list':
			return validateOfferList(formData[fieldName] as string);

		default:
			return '';
	}
};
export const validateAddRestoForm = (
	formData: Partial<RestaurentsDetailsResponse>
): FormError<Partial<RestaurentsDetailsResponse>> => validateForm(formData, validateAddRestoFields);

export type RestaurantTransactionResponse = {
	payable_amount: string;
	restaurant_id: string;
	settlement_status: string;
	transaction_date: string;
	transaction_revenue: string;
	transaction_total_amount: string;
};

export const useGetRestaurentsTransactionApi = (id: string) => {
	return useQuery(['get_transaction_restaurant'], () =>
		axios<{ data: RestaurantTransactionResponse[] }>({
			method: 'GET',
			url: `/get_transaction_restaurant/${id}/`,
		})
	);
};

export type RestaurantTransactionCountResponse = {
	total_outstanding_count: string;
	total_revenue_count: string;
	total_settlement_count: string;
	total_transaction_count: string;
	total_upcoming_payment_count: string;
};
export const useGetRestaurentsTransactionCountApi = (id: string) => {
	return useQuery(['dashboard_transaction_count'], () =>
		axios<{ data: RestaurantTransactionCountResponse }>({
			method: 'GET',
			url: `/dashboard_transaction_count/${id}/`,
		})
	);
};
