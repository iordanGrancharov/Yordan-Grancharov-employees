import Papa from "papaparse";

import { headerCheck } from "../../utils/prepareData";
import { getPairs } from "../../utils/prepareData";

import styles from "./FileForm.module.css";

function FileForm({ setDataToBeDisplayed, dataToBeDisplayed, setDisplayPair }) {
  const allowedFileTypes = ".csv";

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      Papa.parse(file, {
        skipEmptyLines: true,
        complete: function (results) {
          setDataToBeDisplayed(headerCheck(results.data));
          setDisplayPair(null);
        },
      });
    }
    event.target.value = null;
  };

  function handleClick(e) {
    e.preventDefault();
    if (dataToBeDisplayed?.data) {
      setDisplayPair(getPairs(dataToBeDisplayed?.data));
    }
  }

  return (
    <div className={styles["formContainer"]}>
      <h1 className={styles["header"]}>Projects History</h1>
      <form className={styles["form"]}>
        <label htmlFor="csvFile">Select File</label>
        <input
          type="file"
          accept={allowedFileTypes}
          id="csvFile"
          onChange={handleFileUpload}
        />
        {dataToBeDisplayed ? (
          <button className={styles["check"]} onClick={handleClick}>
            Get The Best Duo
          </button>
        ) : null}
      </form>
    </div>
  );
}

export default FileForm;
