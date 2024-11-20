import { FieldProps, FormError } from '@interfaces/common';
import { validateForm } from '@utils/validateUtils';
import { validatePassword, validateUserName } from '@utils/validator';
import axios from 'axios';
import { useMutation } from 'react-query';

export type LoginRequest = { admin_user_id: string; admin_password: string };

export type LoginFormFields = {
	[key in keyof LoginRequest]: FieldProps;
};

export const LoginFormFields: Partial<LoginFormFields> = {
	admin_user_id: {
		label: 'Enter User ID',
	},
	admin_password: {
		label: 'Enter Password',
		type: 'password',
	},
	// captcha: {
	// 	label: 'Enter Captcha',
	// 	required: true,
	// },
};

export const validateLoginFields = (
	fieldName: keyof LoginRequest,
	formData: LoginRequest
): string => {
	switch (fieldName) {
		case 'admin_user_id':
			return validateUserName(formData[fieldName]);
		case 'admin_password':
			return validatePassword(formData[fieldName]);
		// case 'captcha':
		// 	return validateCaptcha(formData[fieldName]);

		default:
			return '';
	}
};

export const validateLoginForm = (formData: LoginRequest): FormError<LoginRequest> =>
	validateForm(formData, validateLoginFields);

export type LoginResponse = {
	access_token: string;
	user_data: {
		admin_user_id: string;
		admin_name: string;
		email: string;
		mobile_no: string;
		admin_id: string;
		admin_profile: string;
	};
};

export const useLoginApi = () => {
	return useMutation((info: { request: LoginRequest }) =>
		axios<LoginResponse>({
			method: 'POST',
			url: `/admin_login/`,
			data: info.request,
		})
	);
};
