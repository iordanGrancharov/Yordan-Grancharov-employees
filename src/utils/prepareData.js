export const headerCheck = (data) => {
  const headerCSV = data[0].join(" ");
  const pattern = /\d{1,}/m;

  let isHeader = false;

  if (!headerCSV.match(pattern)) {
    isHeader = true;
    data = data.slice(1);
  }

  return { header: isHeader ? headerCSV.split(" ") : null, data };
};

export const getPairs = (data) => {
  // data => array of arrays
  const projects = uniqueProjects(data);
  sortDataByAscending(projects);

  let pairs = [];

  projects.forEach((project) => (pairs = [...pairs, ...findPairs(project)]));

  //find pairs for project

  const projectData = getTotalTimeSpentTogether(pairs);
  projectData.sort(
    (current, next) =>
      next.totalTimeSpentTogether - current.totalTimeSpentTogether
  );

  return projectData;
};

const uniqueProjects = (data) => {
  const projects = [];

  data.forEach((project) => {
    project = project.map((x) => x.trimStart());
    let el = projects.find((x) => x.id === project[1]);

    if (!el) {
      projects.push({
        id: project[1],
        employees: [
          {
            empId: project[0],
            ...timeSpentOnProjectInSeconds(project[2], project[3]),
          },
        ],
      });
    } else {
      el.employees.push({
        empId: project[0],
        ...timeSpentOnProjectInSeconds(project[2], project[3]),
      });
    }
  });

  return projects;
};

const timeSpentOnProjectInSeconds = (from, to) => {
  if (from.toUpperCase() === "NULL") {
    from = new Date().toString();
  }
  if (to.toUpperCase() === "NULL") {
    to = new Date().toString();
  }

  let isToNumber = false;
  let isFromNumber = false;
  let pattern = /[-!$%^&*()_+|~=`{}[\]:";'<>?,./]/gm;
  let workedTo;
  let workedFrom;

  if (!isNaN(Number(to))) {
    isToNumber = true;
  } else {
    workedTo = to.replaceAll(pattern, "-");
  }

  if (!isNaN(Number(from))) {
    isFromNumber = true;
  } else {
    workedFrom = from.replaceAll(pattern, "-");
  }

  workedFrom = isFromNumber ? from : new Date(from);
  workedTo = isToNumber ? to : new Date(to);

  if (isNaN(workedFrom) || isNaN(workedTo)) {
    return null;
    // Return null if the date is invalid
  }

  workedTo = isToNumber ? workedTo / 1000 : workedTo.getTime() / 1000;
  workedFrom = isFromNumber ? workedFrom / 1000 : workedFrom.getTime() / 1000;

  const timeSpent = Math.floor(workedTo) - Math.floor(workedFrom);

  return {
    timeSpent,
    from: Math.floor(workedFrom),
    to: Math.floor(workedTo),
  };
};

export const convertSecondsToDays = (data) => {
  const secondsInADay = 86400;

  return Math.floor(data / secondsInADay);
};

const sortDataByAscending = (data) => {
  data.forEach((project) =>
    project.employees.sort((current, next) => current.from - next.from)
  );
};

const findPairs = (data) => {
  //data => projects
  const dataCopy = data.employees.slice();
  const pairs = [];

  while (dataCopy.length > 1) {
    let current = dataCopy.shift();
    dataCopy.forEach((emp) => {
      if (emp.from < current.to) {
        const timeSpentTogetherOnProject = current.to - emp.from;
        pairs.push([data.id, current, emp, timeSpentTogetherOnProject]);
      }
    });
  }

  return pairs;
};

const getTotalTimeSpentTogether = (data) => {
  const dataCopy = data.slice();
  let totalTimeSpentByPair = [];

  while (dataCopy.length > 1) {
    const currentPair = dataCopy.shift();
    let flag = false;

    dataCopy.forEach((pair) => {
      if (
        (currentPair[1].empId === pair[1].empId &&
          currentPair[2].empId === pair[2].empId) ||
        (currentPair[1].empId === pair[2].empId &&
          currentPair[2].empId === pair[1].empId)
      ) {
        let el = totalTimeSpentByPair.some(
          (obj) =>
            (obj.empId1 === pair[1].empId && obj.empId2 === pair[2].empId) ||
            (obj.empId2 === pair[1].empId && obj.empId1 === pair[2].empId)
        );

        flag = true;

        if (!el) {
          totalTimeSpentByPair.push({
            empId1: currentPair[1].empId,
            empId2: currentPair[2].empId,
            projects: [
              { projectName: currentPair[0], timeSpent: currentPair[3] },
              { projectName: pair[0], timeSpent: pair[3] },
            ],
            totalTimeSpentTogether: currentPair[3] + pair[3],
          });
        } else {
          el = {
            ...el,
            projects: [
              ...el.projects,
              { projectName: pair[0], timeSpent: pair[3] },
            ],
            totalTimeSpentTogether: el.totalTimeSpentTogether + pair[3],
          };
        }
      }
    });

    if (!flag) {
      totalTimeSpentByPair.push({
        empId1: currentPair[1].empId,
        empId2: currentPair[2].empId,
        projects: [{ projectName: currentPair[0], timeSpent: currentPair[3] }],
        totalTimeSpentTogether: currentPair[3],
      });
    }
  }
  return totalTimeSpentByPair;
};
