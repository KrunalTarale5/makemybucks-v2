import InputField, { InputFieldValue } from '@components/InputField';
import {
	IdentityProofFormFields,
	IdentityProofFormRequest,
	UpdateSalesExecutiveContext,
	UpdateSalesExecutiveRequest,
	validateIdentityProofFields,
	validateIdentityProofForm,
} from '@hooks/admin-update-sales-executive';
import { FieldProps, FormErrorMessage } from '@interfaces/common';
import { Grid, Stack } from '@mui/material';
import { memo, useContext, useEffect, useState } from 'react';
import NavigateButtons from '../NavigateButtons';
import { validateIsNumber } from '@utils/validator';

const intialFormData = (formData: UpdateSalesExecutiveRequest): IdentityProofFormRequest => ({
	aadhar_no: formData?.aadhar_no as string,
	addhar_front_pic: formData?.addhar_front_pic,
	addhar_back_pic: formData?.addhar_back_pic,
});

const intialFormError: FormErrorMessage<IdentityProofFormRequest> = {
	aadhar_no: '',
	addhar_back_pic: '',
	addhar_front_pic: '',
};

const IdentityProofForm = () => {
	const formContext = useContext(UpdateSalesExecutiveContext);

	const [formData, setFormData] = useState(intialFormData(formContext.formData));
	const [formError, setFormError] = useState(intialFormError);

	useEffect(() => {
		setFormData(formContext.formData as unknown as IdentityProofFormRequest);
	}, [formContext.formData]);

	const onChange = (
		fieldName: string,
		value: InputFieldValue,
		fieldType: FieldProps['fieldType'],
		event?: any
	) => {
		let _formData: IdentityProofFormRequest = {} as IdentityProofFormRequest;
		if (fieldType === 'number') {
			const isNumber = validateIsNumber(String(value));
			if (fieldName === 'aadhar_no' && (value as string).length > 12) return;
			_formData = {
				...formData,
				[fieldName]: isNumber ? value : formData[fieldName as keyof IdentityProofFormRequest],
			};
		} else if (fieldType === 'upload') {
			_formData = {
				...formData,
				[fieldName]: event?.target?.files,
			};
		} else {
			_formData = { ...formData, [fieldName]: value };
		}
		setFormData(_formData);
		setFormError({
			...formError,
			[fieldName]: validateIdentityProofFields(
				fieldName as keyof IdentityProofFormRequest,
				_formData
			),
		});
	};

	const handleNextClick = () => {
		const validatation = validateIdentityProofForm(formData);
		if (validatation.hasError) {
			setFormError(validatation.errors);
			return;
		}
		formContext.setFormData({ ...formContext.formData, ...formData });
		formContext.setActiveStep(formContext.activeStep + 1);
	};

	const handlePreviousClick = () => {
		formContext.setActiveStep(formContext.activeStep - 1);
	};

	return (
		<Stack
			gap={6}
			alignItems={'flex-start'}
		>
			<Grid
				container
				spacing={4}
			>
				<Grid
					item
					container
					xs={7}
					rowGap={3}
				>
					<Grid
						item
						xs={6}
					>
						<Stack
							flexDirection={'row'}
							gap={2}
							alignItems={'self-end'}
						>
							<InputField
								fieldName={'1'}
								value={(formData?.aadhar_no as string)?.substring(0, 4)}
								key={'1'}
								fieldProps={{
									...IdentityProofFormFields.aadhar_no,
									color: 'secondary',
									fullWidth: true,
									id: 'aadharNo-1',
									sx: {
										width: 129,
										gap: 0,
										'.MuiTypography-subtitle1': {
											fontFamily: 'Poppins',
											fontSize: `14px`,
										},
									},
									error: Boolean(formError['aadhar_no']),
								}}
								fieldType={IdentityProofFormFields.aadhar_no?.fieldType}
							/>
							<InputField
								fieldName={'2'}
								value={(formData?.aadhar_no as string)?.substring(4, 8)}
								key={'2'}
								fieldProps={{
									...IdentityProofFormFields.aadhar_no,
									color: 'secondary',
									fullWidth: true,
									label: ' ',
									required: false,
									id: 'aadharNo-2',
									sx: {
										width: 129,
										gap: 0,
										'.MuiTypography-subtitle1': {
											fontFamily: 'Poppins',
											fontSize: `14px`,
										},
									},
									error: Boolean(formError['aadhar_no']),
								}}
								fieldType={IdentityProofFormFields.aadhar_no?.fieldType}
							/>
							<InputField
								fieldName={'3'}
								value={(formData?.aadhar_no as string)?.substring(8, 12)}
								key={'3'}
								fieldProps={{
									...IdentityProofFormFields.aadhar_no,
									color: 'secondary',
									fullWidth: true,
									label: ' ',
									required: false,
									id: 'aadharNo-3',
									sx: {
										width: 129,
										gap: 0,
										'.MuiTypography-subtitle1': {
											fontFamily: 'Poppins',
											fontSize: `14px`,
										},
									},
									error: Boolean(formError['aadhar_no']),
								}}
								fieldType={IdentityProofFormFields.aadhar_no?.fieldType}
							/>
						</Stack>
					</Grid>
					<Grid
						container
						spacing={4}
					>
						<Grid
							item
							xs={12}
							display={'inline-grid'}
							gridTemplateColumns={`1fr 1fr`}
							rowGap={3}
							columnGap={2}
						>
							{Object.entries(IdentityProofFormFields).map((v) => {
								const fieldName: keyof IdentityProofFormFields =
									v[0] as keyof IdentityProofFormFields;
								const fieldProps = v[1];

								return (
									(fieldName === 'addhar_front_pic' || fieldName === 'addhar_back_pic') && (
										<InputField
											fieldName={fieldName}
											value={
												(formData?.[fieldName] as InputFieldValue) ??
												'' /* ? URL.createObjectURL(formData[fieldName][0]) : '' */
											}
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
													'.uploader-container': {
														height: 233,
														borderStyle: 'solid',
														borderWidth: 1,
														borderRadius: `4px`,
													},
												},
												error: Boolean(formError[fieldName]),
												helperText: formError[fieldName],
											}}
											fieldType={fieldProps.fieldType}
											onChange={onChange}
										/>
									)
								);
							})}
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<NavigateButtons
				onNextClick={handleNextClick}
				onPreviousClick={handlePreviousClick}
			/>
		</Stack>
	);
};

export default memo(IdentityProofForm);
