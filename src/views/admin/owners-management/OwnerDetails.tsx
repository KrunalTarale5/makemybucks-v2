import { OwnerCards } from '@components/Cards';
import DetailsTable from '@components/DetailsTable';
import { AcceptRejectDocumentsDialog, ViewType } from '@components/DocumentAcceptReject';
import IconFinder from '@components/Icon';
import { useSnackbar } from '@components/Snackbar';
import { PoppinsTypography } from '@components/Typography';
import Uploader from '@components/Uploader';
import { useChangeOwnerStatusApi, useGetOwnerOtherDetailsApi } from '@hooks/admin-owner-management';
import { Status } from '@interfaces/common';
import { LoadingButton } from '@mui/lab';
import Stack from '@mui/material/Stack';
import useTheme from '@mui/material/styles/useTheme';
import moment from 'moment';
import { ReactNode, memo, useState } from 'react';
import { useParams } from 'react-router-dom';

function OwnersDetails() {
	const theme = useTheme();
	const { id } = useParams() as { id: string };
	const { showSnackbar, hideSnackbar } = useSnackbar();
	const GetOwnerOtherDetailApi = useGetOwnerOtherDetailsApi(id);
	const ChangeOwnerStatusApi = useChangeOwnerStatusApi();

	const details = GetOwnerOtherDetailApi.data?.data;

	const [viewInfo, setViewInfo] = useState<{
		type: ViewType;
		render: ReactNode;
		heading: string;
		disableAccept?: boolean;
		disableReject?: boolean;
	} | null>(null);

	const handleStatusClick = (status: string) => () => {
		ChangeOwnerStatusApi.mutateAsync({ request: { owner_id: id, owner_status: status } })
			.then((response) => {
				void GetOwnerOtherDetailApi.refetch();
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

	return (
		<Stack
			gap={10}
			overflow={'auto'}
			flexBasis={`1px`}
			flexGrow={1}
			paddingY={3}
		>
			<Stack
				gap={`20px`}
				flexDirection={'row'}
			>
				<OwnerCards
					heading='Owner Name'
					content={details?.owner_details.owner_name}
					sx={{ width: 400 }}
				/>

				<OwnerCards
					heading='Agreement Period'
					content={details?.owner_details.agreement_period}
				/>

				<OwnerCards
					heading='Agreed Percentage'
					content={
						details?.owner_details.agreed_percentage !== '0'
							? `${details?.owner_details.agreed_percentage ?? ''}%`
							: `NA`
					}
				/>

				<OwnerCards
					heading='Agreement Type'
					content={details?.owner_details.agreement_type}
					sx={{ width: 350 }}
				/>
				<OwnerCards
					heading='Payment Method'
					content={details?.owner_details.payment_type}
					sx={{ width: 296 }}
				/>
			</Stack>

			<Stack
				display={'flex'}
				sx={{
					width: '100%',
				}}
			>
				<Stack>
					<Stack
						gap={`1%`}
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
								variant='subtitle2'
								sx={{ color: theme.palette.common.primaryGreyText, textTransform: 'uppercase' }}
								fontWeight={600}
							>
								Owner Details
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
												>{`Email ID  `}</PoppinsTypography>
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
												>{`Phone Number  `}</PoppinsTypography>
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
												{details?.owner_details.owner_contact_no}
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
												{details?.owner_details.added_by}
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
								variant='subtitle2'
								sx={{ color: theme.palette.common.primaryGreyText, textTransform: 'uppercase' }}
								fontWeight={600}
							>
								Business Details
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
												>{`Business Name  `}</PoppinsTypography>
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
												{details?.bussiness_details.business_name}
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
												>{`Business Type  `}</PoppinsTypography>
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
												{details?.bussiness_details.business_type}
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
												>{`Registered Address `}</PoppinsTypography>
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
												{details?.bussiness_details.address}
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
												>{`Renewal On `}</PoppinsTypography>
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
												{moment(details?.bussiness_details.renewal_on).format('DD MMM YYYY')}
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
								variant='subtitle2'
								sx={{ color: theme.palette.common.primaryGreyText, textTransform: 'uppercase' }}
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
												>{`Registration Certificate  `}</PoppinsTypography>
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
																	fieldName='Registration Certificate'
																	file={
																		details?.document_details?.registration_certificate_pic ?? ''
																	}
																/>
															),
															heading: `Registration Certificate`,
															type: 'Registration Certificate',
															disableAccept:
																details?.document_details?.registration_certificate_status ===
																	'1' ||
																details?.document_details?.registration_certificate_status === '2',
															disableReject:
																details?.document_details?.registration_certificate_status ===
																	'1' ||
																details?.document_details?.registration_certificate_status === '2',
															//	showDone: !(details?.owner_details.owner_status === '0'),
														})
													}
												>
													{'View Details'}
												</PoppinsTypography>
												<CheckedStatusIcon
													status={
														details?.document_details?.registration_certificate_status as Status
													}
												/>
											</Stack>
										),
										showWhen: details?.bussiness_details.business_type !== 'Proprietorship',
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
												>{`PAN Details `}</PoppinsTypography>
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
																	fieldName='pan'
																	file={details?.document_details?.pan_no_url_pic ?? ''}
																/>
															),
															heading: `PAN Details`,
															type: 'PAN',
															disableAccept:
																details?.document_details?.pan_status === '1' ||
																details?.document_details?.pan_status === '2',
															disableReject:
																details?.document_details?.pan_status === '1' ||
																details?.document_details?.pan_status === '2',
															//showDone: !(details?.owner_details.owner_status === '0'),
														})
													}
												>
													{details?.document_details?.pan_no}
												</PoppinsTypography>
												<CheckedStatusIcon
													status={details?.document_details?.pan_status as Status}
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
												>{`GST Number  `}</PoppinsTypography>
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
														setViewInfo({
															render: (
																<Uploader
																	fieldName='pan'
																	file={details?.document_details?.gst_no_url_pic ?? ''}
																/>
															),
															heading: `GST Certificate`,
															type: 'GST Number',
															disableAccept:
																details?.document_details?.gst_status === '1' ||
																details?.document_details?.gst_status === '2',
															disableReject:
																details?.document_details?.gst_status === '1' ||
																details?.document_details?.gst_status === '2',

															//	showDone: !(details?.owner_details.owner_status === '0'),
														})
													}
												>
													{details?.document_details?.gst_no}
												</PoppinsTypography>
												<CheckedStatusIcon
													status={details?.document_details?.gst_status as Status}
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
														setViewInfo({
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
																							{details?.bank_details.acc_holder_name}
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
																							{details?.bank_details.account_number}
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
																								{details?.bank_details.ifscode_number}
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
										showWhen: !details?.owner_details.payment_type
											.toLowerCase()
											.includes('Decentralised'.toLowerCase()),
									},
								]}
							/>
						</Stack>
					</Stack>
				</Stack>
			</Stack>

			<Stack
				flexDirection={'row'}
				gap={2}
				paddingLeft={2}
			>
				{details?.owner_details.owner_status === '1' ? (
					<LoadingButton
						size='large'
						color='success'
						variant='contained'
						sx={{ width: 196 }}
						loading={ChangeOwnerStatusApi.isLoading}
					>
						<PoppinsTypography
							variant='h6'
							color='white'
						>
							Approved
						</PoppinsTypography>
					</LoadingButton>
				) : (
					<>
						<LoadingButton
							size='large'
							variant='outlined'
							color='inherit'
							disabled={ChangeOwnerStatusApi.isLoading}
							sx={{
								borderColor: theme.palette.common.secondaryGreyText,
								width: 196,
							}}
							onClick={handleStatusClick('reject')}
						>
							<PoppinsTypography variant='h6'>Reject</PoppinsTypography>
						</LoadingButton>
						<LoadingButton
							size='large'
							color='primary'
							variant='contained'
							sx={{ width: 196 }}
							loading={ChangeOwnerStatusApi.isLoading}
							onClick={handleStatusClick('approved')}
							disabled={
								details?.document_details.pan_status !== '1' ||
								(details?.bussiness_details.business_type !== 'Proprietorship' &&
									details?.document_details.registration_certificate_status !== '1') ||
								details?.document_details.gst_status !== '1' ||
								(!details?.owner_details.payment_type
									.toLowerCase()
									.includes('Decentralised'.toLowerCase()) &&
									details?.bank_details.bank_details_status !== '1')
							}
						>
							<PoppinsTypography variant='h6'>Approve</PoppinsTypography>
						</LoadingButton>
					</>
				)}
			</Stack>
			<AcceptRejectDocumentsDialog
				useApi='owner'
				id={id}
				render={viewInfo?.render}
				heading={viewInfo?.heading as string}
				type={viewInfo?.type as ViewType}
				handleClose={() => setViewInfo(null)}
				refetch={() => {
					void GetOwnerOtherDetailApi.refetch();
					setViewInfo(null);
				}}
				disableAccept={viewInfo?.disableAccept}
				disableReject={viewInfo?.disableReject}
			/>
		</Stack>
	);
}

export default memo(OwnersDetails);

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
