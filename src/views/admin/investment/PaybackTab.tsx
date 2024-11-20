import { useAlertDialog } from '@components/AlertDialog';
import DetailsTable from '@components/DetailsTable';
import IconFinder from '@components/Icon';
import InputField from '@components/InputField';
import { useSnackbar } from '@components/Snackbar';
import Table, { ColumnDef } from '@components/Table';
import { PoppinsTypography } from '@components/Typography';
import { useGetPaybackApi, useGetProfitApi, useUpdateProfitApi } from '@hooks/admin-transation';
import { Box, Button, Stack, useTheme } from '@mui/material';
import moment from 'moment';
import { memo, useEffect, useState } from 'react';

const PaybackTab = () => {
	const theme = useTheme();
	const { showAlertDialog, hideAlertDialog } = useAlertDialog();
	const { showSnackbar, hideSnackbar } = useSnackbar();

	const GetProfitApi = useGetProfitApi();
	const UpdateProfitApi = useUpdateProfitApi();
	const GetPaybackApi = useGetPaybackApi();
	const [profit, setProfit] = useState('');
	const makeDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
	const previousMonth = moment(makeDate.toDateString()).format('MMMM');
	console.warn(previousMonth);
	const rows = GetPaybackApi.data?.data.data.payback_data ?? [];
	type Row = (typeof rows)[number];
	const columns: ColumnDef<Row>[] = [
		{
			field: 'month_year',
			renderHeader: () => `Month`,
			renderCell: ({ row }) => row.month_year,
			tableCellProps: {
				sx: {
					width: 200,
				},
			},
			tableCellTypographySx: {
				paddingLeft: theme.spacing(1),
			},
			tableHeaderProps: {
				sx: {
					width: 200,
				},
			},
		},
		{
			field: 'total_disbursable_amount',
			renderHeader: () => `Total Disbursable Amount (₹)`,
			renderCell: ({ row }) => row.total_disbursable_amount,
			tableCellProps: {
				sx: {
					width: 350,
					textAlign: 'center',
				},
			},
			tableHeaderProps: {
				sx: {
					width: 350,
					flexDirection: 'column',
					textAlign: '-webkit-center',
				},
			},
		},
		{
			field: 'payback_to_user',
			renderHeader: () => 'Payback Disbursed to User',
			renderCell: ({ row }) => row.payback_to_user,
			tableCellProps: {
				sx: {
					width: 350,
					textAlign: 'center',
				},
			},
			tableHeaderProps: {
				sx: {
					width: 350,
					flexDirection: 'column',
					textAlign: '-webkit-center',
				},
			},
		},
		{
			field: 'payback_to_restaurant',
			renderHeader: () => `Payback Disbursed to Restaurant (₹)`,
			renderCell: ({ row }) => row.payback_to_restaurant,
			tableCellProps: {
				sx: {
					width: 400,
					textAlign: 'center',
				},
			},
			tableHeaderProps: {
				sx: {
					width: 400,
					flexDirection: 'column',
					textAlign: '-webkit-center',
				},
			},
		},
	];

	const onSubmit = () => {
		showAlertDialog({
			title: (
				<Stack
					flexDirection={'row'}
					gap={3}
				>
					<IconFinder
						iconName='Warning'
						iconProps={{ style: { marginTop: `8px` } }}
					/>
					<Stack>
						<PoppinsTypography
							variant='h4'
							sx={{ color: theme.palette.common.primaryGreyText }}
						>
							Profit Amount Confirmation
						</PoppinsTypography>
						<PoppinsTypography
							variant='subtitle1'
							sx={{ color: '#929292' }}
						>
							Your are entering the the profit amount. Make sure you have entered correct amount.
						</PoppinsTypography>
					</Stack>
				</Stack>
			),
			content: (
				<Box
					gap={2}
					sx={{
						textAlign: '-webkit-center',
						'& table': {
							borderCollapse: 'separate',
							borderSpacing: `0 4px`,
						},

						'& .tdValue': {
							paddingLeft: 4,
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
										justifyContent={'space-between'}
									>
										<PoppinsTypography
											variant='h6'
											paddingRight={4}
											sx={{ color: theme.palette.common.primaryGreyText }}
											fontWeight={400}
										>
											Profit Amount (₹)
										</PoppinsTypography>
										<PoppinsTypography
											variant='subtitle1'
											sx={{ color: theme.palette.common.secondaryGreyText }}
										>{`:`}</PoppinsTypography>
									</Stack>
								),
								value: (
									<PoppinsTypography
										variant='h6'
										paddingRight={4}
										sx={{ color: theme.palette.common.primaryGreyText }}
										fontWeight={600}
									>
										{profit}
									</PoppinsTypography>
								),
								showWhen: true,
							},
							{
								name: (
									<Stack
										flexDirection={'row'}
										justifyContent={'space-between'}
										gap={2}
									>
										<PoppinsTypography
											variant='h6'
											sx={{ color: theme.palette.common.primaryGreyText }}
											fontWeight={400}
										>
											{previousMonth}
										</PoppinsTypography>
										<PoppinsTypography
											variant='subtitle1'
											sx={{ color: theme.palette.common.secondaryGreyText }}
										>{`:`}</PoppinsTypography>
									</Stack>
								),
								value: (
									<PoppinsTypography
										variant='h6'
										sx={{ color: theme.palette.common.primaryGreyText }}
										fontWeight={600}
									></PoppinsTypography>
								),
								showWhen: true,
							},
						]}
					/>
				</Box>
			),
			buttons: [
				{
					children: 'Cancel',
					variant: 'outlined',
					callback: () => {
						hideAlertDialog();
					},
				},
				{
					children: 'Confirm',
					variant: 'contained',
					callback: () => {
						UpdateProfitApi.mutateAsync({ request: { profit_for_month: profit } })
							.then((response) => {
								showSnackbar({
									title: 'Success!',
									variant: 'sucess',
									content: response.data?.message,
									onCancel: () => hideSnackbar(),
								});
								hideAlertDialog();

								void GetProfitApi.refetch();
								void GetPaybackApi.refetch();
							})
							.catch((error) => {
								showSnackbar({
									title: 'Error!',
									variant: 'error',
									content: error.response?.data?.message,
									onCancel: () => hideSnackbar(),
								});
							});
					},
				},
			],
		});
	};

	useEffect(() => {
		setProfit(GetProfitApi.data?.data?.profit_for_month ?? '');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [GetProfitApi.dataUpdatedAt]);

	return (
		<Stack
			gap={2}
			flexGrow={'inherit'}
		>
			<Stack
				flexDirection={'row'}
				gap={2}
				alignItems={'flex-end'}
			>
				<InputField
					fieldName='input'
					fieldProps={{
						label: 'Profit for Month',
						fullWidth: true,
						sx: {
							width: 465,
							gap: 0,
						},
						disabled: GetProfitApi.data?.data.clickable,
					}}
					onChange={(_, v) => setProfit(v as string)}
					value={profit}
				/>
				<Button
					variant='contained'
					size='large'
					sx={{ height: 40 }}
					onClick={onSubmit}
					disabled={GetProfitApi.data?.data.clickable}
				>
					<PoppinsTypography variant='caption'>Submit</PoppinsTypography>
				</Button>
			</Stack>
			<Table
				rows={rows}
				columns={columns as any}
				rowId={(row) => row.id as string}
				tableProps={{ size: 'small', stickyHeader: false }}
				tableRowProps={{ hover: true }}
				loading={GetPaybackApi.isLoading}
				sx={{ paddingTop: 5 }}
			/>
		</Stack>
	);
};

export default memo(PaybackTab);
