import { AdminCards } from '@components/Cards';
import { YearPicker } from '@components/DatePicker';
import IconFinder from '@components/Icon';
import { InterTypography } from '@components/Typography';
import { BannerInformation, useBannerInfo } from '@hooks/admin-banner-info';
import {
	useGetDashboardCountApi,
	useGetTotalRestaurentCoordApi,
	useGetTotalTransactionCoordApi,
	useGetTotalUserCoordApi,
} from '@hooks/admin-dashboard';
import { Chip, Stack, useTheme } from '@mui/material';
import { getMaxTickAmount } from '@utils/common';
import moment from 'moment';
import { memo, useState } from 'react';
// eslint-disable-next-line import/default
import Chart from 'react-apexcharts';

const REPORT_TYPE = ['Daily', 'Monthly', 'Quarterly'];

const Dashboard = () => {
	useBannerInfo(BannerInformation.dashboard);
	const theme = useTheme();

	const [anchorEl, handleAnchorEl] = useState<{
		element: HTMLElement | null;
		box: 1 | 2 | 3;
	} | null>(null);
	const [transationReport, setTransationReport] = useState<{
		date: moment.Moment | null;
		type: string;
	}>({
		date: moment(),
		type: 'Daily',
	});

	const [userReport, setUserReport] = useState<{
		date: moment.Moment | null;
		type: string;
	}>({
		date: moment(),
		type: 'Daily',
	});

	const [restaurantReport, setRestaurantReport] = useState<{
		date: moment.Moment | null;
		type: string;
	}>({
		date: moment(),
		type: 'Daily',
	});

	const GetDashboardCountApi = useGetDashboardCountApi();
	const GetTotalRestaurentCoordApi = useGetTotalRestaurentCoordApi({
		filter: restaurantReport.type.toLowerCase(),
		calendar: 'year',
		year: restaurantReport.date?.get('year').toString(),
		month: restaurantReport.date?.format('MMMM'),
	});
	const GetTotalUserCoordApi = useGetTotalUserCoordApi({
		filter: userReport.type.toLowerCase(),
		calendar: 'year',
		year: userReport.date?.get('year').toString(),
		month: userReport.date?.format('MMMM'),
	});
	const GetTotalTransactionCoordApi = useGetTotalTransactionCoordApi({
		filter: transationReport.type.toLowerCase(),
		calendar: 'year',
		year: transationReport.date?.get('year').toString(),
	});
	return (
		<Stack
			gap={2}
			flexGrow={'inherit'}
		>
			<Stack gap={1}>
				<Stack
					flexDirection={'row'}
					gap={12}
				>
					<Stack
						gap={2}
						flexDirection={'row'}
					>
						<AdminCards
							heading='Total Investment'
							content={`₹${GetDashboardCountApi.data?.data.data.total_investment ?? 'NA'}`}
						/>

						<AdminCards
							heading='Total Profit'
							content={`₹${GetDashboardCountApi.data?.data.data.total_profit ?? 'NA'}`}
						/>
					</Stack>
					<Stack
						gap={2}
						flexDirection={'row'}
					>
						<AdminCards
							heading='Total Revenue'
							content={`₹${GetDashboardCountApi.data?.data.data.total_revenue ?? 'NA'}`}
						/>
						<AdminCards
							heading='Today’s Revenue'
							content={`₹${GetDashboardCountApi.data?.data.data.todays_revenue_count ?? 'NA'}`}
						/>
					</Stack>
					<Stack
						gap={2}
						flexDirection={'row'}
					>
						<AdminCards
							heading='Total Restaurants'
							content={GetDashboardCountApi.data?.data.data.added_restaurant_count ?? `NA`}
						/>

						<AdminCards
							heading='Active Restaurant'
							content={GetDashboardCountApi.data?.data.data.active_restaurant_count ?? `NA`}
						/>
					</Stack>
				</Stack>
				<Stack
					flexDirection={'row'}
					gap={12}
				>
					<Stack
						gap={2}
						flexDirection={'row'}
					>
						<AdminCards
							heading='Total Users'
							content={GetDashboardCountApi.data?.data.data.total_users ?? `NA`}
						/>

						<AdminCards
							heading={`New Users - ${moment(new Date()).format('MMM')} ${moment(new Date()).format(
								'YY'
							)}`}
							content={GetDashboardCountApi.data?.data.data.new_users ?? `NA`}
						/>
					</Stack>
				</Stack>
			</Stack>

			<Stack
				flexDirection={'row'}
				gap={8}
			>
				<Stack
					boxShadow={'0px 2px 8px 0px #00000026'}
					padding={1.3}
					flexBasis={`33%`}
					gap={2}
				>
					<Stack
						flexDirection={'row'}
						justifyContent={'space-between'}
					>
						<InterTypography
							fontWeight={600}
							variant='subtitle1'
						>
							Total Transactions
						</InterTypography>
						<Stack
							gap={1}
							flexDirection={'row'}
						>
							{REPORT_TYPE.filter((f) => f === 'Monthly' || f === 'Daily').map((r) => (
								<Chip
									key={r}
									size='small'
									label={r}
									sx={{
										fontSize: 7,
										backgroundColor: transationReport.type === r ? '#E7EBFE' : 'transparent',
									}}
									onClick={() =>
										setTransationReport({
											...transationReport,
											type: r,
										})
									}
								/>
							))}

							<YearPicker
								onRightClick={() =>
									setTransationReport({
										...transationReport,
										date: moment(transationReport.date).add(1, 'year'),
									})
								}
								onLeftClick={() =>
									setTransationReport({
										...transationReport,
										date: moment(transationReport.date).subtract(1, 'year'),
									})
								}
								onCalenderClick={(e) => handleAnchorEl({ element: e.currentTarget, box: 1 })}
								onChange={(value) => {
									setTransationReport({ ...transationReport, date: value });
									handleAnchorEl(null);
								}}
								show={Boolean(anchorEl) && anchorEl?.box === 1}
								handleClose={() => handleAnchorEl(null)}
								anchorEl={anchorEl?.element}
								date={transationReport.date}
							/>
							<IconFinder
								iconName='MoreVertical'
								iconProps={{ height: 24, fill: 'black' }}
							/>
						</Stack>
					</Stack>
					<Chart
						options={{
							chart: {
								zoom: {
									enabled: false,
								},
							},
							dataLabels: {
								enabled: false,
							},
							xaxis: {
								categories: GetTotalTransactionCoordApi.data?.data.data?.x_axis ?? [],
							},
							yaxis: {
								labels: {
									formatter: (value) => value?.toFixed(0),
								},
								tickAmount: getMaxTickAmount(
									GetTotalTransactionCoordApi.data?.data.data?.y_axis ?? []
								),
							},
							tooltip: {
								enabled: true,
							},
							colors: [theme.palette.primary.main],
						}}
						series={[
							{
								name: 'Total Transactions',
								data: GetTotalTransactionCoordApi.data?.data.data?.y_axis ?? [],
							},
						]}
						type='area'
						height={365}
					/>
				</Stack>

				<Stack
					boxShadow={'0px 2px 8px 0px #00000026'}
					padding={1.3}
					flexBasis={`33%`}
				>
					<Stack gap={2}>
						<Stack
							justifyContent={'space-between'}
							flexDirection={'row'}
						>
							<InterTypography
								fontWeight={600}
								variant='subtitle1'
							>
								Total Users
							</InterTypography>
							<IconFinder
								iconName='MoreVertical'
								iconProps={{ height: 24, fill: 'black' }}
							/>
						</Stack>
						<Stack
							justifyContent={'space-between'}
							flexDirection={'row'}
						>
							<Stack
								gap={1}
								flexDirection={'row'}
							>
								{REPORT_TYPE.map((c) => (
									<Chip
										key={c}
										size='medium'
										label={c}
										sx={{
											fontSize: 10,
											height: 27,
											backgroundColor: userReport.type === c ? '#E7EBFE' : 'transparent',
										}}
										onClick={() =>
											setUserReport({
												...userReport,
												type: c,
											})
										}
									/>
								))}
							</Stack>

							<YearPicker
								onRightClick={() =>
									setUserReport({
										...userReport,
										date: moment(userReport.date).add(1, 'year'),
									})
								}
								onLeftClick={() =>
									setUserReport({
										...userReport,
										date: moment(userReport.date).subtract(1, 'year'),
									})
								}
								onCalenderClick={(e) => handleAnchorEl({ element: e.currentTarget, box: 2 })}
								onChange={(value) => {
									setUserReport({ ...userReport, date: value });
									handleAnchorEl(null);
								}}
								show={Boolean(anchorEl) && anchorEl?.box === 2}
								handleClose={() => handleAnchorEl(null)}
								anchorEl={anchorEl?.element}
								date={userReport.date}
							/>
						</Stack>
						<Chart
							options={{
								chart: {
									zoom: {
										enabled: false,
									},
								},
								dataLabels: {
									enabled: false,
								},
								xaxis: {
									categories: GetTotalUserCoordApi.data?.data.data?.x_axis ?? [],
								},
								yaxis: {
									labels: {
										formatter: (value) => value?.toFixed(0),
									},
									tickAmount: getMaxTickAmount(GetTotalUserCoordApi.data?.data.data?.y_axis ?? []),
								},
								tooltip: {
									enabled: true,
								},
								colors: [theme.palette.primary.main],
							}}
							series={[
								{
									name: 'Total Users',
									data: GetTotalUserCoordApi.data?.data.data?.y_axis ?? [],
								},
							]}
							type='bar'
							height={321}
						/>
					</Stack>
				</Stack>

				<Stack
					boxShadow={'0px 2px 8px 0px #00000026'}
					padding={1.3}
					flexBasis={`33%`}
				>
					<Stack gap={2}>
						<Stack
							justifyContent={'space-between'}
							flexDirection={'row'}
						>
							<InterTypography
								fontWeight={600}
								variant='subtitle1'
							>
								Total Restaurants
							</InterTypography>
							<IconFinder
								iconName='MoreVertical'
								iconProps={{ height: 24, fill: 'black' }}
							/>
						</Stack>
						<Stack
							justifyContent={'space-between'}
							flexDirection={'row'}
						>
							<Stack
								gap={1}
								flexDirection={'row'}
							>
								{REPORT_TYPE.map((c) => (
									<Chip
										key={c}
										size='medium'
										label={c}
										sx={{
											fontSize: 10,
											height: 27,
											backgroundColor: restaurantReport.type === c ? '#E7EBFE' : 'transparent',
										}}
										onClick={() =>
											setRestaurantReport({
												...restaurantReport,
												type: c,
											})
										}
									/>
								))}
							</Stack>

							<YearPicker
								onRightClick={() =>
									setRestaurantReport({
										...restaurantReport,
										date: moment(restaurantReport.date).add(1, 'year'),
									})
								}
								onLeftClick={() =>
									setRestaurantReport({
										...restaurantReport,
										date: moment(restaurantReport.date).subtract(1, 'year'),
									})
								}
								onCalenderClick={(e) => handleAnchorEl({ element: e.currentTarget, box: 3 })}
								onChange={(value) => {
									setRestaurantReport({ ...restaurantReport, date: value });
									handleAnchorEl(null);
								}}
								show={Boolean(anchorEl) && anchorEl?.box === 3}
								handleClose={() => handleAnchorEl(null)}
								anchorEl={anchorEl?.element}
								date={restaurantReport.date}
								position={{ left: 100 }}
							/>
						</Stack>
						<Chart
							options={{
								chart: {
									zoom: {
										enabled: false,
									},
								},
								dataLabels: {
									enabled: false,
								},
								xaxis: {
									categories: GetTotalRestaurentCoordApi.data?.data.data?.x_axis ?? [],
								},
								yaxis: {
									labels: {
										formatter: (value) => value?.toFixed(0),
									},
									tickAmount: getMaxTickAmount(
										GetTotalRestaurentCoordApi.data?.data.data?.y_axis ?? []
									),
								},
								tooltip: {
									enabled: true,
								},
								colors: [theme.palette.primary.main],
							}}
							series={[
								{
									name: 'Total Restaurants',
									data: GetTotalRestaurentCoordApi.data?.data.data?.y_axis ?? [],
								},
							]}
							type='bar'
							height={321}
						/>
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default memo(Dashboard);
