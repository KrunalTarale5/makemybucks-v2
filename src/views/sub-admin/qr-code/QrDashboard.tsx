import { SuAdminOutLineCards, SuAdminSquareCards } from '@components/Cards';
import IconFinder from '@components/Icon';
import SubAdminWrapper from '@components/SubAdminWrapper';
import { PoppinsTypography } from '@components/Typography';
import { useGetSubAdminQrDashboardApi } from '@hooks/sub-admin-qr';
import { Paper, Stack, useTheme } from '@mui/material';
import moment from 'moment';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

const QrDashboard = () => {
	const theme = useTheme();
	const GetSubAdminQrDashboardApi = useGetSubAdminQrDashboardApi();

	const navigate = useNavigate();
	return (
		<SubAdminWrapper
			heading={'QR Code'}
			bottonToolbar
			fabButtonProps={{
				content: (
					<>
						<IconFinder iconName='Add' />
						Assign QR
					</>
				),
				onClick: () => navigate(`/sub-admin/qr/assign`),
			}}
		>
			<Stack gap={`20px`}>
				<Stack
					justifyContent={'space-between'}
					flexDirection={'row'}
					gap={'10px'}
				>
					<SuAdminSquareCards
						content='Total QR Received'
						heading={
							GetSubAdminQrDashboardApi.data?.data.dashboard_data?.total_qr_assigned_count ?? 0
						}
					/>
					<SuAdminSquareCards
						content='QR Assigned'
						heading={GetSubAdminQrDashboardApi.data?.data.dashboard_data?.qr_assigned_count ?? 0}
					/>
				</Stack>

				<SuAdminOutLineCards
					content={GetSubAdminQrDashboardApi.data?.data.dashboard_data?.available_qr_count}
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
					Recently QR Assigned
				</PoppinsTypography>

				<Stack gap={2}>
					{GetSubAdminQrDashboardApi.data?.data.restaurants?.map((l, index) => (
						<Paper
							key={index}
							sx={{ padding: 3, display: 'flex', flexDirection: 'column', gap: 4 }}
						>
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
									{moment(l['added date']).format('DD MMM YY')}
								</PoppinsTypography>
								<PoppinsTypography
									variant='subtitle2'
									sx={{ color: theme.palette.common.secondaryGreyText, display: 'flex', gap: 1 }}
								>
									QR Assigned:
									<PoppinsTypography
										variant='subtitle2'
										sx={{ color: theme.palette.common.primaryGreyText, fontWeight: 600 }}
									>
										{l['assigned qr']}
									</PoppinsTypography>
								</PoppinsTypography>
							</Stack>
						</Paper>
					))}
				</Stack>
			</Stack>
		</SubAdminWrapper>
	);
};

export default memo(QrDashboard);
