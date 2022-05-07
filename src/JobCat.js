const drawHeaderRow = (row) => {
	// 100% dynamic this way:
	// const cols = [];
	// for (const [key,] of Object.entries(row || {})) {
	//   cols.push(<th key={`th-${key}`}>{key}</th>);
	// }
	// return <tr>{cols}</tr>;

	return (
		<tr>
			<th>Date</th>
			<th>Day</th>
			<th>Name</th>
			<th>Service</th>
			<th>Hours</th>
			<th>Billable</th>
			<th>Status</th>
			<th>Notes</th>
		</tr>
	);
};

const drawDataRow = (row, idx) => {
	// const cols = [];
	// for (const [key, value] of Object.entries(row || {})) {
	//   cols.push(<td key={`row${idx}-${key}`}>{value}</td>);
	// }
	// return <tr>{cols}</tr>;
	return (
		<tr key={`row${idx}`}>
			<td>{row.date}</td>
			<td>{row.day}</td>
			<td>{row.name}</td>
			<td>{row.service}</td>
			<td>{row.hours}</td>
			<td>{row.billable}</td>
			<td>{row.approved}</td>
			<td>{row.notes}</td>
		</tr>
	);
};

const JobCat = ({ data, jobcode }) => {
	return (
		<div className='jobcat'>
			<table>
				<thead>{drawHeaderRow(data[0])}</thead>
				<tbody>
					{data.map((row, idx) => {
						return row.jobcode === jobcode && drawDataRow(row, idx);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default JobCat;
