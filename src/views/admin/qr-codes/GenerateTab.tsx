import IconFinder from '@components/Icon';
import { PoppinsTypography } from '@components/Typography';
import { Accordion, AccordionDetails, AccordionSummary, Stack, useTheme } from '@mui/material';
import { FC, memo, useState } from 'react';
import GenerateQrCode from './GenerateQrCode';
import DownloadQrCode from './DownloadQrCode';

interface GenerateTabProps {
	refetch: () => void;
}

const GenerateTab: FC<GenerateTabProps> = (props) => {
	const theme = useTheme();
	const [expandAccordian, setExpandAccordian] = useState<string | false>(false);
	const handleAccExpand = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
		setExpandAccordian(isExpanded ? panel : false);
	};
	return (
		<Stack gap={2}>
			<Accordion
				TransitionProps={{ unmountOnExit: true }}
				expanded={expandAccordian === 'Generate QR Code'}
				onChange={handleAccExpand('Generate QR Code')}
			>
				<AccordionSummary expandIcon={<IconFinder iconName='CircleArrowDown' />}>
					<PoppinsTypography
						variant='h5'
						sx={{ color: theme.palette.common.primaryGreyText }}
					>
						Generate QR Code
					</PoppinsTypography>
				</AccordionSummary>
				<AccordionDetails>
					<GenerateQrCode refetch={props.refetch} />
				</AccordionDetails>
			</Accordion>

			<Accordion
				TransitionProps={{ unmountOnExit: true }}
				expanded={expandAccordian === 'Download QR Code'}
				onChange={handleAccExpand('Download QR Code')}
			>
				<AccordionSummary expandIcon={<IconFinder iconName='CircleArrowDown' />}>
					<PoppinsTypography
						variant='h5'
						sx={{ color: theme.palette.common.primaryGreyText }}
					>
						Download QR Code
					</PoppinsTypography>
				</AccordionSummary>
				<AccordionDetails>
					<DownloadQrCode refetch={props.refetch} />
				</AccordionDetails>
			</Accordion>
		</Stack>
	);
};

export default memo(GenerateTab);
