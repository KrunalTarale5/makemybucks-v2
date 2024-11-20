import DetailsTable from '@components/DetailsTable';
import { PoppinsTypography } from '@components/Typography';
import Uploader from '@components/Uploader';
import { Box, Button, Menu, MenuItem, Stack, Tab, Tabs, useTheme } from '@mui/material';
import React, { memo, useEffect, useState } from 'react';
import OtherDetailTab from './OtherDetailTab';
import IconFinder from '@components/Icon';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
	RestaurentsDetailsResponse,
	useChangeRestaurantStatusApi,
	useGetRestaurentsDetailsApi,
	useGetRestaurentsOtherDetailApi,
	useUpdateRestaurantDetailsApi,
	validateAddRestoFields,
	validateAddRestoForm,
} from '@hooks/admin-restaurant-management';
import { useRestaurantStatus } from '@hooks/common';
import { FieldProps, RestaurantStatus } from '@interfaces/common';
import InputField, { InputFieldValue } from '@components/InputField';
import { useSnackbar } from '@components/Snackbar';
import { BannerInformation, useBannerInfo } from '@hooks/admin-banner-info';
import TransactionHistoryTab from './TransactionHistoryTab';
import MenuDetailTab from './MenuDetailTab';
import moment from 'moment';
import { validateIsMobileNumber } from '@utils/validator';

const TABS = ['Transaction history', 'Other Details', 'Menu Details'];

const RestaurantDetails = () => {
	const location = useLocation();
	const isToUpdate = location.pathname.includes('/admin/restaurants/update/');
	useBannerInfo(
		isToUpdate
			? BannerInformation.restaurantManagementUpdate
			: BannerInformation.restaurantManagement
	);
	const theme = useTheme();
	const getStatus = useRestaurantStatus();

	const navigate = useNavigate();
	const { showSnackbar, hideSnackbar } = useSnackbar();

	const { id } = useParams() as { id: string };
	const ChangeRestaurantStatusApi = useChangeRestaurantStatusApi();

	const GetRestaurentsDetailsApi = useGetRestaurentsDetailsApi(id);
	const GetRestaurentsOtherDetailApi = useGetRestaurentsOtherDetailApi(id);
	const details: RestaurentsDetailsResponse = GetRestaurentsDetailsApi.data?.data
		.data as RestaurentsDetailsResponse;

	const UpdateRestaurantDetailsApi = useUpdateRestaurantDetailsApi();

	const [value, setValue] = useState(1);
	const [StatusAnchorEl, setStatusAnchorEl] = useState<HTMLElement | null>(null);

	const [formData, setFormData] = useState<Partial<RestaurentsDetailsResponse>>({
		manager_name: '',
		manager_no: '',
	});
	const [formError, setFormError] = useState<Partial<RestaurentsDetailsResponse>>({
		manager_name: '',
		manager_no: '',
	});

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};
	const status = getStatus(details?.status);

	const handleStatusChange = (status: string) => () => {
		ChangeRestaurantStatusApi.mutateAsync({
			request: {
				restaurant_id: id,
				status: status.toLowerCase(),
			},
		})
			.then((response) => {
				showSnackbar({
					title: 'Success!',
					variant: 'sucess',
					content: response.data?.message,
					onCancel: () => hideSnackbar(),
				});
				void GetRestaurentsDetailsApi.refetch();
				setStatusAnchorEl(null);
				void GetRestaurentsDetailsApi.refetch();
				void GetRestaurentsOtherDetailApi.refetch();
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

	const onChange = (
		fieldName: string,
		value: InputFieldValue,
		fieldType: FieldProps['fieldType']
	) => {
		let _formData: Partial<RestaurentsDetailsResponse> = {} as Partial<RestaurentsDetailsResponse>;
		if (fieldType === 'mobile-number') {
			const isNumber = validateIsMobileNumber(String(value));
			_formData = {
				...formData,
				[fieldName]: isNumber
					? value
					: formData[fieldName as keyof Partial<RestaurentsDetailsResponse>],
			};
		} else {
			_formData = { ...formData, [fieldName]: value };
		}
		setFormData(_formData);
		setFormError({
			...formError,
			[fieldName]: validateAddRestoFields(
				fieldName as keyof Partial<RestaurentsDetailsResponse>,
				_formData
			),
		});
	};

	const handelOnUpdate = (data?: { owner_email: string; offer_list: string }) => {
		const validatation = validateAddRestoForm(formData);
		if (validatation.hasError) {
			setFormError(validatation.errors as Partial<RestaurentsDetailsResponse>);
			return;
		}
		UpdateRestaurantDetailsApi.mutateAsync({
			request: { ...formData, ...(data?.owner_email && { ...data }) },
			id,
		})
			.then((response) => {
				showSnackbar({
					title: 'Success!',
					variant: 'sucess',
					content: response.data?.message,
					onCancel: () => hideSnackbar(),
				});
				void GetRestaurentsDetailsApi.refetch();
				void GetRestaurentsOtherDetailApi.refetch();
				navigate(`/admin/restaurants/${id}`);
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
		setFormData({
			manager_name: details?.manager_name ?? '',
			manager_no: details?.manager_no ?? '',
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [GetRestaurentsDetailsApi.isSuccess]);

	const handleDisable = (status: RestaurantStatus) => {
		if (status === '5') {
			if (details?.status === '1' || details?.status === '3' || details?.status === '4')
				return true;
			return false;
		}
		if (status === '4') {
			if (details?.status === '5') return true;
			return false;
		}
		if (status === '3') {
			if (details?.status === '1' || details?.status === '2') return false;
		}

		return true;
	};

	return (
		<Stack
			gap={2}
			flexGrow={1}
		>
			<Stack
				display={'flex'}
				sx={{
					background: '#F4F5F8',
					borderRadius: '8px',
					borderStyle: 'solid',
					borderColor: '#DFE3ED',
					borderWidth: '1px',
					width: '100%',
					paddingBottom: 3,
				}}
			>
				<Stack
					gap={5}
					flexDirection={'row'}
					sx={{ paddingTop: 2, paddingLeft: 3, paddingBottom: 2 }}
				>
					<Uploader
						fieldName='fieldName'
						sx={{
							placeContent: 'flex-end',
							width: 104,
							height: 104,
							paddingTop: 1,
							borderRadius: 1,
						}}
						file={details?.restaurant_profile ?? ''}
						children={
							<PoppinsTypography
								flex={'auto'}
								alignSelf={'center'}
								textAlign={'center'}
								variant='h2'
								fontWeight={600}
							>
								{details?.restaurant_name?.charAt(0)}
							</PoppinsTypography>
						}
					/>

					<Stack
						gap={15}
						flexDirection={'row'}
						flexGrow={1}
					>
						<Stack
							sx={{
								width: `25%`,
								'& table': {
									borderCollapse: 'separate',
									borderSpacing: `0 4px`,
								},
								'& tr': {
									verticalAlign: 'top',
								},
								'& .tdValue': {
									paddingLeft: `12px`,
								},
							}}
						>
							<DetailsTable
								data={[
									{
										name: (
											<Stack
												flexDirection={'row'}
												gap={`12px`}
												justifyContent={'space-between'}
											>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.secondaryGreyText }}
												>{`Name `}</PoppinsTypography>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.secondaryGreyText }}
												>{`:`}</PoppinsTypography>
											</Stack>
										),
										value: (
											<PoppinsTypography
												variant='subtitle1'
												sx={{ color: theme.palette.common.primaryGreyText }}
											>
												{`${details?.restaurant_name ?? ''}`}
											</PoppinsTypography>
										),
										showWhen: true,
									},
									{
										name: (
											<Stack
												flexDirection={'row'}
												gap={`12px`}
												justifyContent={'space-between'}
											>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.secondaryGreyText }}
												>{`ID `}</PoppinsTypography>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.secondaryGreyText }}
												>{`:`}</PoppinsTypography>
											</Stack>
										),
										value: (
											<PoppinsTypography
												variant='subtitle1'
												sx={{ color: theme.palette.common.primaryGreyText }}
											>
												{`${details?.restaurant_id ?? ''}`}
											</PoppinsTypography>
										),
										showWhen: true,
									},
									{
										name: (
											<Stack
												flexDirection={'row'}
												gap={`12px`}
												justifyContent={'space-between'}
											>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.secondaryGreyText }}
												>{`Status `}</PoppinsTypography>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.secondaryGreyText }}
												>{`:`}</PoppinsTypography>
											</Stack>
										),
										value: (
											<>
												<Button
													variant='outlined'
													size='small'
													endIcon={<IconFinder iconName='ChevronDown' />}
													sx={{
														minWidth: 200,
														justifyContent: 'space-between',
														borderColor: theme.palette.common.secondaryGreyText,
														paddingY: 0,
													}}
													onClick={(e) => setStatusAnchorEl(e.currentTarget)}
												>
													<PoppinsTypography
														variant='subtitle1'
														sx={status.sx}
													>
														{status.lable}
													</PoppinsTypography>
												</Button>
												<Menu
													anchorEl={StatusAnchorEl}
													open={Boolean(StatusAnchorEl)}
													onClose={() => setStatusAnchorEl(null)}
													anchorOrigin={{
														vertical: 'top',
														horizontal: 'left',
													}}
													transformOrigin={{
														vertical: 'top',
														horizontal: 'left',
													}}
													sx={{
														'.MuiMenu-paper': {
															width: StatusAnchorEl?.getBoundingClientRect().width,
															top: '327px !important',
															left: '540px !important'
														},
														'.MuiPaper-root': {
															width: 'auto',
														}
													}}
												>
													{Object.keys(RestaurantStatus)
														.filter((s) => s !== '0')
														.map((s) => (
															<MenuItem
																key={s}
																disabled={handleDisable(s as RestaurantStatus)}
																onClick={handleStatusChange(
																	RestaurantStatus[s as RestaurantStatus]
																)}
															>
																{getStatus(s as RestaurantStatus).lable}
															</MenuItem>
														))}
												</Menu>
											</>
										),
										showWhen: true,
									},
								]}
							/>
						</Stack>
						<Stack
							sx={{
								width: `25%`,
								'& table': {
									borderCollapse: 'separate',
									borderSpacing: `0 4px`,
								},
								'& tr': {
									verticalAlign: 'top',
								},
								'& .tdValue': {
									paddingLeft: `12px`,
								},
							}}
						>
							<DetailsTable
								data={[
									{
										name: (
											<Stack
												flexDirection={'row'}
												gap={`12px`}
												justifyContent={'space-between'}
											>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.secondaryGreyText }}
												>{`Contact No `}</PoppinsTypography>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.secondaryGreyText }}
												>{`:`}</PoppinsTypography>
											</Stack>
										),
										value: isToUpdate ? (
											<InputField
												showLabel={false}
												fieldName='manager_no'
												value={formData?.manager_no ?? ''}
												fieldType='mobile-number'
												fieldProps={{
													color: 'secondary',
													fullWidth: true,
													sx: {
														'.MuiOutlinedInput-input': {
															paddingY: 1,
														},
														'.MuiInputBase-input': {
															height: 15,
															fontSize: 14,
														},
													},
													error: Boolean(formError.manager_no),
													helperText: formError.manager_no,
												}}
												onChange={onChange}
											/>
										) : (
											<PoppinsTypography
												variant='subtitle1'
												sx={{ color: theme.palette.common.primaryGreyText }}
											>
												{`${details?.manager_no ?? ''}`}
											</PoppinsTypography>
										),
										showWhen: true,
									},
									{
										name: (
											<Stack
												flexDirection={'row'}
												gap={`12px`}
												justifyContent={'space-between'}
											>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.secondaryGreyText }}
												>{`Name `}</PoppinsTypography>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.secondaryGreyText }}
												>{`:`}</PoppinsTypography>
											</Stack>
										),
										value: isToUpdate ? (
											<InputField
												showLabel={false}
												fieldName='manager_name'
												value={formData?.manager_name ?? ''}
												fieldProps={{
													color: 'secondary',
													fullWidth: true,
													sx: {
														'.MuiOutlinedInput-input': {
															paddingY: 1,
														},
														'.MuiInputBase-input': {
															height: 15,
															fontSize: 14,
														},
													},
													error: Boolean(formError.manager_name),
													helperText: formError.manager_name,
												}}
												onChange={onChange}
											/>
										) : (
											<PoppinsTypography
												variant='subtitle1'
												sx={{ color: theme.palette.common.primaryGreyText }}
											>
												{`${details?.manager_name ?? ''}`}
											</PoppinsTypography>
										),
										showWhen: true,
									},
									{
										name: (
											<Stack
												flexDirection={'row'}
												gap={`12px`}
												justifyContent={'space-between'}
											>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.secondaryGreyText }}
												>{`Added By  `}</PoppinsTypography>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.secondaryGreyText }}
												>{`:`}</PoppinsTypography>
											</Stack>
										),
										value: (
											<PoppinsTypography
												variant='subtitle1'
												sx={{ color: theme.palette.common.primaryGreyText }}
											>
												{`${details?.added_by ?? ''}`}
											</PoppinsTypography>
										),
										showWhen: true,
									},
								]}
							/>
						</Stack>

						<Stack
							sx={{
								width: `25%`,
								'& table': {
									borderCollapse: 'separate',
									borderSpacing: `0 4px`,
								},
								'& tr': {
									verticalAlign: 'top',
								},
								'& .tdValue': {
									paddingLeft: `12px`,
								},
							}}
						>
							<DetailsTable
								data={[
									{
										name: (
											<Stack
												flexDirection={'row'}
												gap={`12px`}
												justifyContent={'space-between'}
											>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.secondaryGreyText }}
												>{`OBD  `}</PoppinsTypography>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.secondaryGreyText }}
												>{`:`}</PoppinsTypography>
											</Stack>
										),
										value: (
											<PoppinsTypography
												variant='subtitle1'
												sx={{ color: theme.palette.common.primaryGreyText }}
											>
												{details?.OBD ? moment(details.OBD).format('DD MMM YY') : `--`}
											</PoppinsTypography>
										),
										showWhen: true,
									},
									{
										name: (
											<Stack
												flexDirection={'row'}
												gap={`12px`}
												justifyContent={'space-between'}
											>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.secondaryGreyText }}
												>{`Location  `}</PoppinsTypography>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.secondaryGreyText }}
												>{`:`}</PoppinsTypography>
											</Stack>
										),
										value: (
											<PoppinsTypography
												variant='subtitle1'
												sx={{ color: theme.palette.common.primaryGreyText }}
											>
												{`${details?.location ?? ''}`}
											</PoppinsTypography>
										),
										showWhen: true,
									},
									{
										name: (
											<Stack
												flexDirection={'row'}
												gap={`12px`}
												justifyContent={'space-between'}
											>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.secondaryGreyText }}
												>{`Address  `}</PoppinsTypography>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.secondaryGreyText }}
												>{`:`}</PoppinsTypography>
											</Stack>
										),
										value: (
											<PoppinsTypography
												variant='subtitle1'
												sx={{ color: theme.palette.common.primaryGreyText }}
											>
												{`${details?.address ?? ''}`}
											</PoppinsTypography>
										),
										showWhen: true,
									},
								]}
							/>
						</Stack>
					</Stack>
				</Stack>
			</Stack>

			<Box sx={{ width: '100%', padding: '8px', backgroundColor: '#E9EBF0', borderRadius: '8px' }}>
				<Tabs
					value={value}
					onChange={handleChange}
				>
					{TABS.map((l, index) => (
						<Tab
							sx={{ minWidth: '33.3%' }}
							label={
								<PoppinsTypography
									variant='subtitle1'
									sx={{ color: theme.palette.common.primaryGreyText }}
								>
									{l}
								</PoppinsTypography>
							}
							key={index}
						/>
					))}
				</Tabs>
			</Box>
			{value === 0 && <TransactionHistoryTab></TransactionHistoryTab>}
			{value === 1 && (
				<OtherDetailTab
					refetch={() => {
						void GetRestaurentsDetailsApi.refetch();
					}}
					handelUpdateClick={handelOnUpdate}
				/>
			)}
			{value === 2 && <MenuDetailTab></MenuDetailTab>}
		</Stack>
	);
};

export default memo(RestaurantDetails);
