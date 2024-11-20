import { useAlertDialog } from '@components/AlertDialog';
import IconFinder from '@components/Icon';
import InputField, { InputFieldValue } from '@components/InputField';
import SubAdminSuccess from '@components/SubAdminSuccess';
import SubAdminWrapper from '@components/SubAdminWrapper';
import { PoppinsTypography } from '@components/Typography';
import {
	AddQrRequest,
	useAssignQrIdApi,
	useGetSubAdminRestaurants,
	validateQrFields,
	validateQrForm,
} from '@hooks/sub-admin-qr';
import { FormErrorMessage, Option } from '@interfaces/common';
import { Button, Stack, useTheme } from '@mui/material';
import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type AddQr = { additionalQr: string };

const intialFormData: AddQrRequest = {
	restaurant_id: '',
	qr_ids: [],
	primary_qr: '',
};

const intialFormError: FormErrorMessage<Partial<AddQrRequest>> = {
	restaurant_id: '',
	primary_qr: '',
};

const AssignQr = () => {
	const theme = useTheme();
	const { showAlertDialog, hideAlertDialog } = useAlertDialog();

	const AssignQrIdApi = useAssignQrIdApi();
	const GetSubAdminRestaurants = useGetSubAdminRestaurants();

	const [addQrInputFields, setAddQrInputFields] = useState<AddQr[]>([
		{
			additionalQr: '',
		},
	]);

	const [formData, setFormData] = useState(intialFormData);

	const [formError, setFormError] = useState(intialFormError);
	const navigate = useNavigate();

	const onChange = (fieldName: string, value: InputFieldValue) => {
		let _formData = { ...formData, [fieldName]: value };
		if (fieldName === 'restaurant_id') {
			_formData = {
				..._formData,
				primary_qr:
					GetSubAdminRestaurants.data?.data.restaurant_list?.find(
						(r) => r.restaurant_id === (value as Option)?.value
					)?.primary_qr ?? '',
			};
		}
		setFormData(_formData);
		setFormError({
			...formError,
			[fieldName]: validateQrFields(fieldName as keyof AddQrRequest, _formData),
		});
	};

	const onChangeAdditional = (index: number) => (fieldName: string, value: InputFieldValue) => {
		const updatedState = addQrInputFields.map((v, i: number) => {
			if (i === index) {
				return { ...v, [fieldName]: value };
			} else {
				return v;
			}
		});
		setAddQrInputFields(updatedState);
	};

	const handleNextClick = () => {
		const validatation = validateQrForm(formData);
		if (validatation.hasError) {
			setFormError(validatation.errors);
			return;
		}

		const qrs = addQrInputFields.map((a) => a.additionalQr);

		AssignQrIdApi.mutateAsync({
			request: {
				...(!GetSubAdminRestaurants.data?.data.restaurant_list?.find(
					(r) => r.restaurant_id === (formData.restaurant_id as Option)?.value
				)?.primary_qr && { primary_qr: formData.primary_qr }),
				qr_ids: qrs,
				restaurant_id: (formData.restaurant_id as Option)?.value,
			},
		}).catch((error) => {
			showAlertDialog({
				content: (
					<PoppinsTypography variant='subtitle2'>
						{error?.response?.data?.message}
					</PoppinsTypography>
				),
				buttons: [
					{
						children: 'ok',
						variant: 'outlined',
						callback: () => {
							hideAlertDialog();
						},
					},
				],
			});
		});
	};

	const handleBackToHome = () => {
		navigate(`/sub-admin/qr/dashboard`);
	};

	const handleBackClick = () => {
		navigate(-1);
	};

	const handleAddInput = () => {
		setAddQrInputFields([...addQrInputFields, { additionalQr: '' }]);
	};

	return (
		<SubAdminWrapper
			heading={'Assign QR'}
			controlButtonProps={{
				loading: AssignQrIdApi.isLoading,
				content: AssignQrIdApi.isSuccess ? `Back to Home` : `Assign`,
				onClick: AssignQrIdApi.isSuccess ? handleBackToHome : handleNextClick,
				disabled:
					Boolean(
						GetSubAdminRestaurants.data?.data.restaurant_list?.find(
							(r) => r.restaurant_id === (formData.restaurant_id as Option)?.value
						)?.primary_qr
					) && !addQrInputFields[0].additionalQr,
			}}
			handleBack={handleBackClick}
		>
			<>
				{AssignQrIdApi.isSuccess ? (
					<SubAdminSuccess heading='QR Assigned Successfully!' />
				) : (
					<Stack>
						<Stack gap={2}>
							<InputField
								fieldName={'restaurant_id'}
								value={formData.restaurant_id}
								fieldProps={{
									size: 'medium',
									placeholder: 'Select or Type Restaurant',
									options: GetSubAdminRestaurants.data?.data.restaurant_list?.map((r) => ({
										label: r.restaurant_name,
										value: r.restaurant_id,
									})),
									error: Boolean(formError['restaurant_id']),
									helperText: formError['restaurant_id'],
								}}
								fieldType='select'
								onChange={onChange}
							></InputField>

							<PoppinsTypography
								variant='h6'
								fontWeight={600}
							>
								{
									GetSubAdminRestaurants.data?.data.restaurant_list?.find(
										(r) => r.restaurant_id === (formData.restaurant_id as Option)?.value
									)?.restaurant_name
								}
								<PoppinsTypography
									variant='subtitle1'
									sx={{ color: theme.palette.common.primaryGreyText }}
								>
									{
										GetSubAdminRestaurants.data?.data.restaurant_list?.find(
											(r) => r.restaurant_id === (formData.restaurant_id as Option)?.value
										)?.address
									}
								</PoppinsTypography>
							</PoppinsTypography>
						</Stack>

						<Stack paddingTop={10}>
							<PoppinsTypography
								variant='subtitle1'
								fontWeight={600}
								textTransform={'uppercase'}
								sx={{ color: theme.palette.common.secondaryGreyText }}
							>
								Primary QR
							</PoppinsTypography>
							<InputField
								fieldName={'primary_qr'}
								value={formData.primary_qr}
								fieldProps={{
									disabled: Boolean(
										GetSubAdminRestaurants.data?.data.restaurant_list?.find(
											(r) => r.restaurant_id === (formData.restaurant_id as Option)?.value
										)?.primary_qr
									),
									size: 'medium',
									placeholder: 'Enter Unique QR  ID',
									error: Boolean(formError['primary_qr']),
									helperText: formError['primary_qr'],
								}}
								onChange={onChange}
							/>
							<Stack paddingTop={5}>
								{addQrInputFields.map((v: { additionalQr: InputFieldValue }, index: number) => {
									return (
										<InputField
											key={index}
											fieldName={`additionalQr`}
											value={v.additionalQr}
											fieldProps={{
												size: 'medium',
												placeholder: 'Enter Unique QR  ID',
											}}
											onChange={onChangeAdditional(index)}
											addons={
												addQrInputFields.length === index + 1 && (
													<Button
														variant='text'
														size='small'
														sx={{ paddingX: 0, alignSelf: 'self-start' }}
														onClick={handleAddInput}
														startIcon={
															<IconFinder
																iconName='Add'
																iconProps={{ fill: theme.palette.common.primaryGreyText }}
															/>
														}
													>
														<PoppinsTypography
															variant='subtitle1'
															sx={{ color: theme.palette.common.primaryGreyText }}
														>
															Click to Add Additional QR
														</PoppinsTypography>
													</Button>
												)
											}
										/>
									);
								})}
							</Stack>
						</Stack>
					</Stack>
				)}
			</>
		</SubAdminWrapper>
	);
};

export default memo(AssignQr);
