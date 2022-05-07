import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import JobCat from './JobCat';

const TabsView = ({ data, jobcodes, downloadHandler }) => {
	return (
		<Tabs className='tabs-wrapper'>
			<TabList>
				{jobcodes.map((code, idx) => {
					return <Tab key={`tab_${idx}`}>{code}</Tab>;
				})}
			</TabList>

			{jobcodes.map((code, idx) => {
				return (
					<TabPanel key={`tabpanel_${idx}`}>
						<JobCat key={`jobcat_${idx}`} data={data} jobcode={code} />
						<button onClick={() => downloadHandler(code)}>Download CSV</button>
					</TabPanel>
				);
			})}
		</Tabs>
	);
};

export default TabsView;
