import { FieldProps, FormError } from '@interfaces/common';
import { validateForm } from '@utils/validateUtils';
import { validatePassword } from '@utils/validator';
import axios from 'axios';
import { useMutation } from 'react-query';

export type LoginRequest = { subadmin_email: string; subadmin_password: string };

export type LoginFormFields = {
	[key in keyof LoginRequest]: FieldProps;
};

export const LoginFormFields: Partial<LoginFormFields> = {
	subadmin_email: { label: 'Email ID', placeholder: 'Email ID', type: 'email' },
	subadmin_password: {
		label: 'Enter Password',
		placeholder: 'Enter Password',
		type: 'password',
	},
};

export const validateLoginFields = (
	fieldName: keyof LoginRequest,
	formData: LoginRequest
): string => {
	switch (fieldName) {
		/* 	case 'subadmin_email':
			return validateEmail(formData[fieldName]); */
		case 'subadmin_password':
			return validatePassword(formData[fieldName]);

		default:
			return '';
	}
};

export const validateLoginForm = (formData: LoginRequest): FormError<LoginRequest> =>
	validateForm(formData, validateLoginFields);

export type LoginResponse = {
	access_token: string;
	user_data: {
		subadmin_id: string;
		subadmin_firstname: string;
		subadmin_lastname: string;
		email: string;
		mobile_no: string;
		subadmin_user_id: string;
		profile_pic: string;
	};
};
export const useLoginApi = () => {
	return useMutation((info: { request: LoginRequest }) =>
		axios<LoginResponse>({
			method: 'POST',
			url: `/subadmin_login/`,
			data: info.request,
		})
	);
};
