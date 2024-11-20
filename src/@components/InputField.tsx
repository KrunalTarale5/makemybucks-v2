/* eslint-disable indent */
import { FC, ReactNode, memo, useEffect, useState } from 'react';
import {
	Stack,
	TextField,
	Typography,
	Autocomplete,
	AutocompleteChangeReason,
	Checkbox,
	MenuItem,
	InputAdornment,
	IconButton,
	useTheme,
	FormHelperText,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import { FieldProps, Option } from '@interfaces/common';
import IconFinder from './Icon';
import Uploader from './Uploader';
import { PoppinsTypography } from './Typography';
import { useIsOverflow } from '@hooks/common';
import { useLocation } from 'react-router-dom';
import { RESTAURANT_BASE_URL } from '@utils/common';

export type InputFieldValue = string | Option | Option[] | FileList;
export interface InputFieldProps {
	/**
	 * @default true
	 */
	showLabel?: boolean;
	/**
	 * @default text
	 */
	fieldType?: FieldProps['fieldType'];
	fieldName: string;
	value: InputFieldValue;
	onChange?: (
		fieldName: string,
		value: InputFieldValue,
		type?: InputFieldProps['fieldType'],
		event?: any
	) => void;
	fieldProps?: Omit<Partial<FieldProps>, 'fieldType' | 'onChange'>;
	labelProps?: Omit<Partial<FieldProps>, 'fieldType' | 'onChange'>;
	addons?: ReactNode;
}

const InputField: FC<InputFieldProps> = (props) => {
	const location = useLocation();
	const isoverlow = useIsOverflow(document.getElementById('admin-outlet'));
	const [isEyeOpen, setEyeOpen] = useState<boolean>(false);
	const theme = useTheme();
	const isRestaurantView = location.pathname.includes(`/${RESTAURANT_BASE_URL}/`);
	const [AutocompleteRef, setAutocompleteRef] = useState<HTMLElement | null>(null);
	const [getX, setX] = useState<number>(0);

	const get = () => {
		let x = 0;
		if (isoverlow) {
			x =
				Number(AutocompleteRef?.getBoundingClientRect().top) -
					Number(document.getElementById('autocomplete-popper')?.getBoundingClientRect().height) ??
				0;
		} else {
			x = Number(AutocompleteRef?.getBoundingClientRect().top) + 50 ?? 0;
		}
		return x;
	};

	useEffect(() => {
		if (AutocompleteRef) {
			setX(get());
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [AutocompleteRef]);

	return (
		<Stack
			gap={1}
			className='inputField-root'
			sx={{ position: 'relative', ...props.fieldProps?.sx }}
		>
			{props.showLabel !== false && (
				<Typography
					variant='subtitle1'
					display={'flex'}
					gap={0.5}
				>
					{props.fieldProps?.label}
					{props.fieldProps?.required && (
						<Typography
							className='required'
							variant='subtitle1'
							sx={{ color: theme.palette.error.main }}
						>
							*
						</Typography>
					)}
				</Typography>
			)}

			{props.fieldType === 'date' && (
				<LocalizationProvider dateAdapter={AdapterMoment}>
					<DemoContainer
						components={['DatePicker']}
						sx={{
							flexDirection: 'column-reverse !important',
							overflow: 'hidden',
							padding: 'inherit',
						}}
					>
						<DatePicker
							sx={{
								flex: 'auto',
								'.MuiInputBase-input': {
									paddingY: 1,
								},
							}}
							value={props.value}
							onChange={(e) => {
								props.onChange?.(
									props.fieldName,
									moment(e as moment.MomentInput).toISOString(),
									props.fieldType,
									e
								);
							}}
						/>
					</DemoContainer>
				</LocalizationProvider>
			)}
			{(props.fieldType === 'select' || props.fieldType === 'multple-select') && (
				<Autocomplete
					disabled={props.fieldProps?.disabled}
					multiple={props.fieldType === 'multple-select'}
					getOptionLabel={(option) => option.label ?? ''}
					options={props.fieldProps?.options ?? []}
					disableCloseOnSelect={props.fieldType === 'multple-select'}
					value={props.value as Option | Option[]}
					defaultValue={props.value as Option | Option[]}
					isOptionEqualToValue={(option, value) => option?.value === value?.value}
					renderOption={(_props, option, { selected }) => {
						return (
							<MenuItem
								{..._props}
								disableGutters
							>
								{props.fieldType === 'multple-select' && (
									<Checkbox
										checked={selected}
										sx={{ marginRight: 1 }}
									/>
								)}

								{option.label}
							</MenuItem>
						);
					}}
					renderInput={(params) => (
						<TextField
							{...params}
							size='small'
							{...props.fieldProps}
							name={props.fieldName}
							label=''
							onClick={(e) => setAutocompleteRef(e.currentTarget)}
						/>
					)}
					ChipProps={{
						color: 'primary',
						size: 'small',
					}}
					onChange={(
						event: React.SyntheticEvent,
						value: Option | Option[] | null,
						reason: AutocompleteChangeReason,
						details: any
					) => {
						props.onChange?.(props.fieldName, value as Option | Option[], props.fieldType, {
							event,
							reason,
							details,
						});
					}}
					onClose={() => setAutocompleteRef(null)}
					componentsProps={
						!location.pathname.includes('/sub-admin/')
							? {
									popper: {
										id: 'autocomplete-popper',
										className: 'delayedShow',
										sx: {
											maxHeight: '100px',
											visibility: 'hidden',
											inset: `0px auto auto 0px !important`,
											transform: `translate(${
												AutocompleteRef?.getBoundingClientRect().x ?? 0
											}px, ${getX}px) !important`,
										},
									},
							  }
							: undefined
					}
				/>
			)}
			{props.fieldType === 'upload' && (
				<>
					<Uploader
						fieldName={props.fieldName}
						sx={{ gap: 1.5, alignItems: 'center', placeContent: 'center' }}
						file={props.value as string}
						onChange={(e) => props.onChange?.(props.fieldName, e.target.value, props.fieldType, e)}
					>
						<IconFinder iconName='Upload' />
						<PoppinsTypography
							variant='subtitle1'
							sx={{ color: theme.palette.common.secondaryGreyText }}
						>
							Click to Upload
						</PoppinsTypography>
					</Uploader>
					{props.fieldProps?.helperText && (
						<FormHelperText
							sx={{ color: theme.palette.error.main, marginX: `14px`, marginTop: `4px` }}
						>
							{props.fieldProps?.helperText}
						</FormHelperText>
					)}
				</>
			)}
			{(props.fieldType === undefined ||
				props.fieldType === 'text' ||
				props.fieldType === 'number' ||
				props.fieldType === 'mobile-number') && (
				<TextField
					size='small'
					InputProps={{
						...(props.fieldProps?.type === 'password' && {
							endAdornment: (
								<InputAdornment position='end'>
									<IconButton
										size='small'
										onClick={() => setEyeOpen(!isEyeOpen)}
										sx={{
											color: 'white',
										}}
									>
										<IconFinder
											iconName={!isEyeOpen ? 'OpenEye' : 'CloseEye'}
											iconProps={{
												fill: isRestaurantView ? theme.palette.common.secondaryGreyText : 'white',
											}}
										/>
									</IconButton>
								</InputAdornment>
							),
						}),
					}}
					{...props.fieldProps}
					name={props.fieldName}
					value={props.value}
					onChange={(e) => {
						props.onChange?.(props.fieldName, e.target.value, props.fieldType, e);
					}}
					label=''
					type={props.fieldProps?.type === 'password' ? (isEyeOpen ? 'text' : 'password') : 'text'}
				/>
			)}
			{props.addons && props.addons}
		</Stack>
	);
};

export default memo(InputField);
