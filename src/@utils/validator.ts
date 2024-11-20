import { Option } from '@interfaces/common';

export const EmailValidationExpression =
	// eslint-disable-next-line no-control-regex
	/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

export const PanValidationExpresstion = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/gm;
export const GSTValidationExpresstion = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export const validateIsNumber = (value: string) => !isNaN(Number(value)) && /^$|^\d+$/.test(value);
export const validateIsPrice = (value: string) => !isNaN(Number(value));
export const validateIsMobileNumber = (value: string) =>
	validateIsNumber(value) && value.length <= 10;

export const validateUserName = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter user name.';
	}

	return '';
};

export const validatePassword = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter password.';
	}
	/* if (value.length < 8) {
        return "Password should not be less than 8 charaters.";
    } */
	return '';
};

export const validateCaptcha = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter captcha.';
	}
	/* if (value.length < 8) {
        return "Password should not be less than 8 charaters.";
    } */
	return '';
};

export const validateEmail = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter email id.';
	}
	if (!EmailValidationExpression.test(value)) {
		return 'Please enter valid email id.';
	}
	return '';
};

export const validateReEmail = (value: string, value2: string) => {
	if (!value?.trim()) {
		return 'Please enter email id.';
	}
	if (!EmailValidationExpression.test(value)) {
		return 'Please enter valid email id.';
	}
	if (value !== value2) {
		return 'Your email id is not match.';
	}
	return '';
};

export const validateRePassword = (value: string, value2: string) => {
	if (!value?.trim()) {
		return 'Please re-enter password.';
	}
	if (value !== value2) {
		return 'Your password is not match.';
	}

	return '';
};

export const validateFlatNo = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter flat no.';
	}

	return '';
};
export const validateStreetName = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter street name.';
	}

	return '';
};
export const validateLocalCity = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter city.';
	}
	return '';
};
export const validateLocalPinCode = (value: string) => {
	if (!value?.trim() || value?.length < 5) {
		return 'Please enter pincode.';
	}

	return '';
};
export const validateLocalState = (value: string | Option) => {
	if (typeof value === 'string') {
		if (!value?.trim()) {
			return 'Please state state.';
		}
	}

	if (!value) {
		return 'Please state state.';
	}

	return '';
};
export const validateFirstName = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter first name.';
	}

	return '';
};
export const validateLastName = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter last name.';
	}

	return '';
};

export const validateMobileNo = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter mobile number.';
	}
	if (
		!(
			value.startsWith('6') ||
			value.startsWith('7') ||
			value.startsWith('8') ||
			value.startsWith('9')
		)
	) {
		return 'Contact number should start with 6, 7, 8, 9.';
	}
	if (value.length !== 10) {
		return 'Please enter valid contact number.';
	}

	return '';
};

export const validatePersonalNo = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter personal number.';
	}
	if (
		!(
			value.startsWith('6') ||
			value.startsWith('7') ||
			value.startsWith('8') ||
			value.startsWith('9')
		)
	) {
		return 'Contact number should start with 6, 7, 8, 9.';
	}
	if (value.length !== 10) {
		return 'Please enter valid contact number .';
	}

	return '';
};
export const validateRestaurantName = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter restaurant name.';
	}

	return '';
};
export const validateContactNumber = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter contact number.';
	}
	if (
		!(
			value.startsWith('6') ||
			value.startsWith('7') ||
			value.startsWith('8') ||
			value.startsWith('9')
		)
	) {
		return 'Contact number should start with 6, 7, 8, 9.';
	}
	if (value.length !== 10) {
		return 'Please enter valid contact number .';
	}
	return '';
};
export const validateRestaurantType = (value: string | Option) => {
	if (typeof value === 'string') {
		if (!value?.trim()) {
			return 'Please select restaurant type.';
		}
	}

	if (!value) {
		return 'Please select restaurant type.';
	}

	return '';
};
export const validateCuisine = (value: string[] | Option[]) => {
	if (value.length === 0) {
		return 'Please select cuisine.';
	}

	if (!value) {
		return 'Please enter cuisine.';
	}

	return '';
};
export const validateLocation = (value: string | Option) => {
	if (typeof value === 'string') {
		if (!value?.trim()) {
			return 'Please select location.';
		}
	}

	if (!value) {
		return 'Please enter location.';
	}

	return '';
};
export const validateAddress = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter address .';
	}

	return '';
};
export const validateLatitude = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter Latitude.';
	}
	if (!(isFinite(Number(value)) && Math.abs(Number(value)) <= 90)) {
		return 'Please enter valid Latitude.';
	}
	return '';
};
export const validateLongitude = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter longitude .';
	}
	if (!(isFinite(Number(value)) && Math.abs(Number(value)) <= 180)) {
		return 'Please enter valid .';
	}
	return '';
};
export const validateAddharNumber = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter addhar Number .';
	}
	if (value.length !== 12) {
		return 'Please enter valid addhar Number .';
	}

	return '';
};

export const validateImage = (value: FileList) => {
	if (!value || value?.length === 0) {
		return 'Please upload image';
	}

	return '';
};

export const validateRole = (value: string | Option) => {
	if (typeof value === 'string') {
		if (!value?.trim()) {
			return 'Please select role';
		}
	}

	if (!value) {
		return 'Please select role';
	}

	return '';
};

export const validateWorkLocation = (value: string | Option) => {
	if (typeof value === 'string') {
		if (!value?.trim()) {
			return 'Please select work locatiom';
		}
	}

	if (!value) {
		return 'Please select work locatiom';
	}

	return '';
};

export const validatePhoneNumber = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter phone number .';
	}
	if (
		!(
			value.startsWith('6') ||
			value.startsWith('7') ||
			value.startsWith('8') ||
			value.startsWith('9')
		)
	) {
		return 'Contact number should start with 6, 7, 8, 9.';
	}
	if (value.length !== 10) {
		return 'Please enter valid phone number .';
	}

	return '';
};

export const validateAgreedPercentage = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter agreed percentage.';
	}

	return '';
};

export const validateAgreementType = (value: string | Option) => {
	if (typeof value === 'string') {
		if (!value?.trim()) {
			return 'Please select agreement type .';
		}
	}

	if (!value) {
		return 'Please select agreement type .';
	}
	return '';
};

export const validateAgreementPeriod = (value: string | Option) => {
	if (typeof value === 'string') {
		if (!value?.trim()) {
			return 'Please enter agreement period .';
		}
	}

	if (!value) {
		return 'Please enter agreement period .';
	}

	return '';
};

export const validateGstNumber = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter gst number.';
	}
	if (!GSTValidationExpresstion.test(value)) {
		return 'Please enter valid GST number.';
	}

	return '';
};

export const validatePanNumber = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter pan number.';
	}
	if (!PanValidationExpresstion.test(value)) {
		return 'Please enter valid pan number.';
	}
	return '';
};

export const validateFssaino = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter fssai no.';
	}

	return '';
};

export const validateRestarant = (value: string | Option) => {
	if (typeof value === 'string') {
		if (!value?.trim()) {
			return 'Please select  restaurant.';
		}
	}

	if (!value) {
		return 'Please select  restaurant.';
	}

	return '';
};

export const validatePrimaryQr = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter unique qr  id.';
	}

	return '';
};

export const validateAccountHolderName = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter account holder name.';
	}
	return '';
};

export const validateBankName = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter bank name.';
	}
	return '';
};

export const validateAccountNumber = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter account number.';
	}
	return '';
};

export const validateIFSCCode = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter IFSC code.';
	}
	return '';
};
export const validateOwenerName = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter owner name.';
	}
	return '';
};

export const validateMenuTypeName = (value: string) => {
	if (!value && !value?.trim()) {
		return 'Please select menu type.';
	}
	return '';
};

export const validateMenuCategoryName = (value: string | Option) => {
	if (typeof value === 'string') {
		if (!value?.trim()) {
			return 'Please select category.';
		}
	}
	if (!value) {
		return 'Please select category.';
	}

	return '';
};

export const validateMenuName = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter menu name.';
	}
	return '';
};

export const validatePrice = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter price.';
	}
	return '';
};

export const validateQrCode = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter qr received.';
	}
	return '';
};
export const validateSelectExecutiveCode = (value: string | Option) => {
	if (typeof value === 'string') {
		if (!value?.trim()) {
			return 'Please select executive .';
		}
	}

	if (!value) {
		return 'Please select executive.';
	}

	return '';
};
export const validateFaqQue = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter FAQ quetion.';
	}
	return '';
};
export const validateFaqAns = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter FAQ answer.';
	}
	return '';
};

export const validateOfferList = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter offer list.';
	}
	return '';
};

export const validateAmount = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter amount.';
	}
	return '';
};
export const validateTypeHeading = (value: string) => {
	if (!value?.trim()) {
		return 'Please Type Heading.';
	}
	return '';
};
export const validateInformationText = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter information text.';
	}
	return '';
};

export const validateMessageBody = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter message body.';
	}
	return '';
};

export const validateSelectBodyType = (value: string | Option) => {
	if (typeof value === 'string') {
		if (!value?.trim()) {
			return 'Please select body type.';
		}
	}
	if (!value) {
		return 'Please select body type.';
	}
	return '';
};
export const validateSelectSendType = (value: string | Option) => {
	if (typeof value === 'string') {
		if (!value?.trim()) {
			return 'Please select send type.';
		}
	}
	if (!value) {
		return 'Please select send type.';
	}
	return '';
};
export const validateHours = (value: string | Option) => {
	if (typeof value === 'string') {
		if (!value?.trim()) {
			return 'Please select hours.';
		}
	}
	if (!value) {
		return 'Please select restaurant type.';
	}
	return '';
};
export const validateMinute = (value: string | Option) => {
	if (typeof value === 'string') {
		if (!value?.trim()) {
			return 'Please select minute.';
		}
	}
	if (!value) {
		return 'Please select restaurant type.';
	}
	return '';
};
export const validateAmPm = (value: string | Option) => {
	if (typeof value === 'string') {
		if (!value?.trim()) {
			return 'Please select am & pm.';
		}
	}
	if (!value) {
		return 'Please select restaurant type.';
	}
	return '';
};
export const validateDateMonth = (value: string) => {
	if (!value?.trim()) {
		return 'Please select date & month.';
	}

	return '';
};

export const validateName = (value: string) => {
	if (!value?.trim()) {
		return 'Please enter name.';
	}

	return '';
};
