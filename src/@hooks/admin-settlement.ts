import {
	FormError,
	Option,
	PageRequest,
	PaginationResponse,
	SortRequest,
} from '@interfaces/common';
import { validateForm } from '@utils/validateUtils';
import { validateQrCode, validateSelectExecutiveCode } from '@utils/validator';
import { useMutation, useQuery } from 'react-query';
import axios, { AxiosRequestConfig } from 'axios';

// export type QrCodeRequest = { qrreceived: string };
export type SettlementUserRequest = { number: number | string };
export type SettlementUserResponse = {
	data: {
		recordsTotal: number;
		recordsFiltered: number;
		total_pages: number;
		page: number;
		size: number;
		total_payback_amount: string;
		total_investment: string;
		current_payback: string;
		current_investment: string;
		transaction_data: {
			Date: string;
			Total_amount: string;
			Number_of_user: number;
		}[];
	};
};
export const useGetSettlementUserResponseApi = () =>
	useQuery(['get_user_settlement_data'], () =>
		axios<SettlementUserResponse>({
			method: 'GET',
			url: `/get_user_settlement_data/`,
		})
	);
export type SettlementVendorResponse = {
	data: {
		recordsTotal: number;
		recordsFiltered: number;
		total_pages: number;
		page: number;
		size: number;
		total_payback_amount: string;
		total_investment: string;
		current_payback: string;
		current_investment: string;
		transaction_data: [
			{
				Date: string;
				Total_amount: string;
				Number_of_vendors: number;
				settlement_status: string;
			},
		];
	};
};
export const uploadCustomerDisbusmentExcelApi = (file: FileList): AxiosRequestConfig => {
	const formData = new FormData();
	formData.append('file', file[0], file[0].name);
	return {
		method: 'POST',
		url: `/upload_customer_disbursement_excel/`,
		data: formData,
	};
};

export const uploadVendorDisbusmentExcelApi = (file: FileList): AxiosRequestConfig => {
	const formData = new FormData();
	formData.append('file', file[0], file[0].name);
	return {
		method: 'POST',
		url: `/upload_vendor_settlement_excel/`,
		data: formData,
	};
};

export const useGetSettlementVendorApi = () => {
	return useQuery(['get_vendor_settlement_data'], () =>
		axios<SettlementVendorResponse>({
			method: 'GET',
			url: `/get_vendor_settlement_data/`,
		})
	);
};

export const useGeneraeteQRApi = () =>
	useMutation(
		(info: {
			request: {
				number: number;
			};
		}) =>
			axios({
				method: 'POST',
				url: `/generate_qr/`,
				data: info.request,
			})
	);

export const useDownloadQRApi = () =>
	useMutation((info: { request: { number: number } }) =>
		axios<{
			download_list: {
				qr_id: string;
				qr_status: string;
			}[];
		}>({
			method: 'POST',
			url: `/download_qr/`,
			data: info.request,
		})
	);

export const useReceiveQRApi = () =>
	useMutation(
		(info: {
			request: {
				number: number;
			};
		}) =>
			axios({
				method: 'POST',
				url: `/receive_qr/`,
				data: info.request,
			})
	);
