import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
// import Input from '@material-ui/core/Input';
// import Icon from '@material-ui/core/Icon';
import Search from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
// import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import logo from './logo.svg';
import './App.css';
import response from './source/response.json';
import dijkstra from './source/dijkstras-algorithm';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});

class App extends Component {
  state = {
    from: 'Amsterdam',
    to: 'Moscow',
    departureCity: [],
    arrivalCity: [],
    variant: 'cheapest',
  };

  componentDidMount() {
    this.createDefaultState();
  }

  createDefaultState = () => {
    const { deals } = response;
    const departureCity = this.getDepartureCity('depar');
    const arrivalCity = this.getDepartureCity();

    const graph = departureCity.reduce((graphObject, city) => {
      const getNodes = deals.filter(item => item.departure === city);
      const t = {};

      getNodes.forEach((i) => {
        if (!t[i.arrival]) {
          t[i.arrival] = i;
        } else if (t[i.arrival].arrival === i.arrival
          && t[i.arrival].cost > i.cost) {
          t[i.arrival] = i;
        }
      });
      graphObject = Object.assign({ [city]: t }, graphObject);

      return graphObject;
    }, {});

    console.log(graph);

    this.setState({ departureCity, arrivalCity, graph });
  }

  getDepartureCity = (depar) => {
    const { deals } = response;
    const departureCity = deals.reduce((sum, item) => {
      const currentCity = depar ? item.departure : item.arrival;
      const checkCity = sum.indexOf(currentCity);

      if (!(checkCity + 1)) {
        sum = [...sum, currentCity];
      }

      return sum;
    }, []);

    return departureCity.sort();
  }

  getItems = (cities) => {
    const sendItems = cities.map((city) => {
      return (
        <MenuItem
          key={city}
          value={city}
        >{city}
        </MenuItem>
      );
    });

    return sendItems;
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onClickVariant = (variant) => {
    this.setState({ variant });
  }

  searchPath = () => {
    const { from, to, graph } = this.state;

    console.log(dijkstra({ from, to, graph }));

    // console.log(from, to);
  }

  render() {
    const { classes } = this.props;
    const {
      departureCity, arrivalCity, from, to, variant,
    } = this.state;
    // const departureCity = this.getDepartureCity('depar');
    // const arrivalCity = this.getDepartureCity();

    const departureItems = this.getItems(departureCity);
    const arrivalItems = this.getItems(arrivalCity);

    // console.log(departureCity);

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Fantasy Trip Finder</h1>
        </header>
        <div>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="age-simple">From</InputLabel>
            <Select
              value={from}
              onChange={this.handleChange}
              inputProps={{
                name: 'from',
                id: 'from-simple',
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {departureItems}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="age-simple">To</InputLabel>
            <Select
              value={to}
              onChange={this.handleChange}
              inputProps={{
                name: 'to',
                id: 'to-simple',
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {arrivalItems}
            </Select>
          </FormControl>
        </div>
        <div>
          <Button
            color={variant === 'cheapest' ? 'primary' : 'default'}
            onClick={() => this.onClickVariant('cheapest')}
            variant="contained"
            // color="primary"
            className={classes.button}
          >
              Cheapest
          </Button>
          <Button
            color={variant === 'fastes' ? 'primary' : 'default'}
            onClick={() => this.onClickVariant('fastes')}
            variant="contained"
            // color="primary"
            className={classes.button}
          >
                Fastes
          </Button>

          <div>
            <Button
              onClick={this.searchPath}
              variant="contained"
              color="secondary"
              className={classes.button}
            >
              Search
              <Search className={classes.rightIcon} />
            </Button>
          </div>

        </div>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

// export default App;

export default withStyles(styles)(App);
