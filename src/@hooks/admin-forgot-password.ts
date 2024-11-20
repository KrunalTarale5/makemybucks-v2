import { FieldProps, FormError } from '@interfaces/common';
import { validateForm } from '@utils/validateUtils';
import { validateCaptcha, validateEmail, validateUserName } from '@utils/validator';
import axios from 'axios';
import { useMutation } from 'react-query';

export type ForgotPasswordRequest = { admin_user_id: string; admin_email: string };

export type ForgotPasswordFormFields = {
	[key in keyof ForgotPasswordRequest]: FieldProps;
};

export const ForgotPasswordFormFields: Partial<ForgotPasswordFormFields> = {
	admin_user_id: {
		label: 'Enter User ID',
	},
	admin_email: {
		label: 'Enter Registered Email ID',
		type: 'email',
	},
	// captcha: {
	// 	label: 'Enter Captcha',
	// },
};

export const validateForgotPasswordFields = (
	fieldName: keyof ForgotPasswordRequest,
	formData: ForgotPasswordRequest
): string => {
	switch (fieldName) {
		case 'admin_user_id':
			return validateUserName(formData[fieldName]);
		case 'admin_email':
			return validateEmail(formData[fieldName]);
		// case 'captcha':
		// 	return validateCaptcha(formData[fieldName]);

		default:
			return '';
	}
};

export const validateForgotPasswordForm = (
	ForgotPassword: ForgotPasswordRequest
): FormError<ForgotPasswordRequest> => validateForm(ForgotPassword, validateForgotPasswordFields);

export const useForgotPasswordApi = () => {
	return useMutation((info: { request: { admin_user_id: string; admin_email: string } }) =>
		axios({
			method: 'POST',
			url: `/forgot_password/`,
			data: info.request,
		})
	);
};
