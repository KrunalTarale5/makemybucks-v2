import { BannerInfo } from '@interfaces/admin';

export type UserInfo = {
	id: string;
	name: string;
	email: string;
	mobile_no?: string;
	avatar?: string;
};

export interface SET_BANNER_INFO {
	type: 'SET_BANNER_INFO';
	payload: BannerInfo | null;
}

export interface SET_TOKEN {
	type: 'SET_TOKEN';
	payload: string | null;
}

export interface SET_USER_INFO {
	type: 'SET_USER_INFO';
	payload: UserInfo | null;
}

export interface SET_DIRTY {
	type: 'SET_DIRTY';
	payload: boolean;
}

export type Action = SET_BANNER_INFO | SET_TOKEN | SET_USER_INFO | SET_DIRTY;
