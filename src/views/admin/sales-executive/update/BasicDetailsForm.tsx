import IconFinder from '@components/Icon';
import InputField, { InputFieldProps, InputFieldValue } from '@components/InputField';
import { PoppinsTypography } from '@components/Typography';
import Uploader from '@components/Uploader';
import {
	BasicDetailsFormFields,
	BasicDetailsFormRequest,
	UpdateSalesExecutiveContext,
	UpdateSalesExecutiveRequest,
	validateBasicDetailFields,
	validateBasicDetailForm,
} from '@hooks/admin-update-sales-executive';
import { FormErrorMessage } from '@interfaces/common';
import { Checkbox, FormControlLabel, Grid, Stack } from '@mui/material';
import { memo, useContext, useEffect, useState } from 'react';
import NavigateButtons from '../NavigateButtons';
import { validateIsMobileNumber, validateIsNumber } from '@utils/validator';
import { useVerifySalesExecutivesMobileNumberApi } from '@hooks/admin-add-sales-executive';
import { useSnackbar } from '@components/Snackbar';

const intialFormData = (formData: UpdateSalesExecutiveRequest): BasicDetailsFormRequest => ({
	first_name: formData?.first_name,
	last_name: formData?.last_name,
	email: formData?.email,
	reEmail: formData?.email,
	mobile_no: formData?.mobile_no,
	personal_no: formData?.personal_no,
	profile_pic: formData?.profile_pic,
});

const intialFormError: FormErrorMessage<BasicDetailsFormRequest> = {
	first_name: '',
	last_name: '',
	email: '',
	reEmail: '',
	mobile_no: '',
	personal_no: '',
	profile_pic: '',
};

const BasicDetailsForm = () => {
	const { showSnackbar, hideSnackbar } = useSnackbar();
	const formContext = useContext(UpdateSalesExecutiveContext);

	const [formData, setFormData] = useState(intialFormData(formContext.formData));
	const [formError, setFormError] = useState(intialFormError);

	const VerifySalesExecutivesMobileNumberApi = useVerifySalesExecutivesMobileNumberApi();

	useEffect(() => {
		setFormData({
			...(formContext.formData as unknown as BasicDetailsFormRequest),
			reEmail: formContext.formData?.email,
		});
	}, [formContext.formData]);

	const onChange = (
		fieldName: string,
		value: InputFieldValue,
		fieldType: InputFieldProps['fieldType']
	) => {
		let _formData: BasicDetailsFormRequest = {} as BasicDetailsFormRequest;
		if (fieldType === 'number') {
			const isNumber = validateIsNumber(String(value));
			_formData = {
				...formData,
				[fieldName]: isNumber ? value : formData[fieldName as keyof BasicDetailsFormRequest],
			};
		} else if (fieldType === 'mobile-number') {
			const isNumber = validateIsMobileNumber(String(value));
			_formData = {
				...formData,
				[fieldName]: isNumber ? value : formData[fieldName as keyof BasicDetailsFormRequest],
			};
		} else {
			_formData = { ...formData, [fieldName]: value };
		}
		setFormData(_formData);
		setFormError({
			...formError,
			[fieldName]: validateBasicDetailFields(fieldName as keyof BasicDetailsFormRequest, _formData),
		});
	};

	const handleNextClick = () => {
		const validatation = validateBasicDetailForm(formData);
		if (validatation.hasError) {
			setFormError(validatation.errors);
			return;
		}

		if (formData.mobile_no === formContext.formData.mobile_no) {
			formContext.setFormData({ ...formContext.formData, ...formData });
			formContext.setActiveStep(formContext.activeStep + 1);

			return;
		}
		VerifySalesExecutivesMobileNumberApi.mutateAsync({
			subadmin_contact_no: formData.mobile_no as string,
		})
			.then(() => {
				formContext.setFormData({ ...formContext.formData, ...formData });
				formContext.setActiveStep(formContext.activeStep + 1);
			})
			.catch((error) => {
				showSnackbar({
					title: 'Error!',
					variant: 'error',
					content: error.response?.data?.message,
					onCancel: () => hideSnackbar(),
				});
			});
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
					xs={7}
					display={'inline-grid'}
					gridTemplateColumns={`1fr 1fr`}
					rowGap={3}
					columnGap={2}
				>
					{Object.entries(BasicDetailsFormFields).map((v) => {
						const fieldName: keyof BasicDetailsFormFields = v[0] as keyof BasicDetailsFormFields;
						const fieldProps = v[1];

						return (
							<InputField
								fieldName={fieldName}
								value={(formData?.[fieldName] as InputFieldValue) ?? ''}
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
									error: Boolean(formError[fieldName]),
									helperText: formError[fieldName],
								}}
								fieldType={fieldProps.fieldType}
								addons={
									fieldName === 'personal_no' && (
										<FormControlLabel
											control={
												<Checkbox
													color='primary'
													size='small'
													onChange={(e) => {
														setFormData({
															...formData,
															personal_no: e.target.checked ? formData.mobile_no : '',
														});
														if (e.target.checked) {
															setFormError({
																...formError,
																[fieldName]: validateBasicDetailFields(
																	fieldName as keyof BasicDetailsFormRequest,
																	{ ...formData, [fieldName]: formData.mobile_no }
																),
															});
														}
													}}
												/>
											}
											label={
												<PoppinsTypography variant='subtitle1'>
													Same as Mobile Number
												</PoppinsTypography>
											}
										/>
									)
								}
								onChange={onChange}
							/>
						);
					})}
				</Grid>
				<Grid
					item
					xs={4}
					sx={{ textAlign: '-webkit-right' }}
				>
					<Uploader
						fieldName='fieldName'
						sx={{ placeContent: 'flex-end', width: 266, height: 266 }}
						onChange={(e) => {
							setFormData({
								...formData,
								profile_pic: e.target?.files as FileList,
							});
						}}
						file={formData?.profile_pic}
					>
						<IconFinder iconName='UploadPicture' />
					</Uploader>
				</Grid>
			</Grid>
			<NavigateButtons onNextClick={handleNextClick} />
		</Stack>
	);
};

export default memo(BasicDetailsForm);
