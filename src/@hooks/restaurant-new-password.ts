import { FieldProps, FormError } from '@interfaces/common';
import { validateForm } from '@utils/validateUtils';
import { validatePassword, validateRePassword } from '@utils/validator';
import axios from 'axios';
import { useMutation } from 'react-query';

export type CreateNewPasswordRequest = {
	new_password: string;
	confirm_password: string;
};
export type CreateNewPasswordFormFields = {
	[key in keyof CreateNewPasswordRequest]: FieldProps;
};
export const CreateNewPasswordFormFields: Partial<CreateNewPasswordFormFields> = {
	new_password: { label: '', placeholder: 'Enter New Password', type: 'password' },
	confirm_password: { label: '', placeholder: 'Re-Enter New password', type: 'password' },
};

export const validateCreateNewPasswordFields = (
	fieldName: keyof CreateNewPasswordRequest,
	formData: CreateNewPasswordRequest
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
export const validateCreateNewPasswordForm = (
	formData: CreateNewPasswordRequest
): FormError<CreateNewPasswordRequest> => validateForm(formData, validateCreateNewPasswordFields);

export const useCreateNewPasswordApi = () => {
	return useMutation((info: { request: { key: string } & CreateNewPasswordRequest }) =>
		axios({
			method: 'POST',
			url: `/restaurant_reset_password/`,
			data: info.request,
		})
	);
};
