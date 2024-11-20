import IconFinder from '@components/Icon';
import { PoppinsTypography } from '@components/Typography';
import { MenuItem } from '@interfaces/admin';
import { Stack, useTheme, ListItem, ListItemButton, Box, Divider } from '@mui/material';
import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import Hash6 from '_assets/icons/layout-hash-6.svg';
import { useSelector } from 'react-redux';
import { RootState } from '_store/reducers';
import { RESTAURANT_BASE_URL } from '@utils/common';

const PAGES_MENUS: MenuItem[] = [
	{
		name: 'Dashboard',
		url: `/${RESTAURANT_BASE_URL}/dashboard`,
		icon: 'Dashboard',
	},
	{
		name: 'Menu ',
		url: `/${RESTAURANT_BASE_URL}/menu`,
		icon: 'Menu',
	},
	{
		name: 'Reports',
		url: `null`,
		icon: 'Reports',
	},
	{
		name: 'Settlements',
		url: `null`,
		icon: 'Restaurants',
	},
	{
		name: 'Settings',
		url: `/${RESTAURANT_BASE_URL}/settings`,
		icon: 'Settings',
	},
	{
		name: 'Logout',
		url: `/${RESTAURANT_BASE_URL}/login`,
		icon: 'Logout',
	},
];

interface NavPanelProps {
	onMenuSelect: (item: MenuItem, event?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const NavPanel: FC<NavPanelProps> = (props) => {
	const theme = useTheme();
	const location = useLocation();
	const { userInfo } = useSelector((state: RootState) => state.richPenny);

	return (
		<Stack
			width={`282px`}
			sx={{
				backgroundColor: theme.palette.primary.main,
				borderRadius: `16px`,
				backgroundImage: `url(${Hash6})`,
				backgroundRepeat: 'no-repeat',
				backgroundPosition: `bottom left`,
			}}
		>
			<Stack
				alignItems={'center'}
				paddingY={4}
				gap={4}
			>
				<IconFinder
					iconName='RestaurantLoginLogo'
					iconProps={{ width: 163, height: 90 }}
				/>
				<PoppinsTypography sx={{ color: theme.palette.common.white }}>
					{userInfo?.id}
				</PoppinsTypography>

				<Divider sx={{ borderColor: `#7F7DB7`, width: `100%`, marginX: 4 }} />
			</Stack>

			<Stack
				paddingY={3}
				paddingLeft={2}
				paddingRight={0.5}
				gap={1}
				flex={'auto'}
			>
				{PAGES_MENUS.map((m, i) => {
					const isSelected = location.pathname.includes(m.url);
					return (
						<Stack
							key={i}
							flexDirection={'row'}
							justifyContent={'space-between'}
							alignItems={'center'}
							sx={{ ...(m.name === 'Logout' && { flex: 'auto' }) }}
						>
							<ListItem
								disablePadding
								disableGutters
								sx={{ width: 243, ...(m.name === 'Logout' && { placeSelf: 'flex-end' }) }}
							>
								<ListItemButton
									selected={isSelected}
									sx={{
										height: 48,
										borderRadius: `10px`,
										paddingX: 3,
										backgroundColor: '#7674BB',
										'&.Mui-selected': {
											backgroundColor: theme.palette.secondary.main,
											'&:hover': {
												backgroundColor: theme.palette.secondary.main,
											},
										},
									}}
									onClick={m.url === 'null' ? undefined : (e) => props.onMenuSelect(m, e)}
								>
									<Stack
										alignItems={'center'}
										flexDirection={'row'}
										justifyContent={'space-between'}
										gap={2}
									>
										<IconFinder
											iconName={m.icon}
											iconProps={{
												fill: isSelected
													? theme.palette.common.primaryGreyText
													: theme.palette.secondary.main,
											}}
										/>
										<PoppinsTypography
											variant='subtitle1'
											sx={{
												color: isSelected
													? theme.palette.common.primaryGreyText
													: theme.palette.secondary.main,
											}}
										>
											{m.name}
										</PoppinsTypography>
									</Stack>
								</ListItemButton>
							</ListItem>
							{isSelected && (
								<Box
									sx={{
										width: `5px`,
										height: `28px`,
										backgroundColor: theme.palette.secondary.main,
										borderRadius: `12px 0px 0px 12px`,
									}}
								/>
							)}
						</Stack>
					);
				})}
			</Stack>

			{/* 	<Stack
				flex={'auto'}
				justifyContent={'flex-end'}
				alignItems={'flex-end'}
				paddingBottom={3}
				paddingLeft={2}
				paddingRight={0.5}
				gap={1}
			>
				{BOTTOM_MENUS.map((m, i) => (
					<Stack
						key={i}
						flexDirection={'row'}
						justifyContent={'space-between'}
						alignItems={'center'}
					>
						<ListItem
							disablePadding
							disableGutters
							sx={{ width: 243 }}
						>
							<ListItemButton
								sx={{
									height: 48,
									borderRadius: `16px`,
									paddingX: 3,
									backgroundColor: '#7674BB',
									'&.Mui-selected': {
										backgroundColor: theme.palette.secondary.main,
										'&:hover': {
											backgroundColor: theme.palette.secondary.main,
										},
									},
								}}
								onClick={m.url === 'null' ? undefined : (e) => props.onMenuSelect(m, e)}
							>
								<Stack
									alignItems={'center'}
									flexDirection={'row'}
									justifyContent={'space-between'}
									gap={2}
								>
									<IconFinder iconName={m.icon} />
									<PoppinsTypography variant='subtitle1'>{m.name}</PoppinsTypography>
								</Stack>
							</ListItemButton>
						</ListItem>
					</Stack>
				))}
			</Stack> */}
		</Stack>
	);
};

export default memo(NavPanel);
