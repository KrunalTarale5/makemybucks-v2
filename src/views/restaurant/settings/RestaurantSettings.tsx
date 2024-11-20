import IconFinder from '@components/Icon';
import { PoppinsTypography } from '@components/Typography';
import { Accordion, AccordionDetails, AccordionSummary, Stack, useTheme } from '@mui/material';
import React, { memo, useState } from 'react';
import OperationalTime from './OperationalTime';
import ProfileSettings from './ProfileSettings';
import { useBannerInfo } from '@hooks/admin-banner-info';

function RestaurantSettings() {
	useBannerInfo({ bannerName: 'Settings' });
	const theme = useTheme();
	const [expandAccordian, setExpandAccordian] = useState<string | false>(false);
	const handleAccExpand = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
		setExpandAccordian(isExpanded ? panel : false);
	};

	return (
		<Stack gap={2}>
			<Accordion
				TransitionProps={{ unmountOnExit: true }}
				expanded={expandAccordian === 'Profile'}
				onChange={handleAccExpand('Profile')}
			>
				<AccordionSummary expandIcon={<IconFinder iconName='CircleArrowDown' />}>
					<PoppinsTypography
						variant='h5'
						sx={{ color: theme.palette.common.primaryGreyText }}
					>
						Profile
					</PoppinsTypography>
				</AccordionSummary>
				<AccordionDetails>
					<ProfileSettings></ProfileSettings>
				</AccordionDetails>
			</Accordion>

			<Accordion
				TransitionProps={{ unmountOnExit: true }}
				expanded={expandAccordian === 'Operational Timing'}
				onChange={handleAccExpand('Operational Timing')}
			>
				<AccordionSummary expandIcon={<IconFinder iconName='CircleArrowDown' />}>
					<PoppinsTypography
						variant='h5'
						sx={{ color: theme.palette.common.primaryGreyText }}
					>
						Operational Timing
					</PoppinsTypography>
				</AccordionSummary>
				<AccordionDetails>
					<OperationalTime></OperationalTime>
				</AccordionDetails>
			</Accordion>
		</Stack>
	);
}

export default memo(RestaurantSettings);
