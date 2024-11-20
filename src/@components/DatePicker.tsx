import { Box, ClickAwayListener, Divider, Stack } from '@mui/material';
import IconFinder from './Icon';
import moment from 'moment';
import { InterTypography } from './Typography';
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

interface YearPickerProps {
	onRightClick: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
	onLeftClick: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
	onCalenderClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
	handleClose: () => void;
	anchorEl?: HTMLElement | null;
	show: boolean;
	date: moment.Moment | null;
	onChange: (value: moment.Moment | null) => void;
	position?: {
		left: number;
	};
}

export const YearPicker = (props: YearPickerProps) => {
	return (
		<>
			<Stack
				flexDirection={'row'}
				border={`1px solid #E5E5E5`}
				borderRadius={`40px`}
				alignItems={'center'}
				height={24}
			>
				<IconFinder
					iconName='ChevronRight'
					iconProps={{
						width: 28,
						height: 20,
						fill: 'black',
						transform: 'rotate(180 0 0)',
						onClick: props.onLeftClick,
						cursor: 'pointer',
					}}
				/>
				<Divider
					orientation='vertical'
					sx={{ borderColor: '#E5E5E5' }}
				/>
				<Stack
					gap={0.5}
					flexDirection={'row'}
					alignItems={'center'}
					paddingX={1}
					onClick={props.onCalenderClick}
					sx={{ cursor: 'pointer' }}
				>
					<IconFinder iconName='Calender2' />
					<InterTypography fontSize={`7px`}>{props.date?.get('year')}</InterTypography>
				</Stack>
				<Divider
					orientation='vertical'
					sx={{ borderColor: '#E5E5E5' }}
				/>
				<IconFinder
					iconName='ChevronRight'
					iconProps={{
						width: 28,
						height: 20,
						fill: 'black',
						onClick: props.onRightClick,
						cursor: 'pointer',
					}}
				/>
			</Stack>
			{props.show && props.anchorEl && (
				<ClickAwayListener onClickAway={props.handleClose}>
					<Box
						zIndex={100}
						position={'fixed'}
						top={`${(props.anchorEl?.getBoundingClientRect().top ?? 0) + 20}px`}
						left={
							props.anchorEl?.getBoundingClientRect().left -
							100 -
							(props.position?.left ? props.position?.left : 0)
						}
						boxShadow={'0px 2px 8px 0px #00000026'}
					>
						<LocalizationProvider dateAdapter={AdapterMoment}>
							<DemoContainer
								components={['DatePicker']}
								sx={{
									flexDirection: 'column-reverse !important',
									overflow: 'hidden',
									padding: 'inherit',
								}}
							>
								<StaticDatePicker
									value={props.date}
									views={['year']}
									onChange={props.onChange}
									sx={{
										'& .MuiPickersLayout-actionBar': {
											display: 'none',
										},
									}}
								/>
							</DemoContainer>
						</LocalizationProvider>
					</Box>
				</ClickAwayListener>
			)}
		</>
	);
};

interface MonthYearPickerProps {
	onRightClick: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
	onLeftClick: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
	onCalenderClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
	handleClose: () => void;
	anchorEl?: HTMLElement | null;
	show: boolean;
	date: moment.Moment | null;
	onChange: (value: moment.Moment | null) => void;
	position?: {
		left: number;
	};
}

export const MonthYearPicker = (props: MonthYearPickerProps) => {
	return (
		<>
			<Stack
				flexDirection={'row'}
				border={`1px solid #E5E5E5`}
				borderRadius={`40px`}
				alignItems={'center'}
				height={24}
			>
				<IconFinder
					iconName='ChevronRight'
					iconProps={{
						width: 28,
						height: 20,
						fill: 'black',
						transform: 'rotate(180 0 0)',
						onClick: props.onRightClick,
						cursor: 'pointer',
					}}
				/>
				<Divider
					orientation='vertical'
					sx={{ borderColor: '#E5E5E5' }}
				/>
				<Stack
					gap={0.5}
					flexDirection={'row'}
					alignItems={'center'}
					paddingX={1}
					onClick={props.onCalenderClick}
					sx={{ cursor: 'pointer' }}
				>
					<IconFinder iconName='Calender2' />
					<InterTypography fontSize={`7px`}>
						{moment(props.date).format('MMM YYYY')}
					</InterTypography>
				</Stack>
				<Divider
					orientation='vertical'
					sx={{ borderColor: '#E5E5E5' }}
				/>
				<IconFinder
					iconName='ChevronRight'
					iconProps={{
						width: 28,
						height: 20,
						fill: 'black',
						onClick: props.onRightClick,
						cursor: 'pointer',
					}}
				/>
			</Stack>
			{props.show && props.anchorEl && (
				<ClickAwayListener onClickAway={props.handleClose}>
					<Box
						zIndex={100}
						position={'fixed'}
						top={`${(props.anchorEl?.getBoundingClientRect().top ?? 0) + 20}px`}
						left={
							props.anchorEl?.getBoundingClientRect().left -
							100 -
							(props.position?.left ? props.position?.left : 0)
						}
						boxShadow={'0px 2px 8px 0px #00000026'}
					>
						<LocalizationProvider dateAdapter={AdapterMoment}>
							<DemoContainer
								components={['DatePicker']}
								sx={{
									flexDirection: 'column-reverse !important',
									overflow: 'hidden',
									padding: 'inherit',
								}}
							>
								<StaticDatePicker
									value={props.date}
									views={['month', 'year']}
									onYearChange={props.onChange}
									sx={{
										'& .MuiPickersLayout-actionBar': {
											display: 'none',
										},
									}}
								/>
							</DemoContainer>
						</LocalizationProvider>
					</Box>
				</ClickAwayListener>
			)}
		</>
	);
};
