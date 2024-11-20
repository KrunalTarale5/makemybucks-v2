import { BannerInfo } from '@interfaces/admin';
import { Action, UserInfo } from '../type';

interface ReducerInitalState {
	bannerInfo: BannerInfo | null;
	token: string | null;
	userInfo: UserInfo | null;
	isDirty: boolean;
}

const initialState: ReducerInitalState = {
	bannerInfo: null,
	token: null,
	userInfo: null,
	isDirty: false,
};

const Reducer = (state = initialState, action: Action): ReducerInitalState => {
	switch (action.type) {
		case 'SET_BANNER_INFO':
			return {
				...state,
				bannerInfo: action.payload,
			};

		case 'SET_TOKEN':
			return {
				...state,
				token: action.payload as string,
			};

		case 'SET_USER_INFO':
			return {
				...state,
				userInfo: action.payload,
			};

		case 'SET_DIRTY':
			return {
				...state,
				isDirty: action.payload,
			};

		default:
			return state;
	}
};

export default Reducer;
