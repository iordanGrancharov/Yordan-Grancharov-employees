import { convertSecondsToDays } from "../../utils/prepareData";
import styles from "./DisplayPair.module.css";

function DisplayPair({ displayPair }) {
  return (
    <table className={styles["pairsTable"]}>
      <thead>
        <tr className={styles["cells"]}>
          <th>First Employee ID</th>
          <th>Second Employee ID</th>
          <th>Projects IDs</th>
          <th>Days Spent</th>
        </tr>
      </thead>
      <tbody className={styles["tableBody"]}>
        <tr>
          <td>{displayPair[0].empId1}</td>
          <td>{displayPair[0].empId2}</td>
          <td>
            {displayPair[0].projects
              ?.map((x) => x.projectName.toString())
              .join(" ")}
          </td>
          <td>{convertSecondsToDays(displayPair[0].totalTimeSpentTogether)}</td>
        </tr>
      </tbody>
    </table>
  );
}

export default DisplayPair;
