import {
	KycStatus,
	OwnersStatus,
	RestaurantStatus,
	Status,
	SubAdminStatus,
	UserKycStatus,
	UserStatus,
} from '@interfaces/common';
import { SxProps, Theme, useMediaQuery, useTheme } from '@mui/material';
import { useState, useEffect, useLayoutEffect } from 'react';

export const useVisibility = (): SxProps<Theme> => {
	const [zoom, setZoom] = useState<number>(1);
	const theme = useTheme();

	const isXXLUP = useMediaQuery(theme.breakpoints.up('xxl'));
	const isXXL = useMediaQuery(theme.breakpoints.only('xxl'));
	const is_XL = window.innerWidth === 1536;
	const isBetMD_LG = useMediaQuery(theme.breakpoints.between('md', 'lg'));
	const isXLDown = useMediaQuery(theme.breakpoints.down('xl'));
	const isLGDown = useMediaQuery(theme.breakpoints.down('lg'));
	const isMDDown = useMediaQuery(theme.breakpoints.down('md'));

	useEffect(() => {
		let _zoom = zoom;
		if (is_XL) {
			_zoom = 0.7;
		} else if (isXLDown || isMDDown) {
			_zoom = 0.7;
		} else if (isLGDown) {
			_zoom = 0.75;
		} else if (isBetMD_LG) {
			_zoom = 0.55;
		} else if (isXXLUP || isXXL) {
			_zoom = 1;
		}
		setZoom(_zoom);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isXLDown, isLGDown, isMDDown, isXXLUP, isXXL, is_XL, isBetMD_LG]);

	return { height: 'inherit', ...(zoom !== 1 && { zoom }) } as SxProps<Theme>;
};

export const useStatus = () => {
	const theme = useTheme();
	let info: { sx: SxProps<Theme>; lable: string } = {} as { sx: SxProps<Theme>; lable: string };

	return (status: Status) => {
		switch (status) {
			case '0':
				info = { lable: 'Pending', sx: { color: theme.palette.warning.main } };
				break;
			case '1':
				info = { lable: 'Approved', sx: { color: theme.palette.success.main } };
				break;
			case '2':
				info = { lable: 'Rejected', sx: { color: theme.palette.error.main } };
				break;

			default:
				break;
		}
		return info;
	};
};

export const useSubAdminStatus = () => {
	const theme = useTheme();
	let info: { sx: SxProps<Theme>; lable: string } = {} as { sx: SxProps<Theme>; lable: string };

	return (status: SubAdminStatus) => {
		switch (status) {
			case '0':
				info = { lable: 'Pending', sx: { color: theme.palette.warning.main } };
				break;
			case '1':
				info = { lable: 'Active', sx: { color: theme.palette.success.main } };
				break;
			case '2':
				info = { lable: 'Inactive', sx: { color: theme.palette.error.main } };
				break;
			case '3':
				info = { lable: 'Deactivated', sx: { color: theme.palette.error.main } };
				break;
			default:
				break;
		}
		return info;
	};
};

export const useRestaurantStatus = () => {
	const theme = useTheme();
	let info: { sx: SxProps<Theme>; lable: string } = {} as { sx: SxProps<Theme>; lable: string };

	return (status: RestaurantStatus) => {
		switch (status) {
			case '0':
				info = { lable: 'Approval pending', sx: { color: theme.palette.warning.main } };
				break;
			case '2':
				info = { lable: 'Activation pending', sx: { color: theme.palette.warning.main } };
				break;
			case '1':
				info = { lable: 'Approved', sx: { color: theme.palette.success.main } };
				break;
			case '3':
				info = { lable: 'Active', sx: { color: theme.palette.success.main } };
				break;
			case '4':
				info = { lable: 'Disabled', sx: { color: theme.palette.error.main } };
				break;
			case '5':
				info = { lable: 'Reject', sx: { color: theme.palette.error.main } };
				break;
			default:
				break;
		}
		return info;
	};
};

export const useUserStatus = () => {
	const theme = useTheme();
	let info: { sx: SxProps<Theme>; lable: string } = {} as { sx: SxProps<Theme>; lable: string };

	return (status: UserStatus) => {
		switch (status) {
			case '0':
				info = { lable: 'Active', sx: { color: theme.palette.success.main } };
				break;
			case '1':
				info = { lable: 'Inactive', sx: { color: theme.palette.common.secondaryGreyText } };
				break;

			default:
				break;
		}
		return info;
	};
};

export const useKycStatus = () => {
	const theme = useTheme();
	let info: { sx: SxProps<Theme>; lable: string } = {} as { sx: SxProps<Theme>; lable: string };

	return (status: KycStatus) => {
		switch (status) {
			case 'pending':
				info = { lable: 'Pending', sx: { color: theme.palette.warning.main } };
				break;
			case 'verified':
				info = { lable: 'Done', sx: { color: theme.palette.success.main } };
				break;

			default:
				break;
		}
		return info;
	};
};

export const useUserKycStatus = () => {
	const theme = useTheme();
	let info: { sx: SxProps<Theme>; lable: string } = {} as { sx: SxProps<Theme>; lable: string };

	return (status: UserKycStatus) => {
		switch (status) {
			case 'Pending':
				info = { lable: 'Pending', sx: { color: theme.palette.warning.main } };
				break;
			case 'Verified':
				info = { lable: 'Verified', sx: { color: theme.palette.success.main } };
				break;

			default:
				break;
		}
		return info;
	};
};

export const useIsOverflow = (ref: HTMLElement | null) => {
	const [isOverflow, setIsOverflow] = useState(false);

	useLayoutEffect(() => {
		const trigger = () => {
			const hasOverflow = Number(ref?.scrollHeight) > Number(ref?.clientHeight);

			setIsOverflow(hasOverflow);
		};

		if (ref) {
			trigger();
		}
	}, [ref]);

	return isOverflow;
};

export const useOwnerStatus = () => {
	const theme = useTheme();
	let info: { sx: SxProps<Theme>; lable: string } = {} as { sx: SxProps<Theme>; lable: string };

	return (status: OwnersStatus) => {
		switch (status) {
			case '0':
				info = { lable: 'Approval Pending', sx: { color: theme.palette.warning.main } };
				break;
			case '1':
				info = { lable: 'Approved', sx: { color: theme.palette.success.main } };
				break;
			case '2':
				info = { lable: 'Deactivate', sx: { color: theme.palette.error.main } };
				break;
			case '3':
				info = { lable: 'Reject', sx: { color: theme.palette.error.main } };
				break;

			default:
				break;
		}
		return info;
	};
};
