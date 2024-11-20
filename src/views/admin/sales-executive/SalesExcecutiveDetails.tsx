import DetailsTable from '@components/DetailsTable';
import { BottomOpenDetailsDrawer } from '@components/Drawers';
import Table, { ColumnDef } from '@components/Table';
import { PoppinsTypography } from '@components/Typography';
import Uploader from '@components/Uploader';
import {
	SubAdminDetailsResponse,
	useGetSubAdminDetailsApi,
} from '@hooks/admin-add-sales-executive';
import { useRestaurantStatus } from '@hooks/common';
import { Stack, useTheme } from '@mui/material';
import moment from 'moment';
import { FC, memo } from 'react';
import { ToWords } from 'to-words';

interface SalesExecutivesDetailsProps {
	selectedId: string | false;
	onClose: () => void;
}

const SalesExecutivesDetails: FC<SalesExecutivesDetailsProps> = (props) => {
	const toWords = new ToWords();
	const theme = useTheme();
	const getStatus = useRestaurantStatus();

	const GetSubAdminDetailsApi = useGetSubAdminDetailsApi(props.selectedId as string);
	const details = GetSubAdminDetailsApi.data?.data.data;

	const rows: SubAdminDetailsResponse['data']['restaurant_data'] =
		(details?.restaurant_data as SubAdminDetailsResponse['data']['restaurant_data']) ?? [];
	type Row = (typeof rows)[number];

	const columns: ColumnDef<Row>[] = [
		{
			field: 'id',
			renderHeader: () => 'Sl No.',
			renderCell: ({ rowNumber }) => rowNumber + 1,
			tableCellTypographySx: {
				paddingLeft: theme.spacing(1),
			},
			tableCellProps: {
				sx: {
					width: 100,
				},
			},
			tableHeaderProps: {
				sx: {
					width: 100,
				},
			},
		},
		{
			field: 'Restaurant',
			renderHeader: () => `Restaurant`,
			renderCell: ({ row }) => row.restaurant_name,
			tableCellProps: {
				sx: {
					width: 350,
				},
			},
			tableHeaderProps: {
				sx: {
					width: 350,
				},
			},
		},
		{
			field: 'Date',
			renderHeader: () => 'Date',
			renderCell: ({ row }) => moment(row.restaurant_added_date_time).format('DD MMM YYYY'),
			tableCellProps: {
				sx: {
					width: 250,
				},
			},
			tableHeaderProps: {
				sx: {
					width: 250,
				},
			},
		},
		{
			field: 'Type',
			renderHeader: () => `Type`,
			renderCell: ({ row }) => row.restaurant_type,
		},
		{
			field: 'Location',
			renderHeader: () => `Location`,
			renderCell: ({ row }) => row.address,
		},
		{
			field: 'status',
			renderHeader: () => `Status`,
			renderCell: ({ row }) => {
				const status = getStatus(row.status);
				return (
					<PoppinsTypography
						variant='subtitle1'
						sx={status.sx}
					>
						{status.lable}
					</PoppinsTypography>
				);
			},
			tableCellProps: {
				sx: {
					width: 130,
				},
			},
			tableHeaderProps: {
				sx: {
					width: 130,
				},
			},
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
					<Uploader
						fieldName='fieldName'
						sx={{ placeContent: 'flex-end', width: 104, height: 104, borderRadius: 1 }}
						file={details?.subadmin_details?.profile_pic ?? ''}
						children={
							<PoppinsTypography
								flex={'auto'}
								alignSelf={'center'}
								textAlign={'center'}
								variant='h2'
								fontWeight={600}
							>
								{details?.subadmin_details?.first_name?.charAt(0)}
							</PoppinsTypography>
						}
					/>

					<Stack
						gap={25}
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
											>
												{`${details?.subadmin_details?.first_name ?? ''} ${
													details?.subadmin_details?.last_name ?? ''
												}`}
											</PoppinsTypography>
										),
										showWhen: true,
									},
									{
										name: (
											<PoppinsTypography
												variant='subtitle1'
												sx={{ color: theme.palette.common.secondaryGreyText }}
											>{`ID:`}</PoppinsTypography>
										),
										value: (
											<PoppinsTypography
												variant='subtitle1'
												sx={{ color: theme.palette.common.primaryGreyText }}
											>
												{details?.subadmin_details?.user_id}
											</PoppinsTypography>
										),
										showWhen: true,
									},
									{
										name: (
											<PoppinsTypography
												variant='subtitle1'
												sx={{ color: theme.palette.common.secondaryGreyText }}
											>{`Joining Date:`}</PoppinsTypography>
										),
										value: (
											<PoppinsTypography
												variant='subtitle1'
												sx={{ color: theme.palette.common.primaryGreyText }}
											>
												{moment(details?.subadmin_details?.subadmin_added_date).format(
													'DD MMM YYYY'
												)}
											</PoppinsTypography>
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
											>{`Total Restaurant Onbaorded:`}</PoppinsTypography>
										),
										value: (
											<PoppinsTypography
												variant='subtitle1'
												sx={{ color: theme.palette.common.primaryGreyText }}
											>
												{`${toWords.convert(details?.restaurant_data?.length ?? 0)} (${
													details?.restaurant_data?.length ?? 0
												})`}
											</PoppinsTypography>
										),
										showWhen: true,
									},
									{
										name: (
											<PoppinsTypography
												variant='subtitle1'
												sx={{ color: theme.palette.common.secondaryGreyText }}
											>{`Total QR Received:`}</PoppinsTypography>
										),
										value: (
											<PoppinsTypography
												variant='subtitle1'
												sx={{ color: theme.palette.common.primaryGreyText }}
											>
												{`${toWords.convert(details?.subadmin_details?.total_qr ?? 0)} (${
													details?.subadmin_details?.total_qr ?? 0
												})`}
											</PoppinsTypography>
										),
										showWhen: true,
									},
									{
										name: (
											<PoppinsTypography
												variant='subtitle1'
												sx={{ color: theme.palette.common.secondaryGreyText }}
											>{`Available QR:`}</PoppinsTypography>
										),
										value: (
											<PoppinsTypography
												variant='subtitle1'
												sx={{ color: theme.palette.common.primaryGreyText }}
											>
												{`${toWords.convert(details?.subadmin_details?.available_qr ?? 0)} (${
													details?.subadmin_details?.available_qr ?? 0
												})`}
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
						All Restaurant List
					</PoppinsTypography>
					<Stack flexGrow={1}>
						<Table
							rows={rows}
							columns={columns as any}
							rowId={(row) => row.slNo as string}
							tableProps={{ size: 'small', stickyHeader: false }}
							tableRowProps={{ hover: true }}
							loading={GetSubAdminDetailsApi.isLoading}
						/>
					</Stack>
				</Stack>
			</Stack>
		</BottomOpenDetailsDrawer>
	);
};

export default memo(SalesExecutivesDetails);
