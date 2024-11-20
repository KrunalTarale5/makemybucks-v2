import { FieldProps, FormError } from '@interfaces/common';
import { validateForm } from '@utils/validateUtils';
import { validatePassword, validateRePassword } from '@utils/validator';
import axios from 'axios';
import { useMutation } from 'react-query';

export type UpdatePasswordRequest = { new_password: string; confirm_password: string };

export type UpdatePasswordFormFields = {
	[key in keyof UpdatePasswordRequest]: FieldProps;
};

export const UpdatePasswordFormFields: Partial<UpdatePasswordFormFields> = {
	new_password: {
		label: 'Enter Password',
		placeholder: 'Enter New Password',
		type: 'password',
	},
	confirm_password: {
		label: 'Enter Password',
		placeholder: 'Re-Enter New Password',
		type: 'password',
	},
};
export const validateRePasswordFields = (
	fieldName: keyof UpdatePasswordRequest,
	formData: UpdatePasswordRequest
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
export const validateLoginForm = (
	formData: UpdatePasswordRequest
): FormError<UpdatePasswordRequest> => validateForm(formData, validateRePasswordFields);

export const useUpdatePasswordApi = () => {
	return useMutation(
		(info: { request: { otp: string; new_password: string; confirm_password: string } }) =>
			axios({
				method: 'POST',
				url: `/subadmin_reset_password/`,
				data: info.request,
			})
	);
};
