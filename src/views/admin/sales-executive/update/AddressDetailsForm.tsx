import InputField, { InputFieldProps, InputFieldValue } from '@components/InputField';
import { PoppinsTypography } from '@components/Typography';
import {
	AddressDetailsFormFields,
	AddressDetailsFormRequest,
	AddressDetailsFormType,
	UpdateSalesExecutiveContext,
	UpdateSalesExecutiveRequest,
	validateAddressDetailsFields,
	validateAddressDetailsForm,
} from '@hooks/admin-update-sales-executive';
import { FormErrorMessage, Option } from '@interfaces/common';
import { Checkbox, FormControlLabel, Grid, Stack, useTheme } from '@mui/material';
import { memo, useContext, useEffect, useState } from 'react';
import NavigateButtons from '../NavigateButtons';
import { validateIsNumber } from '@utils/validator';
import { useGetStateApi } from '@hooks/admin-add-sales-executive';

const localAddIntialFormData = (
	formData: UpdateSalesExecutiveRequest
): AddressDetailsFormRequest['localAddress'] => ({
	local_flat_no: formData?.local_flat_no,
	local_street_name: formData?.local_street_name,
	local_city: formData?.local_city,
	local_pin_code: formData?.local_pin_code,
	local_state: formData?.local_state,
});

const localAddIntialFormError: FormErrorMessage<AddressDetailsFormRequest['localAddress']> = {
	local_flat_no: '',
	local_street_name: '',
	local_city: '',
	local_pin_code: '',
	local_state: '',
};

const permanentAddIntialFormData = (
	formData: UpdateSalesExecutiveRequest
): AddressDetailsFormRequest['permanentAddress'] => ({
	permanent_flat_no: formData?.permanent_flat_no,
	permanent_street_name: formData?.local_street_name,
	permanent_city: formData?.permanent_city,
	permanent_pin_code: formData?.permanent_pin_code,
	permanent_state: formData?.permanent_state,
});

const permanaentAddIntialFormError: FormErrorMessage<
	AddressDetailsFormRequest['permanentAddress']
> = {
	permanent_flat_no: '',
	permanent_street_name: '',
	permanent_city: '',
	permanent_pin_code: '',
	permanent_state: '',
};

const AddressDetailsForm = () => {
	const theme = useTheme();
	const formContext = useContext(UpdateSalesExecutiveContext);
	const GetStateApi = useGetStateApi();

	const [localAddformData, setLocalAddFormData] = useState(
		localAddIntialFormData(formContext.formData)
	);
	const [permanentAddformData, setPermanentAddFormData] = useState(
		permanentAddIntialFormData(formContext.formData)
	);
	const [localAddformError, setLocalAddFormError] = useState(localAddIntialFormError);
	const [permanentAddFormError, setPermanentAddFormError] = useState(permanaentAddIntialFormError);

	useEffect(() => {
		setLocalAddFormData({
			...formContext.formData,
			local_state: GetStateApi.data?.data.state_data
				.map((r) => ({
					label: r.state_name,
					value: r.id,
				}))
				.filter((f) => f.label === formContext.formData?.local_state)[0],
		} as unknown as AddressDetailsFormRequest['localAddress']);
		const permanent_state =
			typeof formContext.formData?.permanent_state === 'string'
				? formContext.formData?.permanent_state
				: formContext.formData?.permanent_state?.label;

		setPermanentAddFormData({
			...formContext.formData,
			permanent_state: GetStateApi.data?.data.state_data
				.map((r) => ({
					label: r.state_name,
					value: r.id,
				}))
				.filter((f) => f.label === permanent_state)[0],
		} as unknown as AddressDetailsFormRequest['permanentAddress']);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formContext.formData, GetStateApi.dataUpdatedAt]);

	const onLocalAddChange = (
		fieldName: string,
		value: InputFieldValue,
		fieldType: InputFieldProps['fieldType']
	) => {
		let _formData: AddressDetailsFormRequest['localAddress'] =
			{} as AddressDetailsFormRequest['localAddress'];
		if (fieldType === 'number') {
			const isNumber = validateIsNumber(String(value));
			_formData = {
				...localAddformData,
				[fieldName]: isNumber
					? value
					: localAddformData[fieldName as keyof AddressDetailsFormRequest['localAddress']],
			};
		} else {
			_formData = { ...localAddformData, [fieldName]: value };
		}
		setLocalAddFormData(_formData);
		setLocalAddFormError({
			...localAddformError,
			[fieldName]: validateAddressDetailsFields(
				fieldName as keyof AddressDetailsFormType,
				_formData
			),
		});
	};

	const onPermanentAddChange = (
		fieldName: string,
		value: InputFieldValue,
		fieldType: InputFieldProps['fieldType']
	) => {
		let _formData: AddressDetailsFormRequest['permanentAddress'] =
			{} as AddressDetailsFormRequest['permanentAddress'];
		if (fieldType === 'number') {
			const isNumber = validateIsNumber(String(value));
			_formData = {
				...permanentAddformData,
				[fieldName]: isNumber
					? value
					: permanentAddformData[fieldName as keyof AddressDetailsFormRequest['permanentAddress']],
			};
		} else {
			_formData = { ...permanentAddformData, [fieldName]: value };
		}
		setPermanentAddFormData(_formData);
		setPermanentAddFormError({
			...permanentAddFormError,
			[fieldName]: validateAddressDetailsFields(
				fieldName as keyof AddressDetailsFormType,
				_formData
			),
		});
	};
	const handleNextClick = () => {
		const validatation = validateAddressDetailsForm({
			...localAddformData,
			...permanentAddformData,
		});
		if (validatation.hasError) {
			setLocalAddFormError(
				validatation.errors as FormErrorMessage<AddressDetailsFormRequest['localAddress']>
			);
			setPermanentAddFormError(
				validatation.errors as FormErrorMessage<AddressDetailsFormRequest['permanentAddress']>
			);
			return;
		}
		formContext.setFormData({
			...formContext.formData,
			...localAddformData,
			...permanentAddformData,
		});
		formContext.setActiveStep(formContext.activeStep + 1);
	};

	const handlePreviousClick = () => {
		formContext.setActiveStep(formContext.activeStep - 1);
	};

	const onSameAsClick = (e: React.ChangeEvent<HTMLInputElement>) => {
		const data = {
			permanent_city: localAddformData.local_city,
			permanent_flat_no: localAddformData.local_flat_no,
			permanent_pin_code: localAddformData.local_pin_code,
			permanent_state: localAddformData.local_state,
			permanent_street_name: localAddformData.local_street_name,
		};
		setPermanentAddFormData(
			e.target.checked
				? {
						permanent_city: localAddformData.local_city,
						permanent_flat_no: localAddformData.local_flat_no,
						permanent_pin_code: localAddformData.local_pin_code,
						permanent_state: localAddformData.local_state,
						permanent_street_name: localAddformData.local_street_name,
				  }
				: ({} as AddressDetailsFormRequest['permanentAddress'])
		);
		if (e.target.checked) {
			const errors: FormErrorMessage<AddressDetailsFormRequest['permanentAddress']> =
				permanentAddFormError;

			Object.keys(errors).forEach((fieldName) => {
				errors[fieldName as keyof FormErrorMessage<AddressDetailsFormRequest['permanentAddress']>] =
					validateAddressDetailsFields(fieldName as keyof AddressDetailsFormType, {
						...permanentAddformData,
						...data,
					});
			});
			setPermanentAddFormError({
				...permanentAddFormError,
				...errors,
			});
		}
	};

	const getOptions = (
		fieldName:
			| keyof AddressDetailsFormRequest['permanentAddress']
			| keyof AddressDetailsFormRequest['localAddress']
	): Option[] | undefined => {
		switch (fieldName) {
			case 'permanent_state':
			case 'local_state':
				return GetStateApi.data?.data.state_data.map((r) => ({
					label: r.state_name,
					value: r.id,
				}));

			default:
				break;
		}
	};

	return (
		<Stack
			gap={6}
			alignItems={'flex-start'}
		>
			<Stack
				width={`100%`}
				flexDirection={'row'}
			>
				<Stack flexBasis={`50%`}>
					<Stack
						sx={{ width: '466px !important' }}
						gap={3}
					>
						<PoppinsTypography
							variant='body1'
							fontWeight={600}
							textTransform={'uppercase'}
							sx={{ color: theme.palette.common.secondaryGreyText }}
						>
							Local Address
						</PoppinsTypography>

						{Object.entries(AddressDetailsFormFields.localAddress).map((v) => {
							const fieldName: keyof AddressDetailsFormFields['localAddress'] =
								v[0] as keyof AddressDetailsFormFields['localAddress'];
							const fieldProps = v[1];

							return (
								(fieldName === 'local_flat_no' || fieldName === 'local_street_name') && (
									<InputField
										fieldName={fieldName}
										value={(localAddformData?.[fieldName] as InputFieldValue) ?? ''}
										key={fieldName}
										fieldProps={{
											...fieldProps,
											color: 'secondary',
											fullWidth: true,
											sx: {
												gap: 0,
												'.MuiTypography-subtitle1': {
													fontFamily: 'Poppins',
													fontSize: `14px`,
												},
											},
											options: getOptions(fieldName),
											autoComplete: 'off',
											error: Boolean(localAddformError[fieldName]),
											helperText: localAddformError[fieldName],
										}}
										fieldType={fieldProps.fieldType}
										onChange={onLocalAddChange}
									/>
								)
							);
						})}
						<Grid
							container
							spacing={4}
						>
							<Grid
								item
								display={'inline-grid'}
								gridTemplateColumns={`1.5fr 1fr`}
								rowGap={3}
								columnGap={1}
							>
								{Object.entries(AddressDetailsFormFields.localAddress).map((v) => {
									const fieldName: keyof AddressDetailsFormFields['localAddress'] =
										v[0] as keyof AddressDetailsFormFields['localAddress'];
									const fieldProps = v[1];

									return (
										(fieldName === 'local_city' || fieldName === 'local_pin_code') && (
											<InputField
												fieldName={fieldName}
												value={(localAddformData?.[fieldName] as InputFieldValue) ?? ''}
												key={fieldName}
												fieldProps={{
													...fieldProps,
													color: 'secondary',
													fullWidth: true,
													sx: {
														gap: 0,
														'.MuiTypography-subtitle1': {
															fontFamily: 'Poppins',
															fontSize: `14px`,
														},
													},
													options: getOptions(fieldName),
													autoComplete: 'off',
													error: Boolean(localAddformError[fieldName]),
													helperText: localAddformError[fieldName],
												}}
												fieldType={fieldProps.fieldType}
												onChange={onLocalAddChange}
											/>
										)
									);
								})}
							</Grid>
						</Grid>
						{Object.entries(AddressDetailsFormFields.localAddress).map((v) => {
							const fieldName: keyof AddressDetailsFormFields['localAddress'] =
								v[0] as keyof AddressDetailsFormFields['localAddress'];
							const fieldProps = v[1];

							return (
								fieldName === 'local_state' && (
									<InputField
										fieldName={fieldName}
										value={(localAddformData?.[fieldName] as InputFieldValue) ?? ''}
										key={fieldName}
										fieldProps={{
											...fieldProps,
											color: 'secondary',
											fullWidth: true,
											sx: {
												gap: 0,
												'.MuiTypography-subtitle1': {
													fontFamily: 'Poppins',
													fontSize: `14px`,
												},
											},
											options: getOptions(fieldName),
											autoComplete: 'off',
											error: Boolean(localAddformError[fieldName]),
											helperText: localAddformError[fieldName],
										}}
										fieldType={fieldProps.fieldType}
										onChange={onLocalAddChange}
									/>
								)
							);
						})}
					</Stack>
				</Stack>
				<Stack flexBasis={`50%`}>
					<Stack
						sx={{ width: '466px !important' }}
						gap={3}
					>
						<PoppinsTypography
							variant='body1'
							fontWeight={600}
							textTransform={'uppercase'}
							sx={{ color: theme.palette.common.secondaryGreyText }}
						>
							Permanent Address
						</PoppinsTypography>
						{Object.entries(AddressDetailsFormFields.permanentAddress).map((v) => {
							const fieldName: keyof AddressDetailsFormFields['permanentAddress'] =
								v[0] as keyof AddressDetailsFormFields['permanentAddress'];
							const fieldProps = v[1];

							return (
								(fieldName === 'permanent_flat_no' || fieldName === 'permanent_street_name') && (
									<InputField
										fieldName={fieldName}
										value={(permanentAddformData?.[fieldName] as InputFieldValue) ?? ''}
										key={fieldName}
										fieldProps={{
											...fieldProps,
											color: 'secondary',
											fullWidth: true,
											sx: {
												gap: 0,
												'.MuiTypography-subtitle1': {
													fontFamily: 'Poppins',
													fontSize: `14px`,
												},
											},
											options: getOptions(fieldName),
											autoComplete: 'off',
											error: Boolean(permanentAddFormError[fieldName]),
											helperText: permanentAddFormError[fieldName],
										}}
										fieldType={fieldProps.fieldType}
										onChange={onPermanentAddChange}
									/>
								)
							);
						})}
						<Grid
							container
							spacing={4}
						>
							<Grid
								item
								display={'inline-grid'}
								gridTemplateColumns={`1.5fr 1fr`}
								rowGap={3}
								columnGap={1}
							>
								{Object.entries(AddressDetailsFormFields.permanentAddress).map((v) => {
									const fieldName: keyof AddressDetailsFormFields['permanentAddress'] =
										v[0] as keyof AddressDetailsFormFields['permanentAddress'];
									const fieldProps = v[1];

									return (
										(fieldName === 'permanent_city' || fieldName === 'permanent_pin_code') && (
											<InputField
												fieldName={fieldName}
												value={(permanentAddformData?.[fieldName] as InputFieldValue) ?? ''}
												key={fieldName}
												fieldProps={{
													...fieldProps,
													color: 'secondary',
													fullWidth: true,
													sx: {
														gap: 0,
														'.MuiTypography-subtitle1': {
															fontFamily: 'Poppins',
															fontSize: `14px`,
														},
													},
													options: getOptions(fieldName),
													autoComplete: 'off',
													error: Boolean(permanentAddFormError[fieldName]),
													helperText: permanentAddFormError[fieldName],
												}}
												fieldType={fieldProps.fieldType}
												onChange={onPermanentAddChange}
											/>
										)
									);
								})}
							</Grid>
						</Grid>
						{Object.entries(AddressDetailsFormFields.permanentAddress).map((v) => {
							const fieldName: keyof AddressDetailsFormFields['permanentAddress'] =
								v[0] as keyof AddressDetailsFormFields['permanentAddress'];
							const fieldProps = v[1];

							return (
								fieldName === 'permanent_state' && (
									<InputField
										fieldName={fieldName}
										value={(permanentAddformData?.[fieldName] as InputFieldValue) ?? ''}
										key={fieldName}
										fieldProps={{
											...fieldProps,
											color: 'secondary',
											fullWidth: true,
											sx: {
												gap: 0,
												'.MuiTypography-subtitle1': {
													fontFamily: 'Poppins',
													fontSize: `14px`,
												},
											},
											options: getOptions(fieldName),
											autoComplete: 'off',
											error: Boolean(permanentAddFormError[fieldName]),
											helperText: permanentAddFormError[fieldName],
										}}
										fieldType={fieldProps.fieldType}
										onChange={onLocalAddChange}
										addons={
											fieldName === 'permanent_state' && (
												<FormControlLabel
													control={
														<Checkbox
															color='primary'
															size='small'
															onChange={onSameAsClick}
														/>
													}
													label={
														<PoppinsTypography variant='subtitle1'>
															Same as Local Address
														</PoppinsTypography>
													}
												/>
											)
										}
									/>
								)
							);
						})}
					</Stack>
				</Stack>
			</Stack>

			<NavigateButtons
				onNextClick={handleNextClick}
				onPreviousClick={handlePreviousClick}
			/>
		</Stack>
	);
};

export default memo(AddressDetailsForm);
