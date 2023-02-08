import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core';
import { 
  AttachMoney as AttachMoneyIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  DragHandle as DragHandleIcon
} from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700
  },
  avatar: {
    backgroundColor: theme.palette.white,
    color: theme.palette.primary.main,
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  },
  difference: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  differenceIcon: {
    color: theme.palette.success.white
  },
  differenceValue: {
    color: theme.palette.white,
    marginRight: theme.spacing(1)
  }
}));

const numberWithCommas = (x,y) => {
  return priceRound(x,y).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
};

const priceRound = (price, dec) => {
  if (dec === undefined) {
    dec = 0
  }
  if (price !== 0) {
    if (!price || isNaN(price)) {
      throw new Error('price is not a number' + price);
    }
  }
  const str = parseFloat(Math.round(price * 100) / 100).toFixed(dec);
  return str
};

const TotalProfit = props => {
  const { className, data, ...rest } = props;
  const lastMonth = data[0]
  const thisMonth = data[1]

  let difference = 0
  if(thisMonth?._merchantTotal && lastMonth?._merchantTotal) {
    difference = ((thisMonth?._merchantTotal - lastMonth?._merchantTotal) / lastMonth?._merchantTotal) * 100
  }
  const classes = useStyles();

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <Grid
          container
          justifyContent="space-between"
        >
          <Grid item>
            <Typography
              className={classes.title}
              color="inherit"
              gutterBottom
              variant="body2"
            >
              TOTAL SALES (THIS MONTH)
            </Typography>
            <Typography
              color="inherit"
              variant="h3"
            >
              &#8369;{numberWithCommas((thisMonth?._merchantTotal ? thisMonth?._merchantTotal : 0),2)}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <AttachMoneyIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
        <div className={classes.difference}>
          { difference === 0 ?
            <DragHandleIcon className={classes.differenceIcon} />
            : difference > 0 ?
              <ArrowUpwardIcon className={classes.differenceIcon} />
              :
              <ArrowDownwardIcon className={classes.differenceIcon} />
          }
          
          <Typography
            className={classes.differenceValue}
            variant="body2"
          >
            {numberWithCommas(difference,2)}%
          </Typography>
          <Typography
            className={classes.caption}
            color="inherit"
            variant="caption"
          >
            From last month
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

TotalProfit.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array
};

export default TotalProfit;
