import { useAlertDialog } from '@components/AlertDialog';
import SubAdminSuccess from '@components/SubAdminSuccess';
import SubAdminWrapper from '@components/SubAdminWrapper';
import { PoppinsTypography } from '@components/Typography';
import {
	AddRestaurantContext,
	useAddRestaurantApi,
	useGetAgreementsApi,
	useResendOTPApi,
	useSendOTPApi,
	useVerifyOTPApi,
} from '@hooks/sub-admin-add-restaurant';
import { Option } from '@interfaces/common';
import { Box, Stack, TextField, useTheme } from '@mui/material';
import { RootState } from '_store/reducers';
import { memo, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

interface FormData {
	[key: number]: number | string;
}

const intialFormData: FormData = {};

const AgreementApproval = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const formContext = useContext(AddRestaurantContext);
	const { userInfo } = useSelector((state: RootState) => state.richPenny);
	const { showAlertDialog, hideAlertDialog } = useAlertDialog();
	const SendOTPApi = useSendOTPApi();
	const ResendOTPApi = useResendOTPApi();
	const VerifyOTPApi = useVerifyOTPApi();

	const [otp, setOtp] = useState<FormData>(intialFormData);
	const [showOTP, setShowOTP] = useState<boolean>(false);

	const AddRestaurantApi = useAddRestaurantApi();
	const GetAgreementsApi = useGetAgreementsApi(
		(formContext.formData.agreement_type as Option).value
	);
	const Agreement = GetAgreementsApi.data?.data.agreements[0]?.agreement_text
		.replaceAll('VAR_RestaurantName', formContext.formData.restaurant_name)
		.replaceAll('VAR_OwnerName', formContext.formData.owner_name)
		.replaceAll('VAR_RestaurantAddress', formContext.formData.address)
		.replaceAll('VAR_RestaurantGST', formContext.formData.gst_no)
		.replaceAll('VAR_RestaurantPAN', formContext.formData.pan_no)
		.replaceAll('VAR_RestaurantContact', String(formContext.formData.contact_no))
		.replaceAll('VAR_RestaurantAgreedPercentage', formContext.formData.agreed_percentage)
		.replaceAll('VAR_RestaurantAccountHolderName', formContext.formData.res_acc_holder_name)
		.replaceAll('VAR_RestaurantBankName', formContext.formData.bank_name)
		.replaceAll('VAR_RestaurantAccount', String(formContext.formData.bank_acc_no))
		.replaceAll('VAR_RestaurantIFSC', String(formContext.formData.ifsc_no))
		.replaceAll('VAR_AgreementPeriod', (formContext.formData.agreement_period as Option)?.label)
		.replaceAll('VAR_Sign', '')
		.replaceAll('VAR_Otp_Text', '')
		.replaceAll('VAR Date', `${new Date().toLocaleDateString()}`);

	const AgreementCopy = GetAgreementsApi.data?.data.agreements[0]?.agreement_text
		.replaceAll('VAR_RestaurantName', formContext.formData.restaurant_name)
		.replaceAll('VAR_OwnerName', formContext.formData.owner_name)
		.replaceAll('VAR_RestaurantAddress', formContext.formData.address)
		.replaceAll('VAR_RestaurantGST', formContext.formData.gst_no)
		.replaceAll('VAR_RestaurantPAN', formContext.formData.pan_no)
		.replaceAll('VAR_RestaurantContact', String(formContext.formData.contact_no))
		.replaceAll('VAR_RestaurantAgreedPercentage', formContext.formData.agreed_percentage)
		.replaceAll('VAR_RestaurantAccountHolderName', formContext.formData.res_acc_holder_name)
		.replaceAll('VAR_RestaurantBankName', formContext.formData.bank_name)
		.replaceAll('VAR_RestaurantAccount', String(formContext.formData.bank_acc_no))
		.replaceAll('VAR_RestaurantIFSC', String(formContext.formData.ifsc_no))
		.replaceAll('VAR_AgreementPeriod', (formContext.formData.agreement_period as Option)?.label)
		.replaceAll(
			'VAR_Sign',
			'<img src="https://api.makemybucks.com/media/client_signature/Ayush_Signature_Agreement.png" alt="Signature" height="115px"></img>'
		)
		.replaceAll('VAR_Otp_Text', 'OTP Verified')
		.replaceAll('VAR Date', `${new Date().toLocaleDateString()}`);

	const onInputChange =
		(number: number) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			if (event.target.value?.trim() === '') {
				setOtp({
					...otp,
					[number]: '',
				});
				document.getElementById(`otp-erify-${number - 1}`)?.focus();
			} else if (!isNaN(Number(event.target.value))) {
				if (event.target.value?.trim().length === 1) {
					setOtp({
						...otp,
						[number]: Number(event.target.value),
					});
					document.getElementById(`otp-erify-${number + 1}`)?.focus();
				}
			}
		};

	const handleBackClick = () => {
		formContext.setActiveStep(formContext.activeStep - 1);
	};
	const onProceedClick = () => {
		SendOTPApi.mutateAsync({ request: { owner_no: formContext.formData.owner_no } })
			.then(() => {
				setShowOTP(true);
			})
			.catch((error) => {
				setShowOTP(false);

				showAlertDialog({
					content: (
						<PoppinsTypography variant='subtitle2'>
							{error?.response?.data?.message}
						</PoppinsTypography>
					),
					buttons: [
						{
							children: 'ok',
							variant: 'outlined',
							callback: () => {
								hideAlertDialog();
							},
						},
					],
				});
			});
	};
	const onVerifyOTPClick = () => {
		VerifyOTPApi.mutateAsync({
			request: {
				otp_no: Object.values(otp).join(''),
				owner_no: formContext.formData.owner_no,
				restaurant_id: SendOTPApi.data?.data.restaurant_id as string,
			},
		}).catch((error) => {
			showAlertDialog({
				title: error?.response?.data?.message,
				buttons: [
					{
						children: 'ok',
						variant: 'outlined',
						callback: () => {
							hideAlertDialog();
						},
					},
				],
			});
		});
	};

	const handleResendOTP = () => {
		void ResendOTPApi.mutateAsync({
			request: {
				owner_no: formContext.formData.owner_no,
				restaurant_id: SendOTPApi.data?.data.restaurant_id as string,
			},
		})
			.then(() => {
				showAlertDialog({
					title: 'otp sent to your registerd mobile no',
					buttons: [
						{
							children: 'ok',
							variant: 'outlined',
							callback: () => {
								hideAlertDialog();
							},
						},
					],
				});
			})
			.catch(() => {
				showAlertDialog({
					title: 'something went wrong',
					buttons: [
						{
							children: 'ok',
							variant: 'outlined',
							callback: () => {
								hideAlertDialog();
							},
						},
					],
				});
			});
	};

	const onBackToHomelick = () => {
		navigate(`/sub-admin/restaurants/dashboard`);
	};

	useEffect(() => {
		if (VerifyOTPApi.isSuccess) {
			AddRestaurantApi.mutateAsync({
				id: VerifyOTPApi.data?.data?.restaurant_id as string,
				request: {
					...formContext.formData,
					restaurant_type: (formContext.formData.restaurant_type as Option)?.label,
					cuisine: (formContext.formData.cuisine as Option[])?.map((c) => c.label),
					location: (formContext.formData.location as Option)?.label,
					agreement_period: (formContext.formData.agreement_period as Option)?.label,
					sub_admin_id: userInfo?.id as string,
					added_by: userInfo?.name as string,
					agreement_type: (formContext.formData.agreement_type as Option)?.label,
					agreement_text: AgreementCopy,
				},
			})
				.then(() => {
					setShowOTP(false);
				})
				.catch((error) => {
					setShowOTP(false);

					showAlertDialog({
						content: (
							<PoppinsTypography variant='subtitle2'>
								{error?.response?.data?.message}
							</PoppinsTypography>
						),
						buttons: [
							{
								children: 'ok',
								variant: 'outlined',
								callback: () => {
									hideAlertDialog();
								},
							},
						],
					});
					setShowOTP(false);
				});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [VerifyOTPApi.isSuccess]);

	return (
		<SubAdminWrapper
			heading={AddRestaurantApi.isSuccess ? undefined : 'Add Restaurant'}
			controlButtonProps={{
				loading: VerifyOTPApi.isLoading || SendOTPApi.isLoading || AddRestaurantApi.isLoading,
				content: AddRestaurantApi.isSuccess
					? `Back to Home`
					: showOTP
					  ? `Verify OTP`
					  : `Proceed For Approval`,
				onClick: AddRestaurantApi.isSuccess
					? onBackToHomelick
					: showOTP
					  ? onVerifyOTPClick
					  : onProceedClick,
			}}
			handleBack={handleBackClick}
		>
			<>
				<>
					<Stack
						gap={2}
						height={AddRestaurantApi.isSuccess ? 'inherit' : undefined}
					>
						{!AddRestaurantApi.isSuccess && (
							<Stack
								flexDirection={'row'}
								justifyContent={'space-between'}
								overflow={'hidden'}
							>
								<PoppinsTypography
									variant='subtitle1'
									fontWeight={600}
									textTransform={'uppercase'}
									sx={{ color: theme.palette.common.secondaryGreyText }}
								>
									Agreement approval
								</PoppinsTypography>
								<PoppinsTypography
									variant='subtitle1'
									fontWeight={600}
									sx={{ color: theme.palette.common.primaryGreyText }}
								>
									Steps 4/4
								</PoppinsTypography>
							</Stack>
						)}
						{AddRestaurantApi.isSuccess && (
							<SubAdminSuccess heading='Restaurant Created Successfully!' />
						)}
						{showOTP && (
							<>
								<Stack>
									<PoppinsTypography
										variant='h5'
										fontWeight={600}
										sx={{ color: theme.palette.common.primaryGreyText }}
									>
										Enter OTP for Approval
									</PoppinsTypography>
									<PoppinsTypography
										variant='subtitle2'
										sx={{ color: theme.palette.common.secondaryGreyText }}
									>
										Approval OTP Sent at {formContext.formData?.owner_no}
									</PoppinsTypography>
								</Stack>

								<Stack
									gap={1}
									flexDirection={'row'}
									maxWidth={362}
									alignSelf={'center'}
								>
									{Array.from(Array(6).keys()).flatMap((v, i) => (
										<TextField
											id={`otp-erify-${i}`}
											variant='outlined'
											color='primary'
											autoComplete='off'
											name='usename'
											type={'text'}
											inputMode='numeric'
											onChange={onInputChange(i)}
											value={otp[i] ?? ''}
											sx={{
												'.MuiInputBase-input': {
													textAlign: 'center',
													paddingY: 3,
													fontSize: 35,
													paddingX: 0,
												},
												'.MuiInputBase-root': {
													height: 68,
												},
											}}
										/>
									))}
								</Stack>

								<PoppinsTypography
									variant='subtitle2'
									display={'inline-flex'}
									gap={1}
									sx={{
										color: theme.palette.common.primaryGreyText,
									}}
								>
									{`Did receive? `}
									<PoppinsTypography
										variant='subtitle2'
										sx={{
											color: '#0062FF',
										}}
										onClick={handleResendOTP}
									>
										{` Re-Send OTP`}
									</PoppinsTypography>
								</PoppinsTypography>
							</>
						)}

						{!AddRestaurantApi.isSuccess && !showOTP && (
							<Box
								sx={{
									borderStyle: 'solid',
									borderWidth: 1,
									borderRadius: 1,
									borderColor: `#C8CBD9`,
									padding: 2,
									overflow: 'auto',
									height: `72vh`,
								}}
							>
								<PoppinsTypography
									variant='subtitle1'
									fontWeight={600}
									align='center'
									paddingBottom={1}
								>
									Partnership Agreement
								</PoppinsTypography>
								<div dangerouslySetInnerHTML={{ __html: Agreement as string }} />
							</Box>
						)}
					</Stack>
				</>
			</>
		</SubAdminWrapper>
	);
};

export default memo(AgreementApproval);
