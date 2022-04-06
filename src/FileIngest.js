const ImportFromFileBodyComponent = ({ fileHandler, clearFn }) => {
  let fileReader;

  const handleFileRead = (e) => {
    const content = fileReader.result;
    fileHandler(content);
  };

  const handleFileChosen = (file) => {
    if (!file) return;
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  };

  return <div className='upload-file'>
    <label htmlFor="file">QuickBooks Timesheet Report (csv): </label>
    <input
      type='file'
      id='file'
      className='input-file'
      accept='.csv'
      onBeforeInput={clearFn}
      onChange={e => handleFileChosen(e.target.files[0])}
    />
  </div >;
};

export default ImportFromFileBodyComponent;