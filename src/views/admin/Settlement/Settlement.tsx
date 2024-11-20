import { PoppinsTypography } from '@components/Typography';
import { BannerInformation, useBannerInfo } from '@hooks/admin-banner-info';
import { Box, Stack, Tab, Tabs, useTheme } from '@mui/material';
import { useState, memo, useEffect } from 'react';
import { AdminCards } from '@components/Cards';
import UserTab from './UserTab';
import VendorTab from './VendorTab';
import { useGetSettlementUserResponseApi } from '@hooks/admin-settlement';
const TABS = ['USER', 'VENDOR'];

const Settlement = () => {
	const theme = useTheme();
	useBannerInfo(BannerInformation.settlement);
	const GetSettlementUserResponseApi = useGetSettlementUserResponseApi();

	const [value, setValue] = useState(0);
	const [totalInvestmentCount, setTotalInvestmentCount] = useState('');
	const [totalPayback, setTotalPayback] = useState('');
	const [currentPayback, setCurrentPayback] = useState('');
	const [currentInvestimet, setCurrentInvestment] = useState('');
	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	useEffect(() => {
		setTotalInvestmentCount(GetSettlementUserResponseApi.data?.data.data.total_investment ?? 'NA');
		setTotalPayback(GetSettlementUserResponseApi.data?.data.data.total_payback_amount ?? 'NA');
		setCurrentPayback(GetSettlementUserResponseApi.data?.data.data.current_payback ?? 'NA');
		setCurrentInvestment(GetSettlementUserResponseApi.data?.data.data.current_investment ?? 'NA');
	}, [GetSettlementUserResponseApi]);
	return (
		<Stack
			gap={2}
			flexGrow={'inherit'}
		>
			<Stack
				gap={2}
				flexDirection={'row'}
			>
				<AdminCards
					heading='Total Investment'
					content={`₹${totalInvestmentCount}`}
				/>

				<AdminCards
					heading='Total Payback Amount'
					content={`₹${totalPayback}`}
					sx={{ width: 250 }}
				/>
				<AdminCards
					heading='Current Payback'
					content={`₹${currentPayback}`}
				/>
				<AdminCards
					heading='Current Investment'
					content={`₹${currentInvestimet}`}
				/>
			</Stack>
			<Stack
				gap={2}
				flexGrow={1}
			>
				<Box
					sx={{ width: '100%', padding: '8px', backgroundColor: '#E9EBF0', borderRadius: '8px' }}
				>
					<Tabs
						value={value}
						onChange={handleChange}
					>
						{TABS.map((l, index) => (
							<Tab
								sx={{ minWidth: '50%' }}
								label={
									<PoppinsTypography
										variant='subtitle1'
										sx={{ color: theme.palette.common.primaryGreyText }}
									>
										{l}
									</PoppinsTypography>
								}
								key={index}
							/>
						))}
					</Tabs>
				</Box>

				{value === 0 && <UserTab />}
				{value === 1 && <VendorTab />}
			</Stack>
		</Stack>
	);
};

export default memo(Settlement);
