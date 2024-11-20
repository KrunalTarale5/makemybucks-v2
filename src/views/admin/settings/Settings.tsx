import IconFinder from '@components/Icon';
import { PoppinsTypography } from '@components/Typography';
import { BannerInformation, useBannerInfo } from '@hooks/admin-banner-info';
import { Accordion, AccordionDetails, AccordionSummary, Stack, useTheme } from '@mui/material';
import React, { memo, useState } from 'react';
import Faq from './Faq';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfUse from './TermsOfUse';
import Profile from './Profile';
const ARCODIAN = [
	{ name: 'FAQ’s', detail: <Faq /> },
	{ name: 'Privacy Policy', detail: <PrivacyPolicy /> },
	{ name: 'Terms of Use', detail: <TermsOfUse /> },
	{ name: 'Profile', detail: <Profile /> },
];

const Settings = () => {
	useBannerInfo(BannerInformation.settings);

	const theme = useTheme();

	const [expandAccordian, setExpandAccordian] = useState<string | false>(false);
	const handleAccExpand = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
		setExpandAccordian(isExpanded ? panel : false);
	};
	return (
		<Stack gap={2}>
			<PoppinsTypography
				variant='h5'
				sx={{ color: theme.palette.common.primaryGreyText }}
			>
				All Settings
			</PoppinsTypography>
			<Stack gap={1}>
				{ARCODIAN.map((l, index) => (
					<Accordion
						key={index}
						TransitionProps={{ unmountOnExit: true }}
						expanded={expandAccordian === l.name}
						onChange={handleAccExpand(l.name)}
					>
						<AccordionSummary expandIcon={<IconFinder iconName='CircleArrowDown' />}>
							<PoppinsTypography
								variant='h5'
								sx={{ color: theme.palette.common.primaryGreyText }}
							>
								{l.name}
							</PoppinsTypography>
						</AccordionSummary>
						<AccordionDetails>{l.detail}</AccordionDetails>
					</Accordion>
				))}
			</Stack>
		</Stack>
	);
};

export default memo(Settings);
