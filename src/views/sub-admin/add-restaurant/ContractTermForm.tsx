import InputField, { InputFieldValue } from '@components/InputField';
import SubAdminWrapper from '@components/SubAdminWrapper';
import { PoppinsTypography } from '@components/Typography';
import { useGetAgreementPeriodApi } from '@hooks/admin-master-list';
import {
	AddRestaurantFormRequest,
	ContractTermFormFields,
	ContractTermRequest,
	validateContractTermFields,
	validateContractTermForm,
	AddRestaurantContext,
} from '@hooks/sub-admin-add-restaurant';
import { FieldProps, FormErrorMessage, Option, WeekDays } from '@interfaces/common';
import { Button, Stack, useTheme } from '@mui/material';
import { validateIsMobileNumber, validateIsNumber } from '@utils/validator';
import { memo, useContext, useState } from 'react';

const intialFormData = (formData: AddRestaurantFormRequest): ContractTermRequest => ({
	owner_name: formData.owner_name,
	owner_no: formData.owner_no,
	owner_email: formData.owner_email,
	agreed_percentage: formData.agreed_percentage,
	agreement_period: formData.agreement_period,
	agreement_type: formData.agreement_type,
});

const intialFormError: FormErrorMessage<ContractTermRequest> = {
	owner_name: '',
	owner_no: '',
	owner_email: '',
	agreed_percentage: '',
	agreement_period: '',
	agreement_type: '',
};

const ContractTermForm = () => {
	const theme = useTheme();
	const formContext = useContext(AddRestaurantContext);

	const GetAgreementPeriodApi = useGetAgreementPeriodApi();

	const [formData, setFormData] = useState(intialFormData(formContext.formData));
	const [formError, setFormError] = useState(intialFormError);

	const [days, setDays] = useState<typeof WeekDays>(
		formContext.formData?.applicable_days ?? WeekDays
	);

	const onChange = (
		fieldName: string,
		value: InputFieldValue,
		fieldType: FieldProps['fieldType']
	) => {
		let _formData: ContractTermRequest = {} as ContractTermRequest;
		if (fieldType === 'number') {
			const isNumber = validateIsNumber(String(value));
			_formData = {
				...formData,
				[fieldName]: isNumber ? value : formData[fieldName as keyof ContractTermRequest],
			};
		} else if (fieldType === 'mobile-number') {
			const isNumber = validateIsMobileNumber(String(value));
			_formData = {
				...formData,
				[fieldName]: isNumber ? value : formData[fieldName as keyof ContractTermRequest],
			};
		} else {
			_formData = { ...formData, [fieldName]: value };
		}
		setFormData(_formData);
		setFormError({
			...formError,
			[fieldName]: validateContractTermFields(fieldName as keyof ContractTermRequest, _formData),
		});
	};

	const handleNextClick = () => {
		const validatation = validateContractTermForm(formData);
		if (validatation.hasError) {
			setFormError(validatation.errors);
			return;
		}
		formContext.setFormData({
			...formContext.formData,
			...formData,
			applicable_days: days,
		});
		formContext.setActiveStep(formContext.activeStep + 1);
	};

	const handleBackClick = () => {
		formContext.setActiveStep(formContext.activeStep - 1);
	};

	const getOptions = (fieldName: keyof ContractTermFormFields): Option[] | undefined => {
		switch (fieldName) {
			case 'agreement_period':
				return GetAgreementPeriodApi.data?.data.onbordingPeriodsData.map((r) => ({
					label: r.period,
					value: r.id,
				}));

			default:
				return Object.entries(ContractTermFormFields).find((v) => v[0] === fieldName)?.[1].options;
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
						Contract terms
					</PoppinsTypography>
					<PoppinsTypography
						variant='subtitle1'
						fontWeight={600}
						sx={{ color: theme.palette.common.primaryGreyText }}
					>
						Steps 3/4
					</PoppinsTypography>
				</Stack>

				<Stack gap={1.5}>
					{Object.entries(ContractTermFormFields).map((v) => {
						const fieldName: keyof ContractTermFormFields = v[0] as keyof ContractTermFormFields;
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
							/>
						);
					})}

					<PoppinsTypography
						variant='subtitle1'
						fontWeight={600}
						textTransform={'uppercase'}
						paddingTop={4}
						sx={{ color: theme.palette.common.secondaryGreyText }}
					>
						Applicable Days
					</PoppinsTypography>

					<Stack
						sx={{
							borderWidth: `1px`,
							borderStyle: 'solid',
							borderColor: '#C8CBD9',
							borderRadius: 1,
							gap: 2,
							padding: 2,
							flexDirection: 'row',
							flexFlow: 'wrap',
						}}
					>
						{Object.keys(WeekDays).map((d) => {
							return (
								<Button
									key={d}
									size='small'
									variant='contained'
									style={{
										backgroundColor: !days?.[d as WeekDays]
											? theme.palette.common.secondaryGreyText
											: theme.palette.primary.main,
									}}
									onClick={() => setDays({ ...days, [d]: !days?.[d as WeekDays] })}
								>
									<PoppinsTypography variant='caption'>
										{`${d[0].toUpperCase()}${d.slice(1)}`}
									</PoppinsTypography>
								</Button>
							);
						})}
					</Stack>
				</Stack>
			</Stack>
		</SubAdminWrapper>
	);
};

export default memo(ContractTermForm);
