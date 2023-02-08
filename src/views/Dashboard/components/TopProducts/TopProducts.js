import React from 'react';
import { HorizontalBar } from 'react-chartjs-2';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles, useTheme } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Divider
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  chartContainer: {
    position: 'relative',
    height: 300,
    minWidth: 500,
  },
  stats: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center'
  },
  device: {
    textAlign: 'center',
    padding: theme.spacing(1)
  },
  deviceIcon: {
    color: theme.palette.icon
  }
}));

const TopProducts = props => {
  const { className, data, ...rest } = props;

  const classes = useStyles();
  const theme = useTheme();

  const graphData = {
    datasets: [
      {
        data: data?.length ? data.map(i => i.count) : [],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.error.main,
          theme.palette.warning.main,
          theme.palette.success.main,
          theme.palette.secondary.main,
          theme.palette.primary.main,
          theme.palette.error.main,
          theme.palette.warning.main,
          theme.palette.success.main,
          theme.palette.secondary.main
        ],
        borderWidth: 1,
        borderColor: theme.palette.white,
        hoverBorderColor: theme.palette.white
      }
    ],
    labels: data?.length ? data.map(i => i.name) : [],
  };

  const options = {
    legend: {
      display: false
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    layout: { padding: 0 },
    tooltips: {
      enabled: true,
      mode: 'index',
      intersect: true,
      borderWidth: 1
    },
    scales: {
      xAxes: [
        {
          ticks: {
            fontColor: theme.palette.text.secondary,
            beginAtZero: true,
            min: 0
          }
        }
      ]
    }
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        title="Top Products (This Month)"
      />
      <Divider />
      <CardContent>
        <PerfectScrollbar>
          <div className={classes.chartContainer}>
            <HorizontalBar
              data={graphData}
              options={options}
            />
          </div>
        </PerfectScrollbar>
      </CardContent>
    </Card>
  );
};

TopProducts.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array
};

export default TopProducts;
