import { PoppinsTypography } from '@components/Typography';
import { BannerInformation, useBannerInfo } from '@hooks/admin-banner-info';
import { Box, Stack, Tab, Tabs, useTheme } from '@mui/material';
import { useState, memo } from 'react';
import { AdminCards } from '@components/Cards';
import InvestmentTab from './InvestmentTab';
import PaybackTab from './PaybackTab';
import { useGetInvestmentDataApi } from '@hooks/admin-transation';

const TABS = ['INVESTMENT', 'PAYBACK'];

const Investment = () => {
	const theme = useTheme();
	useBannerInfo(BannerInformation.investment);
	const GetInvestmentDataApi = useGetInvestmentDataApi();

	const [value, setValue] = useState(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

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
					content={GetInvestmentDataApi.data?.data.data.total_investment}
				/>

				<AdminCards
					heading='Total Payback Amount'
					content={GetInvestmentDataApi.data?.data.data.total_payback_amount}
					sx={{ width: 250 }}
				/>
				<AdminCards
					heading='Current Payback'
					content={GetInvestmentDataApi.data?.data.data.current_payback}
				/>
				<AdminCards
					heading='Current Investment'
					content={GetInvestmentDataApi.data?.data.data.current_investment}
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

				{value === 0 && <InvestmentTab />}
				{value === 1 && <PaybackTab />}
			</Stack>
		</Stack>
	);
};

export default memo(Investment);
