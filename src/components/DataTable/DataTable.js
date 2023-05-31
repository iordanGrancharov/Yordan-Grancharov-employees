import styles from "./DataTable.module.css";

function DataTable({ dataToBeDisplayed }) {
  return (
    <table className={styles["table"]}>
      {dataToBeDisplayed?.header ? (
        <thead className={styles["tableHeader"]}>
          <tr>
            {dataToBeDisplayed.header.map((cell) => (
              <th key={`${Math.random(0, 1) * 1000}${cell}`}>{cell}</th>
            ))}
          </tr>
        </thead>
      ) : dataToBeDisplayed ? (
        <thead>
          <tr>
            <th>EmpID</th>
            <th>ProjectId</th>
            <th>DateFrom</th>
            <th>DateTo</th>
          </tr>
        </thead>
      ) : null}
      <tbody className={styles["tableBody"]}>
        {dataToBeDisplayed?.data.map((project) => (
          <tr key={`${Math.random(0, 1) * 1000}${project[1]}`}>
            {project.map((cell) => (
              <td key={`${Math.random(0, 1) * 1000}${cell}`}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DataTable;
