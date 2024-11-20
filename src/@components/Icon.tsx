import { memo } from 'react';
import { ReactComponent as Hash1 } from '_assets/icons/layout-hash-1.svg';
import { ReactComponent as Hash2 } from '_assets/icons/layout-hash-2.svg';
import { ReactComponent as DesktopLoginLogo } from '_assets/icons/desktop-login-logo.svg';
import { ReactComponent as DesktopResetLogo } from '_assets/icons/desktop-reset-logo.svg';
import { ReactComponent as MobileLoginLogo } from '_assets/icons/mobile-login-logo.svg';
import { ReactComponent as LightLogo } from '_assets/icons/light-logo.svg';
import { ReactComponent as OpenEye } from '_assets/icons/open-eye.svg';
import { ReactComponent as WarningDanger } from '_assets/icons/warning-danger.svg';
import { ReactComponent as Home } from '_assets/icons/home.svg';
import { ReactComponent as QRCode } from '_assets/icons/qr-code.svg';
import { ReactComponent as Profile } from '_assets/icons/profile.svg';
import { ReactComponent as ArrowBack } from '_assets/icons/arrow-back.svg';
import { ReactComponent as Add } from '_assets/icons/add.svg';
import { ReactComponent as SuccessLogo } from '_assets/icons/success-logo.svg';
import { ReactComponent as FailedLogo } from '_assets/icons/failed-logo.svg';
import { ReactComponent as Dashboard } from '_assets/icons/dashboard.svg';
import { ReactComponent as Users } from '_assets/icons/users.svg';
import { ReactComponent as QRCodeV2 } from '_assets/icons/qr-code-v2.svg';
import { ReactComponent as Restaurants } from '_assets/icons/restaurants.svg';
import { ReactComponent as User } from '_assets/icons/user.svg';
import { ReactComponent as Settings } from '_assets/icons/settings.svg';
import { ReactComponent as ChevronRight } from '_assets/icons/chevron-right.svg';
import { ReactComponent as Logout } from '_assets/icons/logout.svg';
import { ReactComponent as Banner } from '_assets/icons/banner.svg';
import { ReactComponent as Checked } from '_assets/icons/checked.svg';
import { ReactComponent as UploadPicture } from '_assets/icons/upload-picture.svg';
import { ReactComponent as Upload } from '_assets/icons/upload.svg';
import { ReactComponent as Notification } from '_assets/icons/notification.svg';
import { ReactComponent as ChevronDown } from '_assets/icons/chevron-down.svg';
import { ReactComponent as Search } from '_assets/icons/search.svg';
import { ReactComponent as DashCircle } from '_assets/icons/dash-circle.svg';
import { ReactComponent as Pen } from '_assets/icons/pen.svg';
import { ReactComponent as Cancel } from '_assets/icons/cancel.svg';
import { ReactComponent as List } from '_assets/icons/list.svg';
import { ReactComponent as CancelWhite } from '_assets/icons/cancel-white.svg';
import { ReactComponent as CircleArrowUp } from '_assets/icons/circle-arrow-up.svg';
import { ReactComponent as CircleArrowDown } from '_assets/icons/circle-arrow-down.svg';
import { ReactComponent as Correct } from '_assets/icons/correct.svg';
import { ReactComponent as CancelError } from '_assets/icons/cancel-error.svg';
import { ReactComponent as Reports } from '_assets/icons/reports.svg';
import { ReactComponent as Rupee } from '_assets/icons/rupee.svg';
import { ReactComponent as Investment } from '_assets/icons/investment.svg';
import { ReactComponent as Image } from '_assets/icons/image.svg';
import { ReactComponent as RestaurantLoginLogo } from '_assets/icons/restaurant-login-logo.svg';
import { ReactComponent as Menu } from '_assets/icons/menu.svg';
import { ReactComponent as Switch } from '_assets/icons/switch.svg';
import { ReactComponent as RupayV2 } from '_assets/icons/rupee-v2.svg';
import { ReactComponent as UploadFile } from '_assets/icons/upload-file.svg';
import { ReactComponent as Veg } from '_assets/icons/veg.svg';
import { ReactComponent as NonVeg } from '_assets/icons/non-veg.svg';
import { ReactComponent as Star } from '_assets/icons/star.svg';
import { ReactComponent as MoreVertical } from '_assets/icons/more-vertical.svg';
import { ReactComponent as Excel } from '_assets/icons/excel.svg';
import { ReactComponent as PenCircle } from '_assets/icons/pen-circle.svg';
import { ReactComponent as CloseEye } from '_assets/icons/close-eye.svg';
import { ReactComponent as Dot } from '_assets/icons/dot.svg';
import { ReactComponent as Copy } from '_assets/icons/copy.svg';
import { ReactComponent as Replace } from '_assets/icons/replace.svg';
import { ReactComponent as ArrowFill } from '_assets/icons/arrow-fill.svg';
import { ReactComponent as Hash8 } from '_assets/icons/layout-hash-8.svg';
import { ReactComponent as RupeeV3 } from '_assets/icons/rupee-v3.svg';
import { ReactComponent as CelebrationTriangles } from '_assets/icons/celebration-triangles.svg';
import { ReactComponent as StarV2 } from '_assets/icons/star-v2.svg';
import { ReactComponent as NotificationTwo } from '_assets/icons/notification-two.svg';
import { ReactComponent as Send } from '_assets/icons/send.svg';
import { ReactComponent as UploadImage } from '_assets/icons/upload-image.svg';
import { ReactComponent as Calender } from '_assets/icons/calender.svg';
import { ReactComponent as Calender2 } from '_assets/icons/calender_2.svg';
import { ReactComponent as UserAppLogo } from '_assets/icons/user-app-logo.svg';
import { ReactComponent as Owner } from '_assets/icons/owner.svg';
import { ReactComponent as Download } from '_assets/icons/download.svg';
import { ReactComponent as RupayV4 } from '_assets/icons/rupee-v4.svg';
import { ReactComponent as UPIList } from '_assets/icons/upi-list.svg';
import { ReactComponent as Warning } from '_assets/icons/warning.svg';

export type IconType =
	| 'Hash1'
	| 'Hash2'
	| 'Replace'
	| 'PenCircle'
	| 'RestaurantLoginLogo'
	| 'DesktopLoginLogo'
	| 'DesktopResetLogo'
	| 'MobileLoginLogo'
	| 'LightLogo'
	| 'SuccessLogo'
	| 'FailedLogo'
	| 'OpenEye'
	| 'WarningDanger'
	| 'Home'
	| 'QRCode'
	| 'Profile'
	| 'ArrowBack'
	| 'Add'
	| 'Dashboard'
	| 'Users'
	| 'QRCodeV2'
	| 'Restaurants'
	| 'User'
	| 'Settings'
	| 'ChevronRight'
	| 'Logout'
	| 'Banner'
	| 'Checked'
	| 'UploadPicture'
	| 'Upload'
	| 'Notification'
	| 'ChevronDown'
	| 'Search'
	| 'DashCircle'
	| 'Pen'
	| 'Cancel'
	| 'List'
	| 'CancelWhite'
	| 'CircleArrowUp'
	| 'CircleArrowDown'
	| 'Correct'
	| 'CancelError'
	| 'Reports'
	| 'Rupee'
	| 'Investment'
	| 'Image'
	| 'Menu'
	| 'Switch'
	| 'RupayV2'
	| 'UploadFile'
	| 'Veg'
	| 'NonVeg'
	| 'Star'
	| 'MoreVertical'
	| 'Excel'
	| 'CloseEye'
	| 'Dot'
	| 'Copy'
	| 'ArrowFill'
	| 'Hash8'
	| 'RupeeV3'
	| 'CelebrationTriangles'
	| 'StarV2'
	| 'NotificationTwo'
	| 'Send'
	| 'UploadImage'
	| 'Calender'
	| 'Calender2'
	| 'UserAppLogo'
	| 'Owner'
	| 'Download'
	| 'RupayV4'
	| 'UPIList'
	| 'Warning';

export const Icons: {
	[key in IconType]: React.FunctionComponent<
		React.SVGProps<SVGSVGElement> & {
			title?: string | undefined;
		}
	>;
} = {
	Hash1,
	Hash2,
	Replace,
	PenCircle,
	RestaurantLoginLogo,
	DesktopLoginLogo,
	DesktopResetLogo,
	MobileLoginLogo,
	LightLogo,
	SuccessLogo,
	FailedLogo,
	OpenEye,
	WarningDanger,
	Home,
	QRCode,
	Profile,
	ArrowBack,
	Add,
	Dashboard,
	Users,
	QRCodeV2,
	Restaurants,
	User,
	Settings,
	ChevronRight,
	Logout,
	Banner,
	Checked,
	UploadPicture,
	Upload,
	Notification,
	ChevronDown,
	Search,
	DashCircle,
	Pen,
	Cancel,
	List,
	CancelWhite,
	CircleArrowUp,
	CircleArrowDown,
	Correct,
	CancelError,
	Reports,
	Rupee,
	Investment,
	Image,
	Menu,
	Switch,
	RupayV2,
	UploadFile,
	Veg,
	NonVeg,
	Star,
	MoreVertical,
	Excel,
	CloseEye,
	Dot,
	Copy,
	ArrowFill,
	Hash8,
	RupeeV3,
	CelebrationTriangles,
	StarV2,
	NotificationTwo,
	Send,
	UploadImage,
	Calender,
	Calender2,
	UserAppLogo,
	Owner,
	Download,
	RupayV4,
	UPIList,
	Warning,
};

interface IconFinderProps {
	iconName: IconType;
	iconProps?: React.SVGProps<SVGSVGElement> & { title?: string };
}
const IconFinder = memo((props: IconFinderProps) => {
	const Icon = Icons[props.iconName];
	return Icon ? <Icon {...props.iconProps} /> : <></>;
});
export default IconFinder;
