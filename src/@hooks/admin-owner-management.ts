import {
	OwnersStatus,
	PageRequest,
	PaginationResponse,
	SortRequest,
	Status,
} from '@interfaces/common';
import axios from 'axios';
import { useMutation, useQuery } from 'react-query';

export type OwnersResponse = {
	added_by: string;
	agreement_type: string;
	city: string;
	owner_id: string;
	owner_name: string;
	owner_status: OwnersStatus;
	state: string;
};

export const useGetOwnersApi = (request: PageRequest & SortRequest & { search?: string }) => {
	return useQuery(['get_owners', request], () =>
		axios<PaginationResponse<OwnersResponse>>({
			method: 'GET',
			url: `/get_restaurant_owner_details/`,
			params: request,
		})
	);
};

export type OwnerOtherDetailsResponse = {
	owner_details: {
		owner_id: string;
		owner_name: string;
		owner_email: string;
		owner_contact_no: string;
		agreement_type: string;
		agreement_period: string;
		added_by: string;
		payment_type: string;
		agreed_percentage: string;
		owner_status: OwnersStatus;
	};
	bussiness_details: {
		business_name: string;
		business_type: string;
		address: string;
		renewal_on: string;
	};
	document_details: {
		gst_no: string;
		gst_no_url_pic: string;
		gst_status: Status;
		pan_no: string;
		pan_no_url_pic: string;
		pan_status: Status;
		registration_certificate_pic: string;
		registration_certificate_status: Status;
	};
	bank_details: {
		acc_holder_name: string;
		bank_name: string;
		account_number: string;
		bank_branch: string;
		bank_city: string;
		ifscode_number: string;
		bank_details_status: Status;
		bank_cheque_url_pic: string;
	};
};

export const useGetOwnerOtherDetailsApi = (id: string) => {
	return useQuery(['get_owner_other_detail', id], () =>
		axios<OwnerOtherDetailsResponse>({
			method: 'GET',
			url: `/get_owner_other_detail/${id}/`,
		})
	);
};

export const useChangeOwnerStatusApi = () => {
	return useMutation(
		(info: {
			request: {
				owner_id: string;
				owner_status: string;
			};
		}) =>
			axios({
				method: 'POST',
				url: `/change_rest_owner_status/`,
				data: info.request,
			})
	);
};

export const useUpdateOwnerDocumentStatusApi = () => {
	return useMutation(
		(info: {
			request: {
				owner_id: string;
				owner_status: string;
				type: string;
				reject_reason: string;
			};
		}) =>
			axios({
				method: 'POST',
				url: `/update_owner_document_status/`,
				data: info.request,
			})
	);
};

export type OwnerCountResponse = {
	data: {
		active_owner_count: number;
		pending_approval_count: number;
		total_contract: number;
		upcoming_renewal: number;
	};
};

export const useGetOwnerCountApi = () => {
	return useQuery(['dashboard_owner_count'], () =>
		axios<OwnerCountResponse>({
			method: 'GET',
			url: `/dashboard_owner_count/`,
		})
	);
};
