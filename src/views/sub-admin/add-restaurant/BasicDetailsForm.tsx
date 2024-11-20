import InputField, { InputFieldValue } from '@components/InputField';
import SubAdminWrapper from '@components/SubAdminWrapper';
import { PoppinsTypography } from '@components/Typography';
import { useGetWorkLocationApi } from '@hooks/admin-add-sales-executive';
import { useGetCuisineTypeApi, useGetRestaurantTypeApi } from '@hooks/admin-master-list';
import {
	BasicDetailFormFields,
	BasicDetailRequest,
	validateBasicDetailFields,
	validateBasicDetailForm,
	AddRestaurantContext,
	AddRestaurantFormRequest,
} from '@hooks/sub-admin-add-restaurant';
import { FieldProps, FormErrorMessage, Option } from '@interfaces/common';
import { Stack, useTheme } from '@mui/material';
import { validateIsMobileNumber, validateIsNumber, validateIsPrice } from '@utils/validator';
import { memo, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const intialFormData = (formData: AddRestaurantFormRequest): BasicDetailRequest => ({
	restaurant_name: formData.restaurant_name,
	contact_no: formData.contact_no,
	restaurant_type: formData.restaurant_type,
	cuisine: formData.cuisine ?? [],
	location: formData.location,
	address: formData.address,
	latitude: formData.latitude,
	longitude: formData.longitude,
});

const intialFormError: FormErrorMessage<BasicDetailRequest> = {
	restaurant_name: '',
	contact_no: '',
	restaurant_type: '',
	cuisine: '',
	location: '',
	address: '',
	latitude: '',
	longitude: '',
};

const BasicDetailsForm = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const formContext = useContext(AddRestaurantContext);

	const GetRestaurantTypeApi = useGetRestaurantTypeApi();
	const GetCuisineTypeApi = useGetCuisineTypeApi();
	const GetWorkLocationApi = useGetWorkLocationApi();

	const [formData, setFormData] = useState(intialFormData(formContext.formData));
	const [formError, setFormError] = useState(intialFormError);

	const onChange = (
		fieldName: string,
		value: InputFieldValue,
		fieldType: FieldProps['fieldType']
	) => {
		let _formData: BasicDetailRequest = {} as BasicDetailRequest;
		if (fieldType === 'number') {
			if (fieldName === 'latitude' || fieldName === 'longitude') {
				const isPrice = validateIsPrice(String(value));
				_formData = {
					...formData,
					[fieldName]: isPrice ? value : formData[fieldName as keyof BasicDetailRequest],
				};
			} else {
				const isNumber = validateIsNumber(String(value));
				_formData = {
					...formData,
					[fieldName]: isNumber ? value : formData[fieldName as keyof BasicDetailRequest],
				};
			}
		} else if (fieldType === 'mobile-number') {
			const isNumber = validateIsMobileNumber(String(value));
			_formData = {
				...formData,
				[fieldName]: isNumber ? value : formData[fieldName as keyof BasicDetailRequest],
			};
		} else {
			_formData = { ...formData, [fieldName]: value };
		}
		setFormData(_formData);
		setFormError({
			...formError,
			[fieldName]: validateBasicDetailFields(fieldName as keyof BasicDetailRequest, _formData),
		});
	};
	const handleNextClick = () => {
		const validatation = validateBasicDetailForm(formData);
		if (validatation.hasError) {
			setFormError(validatation.errors);
			return;
		}
		formContext.setFormData({ ...formContext.formData, ...formData });
		formContext.setActiveStep(formContext.activeStep + 1);
	};

	const handleBackClick = () => {
		navigate(-1);
	};

	const getOptions = (fieldName: keyof BasicDetailFormFields): Option[] | undefined => {
		switch (fieldName) {
			case 'restaurant_type':
				return GetRestaurantTypeApi.data?.data.restaurantTypeData.map((r) => ({
					label: r.type_name,
					value: r.id,
				}));
			case 'cuisine':
				return GetCuisineTypeApi.data?.data.cuisineData.map((r) => ({
					label: r.cuisine_name,
					value: r.id,
				}));
			case 'location':
				return GetWorkLocationApi.data?.data.location_data.map((r) => ({
					label: r.location_name,
					value: r.id,
				}));

			default:
				break;
		}
	};

	return (
		<SubAdminWrapper
			heading={'Add Restaurant'}
			controlButtonProps={{
				content: `Next`,
				onClick: handleNextClick,
			}}
			handleBack={handleBackClick}
		>
			<Stack gap={2}>
				<Stack
					flexDirection={'row'}
					justifyContent={'space-between'}
				>
					<PoppinsTypography
						variant='subtitle1'
						fontWeight={600}
						textTransform={'uppercase'}
						sx={{ color: theme.palette.common.secondaryGreyText }}
					>
						Basic Details
					</PoppinsTypography>
					<PoppinsTypography
						variant='subtitle1'
						fontWeight={600}
						sx={{ color: theme.palette.common.primaryGreyText }}
					>
						Steps 1/4
					</PoppinsTypography>
				</Stack>

				<Stack gap={1.5}>
					{Object.entries(BasicDetailFormFields).map((v) => {
						const fieldName: keyof BasicDetailFormFields = v[0] as keyof BasicDetailFormFields;
						const fieldProps = v[1];

						return (
							<InputField
								showLabel={false}
								fieldName={fieldName}
								value={(formData[fieldName] as InputFieldValue) ?? ''}
								key={fieldName}
								fieldProps={{
									...fieldProps,
									color: 'primary',
									fullWidth: true,
									size: 'medium',
									error: Boolean(formError[fieldName]),
									helperText: formError[fieldName],
									options: getOptions(fieldName),
								}}
								fieldType={fieldProps.fieldType}
								onChange={onChange}
								addons={
									fieldName === 'address' && (
										<PoppinsTypography
											variant='subtitle1'
											fontWeight={600}
											textTransform={'uppercase'}
											paddingTop={4}
											sx={{ color: theme.palette.common.secondaryGreyText }}
										>
											location Details
										</PoppinsTypography>
									)
								}
							/>
						);
					})}
				</Stack>
			</Stack>
		</SubAdminWrapper>
	);
};

export default memo(BasicDetailsForm);
