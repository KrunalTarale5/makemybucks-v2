import IconFinder from '@components/Icon';
import { Avatar, Box, Button, Stack } from '@mui/material';
import { memo, useEffect } from 'react';
import Footer from './Footer';
import { InterTypography, PoppinsTypography } from '@components/Typography';
import NavPanel from './NavPanel';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '_store/reducers';
import Hash4 from '_assets/icons/layout-hash-4.svg';
import Hash3 from '_assets/icons/layout-hash-3.svg';

const Landing = () => {
	const navigate = useNavigate();

	const { bannerInfo, userInfo, token } = useSelector((state: RootState) => state.richPenny);

	useEffect(() => {
		if (userInfo && token && location.pathname === '/admin/') {
			navigate('/admin/home', { replace: true });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.pathname]);

	return (
		<Box
			sx={{
				height: `inherit`,
				display: 'flex',
				backgroundImage: `url(${Hash4}), url(${Hash3})`,
				backgroundRepeat: 'no-repeat',
				backgroundPosition: `bottom left, bottom right`,
			}}
		>
			<Stack
				width={`257px`}
				sx={{
					boxShadow: `0px 10px 30px 0px #1126920D`,
				}}
			>
				<NavPanel />
			</Stack>
			<Stack
				overflow={'auto'}
				flexGrow={1}
				gap={2}
			>
				<Box
					sx={{
						borderBottomRightRadius: `14px`,
						borderBottomLeftRadius: `14px`,
						maxHeight: `188px`,
						minHeight: `188px`,
						overflow: 'hidden',
					}}
				>
					<Box
						sx={{
							position: 'absolute',
							top: 51,
							paddingLeft: `56px`,
							color: 'white',
						}}
					>
						<PoppinsTypography
							variant='h3'
							fontWeight={600}
							paddingBottom={4}
						>
							{bannerInfo?.bannerName}
						</PoppinsTypography>

						{bannerInfo?.breadcrumbs?.map((b, i) => (
							<PoppinsTypography
								key={i}
								variant='caption'
							>
								<PoppinsTypography
									key={i}
									variant='caption'
									sx={{
										'&:hover': {
											cursor: 'pointer',
											textDecoration: 'underline',
										},
									}}
									onClick={b.url ? () => navigate(b.url as string) : undefined}
								>
									{b.name}
								</PoppinsTypography>
								{Number(bannerInfo?.breadcrumbs?.length) !== i + 1 && ` > `}
							</PoppinsTypography>
						))}
					</Box>

					<Box
						sx={{
							position: 'absolute',
							top: 21,
							right: 21,
							backgroundColor: '#38367F',
							borderRadius: `4px`,
							padding: 1,
							paddingX: 2,
							display: 'flex',
							gap: 1,
							alignItems: 'center',
						}}
					>
						<IconFinder iconName='Notification' />

						<Button
							sx={{ color: 'white', gap: 1, '.MuiButton-endIcon': { alignSelf: 'start' } }}
							startIcon={
								<Avatar
									alt='Avatar'
									src={userInfo?.avatar ?? ''}
									sx={{ width: 45, height: 45 }}
								/>
							}
							endIcon={
								<IconFinder
									iconName='ChevronDown'
									iconProps={{
										fill: 'white',
									}}
								/>
							}
						>
							<Stack
								flexDirection={'column'}
								alignItems={'start'}
							>
								<PoppinsTypography variant='subtitle1'>{userInfo?.name}</PoppinsTypography>
								<InterTypography variant='caption'>Admin</InterTypography>
							</Stack>
						</Button>
					</Box>
					<IconFinder
						iconName='Banner'
						iconProps={{
							width: `100%`,
							height: `100%`,
						}}
					/>
				</Box>
				<Stack
					paddingX={3}
					flexGrow={1}
					overflow={'auto'}
					id='admin-outlet'
				>
					<Outlet />
				</Stack>
				<Footer />
			</Stack>
		</Box>
	);
};

export default memo(Landing);
