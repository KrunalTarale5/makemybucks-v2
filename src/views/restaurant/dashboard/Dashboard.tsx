import { RestaurantCards, RestaurantCardsOne, RestaurantCardsTwo } from '@components/Cards';
import IconFinder from '@components/Icon';
import Pagination from '@components/Pagination';
import Table, { ColumnDef } from '@components/Table';
import { PoppinsTypography } from '@components/Typography';
import { useBannerInfo } from '@hooks/admin-banner-info';
import { RestaurantDashboardResponse, useGetDashboardCountApi } from '@hooks/restaurant-dashboard';
import { PaginationResponse } from '@interfaces/common';
import { Stack } from '@mui/material';
import { memo } from 'react';

const Dashboard = () => {
	useBannerInfo({ bannerName: 'Dashboard' });

	const GetDashboardCountApi = useGetDashboardCountApi();

	return (
		<Stack
			gap={4}
			flexGrow={'inherit'}
		>
			<Stack
				gap={2}
				flexDirection={'row'}
				justifyContent={'space-between'}
			>
				<RestaurantCards
					heading='Upcoming Settlement'
					content={
						<>
							<IconFinder iconName='RupayV2' />{' '}
							{GetDashboardCountApi.data?.data.data.upcoming_settlement ?? 0}
						</>
					}
				/>

				<RestaurantCards
					heading='Profit Payback'
					content={
						<>
							<IconFinder iconName='RupayV2' />{' '}
							{GetDashboardCountApi.data?.data.data.profit_payback ?? 0}
						</>
					}
				/>
				<RestaurantCardsOne
					heading='Today’s Transaction'
					subtitle='Amount'
					content={
						<>
							<IconFinder iconName='RupayV2' />{' '}
							{GetDashboardCountApi.data?.data.data.todays_transaction ?? 0}
						</>
					}
					contenttwo='0'
					sx={{ backgroundColor: '#EFEFFA' }}
				/>
				<Stack gap={1}>
					<RestaurantCardsTwo
						subtitle='Active Offer'
						sx={{ '& .wrapper': { alignItems: 'center' } }}
						contenttwo={<>{GetDashboardCountApi.data?.data.data.active_offer ?? 0}%</>}
					/>
					<RestaurantCardsTwo
						subtitle='Total Onboarded'
						sx={undefined}
						contenttwo={GetDashboardCountApi.data?.data.data['Total Onboarded'] ?? 0}
					/>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default memo(Dashboard);
