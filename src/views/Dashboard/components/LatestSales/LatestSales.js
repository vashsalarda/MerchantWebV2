import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Bar, Line } from 'react-chartjs-2';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles, withStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputBase from '@material-ui/core/InputBase';
import palette from 'theme/palette';
import { format } from 'date-fns';

const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: 'none',
    fontSize: 'inherit',
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Roboto"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

const useStyles = makeStyles(() => ({
  root: {},
  chartContainer: {
    height: 400,
    minWidth: 500,
    overFlow: 'auto',
    position: 'relative'
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  legend: { display: false },
  cornerRadius: 20,
  tooltips: {
    enabled: true,
    mode: 'index',
    intersect: false,
    borderWidth: 1,
    borderColor: palette.divider,
    backgroundColor: palette.white,
    titleFontColor: palette.text.primary,
    bodyFontColor: palette.text.secondary,
    footerFontColor: palette.text.secondary
  },
  layout: { padding: 0 },
  scales: {
    xAxes: [
      {
        ticks: {
          fontColor: palette.text.secondary
        },
        gridLines: {
          display: false,
          drawBorder: false
        }
      }
    ],
    yAxes: [
      {
        ticks: {
          fontColor: palette.text.secondary,
          beginAtZero: true,
          min: 0
        },
        gridLines: {
          borderDash: [2],
          borderDashOffset: [2],
          color: palette.divider,
          drawBorder: false,
          zeroLineBorderDash: [2],
          zeroLineBorderDashOffset: [2],
          zeroLineColor: palette.divider
        }
      }
    ]
  }
};

const LatestSales = props => {
  const { className, data, graph, onChangePeriod, ...rest } = props;
  const classes = useStyles();

  const [ filters, setFilters ] = useState({
    period: 'thisMonth'
  })

  const period = [
    {
      key: 'thisWeek',
      value: 'This Week',
    },
    {
      key: 'thisMonth',
      value: 'This Month',
    },
    {
      key: 'last7Days',
      value: 'Last 7 Days',
    },
    {
      key: 'last15Days',
      value: 'Last 15 Days',
    },
    {
      key: 'last30Days',
      value: 'Last 30 Days',
    }
  ]

  const labels = data ? data.map(item => format(new Date(item._id),'dd MMM')) : []
  const dataItems = data ? data.map(item => roundOffNum(item._merchantTotal)) : []

  const chartData = {
    labels: labels,
    datasets: [
      {
        backgroundColor: palette.primary.light,
        barPercentage: 0.5,
        barThickness: 15,
        borderColor: 'rgb(51,	88,	244)',
        categoryPercentage: 0.5,
        data: dataItems,
        // label: 'This day',
        maxBarThickness: 10,
        tension: 0.125,
      }
    ],
  }

  const handleChangePeriod = (e) => {
    const { value } = e.target
    setFilters({period:value})
    onChangePeriod(value)
  }

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        action={
          <Select
            id="demo-customized-select"
            input={<BootstrapInput />}
            labelId="demo-customized-select-label"
            onChange={handleChangePeriod}
            size="sm"
            value={filters.period}
          >
            { period.map(item => {
              return(
                <MenuItem 
                  key={item.key} 
                  value={item.key}
                >
                  {item.value}
                </MenuItem>
              )
            })
            }
          </Select>
        }
        title="Sales"
      />
      <Divider />
      <CardContent>
        <PerfectScrollbar>
          <div className={classes.chartContainer}>
            { graph === 'Bar' ?
              <Bar
                data={chartData}
                options={chartOptions}
              /> 
              :
              <Line
                data={chartData}
                options={chartOptions}
              /> 
            }
          </div>
        </PerfectScrollbar>
      </CardContent>
      <Divider />
      <CardActions className={classes.actions}>
        <Button
          color="primary"
          size="small"
          variant="text"
        >
          Overview <ArrowRightIcon />
        </Button>
      </CardActions>
    </Card>
  );
};

// Round of number (Two decimal place)
const roundOffNum = (x) => {
  let res = x
  if(!isNaN(x)) {
    res = Math.round(x * 100) / 100;
  }
  return res
}

LatestSales.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array,
  graph: PropTypes.string,
  onChangePeriod: PropTypes.func
};

export default LatestSales;
