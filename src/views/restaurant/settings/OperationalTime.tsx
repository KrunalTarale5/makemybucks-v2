/* eslint-disable indent */
import InputField, { InputFieldProps, InputFieldValue } from '@components/InputField';
import { useSnackbar } from '@components/Snackbar';
import SwitchButton from '@components/SwitchButton';
import { PoppinsTypography } from '@components/Typography';
import {
	OperationalTiming,
	RestaurentTimingRequest,
	useGetRestaurentTimingApi,
	useUpdateRestaurentTimingApi,
} from '@hooks/restaurant-settings';
import { Option, WeekDays } from '@interfaces/common';
import { LoadingButton } from '@mui/lab';
import { Chip, Stack, useTheme } from '@mui/material';

import { memo, useEffect, useState } from 'react';
const intialFormData: RestaurentTimingRequest = Object.keys(WeekDays)
	.map(() => ({
		days_status: false,
		opening_time: {
			hr: '',
			min: '',
			ampm: '',
		},
		closing_time: {
			hr: '',
			min: '',
			ampm: '',
		},
	}))
	.reduce(
		(obj, item, index) => ({
			...obj,
			[Object.keys(WeekDays)[index]]: item,
		}),
		{} as RestaurentTimingRequest
	);

function OperationalTime() {
	const theme = useTheme();
	const { showSnackbar, hideSnackbar } = useSnackbar();

	const GetRestaurentTimingApi = useGetRestaurentTimingApi();
	const UpdateRestaurentTimingApi = useUpdateRestaurentTimingApi();

	const [formData, setFormData] = useState(intialFormData);

	const onChange =
		(field: keyof RestaurentTimingRequest[WeekDays], day: WeekDays) =>
		(fieldName: string, value: InputFieldValue | boolean) => {
			if (field === 'days_status') {
				setFormData({
					...formData,
					[day]: {
						...formData[day],
						opening_time: GetRestaurentTimingApi.data?.data.restaurant_timing[day].opening_time,
						closing_time: GetRestaurentTimingApi.data?.data.restaurant_timing[day].closing_time,
						[field]: value,
					},
				});
			} else {
				setFormData({
					...formData,
					[day]: {
						...formData[day],
						[field]: {
							...(formData[day][field] as unknown as any),
							[fieldName]: (value as Option)?.value,
						},
					},
				});
			}
		};

	const onSave = () => {
		UpdateRestaurentTimingApi.mutateAsync({ request: formData })
			.then((response) => {
				showSnackbar({
					title: 'Success!',
					variant: 'sucess',
					content: response.data?.message,
					onCancel: () => hideSnackbar(),
				});
				void GetRestaurentTimingApi.refetch();
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

	useEffect(() => {
		setFormData(GetRestaurentTimingApi.data?.data.restaurant_timing ?? intialFormData);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [GetRestaurentTimingApi.dataUpdatedAt]);

	return (
		<>
			<Stack
				sx={{ flexDirection: 'row', justifyContent: 'space-evenly' }}
				gap={2}
			>
				<Stack
					flexBasis={'5%'}
					gap={4}
				>
					<PoppinsTypography
						variant='subtitle1'
						sx={{ color: theme.palette.common.secondaryGreyText }}
					>
						Status
					</PoppinsTypography>
					{Object.keys(WeekDays).map((d) => (
						<Stack
							height={44}
							key={d}
							justifyContent={'center'}
						>
							<SwitchButton
								checked={formData[d as WeekDays].days_status}
								onChange={(e) =>
									onChange('days_status', d as WeekDays)('days_status', e.target.checked)
								}
							/>
						</Stack>
					))}
				</Stack>
				<Stack
					flexBasis={'5%'}
					gap={4}
				>
					<PoppinsTypography
						variant='subtitle1'
						sx={{ color: theme.palette.common.secondaryGreyText }}
					>
						Day
					</PoppinsTypography>
					{Object.keys(WeekDays).map((d) => {
						return (
							<Chip
								key={d}
								label={
									<PoppinsTypography
										variant='subtitle1'
										fontWeight={600}
										sx={{
											color: formData[d as WeekDays].days_status
												? theme.palette.common.primaryGreyText
												: theme.palette.common.secondaryGreyText,
										}}
									>
										{`${d[0].toUpperCase()}${d.slice(1)}`}
									</PoppinsTypography>
								}
								variant='outlined'
								sx={{
									borderColor: theme.palette.common.secondaryGreyText,
									borderRadius: '12px',
									width: '110px',
									height: '44px',
								}}
							/>
						);
					})}
				</Stack>
				<Stack gap={4}>
					<PoppinsTypography
						variant='subtitle1'
						sx={{ color: theme.palette.common.secondaryGreyText }}
					>
						Opening Time
					</PoppinsTypography>
					{Object.keys(WeekDays).map((d) => {
						return (
							<TimeField
								key={d}
								day={d as WeekDays}
								onChange={onChange('opening_time', d as WeekDays)}
								value={formData[d as WeekDays].opening_time}
								preValue={
									GetRestaurentTimingApi.data?.data.restaurant_timing[d as WeekDays].opening_time
								}
								disabled={!formData[d as WeekDays].days_status}
							/>
						);
					})}
				</Stack>
				<Stack gap={4}>
					<PoppinsTypography
						variant='subtitle1'
						sx={{ color: theme.palette.common.secondaryGreyText }}
					>
						Closing Time
					</PoppinsTypography>
					{Object.keys(WeekDays).map((d) => {
						return (
							<TimeField
								key={d}
								day={d as WeekDays}
								onChange={onChange('closing_time', d as WeekDays)}
								value={formData[d as WeekDays].closing_time}
								preValue={
									GetRestaurentTimingApi.data?.data.restaurant_timing[d as WeekDays].closing_time
								}
								disabled={!formData[d as WeekDays].days_status}
							/>
						);
					})}
				</Stack>
				<Stack
					flexBasis={'10%'}
					alignSelf={'end'}
				>
					<LoadingButton
						variant='contained'
						size='large'
						color='primary'
						fullWidth
						sx={{ width: '328px', height: '56px' }}
						onClick={onSave}
						disabled={
							JSON.stringify(GetRestaurentTimingApi.data?.data.restaurant_timing) ===
							JSON.stringify(formData)
						}
						loading={UpdateRestaurentTimingApi.isLoading}
					>
						<PoppinsTypography variant='h5'>Save </PoppinsTypography>
					</LoadingButton>
				</Stack>
			</Stack>
		</>
	);
}

export default memo(OperationalTime);

interface TimeFieldProps {
	day: WeekDays;
	onChange: InputFieldProps['onChange'];
	value: OperationalTiming;
	preValue?: OperationalTiming;
	disabled: boolean;
}
function TimeField(props: TimeFieldProps) {
	const theme = useTheme();
	return (
		<>
			<Stack
				flexDirection={'row'}
				gap={4}
			>
				<InputField
					showLabel={false}
					fieldName={'hr'}
					value={{ label: String(props?.value?.hr ?? ''), value: String(props?.value?.hr ?? '') }}
					fieldProps={{
						placeholder: 'Hours',
						size: 'medium',
						options: Array.from(Array(12).keys()).map((o) => ({
							label: String(o + 1),
							value: String(o + 1),
						})),
						disabled: props.disabled,
						sx: {
							'& .MuiOutlinedInput-notchedOutline': {
								borderColor: theme.palette.common.secondaryGreyText,
								borderRadius: `12px`,
								minWidth: `114px`,
							},
							'& .MuiInputBase-input': {
								height: 11,
								fontWeight:
									String(props.preValue?.hr ?? '') === String(props?.value?.hr ?? '') ? 500 : 600,
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
					onChange={props.onChange}
				/>

				<InputField
					showLabel={false}
					fieldName={'min'}
					value={{ label: String(props?.value?.min ?? ''), value: String(props?.value?.min ?? '') }}
					fieldProps={{
						placeholder: 'Min',
						size: 'medium',
						options: Array.from(Array(60).keys()).map((o) => ({
							label: String(o),
							value: String(o),
						})),
						disabled: props.disabled,
						sx: {
							'& .MuiOutlinedInput-notchedOutline': {
								borderColor: theme.palette.common.secondaryGreyText,
								borderRadius: `12px`,
								minWidth: `114px`,
							},
							'& .MuiInputBase-input': {
								height: 11,
								fontWeight: String(props.preValue?.min) === String(props?.value?.min) ? 500 : 600,
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
					onChange={props.onChange}
				/>

				<InputField
					showLabel={false}
					fieldName={'ampm'}
					value={{ label: props?.value?.ampm, value: props?.value?.ampm }}
					fieldProps={{
						placeholder: 'AM',
						size: 'medium',
						options: ['AM', 'PM'].map((o) => ({
							label: o,
							value: o,
						})),
						disabled: props.disabled,
						sx: {
							paddingLeft: '10px',
							width: `73px`,
							'& .MuiOutlinedInput-notchedOutline': {
								borderColor: theme.palette.common.secondaryGreyText,
								borderRadius: `12px`,
							},
							'& .MuiInputBase-input': {
								height: 11,
								fontWeight: props.preValue?.ampm === props?.value?.ampm ? 500 : 600,
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
					onChange={props.onChange}
				/>
			</Stack>
		</>
	);
}
