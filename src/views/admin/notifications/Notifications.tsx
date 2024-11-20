import { PoppinsTypography } from '@components/Typography';
import { BannerInformation, useBannerInfo } from '@hooks/admin-banner-info';
import { Box, Stack, Tab, Tabs, useTheme } from '@mui/material';
import React, { memo, useState } from 'react';
import AllNotifications from './AllNotificationsTabs';
import CreateTab from './CreateTab';

const TABS = ['ALL NOTIFICATIONS', 'CREATE'];

function Notifications() {
	useBannerInfo(BannerInformation.notifications);
	const theme = useTheme();

	const [value, setValue] = useState(0);
	const [isToUpdate, setIsToUpdate] = useState<string | false>(false);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
		setIsToUpdate(false);
	};

	return (
		<Stack
			gap={2}
			flexGrow={'inherit'}
		>
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
				{value === 0 && (
					<AllNotifications
						isToUpdate={(value) => {
							setIsToUpdate(value);
							setValue(1);
						}}
					/>
				)}
				{value === 1 && <CreateTab isToUpdate={isToUpdate} />}
			</Stack>
		</Stack>
	);
}

export default memo(Notifications);
