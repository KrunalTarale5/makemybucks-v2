import {
	useSetDocumentStatusApi,
	RestaurantOtherDetailResponse,
	useUpdateRestaurantDetailsApi,
} from '@hooks/admin-restaurant-management';
import { validateAddDocunemtFields, AddDocumentRequest } from '@hooks/sub-admin-add-restaurant';
import { LoadingButton } from '@mui/lab';
import { Dialog, DialogTitle, DialogContent, Stack, useTheme, IconButton } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import DetailsTable from './DetailsTable';
import InputField, { InputFieldValue } from './InputField';
import { useSnackbar } from './Snackbar';
import { PoppinsTypography } from './Typography';
import { useUpdateKYCStatusApi } from '@hooks/admin-user-management';
import { useUpdateOwnerDocumentStatusApi } from '@hooks/admin-owner-management';
import { useGetRejectedReasonApi } from '@hooks/admin-master-list';
import IconFinder from './Icon';
import { Option } from '@interfaces/common';

interface DetailsDialogProps {
	useApi: 'user' | 'restaurent' | 'owner';
	id: string;
	heading: string;
	render: ReactNode;
	type: ViewType;
	isToUpdate?: boolean;
	loading?: boolean;
	onUpdateClick?: (type: ViewType, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
	refetch?: () => void;
	handleClose?: () => void;
	disableAccept?: boolean;
	disableReject?: boolean;
}
export type ViewType =
	| 'PAN'
	| 'GST Number'
	| 'FSSAI Licence'
	| 'Bank Details'
	| 'Registration Certificate';

export const AcceptRejectDocumentsDialog = (props: DetailsDialogProps) => {
	const theme = useTheme();
	const { showSnackbar, hideSnackbar } = useSnackbar();
	const SetDocumentStatusApi = useSetDocumentStatusApi();
	const UpdateKYCStatusApi = useUpdateKYCStatusApi();
	const UpdateOwnerDocumentStatusApi = useUpdateOwnerDocumentStatusApi();
	const GetRejectedReasonApi = useGetRejectedReasonApi();

	const [showRejectReasons, setShowRejectReasons] = useState(false);
	const [selectedRejectReasons, setSelectedRejectReasons] = useState<Option>();

	const getType = (type?: ViewType) => {
		switch (type) {
			case 'PAN':
				return 'pan';
			case 'GST Number':
				return 'gst';
			case 'FSSAI Licence':
				return 'fssai';
			case 'Bank Details':
				return 'bank';
			case 'Registration Certificate':
				return 'registration_certificate';
			default:
				return '';
		}
	};
	const handelOnAccept = () => {
		if (props.useApi === 'restaurent') {
			SetDocumentStatusApi.mutateAsync({
				request: {
					restaurant_id: props.id,
					status: 'accept',
					type: getType(props.type),
					reject_reason: '',
				},
			})
				.then((response) => {
					showSnackbar({
						title: 'Success!',
						variant: 'sucess',
						content: response.data?.message,
						onCancel: () => hideSnackbar(),
					});
					props.refetch?.();
					props.handleClose?.();
				})
				.catch((error) => {
					showSnackbar({
						title: 'Error!',
						variant: 'error',
						content: error.response?.data?.message,
						onCancel: () => hideSnackbar(),
					});
				});
			return;
		}

		if (props.useApi === 'user') {
			UpdateKYCStatusApi.mutateAsync({
				request: {
					user_id: props.id,
					KYC_Approval_status: 'Verified',
				},
			})
				.then((response) => {
					showSnackbar({
						title: 'Success!',
						variant: 'sucess',
						content: response.data?.message,
						onCancel: () => hideSnackbar(),
					});
					props.refetch?.();
					props.handleClose?.();
				})
				.catch((error) => {
					showSnackbar({
						title: 'Error!',
						variant: 'error',
						content: error.response?.data?.message,
						onCancel: () => hideSnackbar(),
					});
				});
			return;
		}

		if (props.useApi === 'owner') {
			UpdateOwnerDocumentStatusApi.mutateAsync({
				request: {
					owner_id: props.id,
					owner_status: 'accept',
					type: getType(props.type),
					reject_reason: '',
				},
			})
				.then((response) => {
					showSnackbar({
						title: 'Success!',
						variant: 'sucess',
						content: response.data?.message,
						onCancel: () => hideSnackbar(),
					});
					props.refetch?.();
					props.handleClose?.();
				})
				.catch((error) => {
					showSnackbar({
						title: 'Error!',
						variant: 'error',
						content: error.response?.data?.message,
						onCancel: () => hideSnackbar(),
					});
				});
			return;
		}
	};

	const handelOnReject = () => {
		if (props.useApi === 'user') {
			UpdateKYCStatusApi.mutateAsync({
				request: {
					user_id: props.id,
					KYC_Approval_status: 'Pending',
				},
			})
				.then((response) => {
					showSnackbar({
						title: 'Success!',
						variant: 'sucess',
						content: response.data?.message,
						onCancel: () => hideSnackbar(),
					});
					props.refetch?.();
					props.handleClose?.();
				})
				.catch((error) => {
					showSnackbar({
						title: 'Error!',
						variant: 'error',
						content: error.response?.data?.message,
						onCancel: () => hideSnackbar(),
					});
				});
			return;
		}

		if (props.useApi === 'owner' || props.useApi === 'restaurent') {
			setShowRejectReasons(true);
			return;
		}
	};

	const rejectDocument = () => {
		if (props.useApi === 'restaurent') {
			SetDocumentStatusApi.mutateAsync({
				request: {
					restaurant_id: props.id,
					status: 'reject',
					type: getType(props?.type),
					reject_reason: String(selectedRejectReasons?.value),
				},
			})
				.then((response) => {
					showSnackbar({
						title: 'Success!',
						variant: 'sucess',
						content: response.data?.message,
						onCancel: () => hideSnackbar(),
					});
					props.refetch?.();
					props.handleClose?.();
				})
				.catch((error) => {
					showSnackbar({
						title: 'Error!',
						variant: 'error',
						content: error.response?.data?.message,
						onCancel: () => hideSnackbar(),
					});
				});
			return;
		}
		if (props.useApi === 'owner') {
			UpdateOwnerDocumentStatusApi.mutateAsync({
				request: {
					owner_id: props.id,
					owner_status: 'reject',
					type: getType(props.type),
					reject_reason: String(selectedRejectReasons?.value),
				},
			})
				.then((response) => {
					showSnackbar({
						title: 'Success!',
						variant: 'sucess',
						content: response.data?.message,
						onCancel: () => hideSnackbar(),
					});
					props.refetch?.();
					props.handleClose?.();
				})
				.catch((error) => {
					showSnackbar({
						title: 'Error!',
						variant: 'error',
						content: error.response?.data?.message,
						onCancel: () => hideSnackbar(),
					});
				});
			return;
		}
	};
	useEffect(() => {
		if (!props.heading) {
			setShowRejectReasons(false);
			setSelectedRejectReasons(undefined);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.heading]);
	return (
		<Dialog
			onClose={props.handleClose}
			open={Boolean(props.heading)}
			maxWidth='sm'
			sx={{ '.MuiPaper-root': { width: `100%`, minHeight: `50%` } }}
		>
			<DialogTitle>
				<PoppinsTypography
					variant='h5'
					sx={{ color: theme.palette.common.primaryGreyText }}
				>
					{showRejectReasons ? (
						<>
							<IconButton onClick={() => setShowRejectReasons(false)}>
								<IconFinder iconName='ArrowBack' />
							</IconButton>
							Document Rejection
						</>
					) : (
						props.heading
					)}
				</PoppinsTypography>
			</DialogTitle>
			<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
				<Stack flex={'auto'}>
					{showRejectReasons ? (
						<InputField
							fieldName='selectedRejectReasons'
							value={selectedRejectReasons ?? ''}
							fieldType='select'
							fieldProps={{
								color: 'secondary',
								fullWidth: true,
								label: 'Select Reason For Rejection',
								required: true,
								options: GetRejectedReasonApi.data?.data.reject_reason_data.map((o) => ({
									label: o.reject_reason,
									value: o.reject_reason,
								})),
								sx: {
									'.MuiOutlinedInput-input': {
										paddingY: 1,
									},
								},
							}}
							onChange={(f, v) => setSelectedRejectReasons(v as Option)}
						/>
					) : (
						props.render
					)}
				</Stack>
				{showRejectReasons ? (
					<Stack
						flexDirection={'row'}
						gap={1}
						alignSelf={'end'}
					>
						<LoadingButton
							variant='contained'
							size='large'
							sx={{ width: 166 }}
							loading={
								props.loading ||
								SetDocumentStatusApi.isLoading ||
								UpdateOwnerDocumentStatusApi.isLoading
							}
							disabled={!selectedRejectReasons}
							onClick={rejectDocument}
						>
							<PoppinsTypography variant='h5'>Reject</PoppinsTypography>
						</LoadingButton>
					</Stack>
				) : (
					<Stack
						flexDirection={'row'}
						gap={1}
						alignSelf={'center'}
					>
						{props.isToUpdate ? (
							<>
								<LoadingButton
									variant='outlined'
									size='large'
									sx={{ width: 166 }}
									onClick={props.handleClose}
								>
									<PoppinsTypography
										variant='h5'
										sx={{ color: theme.palette.common.primaryGreyText }}
									>
										{props.onUpdateClick ? `Cancel` : `Back`}
									</PoppinsTypography>
								</LoadingButton>
								{props.onUpdateClick && (
									<LoadingButton
										variant='contained'
										size='large'
										sx={{ width: 166 }}
										loading={
											props.loading ||
											SetDocumentStatusApi.isLoading ||
											UpdateOwnerDocumentStatusApi.isLoading
										}
										onClick={(e) => props.onUpdateClick?.(props.type, e)}
									>
										<PoppinsTypography variant='h5'>Update</PoppinsTypography>
									</LoadingButton>
								)}
							</>
						) : (
							<>
								<LoadingButton
									variant={props.disableReject ? 'contained' : 'outlined'}
									size='large'
									sx={{ width: 166 }}
									loading={
										props.loading ||
										SetDocumentStatusApi.isLoading ||
										UpdateOwnerDocumentStatusApi.isLoading
									}
									disabled={props.disableReject}
									onClick={handelOnReject}
								>
									<PoppinsTypography
										variant='h5'
										sx={{
											...(!props.disableReject && { color: theme.palette.common.primaryGreyText }),
										}}
									>
										Reject
									</PoppinsTypography>
								</LoadingButton>

								<LoadingButton
									variant='contained'
									size='large'
									sx={{ width: 166 }}
									loading={
										props.loading ||
										SetDocumentStatusApi.isLoading ||
										UpdateOwnerDocumentStatusApi.isLoading
									}
									disabled={props.disableAccept}
									onClick={handelOnAccept}
								>
									<PoppinsTypography variant='h5'>Accept</PoppinsTypography>
								</LoadingButton>
							</>
						)}
					</Stack>
				)}
			</DialogContent>
		</Dialog>
	);
};

interface BankDetailsFormData {
	res_acc_holder_name: string;
	bank_name: string;
	bank_acc_no: string;
	ifsc_no: string;
}

export const UpdateBankDetails = (props: {
	useType: DetailsDialogProps['useApi'];
	id: string;
	details?: RestaurantOtherDetailResponse;
	handleClose?: () => void;
	refetch?: () => void;
	disableAccept?: boolean;
	disableReject?: boolean;
}) => {
	const theme = useTheme();
	const { showSnackbar, hideSnackbar } = useSnackbar();

	const UpdateRestaurantDetailsApi = useUpdateRestaurantDetailsApi();

	const [formData, setFormData] = useState<BankDetailsFormData>(
		props.details?.bank_details as BankDetailsFormData
	);
	const [formError, setFormError] = useState<BankDetailsFormData>({} as BankDetailsFormData);
	const onChange = (fieldName: string, value: InputFieldValue) => {
		let _formData: BankDetailsFormData = {} as BankDetailsFormData;
		_formData = { ...formData, [fieldName]: value };

		setFormData((p) => ({ ...p, [fieldName]: value }));
		setFormError({
			...formError,
			[fieldName]: validateAddDocunemtFields(
				fieldName as keyof AddDocumentRequest,
				_formData as AddDocumentRequest
			),
		});
	};
	const handelOnUpdate = () => {
		void UpdateRestaurantDetailsApi.mutateAsync({
			request: formData,
			id: props.id,
		})
			.then((response) => {
				showSnackbar({
					title: 'Success!',
					variant: 'sucess',
					content: response.data?.message,
					onCancel: () => hideSnackbar(),
				});
				props.handleClose?.();
				props.refetch?.();
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

	const renderInDialog = () => (
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
							<>
								<InputField
									showLabel={false}
									fieldName='res_acc_holder_name'
									value={formData?.res_acc_holder_name}
									fieldProps={{
										color: 'secondary',
										fullWidth: true,
										error: Boolean(formError['res_acc_holder_name']),
										helperText: formError['res_acc_holder_name'],
										sx: {
											'.MuiOutlinedInput-input': {
												paddingY: 1,
											},
										},
									}}
									onChange={onChange}
								/>
							</>
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
							<>
								<InputField
									showLabel={false}
									fieldName='bank_name'
									value={formData?.bank_name}
									fieldProps={{
										color: 'secondary',
										fullWidth: true,
										error: Boolean(formError['bank_name']),
										helperText: formError['bank_name'],
										sx: {
											'.MuiOutlinedInput-input': {
												paddingY: 1,
											},
										},
									}}
									onChange={onChange}
								/>
							</>
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
							<>
								<InputField
									showLabel={false}
									fieldName='bank_acc_no'
									value={formData?.bank_acc_no}
									fieldProps={{
										color: 'secondary',
										fullWidth: true,
										error: Boolean(formError['bank_acc_no']),
										helperText: formError['bank_acc_no'],
										sx: {
											'.MuiOutlinedInput-input': {
												paddingY: 1,
											},
										},
									}}
									onChange={onChange}
								/>
							</>
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
								<InputField
									showLabel={false}
									fieldName='ifsc_no'
									value={formData?.ifsc_no}
									fieldProps={{
										color: 'secondary',
										fullWidth: true,
										error: Boolean(formError['ifsc_no']),
										helperText: formError['ifsc_no'],
										sx: {
											'.MuiOutlinedInput-input': {
												paddingY: 1,
											},
										},
									}}
									onChange={onChange}
								/>
							</>
						),
						showWhen: true,
					},
				]}
			/>
		</Stack>
	);
	return (
		<AcceptRejectDocumentsDialog
			useApi={props.useType}
			id={props.id}
			isToUpdate={true}
			loading={UpdateRestaurantDetailsApi.isLoading}
			render={renderInDialog()}
			heading={'Update Bank Details'}
			type={'Bank Details'}
			handleClose={props.handleClose}
			onUpdateClick={handelOnUpdate}
			disableAccept={props?.disableAccept}
			disableReject={props?.disableReject}
		/>
	);
};
