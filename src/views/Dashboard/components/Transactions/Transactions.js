import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Avatar, Card, Chip, CardContent, Grid, Typography } from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700
  },
  avatar: {
    backgroundColor: theme.palette.success.main,
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  },
  items: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  leftItem: {
    marginRight: theme.spacing(1)
  },
  medium: {
    fontWeight: 500
  },
  green: {
    color: theme.palette.success.main
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

const Transactions = props => {
  const { className, data, ...rest } = props;
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
              color="textSecondary"
              gutterBottom
              variant="body2"
            >
              TRANSACTIONS (THIS MONTH)
            </Typography>
            <Typography variant="h3">{numberWithCommas(data.total,0)}</Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <ShoppingCartIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
        <div className={classes.items}>
          <Typography
            className={clsx(classes.medium,classes.leftItem)}
            variant="subtitle2"
          >
            <Chip
              color="primary"
              label={`${data.paid ? numberWithCommas(data.paid,0) : 0} Paid`}
            />
          </Typography>
          <Typography
            className={clsx(classes.medium,classes.leftItem)}
            variant="subtitle2"
          >
            <Chip
              color="secondary"
              label={`${data.cancelled ? numberWithCommas(data.cancelled,0) : 0} Cancelled`}
            />
          </Typography>
          <Typography
            className={classes.medium}
            variant="subtitle2"
          >
            <Chip
              color="default"
              label={`${data.void ? numberWithCommas(data.void,0) : 0} Void`}
            />
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

Transactions.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object
};

export default Transactions;
