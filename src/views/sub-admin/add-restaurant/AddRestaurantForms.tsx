import { AddRestaurantContext, AddRestaurantFormRequest } from '@hooks/sub-admin-add-restaurant';
import { memo, useState } from 'react';
import BasicDetailsForm from './BasicDetailsForm';
import ContractTermForm from './ContractTermForm';
import AddDocumentsForm from './AddDocumentsForm';
import AgreementApproval from './AgreementApproval';

const AddRestaurantForms = () => {
	const [activeStep, setActiveStep] = useState<number>(0);
	const [formData, setFormData] = useState<AddRestaurantFormRequest>(
		{} as AddRestaurantFormRequest
	);

	return (
		<AddRestaurantContext.Provider
			value={{
				formData,
				setFormData,
				activeStep,
				setActiveStep,
			}}
		>
			{activeStep === 0 && <BasicDetailsForm />}
			{activeStep === 1 && <AddDocumentsForm />}
			{activeStep === 2 && <ContractTermForm />}
			{activeStep === 3 && <AgreementApproval />}
		</AddRestaurantContext.Provider>
	);
};

export default memo(AddRestaurantForms);
