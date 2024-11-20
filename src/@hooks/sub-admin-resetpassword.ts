import { FieldProps, FormError } from '@interfaces/common';
import { validateForm } from '@utils/validateUtils';
import { validateCaptcha, validateEmail } from '@utils/validator';
import axios from 'axios';
import { useMutation } from 'react-query';

export type ResetPasswordRequest = { subadmin_email: string };
export type ResetPasswordFormFields = {
	[key in keyof ResetPasswordRequest]: FieldProps;
};

export const ResetPasswordFormFields: Partial<ResetPasswordFormFields> = {
	subadmin_email: { label: 'Email ID', placeholder: 'Email ID', type: 'email' },
	// captcha: {
	// 	label: 'Enter captcha',
	// 	placeholder: 'Enter captcha',
	// },
};

export const validateResetPasswordFields = (
	fieldName: keyof ResetPasswordRequest,
	formData: ResetPasswordRequest
): string => {
	switch (fieldName) {
		case 'subadmin_email':
			return validateEmail(formData[fieldName]);
		// case 'captcha':
		// 	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		// 	return validateCaptcha(formData[fieldName]);

		default:
			return '';
	}
};
export const validateResetPasswodForm = (
	formData: ResetPasswordRequest
): FormError<ResetPasswordRequest> => validateForm(formData, validateResetPasswordFields);

// export type ResetPasswordResponse = {
// 	subadmin_email: string;
// };

export const useResetPasswordApi = () => {
	return useMutation((info: { request: { subadmin_email: string } }) =>
		axios({
			method: 'POST',
			url: `/subadmin_forgot_password/`,
			data: info.request,
		})
	);
};
