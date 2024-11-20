import { Button, Drawer, DrawerProps, useTheme } from '@mui/material';
import { memo } from 'react';
import IconFinder from './Icon';
import { PoppinsTypography } from './Typography';

type DrawerProps_ = Omit<DrawerProps, 'anchor'>;

export const BottomOpenDetailsDrawer = memo((props: DrawerProps_) => {
	const theme = useTheme();
	return (
		<Drawer
			{...props}
			sx={{
				'.MuiDrawer-paper': {
					height: `60%`,
					left: 257,
					boxShadow: `0px -4px 8px 0px #00000026`,
					borderTopRightRadius: 8,
					borderTopLeftRadius: 8,
					paddingX: 10,
					paddingTop: 6,
				},
				...props.sx,
			}}
			anchor={'bottom'}
		>
			<>
				<Button
					variant='text'
					size='small'
					startIcon={<IconFinder iconName='Cancel' />}
					sx={{ position: 'absolute', right: 24, top: 20, paddingY: 0, paddingX: 0.25 }}
					onClick={(e) => props?.onClose?.(e, 'backdropClick')}
				>
					<PoppinsTypography
						variant='subtitle1'
						color={theme.palette.common.primaryGreyText}
					>
						Cancel
					</PoppinsTypography>
				</Button>
				{props.children}
			</>
		</Drawer>
	);
});
