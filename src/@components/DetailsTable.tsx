import { PureComponent, ReactNode, memo } from 'react';

interface DetailsTableProps {
	data: { name: ReactNode; value: ReactNode; showWhen?: boolean }[];
	classes?: { root?: string; tBody?: string; tr?: string; tdName?: string; tdValue?: string };
}

class DetailsTable extends PureComponent<DetailsTableProps> {
	render(): ReactNode {
		return (
			<table className={this.props.classes?.root}>
				<tbody className={this.props.classes?.tBody}>
					{this.props.data.map(
						(k, i) =>
							k.showWhen && (
								<tr
									key={i}
									className={this.props.classes?.tr}
								>
									<td
										className={`tdName ${
											this.props.classes?.tdName ? this.props.classes?.tdName : ''
										}`}
									>
										{k.name}
									</td>
									<td
										className={`tdValue ${
											this.props.classes?.tdValue ? this.props.classes?.tdValue : ''
										}`}
									>
										{k.value}
									</td>
								</tr>
							)
					)}
				</tbody>
			</table>
		);
	}
}

export default memo(DetailsTable);
