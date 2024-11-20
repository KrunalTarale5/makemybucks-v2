/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
	FormError,
	NavNotificationStatus,
	Option,
	PageRequest,
	PaginationResponse,
	SortRequest,
} from '@interfaces/common';
import { validateForm } from '@utils/validateUtils';
import axios from 'axios';
import { useMutation, useQuery } from 'react-query';

import {
	validateAmPm,
	validateDateMonth,
	validateHours,
	validateImage,
	validateInformationText,
	validateMenuCategoryName,
	validateMessageBody,
	validateMinute,
	validateSelectBodyType,
	validateTypeHeading,
} from '@utils/validator';

export type AllNotificationsResponse = {
	sl_no: string;
	message_title: string;
	message_info_text: string;
	message_body_type: string;
	message_category: string;
	schedule_time: string;
	//status: string;
	notification_id: string;
	message_body: string;
	message_img: string;
	message_status: string;
	message_type: string;
};

export const useGetAllNotificationApi = (
	request: PageRequest & SortRequest & { search?: string }
) => {
	return useQuery(['get_notification', request], () =>
		axios<PaginationResponse<AllNotificationsResponse>>({
			method: 'GET',
			url: `/get_notification/`,
			params: request,
		})
	);
};

export const useGetAllNotificationByIdApi = (id: string) => {
	return useQuery(
		['get_notification_id', String(id)],
		() =>
			axios<{ data: AllNotificationsResponse }>({
				method: 'GET',
				url: `/get_notification/${id}/`,
			}),
		{ enabled: Boolean(id) }
	);
};

export type CreateNotificatinRequest = {
	message_img: FileList;
	message_title: string;
	message_info_text: string;
	message_body_type: string;
	message_body: string;
	message_category: string;
	message_type: string;
	schedule_time: string;
};
export type CreateNotificationFormData = {
	message_img: string | FileList;
	message_title: string;
	message_info_text: string;
	message_body_type: string | Option;
	message_body: string;
	message_category: string | Option;
	message_type: string | Option;
	hr: string | Option;
	min: string | Option;
	ampm: string | Option;
	ddmm: string;
};

export const useCreateNotificationApi = (id?: string) =>
	useMutation((info: { request: Partial<CreateNotificatinRequest> }) => {
		const formData = new FormData();
		Object.keys(info.request).forEach((l) => {
			if (!(l === 'message_img')) {
				formData.append(l, info.request[l as keyof CreateNotificatinRequest] as string);
			}
		});
		if (info.request.message_img)
			formData.append('message_img', info.request.message_img[0], info.request.message_img[0].name);

		return axios({
			method: 'POST',
			url: id ? `/send_notification_api/${id}/` : `/send_notification_api/`,
			data: formData,
		});
	});

export const CreateNotificationFields = (
	fieldName: keyof CreateNotificationFormData,
	formData: CreateNotificationFormData
): string => {
	switch (fieldName) {
		case 'message_img':
			return (formData.message_body_type as Option).value === 'image'
				? validateImage(formData[fieldName] as FileList)
				: '';
		case 'message_title':
			return validateTypeHeading(formData[fieldName]);
		case 'message_info_text':
			return validateInformationText(formData[fieldName]);
		case 'message_category':
			return validateMenuCategoryName(formData[fieldName] as Option);
		case 'message_body_type':
			return validateSelectBodyType(formData[fieldName] as Option);

		case 'message_body':
			return (formData.message_body_type as Option).value === 'text'
				? validateMessageBody(formData[fieldName])
				: '';
		case 'message_type':
			return validateSelectBodyType(formData[fieldName] as Option);
		case 'hr':
			return (formData.message_type as Option)?.value === 'schedule send'
				? validateHours(formData[fieldName] as Option)
				: '';
		case 'min':
			return (formData.message_type as Option)?.value === 'schedule send'
				? validateMinute(formData[fieldName] as Option)
				: '';
		case 'ampm':
			return (formData.message_type as Option)?.value === 'schedule send'
				? validateAmPm(formData[fieldName] as Option)
				: '';
		case 'ddmm':
			return (formData.message_type as Option)?.value === 'schedule send'
				? validateDateMonth(formData[fieldName])
				: '';

		default:
			return '';
	}
};
export const validateCreateNotificationForm = (
	formData: CreateNotificationFormData
): FormError<Partial<CreateNotificationFormData>> =>
	validateForm(formData, CreateNotificationFields);

export type SelectCategoryResponse = {
	categoryData: {
		msg_category_id: string;
		message_category: string;
		added_datetime: string;
		updated_datetime: string;
	}[];
};
export const useGetSelectCategoryListApi = () => {
	return useQuery(['get_msg_category'], () =>
		axios<SelectCategoryResponse>({
			method: 'GET',
			url: `/get_msg_category/`,
		})
	);
};

export const useQwickSendApi = () => {
	return useMutation((info: { request: AllNotificationsResponse; id: string }) =>
		axios({
			method: 'POST',
			url: `/quick_notification_api/${info.id}/`,
			data: info.request,
		})
	);
};

export const useGetNotification_status_Api = () => {
	return useQuery(
		['notification_status_api'],
		() =>
			axios<{
				data: {
					owner_status: NavNotificationStatus;
					user_status: NavNotificationStatus;
					restaurant_status: NavNotificationStatus;
					admin_status: NavNotificationStatus;
				};
			}>({
				method: 'GET',
				url: `/notification_status_api/`,
			}),
		{ refetchInterval: 60000 }
	);
};

export type UpdateNotificationStatusRequest = { notification_type: string };
export const useUpdateNotificationStatusApi = () => {
	return useMutation((info: { request: UpdateNotificationStatusRequest }) => {
		const formData = new FormData();
		Object.keys(info.request).forEach((l) => {
			formData.append(l, info.request[l as keyof UpdateNotificationStatusRequest]);
		});

		return axios({
			method: 'POST',
			url: `/update_red_dot_status_api/`,
			data: formData,
		});
	});
};
