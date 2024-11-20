import IconFinder from '@components/Icon';
import { PoppinsTypography } from '@components/Typography';
import { Accordion, AccordionDetails, AccordionSummary, Stack, useTheme } from '@mui/material';
import { FC, memo, useState } from 'react';
import HandoverQr from './HandoverQr';
import QrPlacard from './QrPlacard';

interface ManageTabProps {
	refetch: () => void;
}

const ManageTab: FC<ManageTabProps> = (props) => {
	const theme = useTheme();
	const [expandAccordian, setExpandAccordian] = useState<string | false>(false);
	const handleAccExpand = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
		setExpandAccordian(isExpanded ? panel : false);
	};
	return (
		<Stack gap={2}>
			<Accordion
				TransitionProps={{ unmountOnExit: true }}
				expanded={expandAccordian === 'Handover QR'}
				onChange={handleAccExpand('Handover QR')}
			>
				<AccordionSummary expandIcon={<IconFinder iconName='CircleArrowDown' />}>
					<PoppinsTypography
						variant='h5'
						sx={{ color: theme.palette.common.primaryGreyText }}
					>
						Handover QR
					</PoppinsTypography>
				</AccordionSummary>
				<AccordionDetails>
					<HandoverQr refetch={props.refetch}></HandoverQr>
				</AccordionDetails>
			</Accordion>

			<Accordion
				TransitionProps={{ unmountOnExit: true }}
				expanded={expandAccordian === 'QR Placard'}
				onChange={handleAccExpand('QR Placard')}
			>
				<AccordionSummary expandIcon={<IconFinder iconName='CircleArrowDown' />}>
					<PoppinsTypography
						variant='h5'
						sx={{ color: theme.palette.common.primaryGreyText }}
					>
						QR Placard Received
					</PoppinsTypography>
				</AccordionSummary>
				<AccordionDetails>
					<QrPlacard refetch={props.refetch}></QrPlacard>
				</AccordionDetails>
			</Accordion>
		</Stack>
	);
};

export default memo(ManageTab);
