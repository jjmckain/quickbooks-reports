import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import JobCat from './JobCat';

const COLORS = ['red', 'orange', 'green', 'blue', 'indigo', 'violet'];

const TabsView = ({ data, jobcodes, downloadHandler }) => {
  return (
    <Tabs className="tabs-wrapper">
      <TabList>
        {jobcodes.map((code, idx) => {
          const clr = COLORS[Math.floor(idx * COLORS.length + 2)];
          return <Tab style={{ backgroundColor: clr }} key={`tab_${idx}`}>{code}</Tab>
        })}
      </TabList>

      {
        jobcodes.map((code, idx) => {
          const clr = COLORS[Math.floor(idx * COLORS.length + 2)];
          return (
            <TabPanel key={`tabpanel_${idx}`}>
              <JobCat key={`jobcat_${idx}`} data={data} jobcode={code} />
              <button style={{ backgroundColor: clr }} onClick={() => downloadHandler(code)}>Download CSV</button>
            </TabPanel>
          )
        })
      }
    </Tabs >
  );
};

export default TabsView;