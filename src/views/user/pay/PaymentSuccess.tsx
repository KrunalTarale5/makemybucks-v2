import IconFinder from '@components/Icon';
import UserAppWrapper from '@components/UserAppWrapper';
import { Rating, Stack, useTheme } from '@mui/material';
import { FC, memo } from 'react';
import CelebrationTriangles from '_assets/icons/celebration-triangles.svg';
import { FiraSansTypography } from '@components/Typography';
import Uploader from '@components/Uploader';
import { GetDeepLinkInfoResponse, usePostRatingApi } from '@hooks/user-app-payment';

type PaymentSuccessProps = { data?: GetDeepLinkInfoResponse['data'] & { amount?: string } };

const PaymentSuccess: FC<PaymentSuccessProps> = (props) => {
	const theme = useTheme();
	const postRatingApi = usePostRatingApi();
	return (
		<UserAppWrapper>
			<Stack
				gap={1}
				flexGrow={1}
				justifyContent={'space-between'}
				sx={{
					backgroundSize: 'contain',
					backgroundImage: `url(${CelebrationTriangles})`,
					backgroundRepeat: 'no-repeat',
				}}
			>
				<Stack gap={1}>
					<Stack
						alignSelf={'center'}
						paddingTop={`30vh`}
					>
						<IconFinder
							iconName='SuccessLogo'
							iconProps={{ fill: theme.palette.success.main }}
						/>
					</Stack>

					<FiraSansTypography
						variant='h4'
						textAlign={'center'}
						fontWeight={600}
						sx={{ color: theme.palette.common.white }}
					>
						Payment Successful
					</FiraSansTypography>
					<FiraSansTypography
						variant='subtitle1'
						textAlign={'center'}
						sx={{ color: theme.palette.common.primaryGreyText }}
					>
						Your payment is all done!
					</FiraSansTypography>
				</Stack>

				<Stack
					flex={'auto'}
					sx={{ background: theme.palette.common.white, borderRadius: `32px` }}
					alignItems={'center'}
					justifyContent={'space-around'}
					maxHeight={377}
				>
					<Stack
						justifyContent={'space-around'}
						alignItems={'center'}
						gap={`12px`}
					>
						<Uploader
							fieldName={`restaurant_img`}
							sx={{
								placeContent: 'flex-end',
								height: 68,
								width: 68,
								borderRadius: '16px',
								justifyContent: 'center',
								alignItems: 'center',
							}}
							file={props.data?.restaurant_profile ?? ''}
						/>
						<FiraSansTypography
							variant='h4'
							fontSize={24}
							sx={{ color: theme.palette.common.secondaryGreyText }}
						>
							{props.data?.restaurant_name}
						</FiraSansTypography>

						<FiraSansTypography
							variant='h4'
							fontWeight={600}
							fontSize={32}
							sx={{
								color: theme.palette.common.secondaryGreyText,
								display: 'flex',
								alignItems: 'center',
								alignSelf: 'center',
								gap: 1,
							}}
						>
							<IconFinder
								iconName='RupeeV3'
								iconProps={{ stroke: '#1D1D22' }}
							/>
							{props.data?.amount}
						</FiraSansTypography>
						<FiraSansTypography
							variant='subtitle1'
							sx={{ color: `#646470` }}
						>
							Thank You, Visit Again!
						</FiraSansTypography>
					</Stack>

					<Stack
						alignItems={'center'}
						gap={`12px`}
					>
						<FiraSansTypography
							variant='subtitle1'
							sx={{ color: `#646470` }}
						>
							RATE US
						</FiraSansTypography>

						<Rating
							size='large'
							sx={{
								gap: 1,
							}}
							emptyIcon={<IconFinder iconName='StarV2' />}
							icon={
								<IconFinder
									iconName='StarV2'
									iconProps={{ fill: 'gold' }}
								/>
							}
							onChange={(e, v) => {
								postRatingApi.mutate({
									request: {
										rating: String(v),
										restaurant_id: props.data?.restaurant_id ?? '',
									},
								});
							}}
						/>
					</Stack>
				</Stack>
			</Stack>
		</UserAppWrapper>
	);
};

export default memo(PaymentSuccess);
