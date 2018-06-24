import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Search from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
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

    const graphArr = [];

    departureCity.forEach((city) => {
      const currentCityFilter = deals.filter(item => item.departure === city);

      currentCityFilter.forEach((elemF) => {
        if (!graphArr.length) graphArr.push(elemF);
        const currentArr = graphArr;

        currentArr.forEach((elem, indx) => {
          if (elem.arrival === elemF.arrival && elem.cost > elemF.cost) {
            graphArr.splice(indx, 1);
            graphArr.push(elemF);
          } else if (!graphArr.some(i => i.arrival === elemF.arrival
            && i.departure === elemF.departure)) {
            graphArr.push(elemF);
          }
        });
      });
    });

    this.setState({ departureCity, arrivalCity, graphArr });
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
    const { from, to, graphArr } = this.state;
    const optimalPath = dijkstra({ from, to, graphArr });

    this.setState({ optimalPath });
  }

  showPath = (optimalPath = []) => {
    let sum = 0;
    const objectsJSX = optimalPath.map((i) => {
      sum += i.cost;

      return (
        <li key={i.reference}>{`${i.departure} - ${i.arrival}...transport: ${i.transport}`}</li>
      );
    });

    return (
      <div>
        <ul>{objectsJSX}</ul>
        <div>{`Total: ${sum}`}</div>
      </div>
    );
  }

  render() {
    const { classes } = this.props;
    const {
      departureCity, arrivalCity, from, to, variant, optimalPath,
    } = this.state;

    const departureItems = this.getItems(departureCity);
    const arrivalItems = this.getItems(arrivalCity);

    const showPath = this.showPath(optimalPath);

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
            className={classes.button}
          >
              Cheapest
          </Button>
          <Button
            color={variant === 'fastes' ? 'primary' : 'default'}
            onClick={() => this.onClickVariant('fastes')}
            variant="contained"
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
        {showPath}
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
