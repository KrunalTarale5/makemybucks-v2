import { ErrorValues, FormError, FormErrorMessage, SanitizeErrors } from '@interfaces/common';

export function validateForm<T>(
	formData: T,
	validateField: (fieldName: keyof T, formData: T) => string
) {
	const result: FormError<T> = {
		hasError: false,
		errors: {} as FormErrorMessage<T>,
	};
	for (const key in formData) {
		const message = validateField(key, formData);
		result.hasError = result.hasError ? result.hasError : message !== '' ? true : false;
		result.errors = {
			...result.errors,
			[key]: message,
		};
	}
	return result;
}

export const sanitizeErrors = (err: ErrorValues): SanitizeErrors => {
	const sanitizeErrs: SanitizeErrors = {};

	for (const i in err) {
		if (Array.isArray(err[i])) {
			const v: string[] = err[i] as string[];
			sanitizeErrs[i] = v.join(' ').toString();
		} else if (Object.keys(err[i]).length > 0) {
			const error: any = err[i];
			for (const e in error) {
				const v = error[e];
				sanitizeErrs[i] = v.join(' ').toString();
			}
		} else {
			sanitizeErrs[i] = err[i].toString();
		}
	}
	return sanitizeErrs;
};
