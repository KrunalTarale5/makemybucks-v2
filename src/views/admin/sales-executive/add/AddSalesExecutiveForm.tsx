import IconFinder from '@components/Icon';
import { PoppinsTypography } from '@components/Typography';
import {
	Stack,
	Step,
	StepConnector,
	StepLabel,
	Stepper,
	stepConnectorClasses,
	styled,
	useTheme,
} from '@mui/material';
import { memo, useState } from 'react';
import AddressDetailsForm from './AddressDetailsForm';
import IdentityProofForm from './IdentityProofForm';
import {
	AddSalesExecutiveContext,
	AddSalesExecutiveRequest,
	SALES_EXECUTIVE_FORM_STEPS,
} from '@hooks/admin-add-sales-executive';
import AssignRoleForm from './AssignRoleForm';
import BasicDetailsForm from './BasicDetailsForm';
import { BannerInformation, useBannerInfo } from '@hooks/admin-banner-info';

const AddSalesExecutive = () => {
	useBannerInfo(BannerInformation.subAdminAdd);
	const theme = useTheme();

	const [activeStep, setActiveStep] = useState<number>(0);
	const [formData, setFormData] = useState<AddSalesExecutiveRequest>(
		{} as AddSalesExecutiveRequest
	);

	return (
		<Stack
			gap={5}
			paddingBottom={3}
		>
			<PoppinsTypography
				variant='h5'
				sx={{ color: theme.palette.common.primaryGreyText }}
			>
				Add Sales Executive
			</PoppinsTypography>
			<Stepper
				nonLinear
				activeStep={activeStep}
				connector={<ColorlibConnector />}
				sx={{ width: `90%`, alignSelf: 'center' }}
			>
				{SALES_EXECUTIVE_FORM_STEPS.map((label, index) => (
					<Step
						key={label}
						completed={activeStep + 1 > index}
						active={activeStep + 1 >= index}
					>
						<StepLabel
							icon={
								<IconFinder
									iconName='Checked'
									iconProps={{
										fill:
											activeStep === index
												? '#B2BDF4'
												: activeStep > index
												  ? theme.palette.primary.main
												  : '#D9D9D9',
									}}
								/>
							}
							color='inherit'
						>
							<PoppinsTypography
								variant='subtitle1'
								sx={{
									color:
										activeStep > index
											? theme.palette.common.primaryGreyText
											: theme.palette.common.secondaryGreyText,
								}}
							>
								{label}
							</PoppinsTypography>
						</StepLabel>
					</Step>
				))}
			</Stepper>
			<AddSalesExecutiveContext.Provider
				value={{
					formData,
					setFormData,
					activeStep,
					setActiveStep,
				}}
			>
				{activeStep === 0 && <BasicDetailsForm />}
				{activeStep === 1 && <AddressDetailsForm />}
				{activeStep === 2 && <IdentityProofForm />}
				{activeStep === 3 && <AssignRoleForm />}
			</AddSalesExecutiveContext.Provider>
		</Stack>
	);
};

export default memo(AddSalesExecutive);

export const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
	[`&.${stepConnectorClasses.active}`]: {
		[`& .${stepConnectorClasses.line}`]: {
			backgroundColor: '#DFE4FF',
		},
	},
	[`&.${stepConnectorClasses.completed}`]: {
		[`& .${stepConnectorClasses.line}`]: {
			backgroundColor: theme.palette.primary.main,
		},
	},
	[`& .${stepConnectorClasses.line}`]: {
		height: 4,
		border: 0,
		backgroundColor: '#E3E3E3',
		borderRadius: 8,
	},
}));
