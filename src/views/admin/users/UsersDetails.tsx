/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import DetailsTable from '@components/DetailsTable';
import { AcceptRejectDocumentsDialog, ViewType } from '@components/DocumentAcceptReject';
import { BottomOpenDetailsDrawer } from '@components/Drawers';
import IconFinder from '@components/Icon';
import Table, { ColumnDef } from '@components/Table';
import { PoppinsTypography } from '@components/Typography';
import Uploader from '@components/Uploader';
import { UserDetailResponse, useGetUserDetailsApi } from '@hooks/admin-user-management';
import { IconButton, Stack, useTheme } from '@mui/material';
import moment from 'moment';
import { FC, ReactNode, memo, useState } from 'react';

interface UsersDetailsProps {
	selectedId: string | false;
	onClose: () => void;
	refetch: () => void;
}

const UsersDetails: FC<UsersDetailsProps> = (props) => {
	const theme = useTheme();

	const GetUserDetailApi = useGetUserDetailsApi(props.selectedId as string);
	const details = GetUserDetailApi.data?.data.data;
	const [viewInfo, setViewInfo] = useState<{
		type: ViewType;
		render: ReactNode;
		heading: string;
	} | null>(null);

	const rows: UserDetailResponse['data']['transaction_details'] =
		GetUserDetailApi.data?.data.data.transaction_details ?? [];
	type Row = (typeof rows)[number];

	const columns: ColumnDef<Row>[] = [
		{
			field: 'id',
			renderHeader: () => 'Sl No.',
			renderCell: ({ rowNumber }) => rowNumber + 1,
			tableCellProps: { sx: { minWidth: 200 } },
		},
		{
			field: 'Restaurant',
			renderHeader: () => `Restaurant`,
			renderCell: ({ row }) => row.restaurant_name,
		},
		{
			field: 'Date',
			renderHeader: () => 'Date',
			renderCell: ({ row }) => moment(row.date).utc().format('DD MMM yyyy'),
			//renderCell: ({ row }) => row.date ?? '',
			//moment([row.Date]).format('DD MMM YY')
		},
		{
			field: 'Time',
			renderHeader: () => `Time`,
			renderCell: ({ row }) => moment(`${row.time}`).utc().format('h:mm A'),
			//renderCell: ({ row }) => row.time ?? '',
		},
		{
			field: 'Amount Paid',
			renderHeader: () => `Amount Paid ⟨₹⟩`,
			renderCell: ({ row }) => row.transaction_amount,
		},

		{
			field: 'Offer (%)',
			renderHeader: () => `Offer (%)`,
			renderCell: ({ row }) => row.offer,
		},
		{
			field: 'UTR',
			renderHeader: () => `UTR`,
			renderCell: ({ row }) => row.utr,
		},
		{
			field: 'Payment',
			renderHeader: () => `Payment`,
			renderCell: ({ row }) => row.payment_status ?? `--`,
		},
	];

	return (
		<BottomOpenDetailsDrawer
			open={Boolean(props.selectedId)}
			onClose={props.onClose}
		>
			<Stack
				gap={2}
				flexGrow={1}
			>
				<Stack
					gap={5}
					flexDirection={'row'}
				>
					<Stack gap={1}>
						<Uploader
							fieldName='fieldName'
							sx={{
								placeContent: 'flex-end',
								width: 104,
								height: 104,
								backgroundColor: '#C1BFEA',
								borderRadius: `4px`,
							}}
							file={details?.user_profile_img ?? ''}
							children={
								<PoppinsTypography
									flex={'auto'}
									alignSelf={'center'}
									textAlign={'center'}
									variant='h3'
									fontWeight={600}
								>
									{`${details?.name?.split(' ')[0]?.charAt(0) ?? ''} ${
										details?.name?.split(' ')[1]?.charAt(0) ?? ''
									}`}
								</PoppinsTypography>
							}
						/>
						<Stack
							gap={1}
							flexDirection={'row'}
							alignItems={'center'}
							justifyContent={'center'}
						>
							<IconFinder
								iconName='Dot'
								iconProps={{
									fill:
										details?.block_status === '0'
											? theme.palette.success.main
											: theme.palette.error.main,
								}}
							/>
							<PoppinsTypography
								variant='subtitle1'
								sx={{ color: theme.palette.common.secondaryGreyText }}
							>
								{details?.user_ref_id}
							</PoppinsTypography>
						</Stack>
					</Stack>

					<Stack
						gap={`15%`}
						flexDirection={'row'}
					>
						<Stack
							sx={{
								'& table': {
									borderCollapse: 'separate',
									borderSpacing: `0 4px`,
								},
								'& td': {
									minWidth: `150px`,
								},
								'& tr': {
									verticalAlign: 'top',
								},
								'& .tdValue': {
									paddingLeft: 4,
								},
							}}
						>
							<DetailsTable
								data={[
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
												fontWeight={600}
											>
												{details?.name}
											</PoppinsTypography>
										),
										showWhen: true,
									},
									{
										name: (
											<PoppinsTypography
												variant='subtitle1'
												sx={{ color: theme.palette.common.secondaryGreyText }}
											>{`Mobile No. :`}</PoppinsTypography>
										),
										value: (
											<Stack
												flexDirection={'row'}
												gap={1}
												alignItems={'center'}
											>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.primaryGreyText }}
												>
													{details?.phone_no}
												</PoppinsTypography>
												{details?.phone_no && (
													<IconButton
														onClick={() =>
															void window.navigator.clipboard.writeText(details?.phone_no ?? '')
														}
													>
														<IconFinder iconName='Copy' />
													</IconButton>
												)}
											</Stack>
										),
										showWhen: true,
									},
									{
										name: (
											<PoppinsTypography
												variant='subtitle1'
												sx={{ color: theme.palette.common.secondaryGreyText }}
											>{`Email ID :`}</PoppinsTypography>
										),
										value: (
											<Stack
												flexDirection={'row'}
												gap={1}
												alignItems={'center'}
											>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.primaryGreyText }}
												>
													{details?.email}
												</PoppinsTypography>
												{details?.email && (
													<IconButton
														onClick={() =>
															void window.navigator.clipboard.writeText(details?.email ?? '')
														}
													>
														<IconFinder iconName='Copy' />
													</IconButton>
												)}
											</Stack>
										),
										showWhen: true,
									},
								]}
							/>
						</Stack>
						<Stack
							sx={{
								'& table': {
									borderCollapse: 'separate',
									borderSpacing: `0 4px`,
								},
								'& td': {
									minWidth: `150px`,
								},
								'& tr': {
									verticalAlign: 'top',
								},
								'& .tdValue': {
									paddingLeft: 10,
								},
							}}
						>
							<DetailsTable
								data={[
									{
										name: (
											<PoppinsTypography
												variant='subtitle1'
												sx={{ color: theme.palette.common.secondaryGreyText }}
											>{`DOB :`}</PoppinsTypography>
										),
										value: (
											<PoppinsTypography
												variant='subtitle1'
												sx={{ color: theme.palette.common.primaryGreyText }}
											>
												{details?.user_dob === ''
													? 'NA'
													: moment(details?.user_dob).format('DD MMM YYYY')}
											</PoppinsTypography>
										),
										showWhen: true,
									},
									{
										name: (
											<PoppinsTypography
												variant='subtitle1'
												sx={{ color: theme.palette.common.secondaryGreyText }}
											>{`KYC:`}</PoppinsTypography>
										),
										value: (
											<Stack
												flexDirection={'row'}
												gap={1}
												alignItems={'center'}
											>
												<PoppinsTypography
													variant='subtitle1'
													sx={{
														color: '#0062FF',
														cursor: 'pointer',
														'&:hover': {
															textDecoration: 'underline',
														},
													}}
													onClick={() => {
														setViewInfo({
															render: (
																<Uploader
																	fieldName='document_img'
																	file={details?.document_img ?? ''}
																/>
															),
															heading: `${details?.document_type ?? ''} Details`,
															type: details?.document_type as ViewType,
														});
													}}
												>
													{details?.document_type}
												</PoppinsTypography>
												{details?.KYC_Approval_status === 'Verified' && (
													<IconFinder
														iconName='Checked'
														iconProps={{ fill: theme.palette.success.main, height: 12, width: 12 }}
													/>
												)}
											</Stack>
										),
										showWhen: true,
									},
									{
										name: (
											<PoppinsTypography
												variant='subtitle1'
												sx={{ color: theme.palette.common.secondaryGreyText }}
											>{`Bank Details:`}</PoppinsTypography>
										),
										value: (
											<Stack
												flexDirection={'row'}
												gap={1}
												alignItems={'center'}
											>
												<PoppinsTypography
													variant='subtitle1'
													sx={{ color: theme.palette.common.primaryGreyText }}
													//onClick={onDocumentClick}
												>
													NA
												</PoppinsTypography>
												<IconFinder
													iconName='Checked'
													iconProps={{
														fill: theme.palette.common.secondaryGreyText,
														height: 12,
														width: 12,
													}}
												/>
											</Stack>
										),
										showWhen: true,
									},
								]}
							/>
						</Stack>
						<Stack
							sx={{
								'& table': {
									borderCollapse: 'separate',
									borderSpacing: `0 4px`,
								},
								'& td': {
									minWidth: `150px`,
								},
								'& tr': {
									verticalAlign: 'top',
								},
								'& .tdValue': {
									paddingLeft: 10,
								},
							}}
						>
							<DetailsTable
								data={[
									{
										name: (
											<PoppinsTypography
												variant='subtitle1'
												sx={{ color: theme.palette.common.secondaryGreyText }}
											>{`Total Transaction:`}</PoppinsTypography>
										),
										value: (
											<PoppinsTypography
												variant='subtitle1'
												sx={{ color: theme.palette.common.primaryGreyText }}
											>
												{details?.total_transaction_amount}
											</PoppinsTypography>
										),
										showWhen: true,
									},
									{
										name: (
											<PoppinsTypography
												variant='subtitle1'
												sx={{ color: theme.palette.common.secondaryGreyText }}
											>{`Payback ⟨₹⟩:`}</PoppinsTypography>
										),
										value: (
											<PoppinsTypography
												variant='subtitle1'
												sx={{ color: theme.palette.common.primaryGreyText }}
											>
												{details?.payback}
											</PoppinsTypography>
										),
										showWhen: true,
									},
									{
										name: (
											<PoppinsTypography
												variant='subtitle1'
												sx={{ color: theme.palette.common.secondaryGreyText }}
											>{`Endowment  ⟨₹⟩:`}</PoppinsTypography>
										),
										value: (
											<PoppinsTypography
												variant='subtitle1'
												sx={{ color: theme.palette.common.primaryGreyText }}
											>
												{details?.repository}
											</PoppinsTypography>
										),
										showWhen: true,
									},
								]}
							/>
						</Stack>
					</Stack>
				</Stack>

				<Stack
					gap={1}
					flexGrow={1}
				>
					<PoppinsTypography
						variant='subtitle1'
						sx={{ color: theme.palette.common.secondaryGreyText }}
					>
						Transaction History
					</PoppinsTypography>
					<Stack flexGrow={1}>
						<Table
							rows={rows}
							columns={columns as any}
							rowId={(row) => row.slNo as string}
							tableProps={{ size: 'small', stickyHeader: false }}
							tableRowProps={{ hover: true }}
							loading={GetUserDetailApi.isLoading}
						/>
					</Stack>
				</Stack>
			</Stack>
			<AcceptRejectDocumentsDialog
				useApi='user'
				id={String(details?.user_id)}
				render={viewInfo?.render}
				heading={viewInfo?.heading as string}
				type={viewInfo?.type as ViewType}
				handleClose={() => setViewInfo(null)}
				refetch={() => {
					void GetUserDetailApi.refetch();
					props.refetch();
				}}
			/>
		</BottomOpenDetailsDrawer>
	);
};

export default memo(UsersDetails);
