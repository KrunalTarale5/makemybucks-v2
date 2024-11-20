import {
	Paper,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Table as Table_,
	TableProps as TableProps_,
	SxProps,
	Theme,
	TableRowProps,
	TableCellProps,
	Checkbox,
	useTheme,
	Box,
	CircularProgress,
	IconButton,
	Stack,
	IconButtonProps,
} from '@mui/material';
import React, { useCallback, useState, memo } from 'react';
import IconFinder from '@components/Icon';
import { PoppinsTypography } from './Typography';
import { RESTAURANT_BASE_URL } from '@utils/common';

type RenderCellProps<T> = {
	row: T;
	rowNumber: number;
};

type RenderHeaderProps<T> = {
	field: ColumnDef<T>['field'];
	columnNumber: number;
};

export type ColumnDef<T> = {
	field: Partial<keyof T> | string;
	renderHeader: (props?: RenderHeaderProps<T>) => React.ReactNode;
	renderCell: (props: RenderCellProps<T>) => React.ReactNode;
	tableCellProps?: TableCellProps;
	tableCellTypographySx?: SxProps<Theme>;
	tableHeaderProps?: TableCellProps;
	sortable?: boolean;
};

export type ColumnSort<T> = {
	field: Partial<keyof T> | string;
	order: 'asc' | 'desc';
} | null;

export interface TableProps<T> {
	/**
	 * Set of columns of type ColumnDef<T>[].
	 */
	columns: ColumnDef<T>[];
	/**
	 * Set of rows of type T[].
	 */
	readonly rows: T[];
	/**
	 * Return the id of a given T.
	 */
	rowId: (row: T) => string | number;
	/**
	 * If `true`, the grid get a first column with a checkbox that allows to select rows and the table row will have the selected shading.
	 * @default false
	 */
	checkboxSelection?: boolean;
	/**
	 * Return the selected rows (multiple rows) only when `checkboxSelection` is true
	 */
	selectedRows?: (rows: T[]) => void;
	/**
	 * Callback when short change of column
	 */
	onSortChange?: (sort: ColumnSort<T>) => void;
	loading?: boolean;
	loadingComponent?: React.ReactNode;
	sx?: SxProps<Theme>;
	tableProps?: TableProps_;
	tableRowProps?: TableRowProps;
}

const Table = <T extends { [key: string]: unknown }>(props: TableProps<T>) => {
	const theme = useTheme();
	const isRestaurantView = location.pathname.includes(`/${RESTAURANT_BASE_URL}/`);
	const [selectedRows, setSelectedRows] = useState<readonly string[]>([]);
	const [columnSort, setColumnSort] = useState<ColumnSort<T>>(null);

	const onHeadChecboxClick = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.checked) {
			setSelectedRows(props.rows.map((row) => String(props.rowId(row))));
			props.selectedRows?.(props.rows);
			return;
		}
		setSelectedRows([]);
		props.selectedRows?.([]);
	};

	const onBodyChecboxClick =
		(rowId: ReturnType<TableProps<T>['rowId']>) => (event: React.ChangeEvent<HTMLInputElement>) => {
			event.stopPropagation();
			const selectedIndex = selectedRows.indexOf(String(rowId));
			let newSelected: readonly string[] = [];

			if (selectedIndex === -1) {
				newSelected = newSelected.concat(selectedRows, String(rowId));
			} else if (selectedIndex === 0) {
				newSelected = newSelected.concat(selectedRows.slice(1));
			} else if (selectedIndex === selectedRows.length - 1) {
				newSelected = newSelected.concat(selectedRows.slice(0, -1));
			} else if (selectedIndex > 0) {
				newSelected = newSelected.concat(
					selectedRows.slice(0, selectedIndex),
					selectedRows.slice(selectedIndex + 1)
				);
			}
			setSelectedRows(newSelected);
			props.selectedRows?.(
				props.rows.filter((row) =>
					Object.values(row).some((v) => newSelected.find((s) => s === String(v)))
				)
			);
		};

	const isSelected = useCallback(
		(rowId: string) => selectedRows.indexOf(rowId) !== -1,
		[selectedRows]
	);

	const handleColumnSort = (columnSort: ColumnSort<T>) => {
		setColumnSort(columnSort);
		props.onSortChange?.(columnSort);
	};
	return (
		<TableContainer
			component={Paper}
			sx={{
				flexBasis: `1px`,
				flexGrow: 1,
				boxShadow: 'none',
				'.MuiTableCell-head': {
					background: 'transparent',
				},
				'.MuiTableCell-root': {
					paddingY: 1,
					border: 'none',
				},
				'.MuiTableCell-body': {
					paddingY: 1.25,
				},
				'.MuiTable-root': {
					borderCollapse: 'collapse',
				},
				...props.sx,
			}}
		>
			<Table_
				stickyHeader
				{...props?.tableProps}
			>
				<TableHead
					sx={{
						background: isRestaurantView ? theme.palette.secondary.main : '#E1EDFF',
						position: 'initial',
						top: 0,
						zIndex: 1,
					}}
				>
					<TableRow>
						{props.checkboxSelection && (
							<TableCell>
								<Checkbox
									indeterminate={selectedRows.length > 0 && selectedRows.length < props.rows.length}
									checked={props.rows.length > 0 && selectedRows.length === props.rows.length}
									onChange={onHeadChecboxClick}
								/>
							</TableCell>
						)}
						{props.columns.map((c, i) => (
							<TableCell
								key={i}
								sx={{
									'&:hover': {
										'& #no-column-sort': { visibility: 'visible', opacity: 0.5, transition: `.3s` },
									},
								}}
								{...c.tableHeaderProps}
							>
								<Stack
									flexDirection={'row'}
									alignItems={'center'}
									gap={1}
									sx={c.tableHeaderProps?.sx}
								>
									<PoppinsTypography
										variant={isRestaurantView ? 'subtitle2' : 'subtitle1'}
										sx={{ color: isRestaurantView ? '#727198' : '#61656E' }}
									>
										{c.renderHeader({ field: c.field, columnNumber: i })}
									</PoppinsTypography>
									{c.sortable && (
										<>
											{c.field !== columnSort?.field && (
												<HeaderIconButton
													id='no-column-sort'
													title='Click to sort'
													onClick={() =>
														handleColumnSort({
															field: c.field,
															order: 'asc',
														})
													}
													sx={{ visibility: 'hidden', opacity: 0, transition: `.3s` }}
												>
													<IconFinder iconName='ChevronDown' />
												</HeaderIconButton>
											)}
											{columnSort?.order === 'asc' && c.field === columnSort?.field && (
												<HeaderIconButton
													title='Click to sort descending order'
													onClick={() =>
														handleColumnSort({
															field: c.field,
															order: 'desc',
														})
													}
												>
													<IconFinder iconName='ChevronDown' />
												</HeaderIconButton>
											)}
											{columnSort?.order === 'desc' && c.field === columnSort?.field && (
												<HeaderIconButton
													title='Click to remove sort'
													onClick={() => handleColumnSort(null)}
													sx={{ transform: 'rotate(180deg)' }}
												>
													<IconFinder iconName='ChevronDown' />
												</HeaderIconButton>
											)}
										</>
									)}
								</Stack>
							</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{props.loading ? (
						props.loadingComponent ? (
							props.loadingComponent
						) : (
							<TableRow>
								<TableCell
									colSpan={props.columns.length}
									align='center'
								>
									<Box
										display={'flex'}
										flex={'auto'}
										alignItems={'center'}
										justifyContent={'center'}
										sx={{ position: 'absolute', left: `50%`, top: `50%` }}
									>
										<CircularProgress size={60} />
									</Box>
								</TableCell>
							</TableRow>
						)
					) : props.rows.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={props.columns.length}
								align='center'
							>
								<PoppinsTypography
									variant='h6'
									fontWeight={600}
								>
									Not Found
								</PoppinsTypography>
							</TableCell>
						</TableRow>
					) : (
						props.rows.map((row, index) => {
							const rowId = String(props.rowId(row));
							const _isSelected = isSelected(rowId);
							return (
								<TableRow
									key={index}
									sx={{
										'&:last-child td, &:last-child th': { border: 0 },
										backgroundColor: isRestaurantView ? '#F8F8F9' : `#F8FBFF`,
										borderStyle: 'solid',
										borderColor: 'white',
										borderTopWidth: isRestaurantView ? 4 : 2,
										borderBottomWidth: isRestaurantView ? 4 : 2,
										...(isRestaurantView && {
											'& th:first-child': {
												borderRadius: '12px 0 0 12px',
											},
											'& th:last-child': {
												borderRadius: '0 12px 12px 0',
											},
										}),
									}}
									selected={props.checkboxSelection && _isSelected}
									{...props?.tableRowProps}
								>
									{props.checkboxSelection && (
										<TableCell>
											<Checkbox
												checked={_isSelected}
												onChange={onBodyChecboxClick(rowId)}
											/>
										</TableCell>
									)}
									{props.columns.map((col, i) => {
										return (
											<TableCell
												component='th'
												scope='row'
												key={i}
												{...col?.tableCellProps}
											>
												<PoppinsTypography
													sx={{
														fontFamily: 'Poppins',
														fontSize: /* isRestaurantView ? `20px` : */ `16px`,
														color: theme.palette.common.primaryGreyText,
														whiteSpace: 'nowrap',
														overflow: 'hidden',
														textOverflow: 'ellipsis',
														fontWeight: isRestaurantView ? 600 : 500,
														...col?.tableCellTypographySx,
													}}
												>
													{col.renderCell({ row, rowNumber: index })}
												</PoppinsTypography>
											</TableCell>
										);
									})}
								</TableRow>
							);
						})
					)}
				</TableBody>
			</Table_>
		</TableContainer>
	);
};

export default memo(Table);

const HeaderIconButton = memo((props: IconButtonProps) => (
	<IconButton
		size='small'
		color='inherit'
		{...props}
		title={undefined}
		sx={{ padding: `2px`, ...props.sx }}
	/>
));
