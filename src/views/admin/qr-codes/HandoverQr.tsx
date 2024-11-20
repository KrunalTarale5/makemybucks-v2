import InputField, { InputFieldValue } from '@components/InputField';
import { useSnackbar } from '@components/Snackbar';
import { PoppinsTypography } from '@components/Typography';
import {
	HandoverQrFields,
	HandoverQrRequest,
	useGetSelectExecutiveListApi,
	useHandoverQrApi,
	validateHandoverQrForm,
} from '@hooks/admin-qrcode';
import { FormErrorMessage, Option } from '@interfaces/common';
import { LoadingButton } from '@mui/lab';
import { Button, Stack, useTheme } from '@mui/material';
import { FC, memo, useState, useEffect, useRef } from 'react';

const BUTTONS = [50, 100, 200];

const intialFormData: HandoverQrRequest = {
	sub_admin_id: '',
	number: '',
};
const intialFormError: FormErrorMessage<Partial<HandoverQrRequest>> = {
	sub_admin_id: '',
};

interface HandoverQrProps {
	refetch: () => void;
}
const HandoverQr: FC<HandoverQrProps> = (props) => {
	const theme = useTheme();

	const { showSnackbar, hideSnackbar } = useSnackbar();

	const HandoverQrApi = useHandoverQrApi();
	const GetSelectExecutiveListApi = useGetSelectExecutiveListApi();

	const [formData, setFormData] = useState(intialFormData);
	const [formError, setFormError] = useState(intialFormError);

	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const filteredOptions = GetSelectExecutiveListApi.data?.data.subadmins_list?.filter((option: Option) =>
		option.label.toLowerCase().includes(searchTerm.toLowerCase())
	) || [];

	const handleExecutiveSelect = (value: string, label: string) => {
		onChange('sub_admin_id', { value, label });
		setSearchTerm(label);
		setIsOpen(false);
	};

	const onChange = (fieldName: string, value: InputFieldValue) => {
		const _formData = { ...formData, [fieldName]: value };
		setFormData(_formData);
		setFormError({
			...formError,
			[fieldName]: HandoverQrFields(fieldName as keyof HandoverQrRequest, _formData),
		});
	};

	const handleClick = () => {
		const validatation = validateHandoverQrForm(formData);
		if (validatation.hasError) {
			setFormError(validatation.errors);
			return;
		}
		HandoverQrApi.mutateAsync({
			request: { ...formData, sub_admin_id: (formData.sub_admin_id as Option)?.value },
		})
			.then((response) => {
				setFormData(intialFormData);
				showSnackbar({
					title: 'Success!',
					variant: 'sucess',
					content: response.data?.message,
					onCancel: () => hideSnackbar(),
				});
				props.refetch();
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
		<Stack gap={5}>
			<div ref={dropdownRef} style={{ position: 'relative' }}>
				<label
					htmlFor="sub_admin_id"
					style={{
						color: theme.palette.common.secondaryGreyText,
						display: 'block',
						marginBottom: '8px',
						fontSize: '14px',
						fontFamily: 'Poppins, sans-serif'
					}}
				>
					Select Executive
				</label>
				<div 
					onClick={() => setIsOpen(!isOpen)}
					style={{
						width: '30%',
						position: 'relative',
						cursor: 'pointer'
					}}
				>
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => {
							setSearchTerm(e.target.value);
							setIsOpen(true);
						}}
						onFocus={() => setIsOpen(true)}
						placeholder="Select Executive"
						style={{
							width: '100%',
							height: '40px',
							borderRadius: '8px',
							border: `1px solid #E0E0E0`,
							padding: '0 32px 0 12px',
							color: '#000',
							outline: 'none',
							fontSize: '14px',
							backgroundColor: '#fff',
							cursor: 'pointer',
							fontFamily: 'Poppins, sans-serif'
						}}
					/>
					<div style={{
						position: 'absolute',
						right: '12px',
						top: '50%',
						transform: `translateY(-50%) rotate(${isOpen ? '180deg' : '0deg'})`,
						transition: 'transform 0.2s ease',
						pointerEvents: 'none',
						fontSize: '10px',
						color: '#757575',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: '20px',
						height: '20px'
					}}>
						<svg 
							width="12" 
							height="8" 
							viewBox="0 0 12 8" 
							fill="none" 
							xmlns="http://www.w3.org/2000/svg"
						>
							<path 
								d="M1.41 0.295013L6 4.87501L10.59 0.295013L12 1.70501L6 7.70501L0 1.70501L1.41 0.295013Z"
								fill="#757575"
							/>
						</svg>
					</div>
				</div>
				
				{isOpen && (
					<div
						style={{
							position: 'absolute',
							top: 'calc(100% + 4px)',
							left: 0,
							width: '30%',
							maxHeight: '200px',
							overflowY: 'auto',
							backgroundColor: 'white',
							border: '1px solid #E0E0E0',
							borderRadius: '8px',
							zIndex: 1000,
							boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
							fontFamily: 'Poppins, sans-serif'
						}}
					>
						{filteredOptions.map((option: Option) => (
							<div
								key={option.value}
								onClick={() => handleExecutiveSelect(option.value, option.label)}
								style={{
									padding: '10px 12px',
									cursor: 'pointer',
									fontSize: '14px',
									color: '#000',
									transition: 'background-color 0.2s ease',
									backgroundColor: 'white',
									fontFamily: 'Poppins, sans-serif'
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.backgroundColor = '#f5f5f5';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.backgroundColor = 'white';
								}}
							>
								{option.label}
							</div>
						))}
						{filteredOptions.length === 0 && (
							<div style={{ 
								padding: '10px 12px', 
								color: '#666',
								fontSize: '14px',
								fontFamily: 'Poppins, sans-serif'
							}}>
								No results found
							</div>
						)}
					</div>
				)}

				{formError['sub_admin_id'] && (
					<div style={{ 
						color: 'red', 
						fontSize: '12px', 
						marginTop: '4px' 
					}}>
						{formError['sub_admin_id']}
					</div>
				)}
			</div>
			
			<Stack gap={1}>
				<PoppinsTypography
					variant='subtitle1'
					sx={{ color: theme.palette.common.secondaryGreyText }}
				>
					Select Your Number
				</PoppinsTypography>

				<Stack
					flexDirection={'row'}
					gap={1}
				>
					{BUTTONS.map((l, index) => (
						<Button
							key={index}
							size='large'
							variant={formData.number === String(l) ? 'contained' : 'outlined'}
							color='primary'
							sx={{
								...(formData.number === String(l) && { borderColor: '#DFE3ED' }),
								width: 100,
								height: 40,
								borderRadius: '8px',
							}}
							onClick={() => onChange('number', String(l))}
						>
							{l}
						</Button>
					))}
				</Stack>
			</Stack>
			<LoadingButton
				size='large'
				variant='contained'
				color='primary'
				sx={{
					width: 209,
					height: 51,
					borderRadius: '8px',
				}}
				onClick={handleClick}
				disabled={formData.number === '' || formData.sub_admin_id === ''}
				loading={HandoverQrApi.isLoading}
			>
				<PoppinsTypography variant='subtitle1'>Handover</PoppinsTypography>
			</LoadingButton>
		</Stack>
	);
};

export default memo(HandoverQr);
