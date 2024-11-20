import { AdminCards } from '@components/Cards';
import { PoppinsTypography } from '@components/Typography';
import { BannerInformation, useBannerInfo } from '@hooks/admin-banner-info';
import { Box, Stack, Tab, Tabs, useTheme } from '@mui/material';
import { memo, useState } from 'react';
import ManageTab from './ManageTab';
import HistoryTableTab from './HistoryTableTab';
import GenerateTab from './GenerateTab';
import { useGetQrCodeCountApi } from '@hooks/admin-qrcode';

const TABS = ['HISTORY TABLE', 'MANAGE', 'GENERATE'];

const QrCodeManagement = () => {
	useBannerInfo(BannerInformation.qrManagement);

	const theme = useTheme();
	const GetQrCodeCountApi = useGetQrCodeCountApi();

	const [value, setValue] = useState(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<Stack
			gap={3}
			flexGrow={'inherit'}
		>
			<Stack
				flexDirection={'row'}
				gap={2}
			>
				<AdminCards
					heading='Total QR Generated'
					content={GetQrCodeCountApi.data?.data.data.total_qr_generated_count as number}
					sx={{
						'.MuiTypography-subtitle1': { color: theme.palette.common.secondaryGreyText },
						width: '240px',
					}}
				/>
				<AdminCards
					heading='Available for Download'
					content={GetQrCodeCountApi.data?.data.data.available_qr_count as number}
					sx={{
						'.MuiTypography-subtitle1': { color: theme.palette.common.secondaryGreyText },
						width: '240',
					}}
				/>

				<AdminCards
					heading='Available for printing'
					content={GetQrCodeCountApi.data?.data.data.download_qr_count as number}
					sx={{
						'.MuiTypography-subtitle1': { color: theme.palette.common.secondaryGreyText },
						width: '240px',
					}}
				/>
				<AdminCards
					heading='Available for Handover'
					content={GetQrCodeCountApi.data?.data.data.available_for_handover_count as number}
					sx={{
						'.MuiTypography-subtitle1': { color: theme.palette.common.secondaryGreyText },
						width: '240',
					}}
				/>
				<AdminCards
					heading='Active'
					content={GetQrCodeCountApi.data?.data.data.active_qr_count as number}
					sx={{ '.MuiTypography-subtitle1': { color: theme.palette.success.main }, width: '240px' }}
				/>
				<AdminCards
					heading='Disabled QR'
					content={GetQrCodeCountApi.data?.data.data.disabled_qr_count as number}
					sx={{
						'.MuiTypography-subtitle1': { color: theme.palette.common.secondaryGreyText },
						width: '240px',
					}}
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
								sx={{ minWidth: '33.3%' }}
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

				{value === 0 && <HistoryTableTab />}
				{value === 1 && <ManageTab refetch={() => void GetQrCodeCountApi.refetch()} />}
				{value === 2 && <GenerateTab refetch={() => void GetQrCodeCountApi.refetch()} />}
			</Stack>
		</Stack>
	);
};

export default memo(QrCodeManagement);
