import {
	FormError,
	Option,
	PageRequest,
	PaginationResponse,
	SortRequest,
} from '@interfaces/common';
import { validateForm } from '@utils/validateUtils';
import { validateQrCode, validateSelectExecutiveCode } from '@utils/validator';
import axios from 'axios';
import { useMutation, useQuery } from 'react-query';

// export type QrCodeRequest = { qrreceived: string };
export type QrCodeRequest = { number: number | string };

export const QrCodeFields = (fieldName: keyof QrCodeRequest, formData: QrCodeRequest): string => {
	switch (fieldName) {
		case 'number':
			return validateQrCode(formData[fieldName] as string);

		default:
			return '';
	}
};
export const validateQrCodeForm = (formData: QrCodeRequest): FormError<QrCodeRequest> =>
	validateForm(formData, QrCodeFields);

export type HandoverQrRequest = {
	number: number | string;
	sub_admin_id: string | Option;
};

export const HandoverQrFields = (
	fieldName: keyof HandoverQrRequest,
	formData: HandoverQrRequest
): string => {
	switch (fieldName) {
		case 'sub_admin_id':
			return validateSelectExecutiveCode(formData[fieldName] as string);

		default:
			return '';
	}
};
export const validateHandoverQrForm = (
	formData: HandoverQrRequest
): FormError<Partial<HandoverQrRequest>> => validateForm(formData, HandoverQrFields);

export type QrCodeHistoryResponse = {
	history_id: string;
	action: string;
	by_or_to_id: string;
	qr_number: string;
	added_datetime: string;
};

export const useGetQrCodeHistoryApi = (
	request: PageRequest & SortRequest & { search?: string }
) => {
	return useQuery(['get_qr_history', request], () =>
		axios<PaginationResponse<QrCodeHistoryResponse>>({
			method: 'GET',
			url: `/get_qr_history/`,
			params: request,
		})
	);
};

export type QrCodeCountResponse = {
	data: {
		total_qr_generated_count: number;

		available_qr_count: number;
		download_qr_count: number;
		active_qr_count: number;
		available_for_handover_count: number;
		disabled_qr_count: number;
	};
};

export const useGetQrCodeCountApi = () => {
	return useQuery(['QR_dashboard_count'], () =>
		axios<QrCodeCountResponse>({
			method: 'GET',
			url: `/QR_dashboard_count/`,
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

export const useUpdateQRBgApi = () =>
	useMutation(
		(info: {
			request: Partial<{
				bg_url_1: FileList;
				bg_url_2: FileList;
				bg_url_3: FileList;
			}>;
		}) => {
			const formData = new FormData();

			if (info.request.bg_url_1 && typeof info.request.bg_url_1 !== 'string')
				formData.append('bg_url_1', info.request.bg_url_1[0], info.request.bg_url_1[0].name);
			if (info.request.bg_url_2 && typeof info.request.bg_url_2 !== 'string')
				formData.append('bg_url_2', info.request.bg_url_2[0], info.request.bg_url_2[0].name);
			if (info.request.bg_url_3 && typeof info.request.bg_url_3 !== 'string')
				formData.append('bg_url_3', info.request.bg_url_3[0], info.request.bg_url_3[0].name);

			return axios({
				method: 'POST',
				url: `/add_update_bg_img/`,
				data: formData,
			});
		}
	);

export const useGetQRBgUrlsApi = () => {
	return useQuery(['get_qr_bg'], () =>
		axios<{ bg_urls: string[] }>({
			method: 'GET',
			url: `/get_qr_bg/`,
		})
	);
};

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

export const useHandoverQrApi = () =>
	useMutation((info: { request: HandoverQrRequest }) =>
		axios({
			method: 'POST',
			url: `/handover_qr/`,
			data: info.request,
		})
	);

export type SelectExecutiveListResponse = {
	//restaurant_list: Option[];
	subadmins_list: Option[];
};
export const useGetSelectExecutiveListApi = () => {
	return useQuery(['get_subadmin_name'], () =>
		axios<SelectExecutiveListResponse>({
			method: 'GET',
			url: `/get_subadmin_name/`,
		})
	);
};

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
