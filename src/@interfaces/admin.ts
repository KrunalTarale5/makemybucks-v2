import { IconType } from '@components/Icon';

export type BannerInfo = {
	bannerName?: string;
	breadcrumbs?: { name: string; url?: string }[];
};

export type MenuItem = {
	url: string;
	icon: IconType;
	name: string;
	notificication?: boolean;
	key?: string;
} & BannerInfo;
