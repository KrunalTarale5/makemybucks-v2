import InputField, { InputFieldValue } from '@components/InputField';
import SubAdminWrapper from '@components/SubAdminWrapper';
import { PoppinsTypography } from '@components/Typography';
import {
	AddDocumentFormFields,
	AddDocumentRequest,
	AddRestaurantFormRequest,
	validateAddDocumentForm,
	validateAddDocunemtFields,
	AddRestaurantContext,
} from '@hooks/sub-admin-add-restaurant';
import { FieldProps, FormErrorMessage } from '@interfaces/common';
import { Stack, useTheme } from '@mui/material';
import { validateIsNumber } from '@utils/validator';
import { memo, useContext, useState } from 'react';

const intialFormData = (formData: AddRestaurantFormRequest): AddDocumentRequest => ({
	gst_no: formData.gst_no,
	pan_no: formData.pan_no,
	fssai_lic_no: formData.fssai_lic_no,
	fssai_lic_no_url_pic: formData.fssai_lic_no_url_pic,
	gst_no_url_pic: formData.gst_no_url_pic,
	pan_no_url_pic: formData.pan_no_url_pic,
	res_acc_holder_name: formData.res_acc_holder_name,
	bank_name: formData.bank_name,
	bank_acc_no: formData.bank_acc_no,
	ifsc_no: formData.ifsc_no,
});
const intialFormError: FormErrorMessage<AddDocumentRequest> = {
	gst_no: '',
	pan_no: '',
	fssai_lic_no: '',
	fssai_lic_no_url_pic: '',
	gst_no_url_pic: '',
	pan_no_url_pic: '',
	res_acc_holder_name: '',
	bank_name: '',
	bank_acc_no: '',
	ifsc_no: '',
};

const AddDocumentsForm = () => {
	const theme = useTheme();
	const formContext = useContext(AddRestaurantContext);

	const [formData, setFormData] = useState(intialFormData(formContext.formData));
	const [formError, setFormError] = useState(intialFormError);

	const onChange = (
		fieldName: string,
		value: InputFieldValue,
		fieldType: FieldProps['fieldType'],
		event?: any
	) => {
		let _formData: AddDocumentRequest = {} as AddDocumentRequest;
		if (fieldType === 'number') {
			const isNumber = validateIsNumber(String(value));
			if (fieldName === 'fssai_lic_no' && (value as string).length > 14) return;
			_formData = {
				...formData,
				[fieldName]: isNumber ? value : formData[fieldName as keyof AddDocumentRequest],
			};
		} else if (fieldType === 'upload') {
			_formData = {
				...formData,
				[fieldName]: event?.target?.files,
			};
		} else {
			if (fieldName === 'pan_no' || fieldName === 'gst_no') {
				value = (value as string)?.toUpperCase();
			}
			if (fieldName === 'ifsc_no') {
				value = (value as string)?.trim();
			}
			_formData = { ...formData, [fieldName]: value };
		}
		setFormData(_formData);
		setFormError({
			...formError,
			[fieldName]: validateAddDocunemtFields(fieldName as keyof AddDocumentRequest, _formData),
		});
	};

	const handleNextClick = () => {
		const validatation = validateAddDocumentForm(formData);
		if (validatation.hasError) {
			setFormError(validatation.errors);
			return;
		}
		formContext.setFormData({ ...formContext.formData, ...formData });
		formContext.setActiveStep(formContext.activeStep + 1);
	};

	const handleBackClick = () => {
		formContext.setActiveStep(formContext.activeStep - 1);
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
						Add Documents
					</PoppinsTypography>
					<PoppinsTypography
						variant='subtitle1'
						fontWeight={600}
						sx={{ color: theme.palette.common.primaryGreyText }}
					>
						Steps 2/4
					</PoppinsTypography>
				</Stack>

				<Stack gap={1.5}>
					{Object.entries(AddDocumentFormFields).map((v) => {
						const fieldName: keyof AddDocumentFormFields = v[0] as keyof AddDocumentFormFields;
						const fieldProps = v[1];

						return (
							<InputField
								showLabel={false}
								fieldName={fieldName}
								value={
									fieldName === 'fssai_lic_no_url_pic' ||
									fieldName === 'gst_no_url_pic' ||
									fieldName === 'pan_no_url_pic'
										? formData[fieldName]
											? URL.createObjectURL(formData[fieldName]?.[0])
											: ''
										: (formData[fieldName] as InputFieldValue) ?? ''
								}
								key={fieldName}
								fieldProps={{
									...fieldProps,
									color: 'primary',
									size: 'medium',
									fullWidth: true,
									error: Boolean(formError[fieldName]),
									helperText: formError[fieldName],
									sx: {
										'.uploader-container': {
											height: 164,
											borderStyle: 'solid',
											borderWidth: 1,
											borderRadius: 1,
											borderColor: `#C8CBD9`,
										},
									},
								}}
								fieldType={fieldProps.fieldType}
								onChange={onChange}
								addons={
									fieldName === 'fssai_lic_no_url_pic' && (
										<PoppinsTypography
											variant='subtitle1'
											fontWeight={600}
											textTransform={'uppercase'}
											paddingTop={4}
											sx={{ color: theme.palette.common.secondaryGreyText }}
										>
											bank account details
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

export default memo(AddDocumentsForm);
