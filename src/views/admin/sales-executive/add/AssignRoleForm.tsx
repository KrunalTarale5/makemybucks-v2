import DetailsTable from '@components/DetailsTable';
import InputField, { InputFieldValue } from '@components/InputField';
import { PoppinsTypography } from '@components/Typography';
import Uploader from '@components/Uploader';
import {
	AddSalesExecutiveContext,
	AddSalesExecutiveRequest,
	AssignRoleFormFields,
	AssignRoleFormRequest,
	addSubAdminApi,
	useGetAssignRolesApi,
	useGetWorkLocationApi,
	validateAssignRoleFields,
	validateAssignRoleForm,
} from '@hooks/admin-add-sales-executive';
import { FormErrorMessage, Option } from '@interfaces/common';
import { Grid, Stack, useTheme } from '@mui/material';
import { memo, useContext, useState, useEffect, useRef } from 'react';
import NavigateButtons from '../NavigateButtons';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '@components/Snackbar';
import { Autocomplete, TextField } from '@mui/material';

const intialFormData = (formData: AddSalesExecutiveRequest): AssignRoleFormRequest => ({
	assign_role: formData.assign_role as Option,
	assign_work_location: formData.assign_work_location as Option,
});

const intialFormError: FormErrorMessage<AssignRoleFormRequest> = {
	assign_role: '',
	assign_work_location: '',
};

const SearchableSelect = ({ 
	options, 
	value, 
	onChange, 
	placeholder, 
	error, 
	label 
}: {
	options: Option[];
	value: Option | null;
	onChange: (value: Option) => void;
	placeholder: string;
	error?: string;
	label?: string;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const wrapperRef = useRef<HTMLDivElement>(null);

	const filteredOptions = options?.filter(option =>
		option.label.toLowerCase().includes(searchTerm.toLowerCase())
	);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	return (
		<div style={{ marginBottom: '16px' }}>
			{label && (
				<label style={{ 
					display: 'block', 
					marginBottom: '8px', 
					color: '#6F6F6F', 
					fontSize: '14px', 
					fontFamily: 'Poppins' 
				}}>
					{label}
				</label>
			)}
			<div ref={wrapperRef} style={{ position: 'relative' }}>
				<div
					onClick={() => setIsOpen(!isOpen)}
					style={{
						width: '100%',
						padding: '10px 12px',
						fontSize: '14px',
						fontFamily: 'Poppins',
						borderRadius: '4px',
						border: `1px solid ${error ? '#d32f2f' : '#E0E0E0'}`,
						backgroundColor: 'white',
						cursor: 'pointer',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						color: value ? '#000' : '#9E9E9E',
					}}
				>
					<span style={{ 
						color: value ? '#000' : '#9E9E9E',
						opacity: value ? 1 : 0.7
					}}>
						{value ? value.label : placeholder}
					</span>
					<svg 
						width="16" 
						height="16" 
						viewBox="0 0 24 24" 
						fill="none" 
						stroke="currentColor" 
						strokeWidth="2"
						style={{
							transform: isOpen ? 'rotate(180deg)' : 'none',
							transition: 'transform 0.2s'
						}}
					>
						<polyline points="6 9 12 15 18 9"></polyline>
					</svg>
				</div>

				{isOpen && (
					<div style={{
						position: 'absolute',
						top: '100%',
						left: 0,
						right: 0,
						backgroundColor: 'white',
						border: '1px solid #E0E0E0',
						borderRadius: '4px',
						marginTop: '4px',
						boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
						zIndex: 1000,
						maxHeight: '250px',
						overflowY: 'auto'
					}}>
						<input
							type="text"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							onClick={(e) => e.stopPropagation()}
							placeholder="Search..."
							style={{
								width: '100%',
								padding: '8px',
								border: 'none',
								borderBottom: '1px solid #E0E0E0',
								outline: 'none',
								fontSize: '14px',
								fontFamily: 'Poppins',
								color: '#000'
							}}
						/>
						{filteredOptions?.length > 0 ? (
							filteredOptions.map((option) => (
								<div
									key={option.value}
									onClick={() => {
										onChange(option);
										setIsOpen(false);
										setSearchTerm('');
									}}
									className={`option ${value?.value === option.value ? 'selected' : ''}`}
									style={{ padding: '10px 12px' }}
								>
									{option.label}
								</div>
							))
						) : (
							<div style={{
								padding: '10px',
								color: '#9E9E9E',
								textAlign: 'center'
							}}>
								No options found
							</div>
						)}
					</div>
				)}
				{error && (
					<div style={{ 
						color: '#d32f2f', 
						fontSize: '12px',
						marginTop: '4px',
						fontFamily: 'Poppins'
					}}>
						{error}
					</div>
				)}
			</div>
		</div>
	);
};

const AssignRoleForm = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const { showSnackbar, hideSnackbar } = useSnackbar();

	const formContext = useContext(AddSalesExecutiveContext);
	const GetAssignRolesApi = useGetAssignRolesApi();
	const GetWorkLocationApi = useGetWorkLocationApi();

	const [formData, setFormData] = useState(intialFormData(formContext.formData));
	const [formError, setFormError] = useState(intialFormError);
	const [isLoading, setIsLoading] = useState(false);

	const onChange = (fieldName: string, value: InputFieldValue) => {
		let _formData: AssignRoleFormRequest = {} as AssignRoleFormRequest;
		_formData = { ...formData, [fieldName]: value };

		setFormData(_formData);
		setFormError({
			...formError,
			[fieldName]: validateAssignRoleFields(fieldName as keyof AssignRoleFormRequest, _formData),
		});
	};

	const handleCreateClick = () => {
		const validatation = validateAssignRoleForm(formData);
		if (validatation.hasError) {
			setFormError(validatation.errors);
			return;
		}
		setIsLoading(true);
		addSubAdminApi({
			...formContext.formData,
			assign_role: formData.assign_role.label,
			assign_work_location: formData.assign_work_location.label,
			local_state: (formContext.formData.local_state as Option)?.label,
			permanent_state: (formContext.formData.permanent_state as Option)?.label,
		})
			.then((response) => {
				showSnackbar({
					title: 'Success!',
					variant: 'sucess',
					content: response.data?.message,
					onCancel: () => hideSnackbar(),
				});
				navigate('/admin/subadmin');
				setIsLoading(false);
			})
			.catch((error) => {
				showSnackbar({
					title: 'Error!',
					variant: 'error',
					content: error.response?.data?.message,
					onCancel: () => hideSnackbar(),
				});
				setIsLoading(false);
			});
	};

	const handlePreviousClick = () => {
		formContext.setActiveStep(formContext.activeStep - 1);
	};

	const getOptions = (fieldName: keyof AssignRoleFormRequest): Option[] | undefined => {
		switch (fieldName) {
			case 'assign_role':
				return GetAssignRolesApi.data?.data.subAdminRolesData.map((r) => ({
					label: r.roles,
					value: r.id,
				}));

			case 'assign_work_location':
				return GetWorkLocationApi.data?.data.location_data.map?.((l) => ({
					label: l.location_name,
					value: l.id,
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
				<Stack
					flexBasis={`55%`}
					sx={{
						'& table': {
							borderCollapse: 'separate',
							borderSpacing: `0 24px`,
						},
						'& td': {
							minWidth: `200px`,
						},
						'& tr': {
							verticalAlign: 'top',
						},
					}}
				>
					<DetailsTable
						data={[
							// {
							// 	name: (
							// 		<PoppinsTypography
							// 			variant='subtitle1'
							// 			sx={{ color: theme.palette.common.secondaryGreyText }}
							// 		>{`ID:`}</PoppinsTypography>
							// 	),
							// 	value: (
							// 		<PoppinsTypography
							// 			variant='subtitle1'
							// 			sx={{ color: theme.palette.common.primaryGreyText }}
							// 		>
							// 			--
							// 		</PoppinsTypography>
							// 	),
							// 	showWhen: true,
							// },
							{
								name: (
									<PoppinsTypography
										variant='subtitle1'
										sx={{ color: theme.palette.common.secondaryGreyText }}
									>{`Name:`}</PoppinsTypography>
								),
								value: (
									<PoppinsTypography
										variant='subtitle1'
										sx={{ color: theme.palette.common.primaryGreyText }}
									>
										{`${formContext.formData.first_name} ${formContext.formData.last_name}`}
									</PoppinsTypography>
								),
								showWhen: true,
							},
							{
								name: (
									<PoppinsTypography
										variant='subtitle1'
										sx={{ color: theme.palette.common.secondaryGreyText }}
									>{`Email ID:`}</PoppinsTypography>
								),
								value: (
									<PoppinsTypography
										variant='subtitle1'
										sx={{ color: theme.palette.common.primaryGreyText }}
									>
										{formContext.formData.email}
									</PoppinsTypography>
								),
								showWhen: true,
							},
							{
								name: (
									<PoppinsTypography
										variant='subtitle1'
										sx={{ color: theme.palette.common.secondaryGreyText }}
									>{`Phone Number:`}</PoppinsTypography>
								),
								value: (
									<PoppinsTypography
										variant='subtitle1'
										sx={{ color: theme.palette.common.primaryGreyText }}
									>
										{formContext.formData.mobile_no}
									</PoppinsTypography>
								),
								showWhen: true,
							},
							{
								name: (
									<PoppinsTypography
										variant='subtitle1'
										sx={{ color: theme.palette.common.secondaryGreyText }}
									>{`Personal Number:`}</PoppinsTypography>
								),
								value: (
									<PoppinsTypography
										variant='subtitle1'
										sx={{ color: theme.palette.common.primaryGreyText }}
									>
										{formContext.formData.personal_no}
									</PoppinsTypography>
								),
								showWhen: true,
							},
							{
								name: (
									<PoppinsTypography
										variant='subtitle1'
										sx={{ color: theme.palette.common.secondaryGreyText }}
									>{`Local Address:`}</PoppinsTypography>
								),
								value: (
									<PoppinsTypography
										variant='subtitle1'
										sx={{ color: theme.palette.common.primaryGreyText }}
									>
										{`${formContext.formData.local_flat_no} ${
											formContext.formData.local_street_name
										} ${formContext.formData.local_city} ${(
											formContext.formData.local_state as Option
										)?.label} ${formContext.formData.local_pin_code} `}
									</PoppinsTypography>
								),
								showWhen: true,
							},
							{
								name: (
									<PoppinsTypography
										variant='subtitle1'
										sx={{ color: theme.palette.common.secondaryGreyText }}
									>{`Permanent Address:`}</PoppinsTypography>
								),
								value: (
									<PoppinsTypography
										variant='subtitle1'
										sx={{ color: theme.palette.common.primaryGreyText }}
									>
										{`${formContext.formData.permanent_flat_no} ${
											formContext.formData.permanent_street_name
										} ${formContext.formData.permanent_city} ${(
											formContext.formData.permanent_state as Option
										)?.label} ${formContext.formData.permanent_pin_code}`}
									</PoppinsTypography>
								),
								showWhen: true,
							},
							{
								name: (
									<PoppinsTypography
										variant='subtitle1'
										sx={{ color: theme.palette.common.secondaryGreyText }}
									>{`Aadhar Number:`}</PoppinsTypography>
								),
								value: (
									<PoppinsTypography
										variant='subtitle1'
										sx={{ color: theme.palette.common.primaryGreyText }}
									>
										{formContext.formData.aadhar_no}
									</PoppinsTypography>
								),
								showWhen: true,
							},
						]}
					/>
					<Grid
						container
						spacing={4}
					>
						<Grid
							item
							xs={10}
							display={'inline-grid'}
							gridTemplateColumns={`1fr 1fr`}
							rowGap={3}
							columnGap={2}
						>
							{Object.entries(AssignRoleFormFields).map((v) => {
								const fieldName: keyof AssignRoleFormFields = v[0] as keyof AssignRoleFormFields;
								const fieldProps = v[1];

								return (
									<div key={fieldName} style={{ marginBottom: '16px' }}>
										<SearchableSelect
											options={getOptions(fieldName) || []}
											value={formData[fieldName] as Option}
											onChange={(option) => onChange(fieldName, option)}
											placeholder={`Select ${fieldProps.label}`}
											error={formError[fieldName]}
											label={typeof fieldProps.label === 'string' ? fieldProps.label : String(fieldProps.label)}
											// style={{ width: '100%' }}
										/>
									</div>
								);
							})}
						</Grid>
					</Grid>
				</Stack>

				<Stack flexBasis={`45%`}>
					<Grid
						item
						xs={4}
						sx={{ textAlign: '-webkit-center' }}
					>
						<Uploader
							fieldName='fieldName'
							sx={{ placeContent: 'flex-end', width: 266, height: 266 }}
							file={
								formContext.formData.profile_pic
									? URL.createObjectURL(formContext.formData.profile_pic[0])
									: ''
							}
						/>
					</Grid>
				</Stack>
			</Stack>
			<NavigateButtons
				loading={isLoading}
				onCreateClick={handleCreateClick}
				onPreviousClick={handlePreviousClick}
			/>
		</Stack>
	);
};

export default memo(AssignRoleForm);
