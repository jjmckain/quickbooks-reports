import FileIngest from './FileIngest';
import TabsView from './TabsView';
import './App.css';
import { useState } from 'react';

const capitalizeFirstLetter = (s) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const convertToMinutes = (data) => {
  const parts = data.split(':');
  if (parts.length > 1) {
    //given in HH:MM format - need to parse
    const hrs = Number(parts[0]);
    const mins = Number(parts[1]);
    return 60 * hrs + mins;

  } else {
    //presumed given decimal format - need to convert
    return 60 * Number(parts[0])
  }
}

const minsToHours = (mins) => {
  const num = mins / 60;
  return (Math.round((num + Number.EPSILON) * 100) / 100).toFixed(2);
}

const scrubData = (data) => {
  // remove unwanted columns after doing hours math and consolidating the rows by date+task+jobcode
  const datamap = new Map();
  data.forEach(row => {
    if (!row.local_date) return;
    const obj = {
      name: `${row.fname} ${row.lname.charAt(0)}.`,
      date: row.local_date,
      day: row.local_day,
      minutes: convertToMinutes(row.hours),
      jobcode: row.jobcode,
      billable: row.billable,
      service: row.service_item,
      notes: row.notes,
      approved: capitalizeFirstLetter(row.approved_status)
    };

    const mapkey = `${obj.date}|${obj.jobcode}|${obj.service}|${obj.name}|${obj.approved}|${obj.billable}`;
    const entry = datamap.get(mapkey);
    if (!entry) {
      // first of it's kind, no math to do yet.
      datamap.set(mapkey, obj);
      return
    } else {
      //merge this row's billable time into the one we kept
      entry.minutes += obj.minutes;
      if (obj.notes) {
        if (entry.notes) entry.notes += ', ';
        entry.notes += obj.notes;
      }
      datamap.set(mapkey, entry);
    }

  });
  // remove the minutes column, replace with computed hours
  const output = [];
  [...datamap.values()].forEach(entity => {
    entity.hours = minsToHours(entity.minutes);
    delete entity.minutes;
    output.push(entity);
  });

  return output;
}

const promptFile = (filename, text) => {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};


function App() {
  const [data, setData] = useState([]);
  const [jobcodes, setJobcodes] = useState([]);

  const parseFile = (filetext) => {
    const contents = [];
    const keys = [];
    const codes = [];
    filetext.split('\r\n').forEach(line => {
      const target = {};
      const isHdr = keys.length === 0;
      line.split(",").forEach((column, idx) => {
        if (isHdr) {
          keys[idx] = column.replace(/ /g, '_');
        } else {
          target[keys[idx]] = column;
        }
      });
      if (!isHdr) {
        if (target.jobcode && codes.indexOf(target.jobcode) === -1)
          codes.push(target.jobcode);
        contents.push(target);
      }
    });
    setJobcodes(codes);
    setData(scrubData(contents));
    // console.log(contents);
  }

  const downloadCsv = (jobcode) => {
    // present the file as a CSV download to the user.
    const rows = data.filter(r => r.jobcode === jobcode);
    console.log(`${rows.length} rows match jobcode ${jobcode}`);

    const txtrows = [];
    txtrows.push(`Date,Day,Name,Service,Hours,Billable,Status,Notes\r\n`)
    rows.forEach(r => txtrows.push(`${r.date},${r.day},${r.name},${r.service},${r.hours},${r.billable},${r.approved},${r.notes}\r\n`));
    promptFile(`${jobcode} Timesheet.csv`, txtrows.join(""));
  }

  return (
    <div className="App">
      <header className="App-header">
        <h3>Hope Advising Quickbooks Reporting</h3>
      </header>

      <div className='file-ingest'>
        <FileIngest fileHandler={parseFile} clearFn={() => setData([])} />
        {data && <TabsView jobcodes={jobcodes} data={data} downloadHandler={downloadCsv} />}
      </div>
    </div>
  );
}

export default App;
