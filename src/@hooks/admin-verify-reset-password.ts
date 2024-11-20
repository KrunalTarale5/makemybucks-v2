import { FieldProps, FormError } from '@interfaces/common';
import { validateForm } from '@utils/validateUtils';
import { validatePassword, validateRePassword } from '@utils/validator';
import axios from 'axios';
import { useMutation } from 'react-query';

export type VerifyResetPasswordRequest = {
	new_password: string;
	confirm_password: string;
};

export type VerifyResetPasswordFields = {
	[key in keyof VerifyResetPasswordRequest]: FieldProps;
};
export const VerifyResetPasswordFields: Partial<VerifyResetPasswordFields> = {
	new_password: {
		label: 'Enter  New Password',
		type: 'password',
	},
	confirm_password: {
		label: 'Re-Enter Password',
		type: 'password',
	},
};

export const validateVerifyResetPasswordFields = (
	fieldName: keyof VerifyResetPasswordRequest,
	formData: VerifyResetPasswordRequest
): string => {
	switch (fieldName) {
		case 'new_password':
			return validatePassword(formData[fieldName]);

		case 'confirm_password':
			return validateRePassword(formData[fieldName], formData.new_password);

		default:
			return '';
	}
};

export const validateVerifyResetPasswordForm = (
	formData: VerifyResetPasswordRequest
): FormError<VerifyResetPasswordRequest> =>
	validateForm(formData, validateVerifyResetPasswordFields);

export const useVerifyPasswordApi = () => {
	return useMutation(
		(info: { request: { otp: string; new_password: string; confirm_password: string } }) =>
			axios({
				method: 'POST',
				url: `/verify_otp_and_reset_password/`,
				data: info.request,
			})
	);
};
