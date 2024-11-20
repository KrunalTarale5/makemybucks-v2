/* eslint-disable indent */
import { AdminCards } from '@components/Cards';
import IconFinder from '@components/Icon';
import InputField, { InputFieldValue } from '@components/InputField';
import { useSnackbar } from '@components/Snackbar';
import { PoppinsTypography } from '@components/Typography';
import Uploader from '@components/Uploader';
import { BannerInformation, useBannerInfo } from '@hooks/admin-banner-info';
import {
	BannerRequest,
	InitialBannerResponse,
	useBannerPublishApi,
	useBannerUnPublishApi,
	useGetBannerRestaurantNamesApi,
	useGetInitialBannersApi,
	validateBannerFields,
	validateBannerForm,
} from '@hooks/admin-banners';
import { FormErrorMessage } from '@interfaces/common';
import { LoadingButton } from '@mui/lab';
import { FormHelperText, Stack, useTheme } from '@mui/material';
import { memo, useEffect, useState } from 'react';

const intialFormData: Partial<BannerRequest> = {
	b1_restaurant_id: '',
	b2_restaurant_id: '',
	b3_restaurant_id: '',
	b4_restaurant_id: '',

	BannerImg1: '',
	BannerImg2: '',
	BannerImg3: '',
	BannerImg4: '',
};
const intialFormError: FormErrorMessage<Partial<BannerRequest>> = {
	// b1_restaurant_id: '',
	// b2_restaurant_id: '',
	// b3_restaurant_id: '',
	// b4_restaurant_id: '',

	BannerImg1: '',
	BannerImg2: '',
	BannerImg3: '',
	BannerImg4: '',
};

const Banner = () => {
	useBannerInfo(BannerInformation.banners);
	const theme = useTheme();

	const GetInitialBannersApi = useGetInitialBannersApi();

	return (
		<Stack gap={4}>
			<Stack>
				<AdminCards
					heading='Total Banner'
					content={
						<PoppinsTypography
							variant='h4'
							fontWeight={600}
							sx={{ color: theme.palette.common.primaryGreyText }}
						>
							{GetInitialBannersApi.data?.data.data[0].banner_count}
							<PoppinsTypography
								variant='subtitle1'
								sx={{ color: theme.palette.common.secondaryGreyText, display: 'contents' }}
							>
								/4
							</PoppinsTypography>
						</PoppinsTypography>
					}
				/>
			</Stack>

			<Stack
				gap={2}
				flexDirection={'row'}
			>
				{Array.from(Array(4).keys()).map((b, index) => (
					<BannerFields
						key={index}
						index={index + 1}
					/>
				))}
			</Stack>
		</Stack>
	);
};

export default memo(Banner);

const BannerFields = (props: { index: number }) => {
	const theme = useTheme();

	const { showSnackbar, hideSnackbar } = useSnackbar();

	const GetInitialBannersApi = useGetInitialBannersApi();
	const BannerPublishApi = useBannerPublishApi();
	const BannerUnPublishApi = useBannerUnPublishApi();
	const GetBnnerRestaurantNamesApi = useGetBannerRestaurantNamesApi();

	const [formData, setFormData] = useState(intialFormData);
	const [formError, setFormError] = useState(intialFormError);

	const data = GetInitialBannersApi.data?.data.data?.[0];
	const intialBannerImg =
		data?.[`banner_${props.index}` as keyof InitialBannerResponse['data'][number]];
	const intialRestaurantId = GetBnnerRestaurantNamesApi.data?.data.restaurant_list.find(
		(r) =>
			r.value ===
			data?.[`b${props.index}_restaurant_id` as keyof InitialBannerResponse['data'][number]]
	);
	const intialBannerStatus =
		data?.[`b${props.index}_publish_status` as keyof InitialBannerResponse['data'][number]];
	const onChange = (fieldName: string, value: InputFieldValue) => {
		const _formData = { ...formData, [fieldName]: value };
		setFormData(_formData);
		setFormError({
			...formError,
			[fieldName]: validateBannerFields(fieldName as keyof BannerRequest, _formData),
		});
	};

	const uploadBanner = (fieldName: string, value: InputFieldValue) => {
		BannerPublishApi.mutateAsync({
			request: {
				[fieldName]: value,
			},
		})
			.then((response) => {
				showSnackbar({
					title: 'Success!',
					variant: 'sucess',
					content: response.data?.message,
					onCancel: () => hideSnackbar(),
				});
				setFormData(intialFormData);
				void GetInitialBannersApi.refetch();
			})
			.catch((error) => {
				showSnackbar({
					title: 'Error!',
					variant: 'error',
					content: error.response?.data?.message,
					onCancel: () => hideSnackbar(),
				});
			});
	};

	const publishClick = () => {
		const validatation = validateBannerForm({
			[`b${props.index}_restaurant_id`]:
				formData[`b${props.index}_restaurant_id` as keyof typeof formData],
		});
		if (validatation.hasError) {
			setFormError(validatation.errors);
			return;
		}
		BannerPublishApi.mutateAsync({
			request: { ...formData, [`b${props.index}_publish_status`]: '1' },
		})
			.then((response) => {
				showSnackbar({
					title: 'Success!',
					variant: 'sucess',
					content: response.data?.message,
					onCancel: () => hideSnackbar(),
				});
				setFormData(intialFormData);
				void GetInitialBannersApi.refetch();
			})
			.catch((error) => {
				showSnackbar({
					title: 'Error!',
					variant: 'error',
					content: error.response?.data?.message,
					onCancel: () => hideSnackbar(),
				});
			});
	};

	const unPublishClick = () => {
		BannerPublishApi.mutateAsync({
			request: { [`b${props.index}_restaurant_id`]: null, [`b${props.index}_publish_status`]: '0' },
		})
			.then((response) => {
				showSnackbar({
					title: 'Success!',
					variant: 'sucess',
					content: response.data?.message,
					onCancel: () => hideSnackbar(),
				});
				setFormData(intialFormData);
				void GetInitialBannersApi.refetch();
			})
			.catch((error) => {
				showSnackbar({
					title: 'Error!',
					variant: 'error',
					content: error.response?.data?.message,
					onCancel: () => hideSnackbar(),
				});
			});
	};

	useEffect(() => {
		setFormData({
			...formData,
			[`BannerImg${props.index}`]: data ? intialBannerImg : '',
			[`b${props.index}_publish_status`]: data ? intialBannerStatus : '',
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [GetInitialBannersApi.dataUpdatedAt]);

	return (
		<>
			<Stack
				gap={4}
				width={`24%`}
			>
				<Stack>
					<Uploader
						fieldName={`BannerImg${props.index}`}
						sx={{
							placeContent: 'flex-end',
							height: 182,
							borderRadius: '20px',
							boxShadow: `0px 4px 8px 0px #00000033`,
							justifyContent: 'center',
							alignItems: 'center',
						}}
						file={(formData[`BannerImg${props.index}` as keyof typeof formData] as FileList) ?? ''}
						overlay={
							<Stack
								sx={{
									flexDirection: 'row',
									position: 'absolute',
									justifyContent: 'center',
									alignItems: 'center',
									bottom: 0,
									borderBottomLeftRadius: '20px',
									borderBottomRightRadius: '20px',
									backgroundColor: '#171A2099',
									width: '100%',
									height: '43px',
									gap: 1,
								}}
							>
								<IconFinder
									iconName='Replace'
									iconProps={{ width: 16, height: 16 }}
								/>
								<PoppinsTypography
									variant='subtitle1'
									sx={{ color: theme.palette.common.white }}
								>
									Replace
								</PoppinsTypography>
							</Stack>
						}
						onChange={(event) =>
							uploadBanner(`BannerImg${props.index}`, event.target.files as InputFieldValue)
						}
					>
						<PoppinsTypography variant='subtitle1'>Default Banner</PoppinsTypography>
					</Uploader>
					{formError[`BannerImg${props.index}` as keyof typeof formError] && (
						<FormHelperText
							error={Boolean(formError[`BannerImg${props.index}` as keyof typeof formError])}
						>
							{formError[`BannerImg${props.index}` as keyof typeof formError]}
						</FormHelperText>
					)}
				</Stack>

				<Stack>
					<PoppinsTypography
						variant='subtitle1'
						sx={{ color: theme.palette.common.secondaryGreyText }}
					>
						Link to (Optional)
					</PoppinsTypography>

					<Stack gap={3}>
						<InputField
							fieldName={`b${props.index}_restaurant_id`}
							value={
								intialRestaurantId
									? intialRestaurantId
									: formData[`b${props.index}_restaurant_id` as keyof typeof formData] ?? ''
							}
							fieldProps={{
								disabled: !intialBannerImg,
								placeholder: 'Select restaurant',
								// error: Boolean(
								// 	formError[`b${props.index}_restaurant_id` as keyof typeof formError]
								// ),
								// helperText: formError[`b${props.index}_restaurant_id` as keyof typeof formError],
								size: 'medium',
								options: GetBnnerRestaurantNamesApi.data?.data.restaurant_list,
								sx: {
									'& .MuiOutlinedInput-notchedOutline': {
										borderColor: theme.palette.common.secondaryGreyText,
										borderRadius: `8px`,
									},
									'& .MuiInputBase-input': {
										height: 11,
									},
									'& .MuiInputBase-root': {
										width: '100%',
									},
									'& .MuiTypography-subtitle1': {
										color: theme.palette.common.secondaryGreyText,
									},
								},
							}}
							fieldType={'select'}
							onChange={onChange}
						/>
						{intialBannerStatus === '0' ||
						intialBannerStatus === null ||
						Boolean(formData[`b${props.index}_restaurant_id` as keyof typeof formData]) ? (
							<LoadingButton
								size='large'
								variant='contained'
								color='primary'
								sx={{
									borderRadius: '8px',
									height: 51,
								}}
								onClick={publishClick}
								disabled={
									!(
										intialBannerImg ||
										Boolean(formData[`b${props.index}_restaurant_id` as keyof typeof formData])
									)
								}
								loading={BannerPublishApi.isLoading}
							>
								<PoppinsTypography variant='subtitle1'>Publish</PoppinsTypography>
							</LoadingButton>
						) : (
							<LoadingButton
								size='large'
								variant='outlined'
								color='primary'
								sx={{
									borderRadius: '8px',
									height: 51,
								}}
								onClick={unPublishClick}
								loading={BannerUnPublishApi.isLoading}
							>
								<PoppinsTypography
									variant='subtitle1'
									sx={{ color: theme.palette.common.primaryGreyText }}
								>
									Un-Publish
								</PoppinsTypography>
							</LoadingButton>
						)}
					</Stack>
				</Stack>
			</Stack>
		</>
	);
};
