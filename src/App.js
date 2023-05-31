import { useState } from "react";

import FileForm from "./components/FileForm/FileForm";
import DataTable from "./components/DataTable/DataTable";
import DisplayPair from "./components/DisplayPair/DisplayPair";

import styles from "./App.module.css";

function App() {
  const [dataToBeDisplayed, setDataToBeDisplayed] = useState(null);
  const [displayPair, setDisplayPair] = useState(null);

  return (
    <div className={styles["container"]}>
      <FileForm
        setDataToBeDisplayed={setDataToBeDisplayed}
        dataToBeDisplayed={dataToBeDisplayed}
        setDisplayPair={setDisplayPair}
      />
      {displayPair ? <DisplayPair displayPair={displayPair} /> : null}

      <DataTable dataToBeDisplayed={dataToBeDisplayed} />
    </div>
  );
}

export default App;
