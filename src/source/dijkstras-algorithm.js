const dijkstra = ({
  from, to, graphArr,
}) => {
  const uniqueArray = () => {
    const allCity = graphArr.map(i => i.departure);

    return allCity.filter((item, pos) => allCity.indexOf(item) === pos);
  };

  const searchingObj = {
    [from]: { count: 0, path: [] },
    [to]: { count: Infinity, path: [] },
    historyGraph: uniqueArray(),
  };

  const oneStep = (city) => {
    const currentArr = graphArr.filter(item => item.departure === city);
    /* eslint-disable complexity */

    currentArr.forEach((item, idx) => {
      const departureCity = item.departure;
      const currentPrice = searchingObj[departureCity].count;
      const currentPath = searchingObj[departureCity].path;
      const checkHistory = searchingObj.historyGraph.some(i => i === departureCity);

      if (checkHistory) {
        if (searchingObj[item.arrival]
          && searchingObj[item.arrival].count > (currentPrice + item.cost)) {
          searchingObj[item.arrival] = {
            count: currentPrice + item.cost,
            path: [...currentPath, item.reference],
          };
        } else if (!searchingObj[item.arrival]) {
          searchingObj[item.arrival] = {
            count: currentPrice + item.cost,
            path: [...currentPath, item.reference],
          };
        }
      }

      if (currentArr.length === idx + 1) {
        const timingHistory = searchingObj.historyGraph;

        timingHistory.forEach((elem, indx) => {
          if (elem === departureCity) searchingObj.historyGraph.splice(indx, 1);
        });
      }
    });
  };

  const lowestCity = () => {
    return Object.keys(searchingObj).reduce((lowest, node) => {
      if (node !== 'historyGraph' || lowest === '' || searchingObj[node].cost !== Infinity
        || searchingObj[node].cost < searchingObj[lowest].cost) {
        lowest = node;
      }

      return lowest;
    }, '');
  };

  oneStep(from);
  let counter = searchingObj.historyGraph.length;

  while (counter) {
    oneStep(lowestCity());
    if (counter === searchingObj.historyGraph.length) {
      counter = 0;
    } else {
      counter = searchingObj.historyGraph.length;
    }
  }
  const getPath = searchingObj[to].path;

  const getCityPath = [];

  getPath.forEach((item) => {
    graphArr.forEach((elem) => {
      if (elem.reference === item) getCityPath.push(elem);
    });
  });

  return getCityPath;
};

export default dijkstra;
