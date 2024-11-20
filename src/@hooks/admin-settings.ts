import { FieldProps, FormError } from '@interfaces/common';
import { validateForm } from '@utils/validateUtils';
import { validateFaqAns, validateFaqQue } from '@utils/validator';
import axios from 'axios';
import { useMutation, useQuery } from 'react-query';

export type FaqRequest = { question: string; answer: string };
export type FaqFormFields = {
	[key in keyof FaqRequest]: FieldProps;
};
export const FaqFormFields: Partial<FaqFormFields> = {
	question: { label: '', placeholder: '' },
	answer: { label: '', placeholder: '' },
};

export const validateFaqFields = (fieldName: keyof FaqRequest, formData: FaqRequest): string => {
	switch (fieldName) {
		case 'question':
			return validateFaqQue(formData[fieldName]);
		case 'answer':
			return validateFaqAns(formData[fieldName]);

		default:
			return '';
	}
};
export const validateFaqsForm = (formData: FaqRequest): FormError<FaqRequest> =>
	validateForm(formData, validateFaqFields);

export type FaqResponse = {
	data: {
		id: string;
		question: string;
		answer: string;
		added_datetime: string;
		update_datetime: string;
	}[];
};

export const useGetFaqsApi = () => {
	return useQuery(['get_faqs'], () =>
		axios<FaqResponse>({
			method: 'GET',
			url: `/get_faqs/`,
		})
	);
};
export const useUpdateFaqApi = () => {
	return useMutation((info: { request: { faq_id: string; question: string; answer: string } }) =>
		axios({
			method: 'PUT',
			url: `/update_faqs/`,
			data: info.request,
		})
	);
};

export type ProfileResponse = {
	data: {
		admin_name: string;
		email: string;
		mobile_no: string;
		admin_profile: FileList | string;
	};
};
export const useGetProfileApi = () => {
	return useQuery(['get_admin_profile'], () =>
		axios<ProfileResponse>({
			method: 'GET',
			url: `/get_admin_profile/`,
		})
	);
};

export type ProfileRequest = {
	admin_profile: FileList | string;
};

export const useUpdateProfileApi = () =>
	useMutation((info: { request: ProfileRequest }) => {
		const formData = new FormData();

		if (info.request.admin_profile && typeof info.request.admin_profile !== 'string')
			formData.append(
				'admin_profile',
				info.request.admin_profile[0],
				info.request.admin_profile[0].name
			);
		return axios({
			method: 'POST',
			url: `/update_admin_profile/`,
			data: formData,
		});
	});

export const useGetPrivatePolicyApi = () => {
	return useQuery(['get_private_policy'], () =>
		axios<{
			data: {
				policy_id: string;
				policy_data: string;
				added_datetime: string;
				updated_datetime: string;
			};
		}>({
			method: 'GET',
			url: `/get_private_policy/`,
		})
	);
};

export const useGetTermsOfUseApi = () => {
	return useQuery(['get_terms_of_use'], () =>
		axios<{
			data: {
				terms_id: string;
				terms_data: string;
				added_datetime: string;
				updated_datetime: string;
			};
		}>({
			method: 'GET',
			url: `/get_terms_of_use/`,
		})
	);
};

export const useUpdatePrivatePolicyApi = () =>
	useMutation((info: { request: { policy_data: string } }) => {
		return axios({
			method: 'POST',
			url: `/update_privacy_policy/`,
			data: info.request,
		});
	});

export const useUpdateTermsOfUseApi = () =>
	useMutation((info: { request: { terms_data: string } }) => {
		return axios({
			method: 'POST',
			url: `/update_term_of_use/`,
			data: info.request,
		});
	});
