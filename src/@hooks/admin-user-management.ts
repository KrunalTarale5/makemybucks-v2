import {
	KycStatus,
	PageRequest,
	PaginationResponse,
	SortRequest,
	UserKycStatus,
	UserStatus,
} from '@interfaces/common';
import axios from 'axios';
import { useMutation, useQuery } from 'react-query';

export type UserManagementResponse = {
	KYC_status: KycStatus;
	Register_status: string;
	address: string;
	block_status: UserStatus;
	city: string;
	document_img: string;
	document_no: string;
	document_type: string;
	email: string;
	name: string;
	phone_no: string;
	state: string;
	user_dob: string;
	user_id: string;
	KYC_Approval_status: UserKycStatus;
	user_ref_id: string;
	user_profile_img: string;
	added_datetime: string;
	updated_datetime: string;
	total_transaction_amount_user: string;
	total_payback: string;
};

export const useGetUserManagementApi = (
	request: PageRequest & SortRequest & { search?: string }
) => {
	return useQuery(['get_restaurents', request], () =>
		axios<
			PaginationResponse<UserManagementResponse> & {
				block_user_count: number;
				all_user_count: number;
			}
		>({
			method: 'GET',
			url: `/get_user_new/`,
			params: request,
		})
	);
};

export type UserDetailResponse = {
	block_user_count: number;
	all_user_count: number;
	data: {
		user_id: number;
		name: string;
		user_dob: string;
		phone_no: string;
		address: string;
		email: string;
		user_ref_id: string;
		city: string;
		state: string;
		Register_status: string;
		KYC_status: KycStatus;
		document_type: string;
		document_no: string;
		document_img: string;
		user_profile_img: string;
		block_status: UserStatus;
		added_datetime: string;
		updated_datetime: string;
		KYC_Approval_status: UserKycStatus;
		total_transaction_amount: string;
		payback: string;
		repository: string;
		transaction_details: {
			restaurant_name: string;
			date: string;
			time: string;
			transaction_amount: string;
			offer: string;
			utr: string;
			payment_status: string;
		}[];
	};
};

export const useGetUserDetailsApi = (slno: string) => {
	return useQuery(['get_subadmin_restaurant'], () =>
		axios<UserDetailResponse>({
			method: 'GET',
			url: `/get_user_new/${slno}/`,
		})
	);
};

export const useBlockUserApi = () => {
	return useMutation((info: { id: string }) =>
		axios({
			method: 'POST',
			url: `/block_user/${info.id}/`,
		})
	);
};

export const useUpdateKYCStatusApi = () => {
	return useMutation((info: { request: { user_id: string; KYC_Approval_status: UserKycStatus } }) =>
		axios({
			method: 'POST',
			url: `/kyc_approval_status/`,
			data: info.request,
		})
	);
};
