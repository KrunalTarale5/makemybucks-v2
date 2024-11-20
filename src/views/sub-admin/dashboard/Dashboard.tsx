import { memo } from 'react';
import { Stack, useTheme } from '@mui/material';
import { PoppinsTypography } from '@components/Typography';
import SubAdminWrapper from '@components/SubAdminWrapper';
import IconFinder from '@components/Icon';
import { useNavigate } from 'react-router-dom';
import { SuAdminDetailsCards, SuAdminOutLineCards, SuAdminSquareCards } from '@components/Cards';
import { useGetSubDashboardCountApi } from '@hooks/sub-admin-dashboard';
import { useRestaurantStatus } from '@hooks/common';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { RootState } from '_store/reducers';

const Dashboard = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const getStatus = useRestaurantStatus();
	const { userInfo } = useSelector((state: RootState) => state.richPenny);

	const GetSubDashboardCountApi = useGetSubDashboardCountApi();

	return (
		<SubAdminWrapper
			subHeading={userInfo?.name ?? ''}
			heading={'Dashboard'}
			bottonToolbar
			fabButtonProps={{
				content: (
					<>
						<IconFinder iconName='Add' />
						Add Restaurant
					</>
				),
				onClick: () => navigate(`/sub-admin/restaurants/add`),
			}}
		>
			<Stack
				gap={`20px`}
				marginTop={2}
			>
				<Stack
					justifyContent={'space-between'}
					flexDirection={'row'}
					gap={'10px'}
				>
					<SuAdminSquareCards
						content='Restaurant Added'
						heading={GetSubDashboardCountApi.data?.data.data.added_sub_admin_count ?? 0}
					/>
					<SuAdminSquareCards
						content='Active Restaurant'
						heading={GetSubDashboardCountApi.data?.data.data.active_sub_admin_count ?? 0}
					/>
				</Stack>
				<SuAdminOutLineCards
					content={GetSubDashboardCountApi.data?.data.data.available_qr_count ?? 0}
					heading='Available QR Placard'
					sx={{
						borderColor: theme.palette.success.main,
					}}
				/>

				<PoppinsTypography
					variant='subtitle2'
					fontWeight={600}
					textTransform={'uppercase'}
					sx={{ color: theme.palette.common.secondaryGreyText }}
				>
					Recently Added Restaurant
				</PoppinsTypography>

				<Stack gap={2}>
					{GetSubDashboardCountApi.data?.data.data.recently_added_restaurants?.map((l, index) => {
						const status = getStatus(l.status);
						return (
							<SuAdminDetailsCards key={index}>
								<div>
									<PoppinsTypography
										variant='h6'
										fontWeight={600}
										sx={{ color: theme.palette.common.primaryGreyText }}
									>
										{l.restaurant_name}
									</PoppinsTypography>
									<PoppinsTypography
										variant='subtitle1'
										sx={{ color: theme.palette.common.secondaryGreyText }}
									>
										{l.address}
									</PoppinsTypography>
								</div>
								<Stack
									flexDirection={'row'}
									justifyContent={'space-between'}
								>
									<PoppinsTypography
										variant='subtitle2'
										sx={{ color: theme.palette.common.secondaryGreyText }}
									>
										{moment(l.added_date_time).format('DD MMM YY')}
									</PoppinsTypography>
									<PoppinsTypography
										variant='subtitle2'
										sx={{ color: theme.palette.common.secondaryGreyText, display: 'flex', gap: 1 }}
									>
										Status:
										<PoppinsTypography
											variant='subtitle2'
											sx={status.sx}
										>
											{status.lable}
										</PoppinsTypography>
									</PoppinsTypography>
								</Stack>
							</SuAdminDetailsCards>
						);
					})}
				</Stack>
			</Stack>
		</SubAdminWrapper>
	);
};

export default memo(Dashboard);
