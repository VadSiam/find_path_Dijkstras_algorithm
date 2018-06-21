/* eslint-disable */

const lowestCostNode = (costs, processed) => {
  return Object.keys(costs).reduce((lowest, node) => {
    if (lowest === null || costs[node] < costs[lowest]) {
      if (!processed.includes(node)) {
        lowest = node;
      }
    }
    return lowest;
  }, null);
};

// function that returns the minimum cost and path to reach Finish
const dijkstra = ({from, to, graph}) => {

  // track lowest cost to reach each node
  const costs = Object.assign({[to]: Infinity}, graph[from]);

  // track paths
  const parents = {[to]: null};
  for (let child in graph[from]) {
    parents[child] = 'start';
  }

  // track nodes that have already been processed
  const processed = [];

  let node = lowestCostNode(costs, processed);

  while (node) {

    let cost = costs[node];
    let children = graph[node];
    for (let n in children) {
      let newCost = cost + children[n];
      if (!costs[n]) {
        costs[n] = newCost;
        parents[n] = node;
      }
      if (costs[n] > newCost) {
        costs[n] = newCost;
        parents[n] = node;
      }
    }
    processed.push(node);
    node = lowestCostNode(costs, processed);

  }

  let optimalPath = [to];
  let parent = parents[to];
  while (parent) {
    optimalPath.push(parent);
    parent = parents[parent];
  }
  optimalPath.reverse();

  const results = {
    distance: costs[to],
    path: optimalPath
  };

  return results;
};

export default dijkstra;

// console.log(dijkstra(problem));
