/* eslint-disable indent */
import DetailsTable from '@components/DetailsTable';
import {
	AcceptRejectDocumentsDialog,
	UpdateBankDetails,
	ViewType,
} from '@components/DocumentAcceptReject';
import IconFinder from '@components/Icon';
import InputField, { InputFieldValue } from '@components/InputField';
import { useSnackbar } from '@components/Snackbar';
import { PoppinsTypography } from '@components/Typography';
import Uploader from '@components/Uploader';
import {
	RestaurentsDetailsResponse,
	useChangeRestaurantStatusApi,
	useGetRestaurentsDetailsApi,
	useGetRestaurentsOtherDetailApi,
	useUpdateRestaurantDetailsApi,
	validateAddRestoFields,
	validateAddRestoForm,
} from '@hooks/admin-restaurant-management';
import { Status, WeekDays } from '@interfaces/common';
import { LoadingButton } from '@mui/lab';
import { Box, Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import useTheme from '@mui/material/styles/useTheme';
import { ReactNode, memo, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

interface OtherDetailTabProps {
	refetch: () => void;
	handelUpdateClick: (data?: { owner_email: string; offer_list: string }) => void;
}

function OtherDetailTab(props: OtherDetailTabProps) {
	const theme = useTheme();
	const location = useLocation();
	const { showSnackbar, hideSnackbar } = useSnackbar();
	const { id } = useParams() as { id: string };
	const GetRestaurentsDetailsApi = useGetRestaurentsDetailsApi(id);
	const GetRestaurentsOtherDetailApi = useGetRestaurentsOtherDetailApi(id);
	const ChangeRestaurantStatusApi = useChangeRestaurantStatusApi();
	const UpdateRestaurantDetailsApi = useUpdateRestaurantDetailsApi();

	const isToUpdate = location.pathname.includes('/admin/restaurants/update/');
	const details = GetRestaurentsOtherDetailApi.data?.data;
	const [handleUpdateBankDetails, setUpdateBankDetails] = useState<boolean>(false);

	const [days, setDays] = useState<typeof WeekDays>(WeekDays);
	const [formData, setFormData] = useState<Partial<RestaurentsDetailsResponse>>({
		owner_email: '',
		offer_list: '',
	});

	const [formError, setFormError] = useState<Partial<RestaurentsDetailsResponse>>({
		owner_email: '',
		offer_list: '',
	});

	const [viewInfo, setViewInfo] = useState<{
		type: ViewType;
		render: ReactNode;
		heading: string;
		disableAccept?: boolean;
		disableReject?: boolean;
	} | null>(null);

	const onChange = (fieldName: string, value: InputFieldValue) => {
		let _formData: Partial<RestaurentsDetailsResponse> = {} as Partial<RestaurentsDetailsResponse>;

		_formData = { ...formData, [fieldName]: value };

		setFormData(_formData);
		setFormError({
			...formError,
			[fieldName]: validateAddRestoFields(
				fieldName as keyof Partial<RestaurentsDetailsResponse>,
				_formData
			),
		});
		setFormData({ ...formData, [fieldName]: value });
	};

	const handleOnBourdingStatus = (status: string) => () => {
		ChangeRestaurantStatusApi.mutateAsync({ request: { restaurant_id: id, status } })
			.then((response) => {
				props.refetch();
				void GetRestaurentsOtherDetailApi.refetch();
				void GetRestaurentsDetailsApi.refetch();
				showSnackbar({
					title: 'Success!',
					variant: 'sucess',
					content: response.data?.message,
					onCancel: () => hideSnackbar(),
				});
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

	const handleApplicableDays = (day: WeekDays) => () => {
		UpdateRestaurantDetailsApi.mutateAsync({
			id,
			request: { applicable_days: { ...days, [day]: !days?.[day] } },
		})
			.then((response) => {
				showSnackbar({
					title: 'Success!',
					variant: 'sucess',
					content: response.data?.message,
					onCancel: () => hideSnackbar(),
				});
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

	useEffect(() => {
		setDays((details?.applicable_days as typeof WeekDays) ?? WeekDays);
		setFormData({
			owner_email: details?.owner_details.owner_email ?? '',
			offer_list: details?.other_details.offer_list ?? '',
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [GetRestaurentsOtherDetailApi.dataUpdatedAt]);

	return (
		<Stack
			gap={10}
			overflow={'auto'}
			flexBasis={`1px`}
			flexGrow={1}
		>
			<Stack
				display={'flex'}
				sx={{
					width: '100%',
				}}
			>
				<Stack>
					<Stack
						gap={`10%`}
						flexDirection={'row'}
					>
						<Stack
							flexBasis={`100%`}
							gap={2}
							sx={{
								'& table': {
									borderCollapse: 'separate',
									borderSpacing: `0 4px`,
								},
								'& tr': {
									verticalAlign: 'top',
								},
								'& .tdValue': {
									paddingLeft: 2,
								},
							}}
						>
							<PoppinsTypography
								variant='subtitle1'
								sx={{ color: theme.palette.common.primaryGreyText }}
								fontWeight={600}
							>
								Other Details
							</PoppinsTypography>
							<DetailsTable
								data={[
									{
										name: (
											<Stack
												flexDirection={'row'}
												justifyContent={'space-between'}
											>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.secondaryGreyText }}
												>{`Complete Address  `}</PoppinsTypography>
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
												{details?.other_details?.address}
											</PoppinsTypography>
										),
										showWhen: true,
									},
									{
										name: (
											<Stack
												flexDirection={'row'}
												justifyContent={'space-between'}
											>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.secondaryGreyText }}
												>{`Type  `}</PoppinsTypography>
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
												{details?.other_details?.restaurant_type}
											</PoppinsTypography>
										),
										showWhen: true,
									},
									{
										name: (
											<Stack
												flexDirection={'row'}
												justifyContent={'space-between'}
											>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.secondaryGreyText }}
												>{`Cuisine  `}</PoppinsTypography>
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
												{details?.other_details?.cuisine}
											</PoppinsTypography>
										),
										showWhen: true,
									},
									{
										name: (
											<Stack
												flexDirection={'row'}
												justifyContent={'space-between'}
											>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.secondaryGreyText }}
												>{`QR Assigned  `}</PoppinsTypography>
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
												{details?.other_details?.qr_assign}
											</PoppinsTypography>
										),
										showWhen: true,
									},
								]}
							/>
						</Stack>
						<Stack
							flexBasis={`100%`}
							gap={2}
							sx={{
								'& table': {
									borderCollapse: 'separate',
									borderSpacing: `0 4px`,
								},
								'& .tdValue': {
									paddingLeft: 2,
								},
								'& tr': {
									verticalAlign: 'top',
								},
							}}
						>
							<PoppinsTypography
								variant='subtitle1'
								sx={{ color: theme.palette.common.primaryGreyText }}
								fontWeight={600}
							>
								Owner/Stakeholder Details
							</PoppinsTypography>
							<DetailsTable
								data={[
									{
										name: (
											<Stack
												flexDirection={'row'}
												justifyContent={'space-between'}
											>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.secondaryGreyText }}
												>{`Owner  `}</PoppinsTypography>
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
												{details?.owner_details?.owner_name}
											</PoppinsTypography>
										),
										showWhen: true,
									},
									{
										name: (
											<Stack
												flexDirection={'row'}
												justifyContent={'space-between'}
											>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.secondaryGreyText }}
												>{`Contact Number  `}</PoppinsTypography>
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
												{details?.owner_details?.owner_no}
											</PoppinsTypography>
										),
										showWhen: true,
									},
									{
										name: (
											<Stack
												flexDirection={'row'}
												justifyContent={'space-between'}
											>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.secondaryGreyText }}
												>{`Email ID `}</PoppinsTypography>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.secondaryGreyText }}
												>{`:`}</PoppinsTypography>
											</Stack>
										),
										value: isToUpdate ? (
											<InputField
												showLabel={false}
												fieldName='owner_email'
												value={formData?.owner_email ?? ''}
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
													error: Boolean(formError.owner_email),
													helperText: formError.owner_email,
												}}
												onChange={onChange}
											/>
										) : (
											<PoppinsTypography
												variant='subtitle1'
												sx={{ color: theme.palette.common.primaryGreyText }}
											>
												{details?.owner_details.owner_email}
											</PoppinsTypography>
										),
										showWhen: true,
									},
									{
										name: (
											<Stack
												flexDirection={'row'}
												justifyContent={'space-between'}
											>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.secondaryGreyText }}
												>{`Agreement Type  `}</PoppinsTypography>
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
												{details?.owner_details?.agreement_type}
											</PoppinsTypography>
										),
										showWhen: true,
									},
									{
										name: (
											<Stack
												flexDirection={'row'}
												justifyContent={'space-between'}
											>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.secondaryGreyText }}
												>{`Agreed Percentage  `}</PoppinsTypography>
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
												{details?.owner_details?.agreed_percentage}
											</PoppinsTypography>
										),
										showWhen: true,
									},
									{
										name: (
											<Stack
												flexDirection={'row'}
												justifyContent={'space-between'}
											>
												<PoppinsTypography
													variant='subtitle1'
													sx={{
														color: theme.palette.common.primaryGreyText,
														textTransform: 'uppercase',
													}}
												>{`Active Discount  `}</PoppinsTypography>
												<PoppinsTypography
													variant='subtitle1'
													fontWeight={600}
													sx={{ color: theme.palette.common.secondaryGreyText }}
												>{`:`}</PoppinsTypography>
											</Stack>
										),
										value: isToUpdate ? (
											<InputField
												showLabel={false}
												fieldName='offer_list'
												value={formData?.offer_list ?? ''}
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
													error: Boolean(formError.offer_list),
													helperText: formError.offer_list,
												}}
												onChange={onChange}
											/>
										) : (
											<PoppinsTypography
												variant='subtitle1'
												sx={{ color: theme.palette.common.primaryGreyText }}
											>
												{details?.other_details.offer_list}
											</PoppinsTypography>
										),
										showWhen: true,
									},
								]}
							/>
						</Stack>

						<Stack
							flexBasis={`100%`}
							gap={2}
							sx={{
								'& table': {
									borderCollapse: 'separate',
									borderSpacing: `0 4px`,
								},
								'& .tdValue': {
									paddingLeft: 2,
								},
								'& tr': {
									verticalAlign: 'top',
								},
							}}
						>
							<PoppinsTypography
								variant='subtitle1'
								sx={{ color: theme.palette.common.primaryGreyText }}
								fontWeight={600}
							>
								Documents Details
							</PoppinsTypography>
							<DetailsTable
								data={[
									{
										name: (
											<Stack
												flexDirection={'row'}
												justifyContent={'space-between'}
											>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.secondaryGreyText }}
												>{`FSSAI Licence `}</PoppinsTypography>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.secondaryGreyText }}
												>{`:`}</PoppinsTypography>
											</Stack>
										),
										value: (
											<Stack
												sx={{
													flexDirection: 'row',
													justifyContent: 'space-between',
													gap: 1,
												}}
											>
												<PoppinsTypography
													variant='subtitle1'
													sx={{
														color: theme.palette.primary.main,
														paddingLeft: 1,
														cursor: 'pointer',
														'&:hover': {
															textDecoration: 'underline',
														},
													}}
													onClick={() =>
														setViewInfo({
															render: (
																<Uploader
																	fieldName='fassi'
																	file={details?.document_details?.fssai_lic_no_url_pic ?? ''}
																/>
															),
															heading: `FSSAI License`,
															type: 'FSSAI Licence',
															disableAccept:
																details?.document_details?.fssai_status === '1' ||
																details?.document_details?.fssai_status === '2',
															disableReject:
																details?.document_details?.fssai_status === '1' ||
																details?.document_details?.fssai_status === '2',
															//		showDone: !(details?.other_details.status === '0'),
														})
													}
												>
													{details?.document_details?.fssai_lic_no}
												</PoppinsTypography>
												<CheckedStatusIcon
													status={details?.document_details?.fssai_status as Status}
												/>
											</Stack>
										),
										showWhen: true,
									},
									{
										name: (
											<Stack
												flexDirection={'row'}
												justifyContent={'space-between'}
											>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.secondaryGreyText }}
												>{`Bank Details `}</PoppinsTypography>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.secondaryGreyText }}
												>{`:`}</PoppinsTypography>
											</Stack>
										),
										value: (
											<Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', gap: 1 }}>
												<PoppinsTypography
													variant='subtitle1'
													sx={{
														color: theme.palette.primary.main,
														paddingLeft: 1,
														cursor: 'pointer',
														'&:hover': {
															textDecoration: 'underline',
														},
													}}
													onClick={() =>
														isToUpdate
															? setUpdateBankDetails(true)
															: setViewInfo({
																	render: (
																		<>
																			<Uploader
																				fieldName='bank'
																				file={details?.bank_details.bank_cheque_url_pic ?? ''}
																			/>
																			<Stack
																				sx={{
																					'& table': {
																						borderCollapse: 'separate',
																						borderSpacing: `0 4px`,
																					},
																					'& tr': {
																						verticalAlign: 'top',
																					},
																					'& .tdValue': {
																						paddingLeft: 3,
																						'.inputField-root': { gap: 0 },
																					},
																				}}
																			>
																				<DetailsTable
																					data={[
																						{
																							name: (
																								<Stack
																									flexDirection={'row'}
																									justifyContent={'space-between'}
																								>
																									<PoppinsTypography
																										variant='subtitle1'
																										sx={{
																											color: theme.palette.common.secondaryGreyText,
																										}}
																									>{`Account Holder Name `}</PoppinsTypography>
																									<PoppinsTypography
																										variant='subtitle1'
																										sx={{
																											color: theme.palette.common.secondaryGreyText,
																										}}
																									>{`:`}</PoppinsTypography>
																								</Stack>
																							),
																							value: (
																								<PoppinsTypography
																									variant='subtitle1'
																									sx={{
																										color: theme.palette.common.primaryGreyText,
																									}}
																								>
																									{details?.bank_details.res_acc_holder_name}
																								</PoppinsTypography>
																							),
																							showWhen: true,
																						},
																						{
																							name: (
																								<Stack
																									flexDirection={'row'}
																									justifyContent={'space-between'}
																								>
																									<PoppinsTypography
																										variant='subtitle1'
																										sx={{
																											color: theme.palette.common.secondaryGreyText,
																										}}
																									>{`Bank Name`}</PoppinsTypography>
																									<PoppinsTypography
																										variant='subtitle1'
																										sx={{
																											color: theme.palette.common.secondaryGreyText,
																										}}
																									>{`:`}</PoppinsTypography>
																								</Stack>
																							),
																							value: (
																								<PoppinsTypography
																									variant='subtitle1'
																									sx={{
																										color: theme.palette.common.primaryGreyText,
																									}}
																								>
																									{details?.bank_details.bank_name}
																								</PoppinsTypography>
																							),
																							showWhen: true,
																						},
																						{
																							name: (
																								<Stack
																									flexDirection={'row'}
																									justifyContent={'space-between'}
																								>
																									<PoppinsTypography
																										variant='subtitle1'
																										sx={{
																											color: theme.palette.common.secondaryGreyText,
																										}}
																									>{`Account Number `}</PoppinsTypography>
																									<PoppinsTypography
																										variant='subtitle1'
																										sx={{
																											color: theme.palette.common.secondaryGreyText,
																										}}
																									>{`:`}</PoppinsTypography>
																								</Stack>
																							),
																							value: (
																								<PoppinsTypography
																									variant='subtitle1'
																									sx={{
																										color: theme.palette.common.primaryGreyText,
																									}}
																								>
																									{details?.bank_details.bank_acc_no}
																								</PoppinsTypography>
																							),
																							showWhen: true,
																						},
																						{
																							name: (
																								<Stack
																									flexDirection={'row'}
																									justifyContent={'space-between'}
																								>
																									<PoppinsTypography
																										variant='subtitle1'
																										sx={{
																											color: theme.palette.common.secondaryGreyText,
																										}}
																									>{`IFSC`}</PoppinsTypography>
																									<PoppinsTypography
																										variant='subtitle1'
																										sx={{
																											color: theme.palette.common.secondaryGreyText,
																										}}
																									>{`:`}</PoppinsTypography>
																								</Stack>
																							),
																							value: (
																								<>
																									<PoppinsTypography
																										variant='subtitle1'
																										sx={{
																											color: theme.palette.common.primaryGreyText,
																										}}
																									>
																										{details?.bank_details.ifsc_no}
																									</PoppinsTypography>
																								</>
																							),
																							showWhen: true,
																						},
																					]}
																				/>
																			</Stack>
																		</>
																	),
																	heading: `Bank Details`,
																	type: 'Bank Details',
																	disableAccept:
																		details?.bank_details.bank_details_status === '1' ||
																		details?.bank_details.bank_details_status === '2',
																	disableReject:
																		details?.bank_details.bank_details_status === '1' ||
																		details?.bank_details.bank_details_status === '2',
															  })
													}
												>
													View Details
												</PoppinsTypography>
												<CheckedStatusIcon
													status={details?.bank_details.bank_details_status as Status}
												/>
											</Stack>
										),
										showWhen: details?.owner_details.payment_type
											.toLowerCase()
											.includes('Decentralised'.toLowerCase()),
									},
								]}
							/>
						</Stack>
					</Stack>
				</Stack>
			</Stack>

			<Box
				gap={2}
				sx={{
					'& table': {
						borderCollapse: 'separate',
						borderSpacing: `0 4px`,
					},
					'& .tdValue': {
						paddingLeft: 2,
					},
					'& tr': {
						verticalAlign: 'top',
					},
				}}
			>
				<DetailsTable
					data={[
						{
							name: (
								<Stack
									flexDirection={'row'}
									gap={2}
								>
									<PoppinsTypography
										variant='subtitle1'
										sx={{ color: theme.palette.common.primaryGreyText }}
										fontWeight={600}
									>
										Applicable Days
									</PoppinsTypography>
									<PoppinsTypography
										variant='subtitle1'
										sx={{ color: theme.palette.common.secondaryGreyText }}
									>{`:`}</PoppinsTypography>
								</Stack>
							),
							value: (
								<Stack
									sx={{
										gap: 2,
										flexDirection: 'row',
										flexFlow: 'wrap',
										width: `75%`,
									}}
								>
									{Object.keys(WeekDays).map((d) => {
										return (
											<Button
												key={d}
												size='small'
												variant='contained'
												style={{
													backgroundColor: `#E2E6F0`,
													cursor: isToUpdate ? 'pointer' : 'default',
													boxShadow: 'none',
												}}
												endIcon={
													<IconFinder
														iconName={days?.[d as WeekDays] ? 'Correct' : 'CancelError'}
													/>
												}
												onClick={isToUpdate ? handleApplicableDays(d as WeekDays) : undefined}
											>
												<PoppinsTypography
													variant='caption'
													sx={{ color: theme.palette.common.primaryGreyText }}
												>
													{`${d[0].toUpperCase()}${d.slice(1)}`}
												</PoppinsTypography>
											</Button>
										);
									})}
								</Stack>
							),
							showWhen: true,
						},
					]}
				/>
			</Box>

			<Stack
				flexDirection={'row'}
				gap={2}
				paddingLeft={2}
			>
				{isToUpdate ? (
					<LoadingButton
						size='large'
						color='primary'
						variant='contained'
						sx={{ width: 196 }}
						loading={UpdateRestaurantDetailsApi.isLoading}
						onClick={() => {
							const validatation = validateAddRestoForm(formData);
							if (validatation.hasError) {
								setFormError(validatation.errors as Partial<RestaurentsDetailsResponse>);
								return;
							}
							props.handelUpdateClick({
								owner_email: formData?.owner_email ?? '',
								offer_list: formData.offer_list ?? '',
							});
						}}
					>
						<PoppinsTypography variant='h6'>Update</PoppinsTypography>
					</LoadingButton>
				) : (
					<>
						{!(
							details?.other_details.status === '1' ||
							details?.other_details.status === '3' ||
							details?.other_details.status === '4'
						) && (
							<LoadingButton
								size='large'
								variant='outlined'
								color='inherit'
								disabled={
									ChangeRestaurantStatusApi.isLoading || details?.other_details.status === '5'
								}
								sx={{
									borderColor: theme.palette.common.secondaryGreyText,
									width: 196,
								}}
								onClick={handleOnBourdingStatus('reject')}
							>
								<PoppinsTypography variant='h6'>Reject</PoppinsTypography>
							</LoadingButton>
						)}
						{details?.other_details.status === '0' && (
							<>
								<LoadingButton
									size='large'
									color='primary'
									variant='contained'
									sx={{ width: 196 }}
									loading={ChangeRestaurantStatusApi.isLoading}
									onClick={handleOnBourdingStatus('approved')}
									disabled={
										GetRestaurentsDetailsApi.data?.data.data.status === '1' ||
										details?.document_details.fssai_status !== '1' ||
										(details?.owner_details.payment_type
											.toLowerCase()
											.includes('Decentralised'.toLowerCase()) &&
											details?.bank_details.bank_details_status !== '1')
									}
								>
									<PoppinsTypography variant='h6'>Accept</PoppinsTypography>
								</LoadingButton>
							</>
						)}
					</>
				)}
			</Stack>
			<AcceptRejectDocumentsDialog
				useApi='restaurent'
				id={id}
				render={viewInfo?.render}
				heading={viewInfo?.heading as string}
				type={viewInfo?.type as ViewType}
				handleClose={() => setViewInfo(null)}
				refetch={() => {
					void GetRestaurentsOtherDetailApi.refetch();
					setViewInfo(null);
				}}
				disableAccept={viewInfo?.disableAccept}
				disableReject={viewInfo?.disableReject}
			/>
			{isToUpdate && handleUpdateBankDetails && (
				<UpdateBankDetails
					useType='restaurent'
					id={id}
					details={details}
					handleClose={() => setUpdateBankDetails(false)}
					refetch={() => {
						void GetRestaurentsOtherDetailApi.refetch();
					}}
				/>
			)}
		</Stack>
	);
}

export default memo(OtherDetailTab);

interface CheckedStatusIconProps {
	status: Status;
}
const CheckedStatusIcon = (props: CheckedStatusIconProps) => {
	const theme = useTheme();
	return (
		<IconFinder
			iconName='Checked'
			iconProps={{
				fill:
					props.status === '0'
						? theme.palette.common.secondaryGreyText
						: props.status === '1'
						  ? theme.palette.success.main
						  : theme.palette.error.main,
			}}
		/>
	);
};
