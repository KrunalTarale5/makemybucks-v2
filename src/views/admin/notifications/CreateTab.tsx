import IconFinder from '@components/Icon';
import InputField, { InputFieldValue } from '@components/InputField';
import { PoppinsTypography } from '@components/Typography';
import Uploader from '@components/Uploader';
import {
	CreateNotificationFields,
	CreateNotificationFormData,
	useCreateNotificationApi,
	useGetAllNotificationByIdApi,
	useGetSelectCategoryListApi,
	validateCreateNotificationForm,
} from '@hooks/admin-notifications';
import { FormErrorMessage, Option } from '@interfaces/common';
import { LoadingButton } from '@mui/lab';
import { Stack, useTheme } from '@mui/material';
import { memo, useEffect, useState } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment, { Moment } from 'moment';
import { useSnackbar } from '@components/Snackbar';

const message_body_types: Option[] = [
	{ value: 'text', label: 'Text' },
	{
		value: 'image',
		label: 'Image',
	},
];

const message_types = [
	{
		value: 'instant',
		label: 'Instant',
	},
	{ value: 'schedule send', label: 'Schedule Send' },
];

const intialFormData: CreateNotificationFormData = {
	message_img: '',
	message_title: '',
	message_info_text: '',
	message_body_type: message_body_types[0],
	message_body: '',
	message_category: '',
	message_type: message_types[0],
	hr: '',
	min: '',
	ampm: '',
	ddmm: '',
};
const intialFormError: FormErrorMessage<Partial<CreateNotificationFormData>> = {
	message_img: '',
	message_title: '',
	message_info_text: '',
	message_body_type: '',
	message_body: '',
	message_category: '',
	message_type: '',
	hr: '',
	min: '',
	ampm: '',
	ddmm: '',
};

interface CreateTabProps {
	isToUpdate: string | false;
}

const CreateTab = (props: CreateTabProps) => {
	const theme = useTheme();
	const { showSnackbar, hideSnackbar } = useSnackbar();

	const CreateNotificationApi = useCreateNotificationApi(props.isToUpdate as string);
	const GetSelectCategoryListApi = useGetSelectCategoryListApi();
	const GetAllNotificationByIdApi = useGetAllNotificationByIdApi(props.isToUpdate as string);

	const [formData, setFormData] = useState(intialFormData);
	const [formError, setFormError] = useState(intialFormError);

	const onChange = (fieldName: string, value: InputFieldValue) => {
		const _formData = { ...formData, [fieldName]: value };
		setFormData(_formData);
		setFormError({
			...formError,
			[fieldName]: CreateNotificationFields(
				fieldName as keyof CreateNotificationFormData,
				_formData
			),
		});
	};

	const handleClick = () => {
		const validatation = validateCreateNotificationForm(formData);

		if (validatation.hasError) {
			setFormError(validatation.errors);
			return;
		}
		CreateNotificationApi.mutateAsync({
			request: {
				message_category: (formData.message_category as Option)?.value,
				message_info_text: formData.message_info_text,
				message_title: formData.message_title,
				message_body_type: (formData.message_body_type as Option)?.value,
				message_type: (formData.message_type as Option)?.value,
				...((formData.message_body_type as Option).value === 'text' && {
					message_body: formData.message_body,
				}),
				...((formData.message_body_type as Option).value === 'image' && {
					message_img: formData.message_img as FileList,
				}),
				...((formData.message_type as Option)?.value === 'schedule send' && {
					schedule_time: `${formData.ddmm} ${(formData.hr as Option)?.value}:${(
						formData.min as Option
					)?.value} ${(formData.ampm as Option)?.value}`,
				}),
			},
		})
			.then((response) => {
				showSnackbar({
					title: 'Success!',
					variant: 'sucess',
					content: response.data?.message,
					onCancel: () => hideSnackbar(),
				});
				setFormData(intialFormData);
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

	const data = GetAllNotificationByIdApi.data?.data.data;

	useEffect(() => {
		if (props.isToUpdate) {
			setFormData({
				message_category:
					{
						label:
							GetSelectCategoryListApi.data?.data.categoryData.find(
								(c) => c.msg_category_id === data?.message_category
							)?.message_category ?? '',
						value:
							GetSelectCategoryListApi.data?.data.categoryData.find(
								(c) => c.msg_category_id === data?.message_category
							)?.msg_category_id ?? '',
					} ?? '',
				message_info_text: data?.message_info_text ?? '',
				message_title: data?.message_title ?? '',
				message_body_type:
					message_body_types.find((m) => m.value === data?.message_body_type) ?? '',
				message_type: message_types.find((m) => m.value === data?.message_type) ?? '',
				message_body: data?.message_body ?? '',
				message_img: data?.message_img ?? '',
				hr: {
					label: data?.schedule_time ? String(moment(data?.schedule_time).hours() % 12) : '',
					value: data?.schedule_time ? String(moment(data?.schedule_time).hours() % 12) : '',
				},
				min: {
					label: data?.schedule_time ? String(moment(data?.schedule_time).minutes()) : '',
					value: data?.schedule_time ? String(moment(data?.schedule_time).minutes()) : '',
				},
				ampm: {
					label: data?.schedule_time ? String(moment(data?.schedule_time).format('A')) : '',
					value: data?.schedule_time ? String(moment(data?.schedule_time).format('A')) : '',
				},
				ddmm: data?.schedule_time ? moment(data?.schedule_time).format('MM-DD-YYYY') : '',
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.isToUpdate, data]);

	return (
		<Stack gap={6}>
			<Stack gap={3}>
				<PoppinsTypography
					variant='subtitle1'
					sx={{ color: theme.palette.common.secondaryGreyText }}
				>
					Create New Notification
				</PoppinsTypography>

				<Stack gap={1}>
					<InputField
						fieldName={'message_category'}
						value={formData.message_category}
						fieldProps={{
							placeholder: 'Select category',
							error: Boolean(formError['message_category']),
							helperText: formError['message_category'],
							size: 'medium',
							options: GetSelectCategoryListApi.data?.data.categoryData.map((o) => ({
								label: String(o.message_category),
								value: String(o.msg_category_id),
							})),
							sx: {
								'& .MuiOutlinedInput-notchedOutline': {
									borderColor: theme.palette.common.secondaryGreyText,
									borderRadius: `8px`,
								},
								'& .MuiInputBase-input': {
									height: 11,
								},
								'& .MuiInputBase-root': {
									width: 356,
								},
								'& .MuiTypography-subtitle1': {
									color: theme.palette.common.primaryGreyText,
								},
							},
						}}
						fieldType={'select'}
						onChange={onChange}
					/>
					<InputField
						showLabel={false}
						fieldName={'message_info_text'}
						value={formData.message_info_text}
						fieldProps={{
							placeholder: 'Information Text',
							size: 'medium',
							error: Boolean(formError['message_info_text']),
							helperText: formError['message_info_text'],
							sx: {
								'& .MuiOutlinedInput-notchedOutline': {
									borderColor: theme.palette.common.secondaryGreyText,
									borderRadius: `8px`,
								},
								'& .MuiInputBase-input': {
									height: 11,
								},
								'& .MuiInputBase-root': {
									width: 356,
								},
							},
						}}
						onChange={onChange}
					/>
				</Stack>
			</Stack>
			<Stack gap={1}>
				<InputField
					showLabel={false}
					fieldName={'message_title'}
					value={formData.message_title}
					fieldProps={{
						placeholder: 'Type Heading',
						size: 'medium',
						error: Boolean(formError['message_title']),
						helperText: formError['message_title'],
						sx: {
							'& .MuiOutlinedInput-notchedOutline': {
								borderColor: theme.palette.common.secondaryGreyText,
								borderRadius: `8px`,
							},
							'& .MuiInputBase-input': {
								height: 11,
							},
							'& .MuiInputBase-root': {
								width: 356,
							},
						},
					}}
					onChange={onChange}
				/>
				<InputField
					fieldName={'message_body_type'}
					value={formData.message_body_type}
					fieldProps={{
						placeholder: 'Select Body Type',
						error: Boolean(formError['message_body_type']),
						helperText: formError['message_body_type'],
						size: 'medium',
						options: message_body_types,
						sx: {
							'& .MuiOutlinedInput-notchedOutline': {
								borderColor: theme.palette.common.secondaryGreyText,
								borderRadius: `8px`,
							},
							'& .MuiInputBase-input': {
								height: 11,
							},
							'& .MuiInputBase-root': {
								width: 356,
							},
							'& .MuiTypography-subtitle1': {
								color: theme.palette.common.primaryGreyText,
							},
						},
					}}
					fieldType={'select'}
					onChange={onChange}
				/>
				{(formData.message_body_type as Option)?.value === 'image' ? (
					<Uploader
						fieldName='message_img'
						sx={{
							flexDirection: 'column',
							alignItems: 'center',
							placeContent: 'center',
							width: 356,
							height: 129,
							borderRadius: '8px',
							borderStyle: 'solid',
							borderWidth: '1px',
							borderColor: theme.palette.common.secondaryGreyText,
						}}
						file={formData.message_img}
						onChange={(event) => onChange('message_img', event.target.files as FileList)}
					>
						<IconFinder iconName='Upload' />
						<PoppinsTypography
							variant='subtitle1'
							sx={{ color: theme.palette.common.secondaryGreyText }}
						>
							Upload image
						</PoppinsTypography>
						<PoppinsTypography
							variant='caption'
							sx={{ color: theme.palette.common.secondaryGreyText }}
						>
							Max size 300KB
						</PoppinsTypography>
					</Uploader>
				) : (
					<InputField
						fieldName='message_body'
						value={formData.message_body}
						fieldProps={{
							placeholder: 'Type body text...',
							multiline: true,
							maxRows: 5,
							size: 'medium',
							sx: {
								'& .MuiInputBase-input': {
									height: `119px !important`,
									paddingX: `14px`,
									paddingY: `16px`,
									fontSize: '18px',
									color: theme.palette.common.primaryGreyText,
									fontFamily: 'Fira Sans',
									overflow: 'auto',
								},
								'& .MuiInputBase-root': {
									width: 356,
									padding: 0,
									borderRadius: '8px',
									borderColor: theme.palette.common.secondaryGreyText,
								},
							},
							error: Boolean(formError['message_body']),
							helperText: formError['message_body'],
						}}
						onChange={onChange}
					/>
				)}
			</Stack>
			<Stack gap={1}>
				<InputField
					fieldName={'message_type'}
					value={formData.message_type}
					fieldProps={{
						placeholder: 'Select Send Type',
						error: Boolean(formError['message_type']),
						helperText: formError['message_type'],
						size: 'medium',
						options: message_types,
						sx: {
							'& .MuiOutlinedInput-notchedOutline': {
								borderColor: theme.palette.common.secondaryGreyText,
								borderRadius: `8px`,
							},
							'& .MuiInputBase-input': {
								height: 11,
							},
							'& .MuiInputBase-root': {
								width: 356,
							},
							'& .MuiTypography-subtitle1': {
								color: theme.palette.common.primaryGreyText,
							},
						},
					}}
					fieldType={'select'}
					onChange={onChange}
				/>

				{(formData.message_type as Option)?.value === 'schedule send' && (
					<Stack
						flexDirection={'row'}
						gap={4}
						alignItems={'center'}
						//gap={4}
					>
						<LocalizationProvider dateAdapter={AdapterMoment}>
							<DemoContainer components={['DatePicker']}>
								<DatePicker
									format='DD/MM/YYYY'
									slotProps={{
										textField: {
											placeholder: 'DD/MM/YYYY',
											error: Boolean(formError['ddmm']),
											//	helperText: formError['ddmm'],
											/* InputProps: {
												endAdornment: <IconFinder iconName={'Calender'} />,
											}, */
										},
									}}
									onChange={(value: Moment | null) =>
										onChange('ddmm', value?.format('MM-DD-YYYY') as string)
									}
									sx={{
										'& .MuiOutlinedInput-notchedOutline': {
											borderColor: theme.palette.common.secondaryGreyText,
											borderRadius: `8px`,
											width: 146,
										},
										'& .MuiInputBase-input': {
											height: 11,
											width: 150,
										},
									}}
									value={moment(formData.ddmm)}
								/>
							</DemoContainer>
						</LocalizationProvider>

						<Stack
							flexDirection={'row'}
							gap={1}
						>
							<InputField
								showLabel={false}
								fieldName={'hr'}
								value={formData.hr}
								fieldProps={{
									placeholder: 'Hours',
									size: 'medium',
									error: Boolean(formError['hr']),
									//	helperText: formError['hr'],
									options: Array.from(Array(12).keys()).map((o) => ({
										label: String(o + 1),
										value: String(o + 1),
									})),
									sx: {
										'& .MuiOutlinedInput-notchedOutline': {
											borderColor: theme.palette.common.secondaryGreyText,
											borderRadius: `8px`,
											minWidth: `114px`,
										},
										'& .MuiInputBase-input': {
											height: 11,
										},
										'& .MuiAutocomplete-clearIndicator': {
											display: 'none',
										},
										'& .MuiAutocomplete-inputRoot': {
											minWidth: `114px`,
										},
									},
								}}
								fieldType={'select'}
								onChange={onChange}
							/>
							<InputField
								showLabel={false}
								fieldName={'min'}
								value={formData.min}
								fieldProps={{
									placeholder: 'Min',
									size: 'medium',
									error: Boolean(formError['min']),
									//		helperText: formError['min'],
									options: Array.from(Array(60).keys()).map((o) => ({
										label: String(o),
										value: String(o),
									})),
									sx: {
										'& .MuiOutlinedInput-notchedOutline': {
											borderColor: theme.palette.common.secondaryGreyText,
											borderRadius: `8px`,
											minWidth: `114px`,
										},
										'& .MuiInputBase-input': {
											height: 11,
										},
										'& .MuiAutocomplete-clearIndicator': {
											display: 'none',
										},
										'& .MuiAutocomplete-inputRoot': {
											minWidth: `114px`,
										},
									},
								}}
								fieldType={'select'}
								onChange={onChange}
							/>
						</Stack>
						<InputField
							showLabel={false}
							fieldName={'ampm'}
							value={formData.ampm}
							fieldProps={{
								placeholder: 'AM',
								size: 'medium',
								error: Boolean(formError['ampm']),
								//		helperText: formError['ampm'],
								options: ['AM', 'PM'].map((o) => ({
									label: o,
									value: o,
								})),
								sx: {
									paddingLeft: '10px',
									width: `73px`,
									'& .MuiOutlinedInput-notchedOutline': {
										borderColor: theme.palette.common.secondaryGreyText,
										borderRadius: `8px`,
									},
									'& .MuiInputBase-input': {
										height: 11,
									},
									'& .MuiAutocomplete-clearIndicator': {
										display: 'none',
									},
									'& .MuiAutocomplete-inputRoot': {
										width: `73px`,
									},
								},
							}}
							fieldType={'select'}
							onChange={onChange}
						/>
					</Stack>
				)}
			</Stack>
			<LoadingButton
				size='large'
				variant='contained'
				color='primary'
				sx={{
					width: 209,
					height: 51,
					borderRadius: '8px',
					marginTop: 10,
				}}
				onClick={handleClick}
				loading={GetSelectCategoryListApi.isLoading}
			>
				<PoppinsTypography variant='subtitle1'>
					{(formData.message_type as Option)?.value === 'schedule send' ? 'Save' : 'Send Now'}
				</PoppinsTypography>
			</LoadingButton>
		</Stack>
	);
};

export default memo(CreateTab);
