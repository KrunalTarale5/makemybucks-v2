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
import { memo, useEffect, useState } from 'react';
import AddressDetailsForm from './AddressDetailsForm';
import IdentityProofForm from './IdentityProofForm';
import AssignRoleForm from './AssignRoleForm';
import BasicDetailsForm from './BasicDetailsForm';
import {
	UpdateSalesExecutiveContext,
	UpdateSalesExecutiveRequest,
	useGetSalesExecutivesDetailsApi,
} from '@hooks/admin-update-sales-executive';
import { useParams } from 'react-router-dom';
import { SALES_EXECUTIVE_FORM_STEPS } from '@hooks/admin-add-sales-executive';
import { BannerInformation, useBannerInfo } from '@hooks/admin-banner-info';

const UpdateSalesExecutive = () => {
	useBannerInfo(BannerInformation.subAdminUpdate);
	const theme = useTheme();
	const { id, step } = useParams() as { id: string; step: string };

	const [activeStep, setActiveStep] = useState<number>(0);
	const [formData, setFormData] = useState<UpdateSalesExecutiveRequest>(
		{} as UpdateSalesExecutiveRequest
	);

	const GetSalesExecutivesDetailsApi = useGetSalesExecutivesDetailsApi(id);

	useEffect(() => {
		setActiveStep(Number(step));
		setFormData(GetSalesExecutivesDetailsApi.data?.data as UpdateSalesExecutiveRequest);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [step, GetSalesExecutivesDetailsApi.dataUpdatedAt]);

	return (
		<Stack
			gap={5}
			paddingBottom={3}
		>
			<PoppinsTypography
				variant='h5'
				sx={{ color: theme.palette.common.primaryGreyText }}
			>
				Update Sales Executive
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
			<UpdateSalesExecutiveContext.Provider
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
			</UpdateSalesExecutiveContext.Provider>
		</Stack>
	);
};

export default UpdateSalesExecutive;

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
