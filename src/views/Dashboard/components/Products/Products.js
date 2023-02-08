import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Avatar, Card,Chip, CardContent, Grid, Typography } from '@material-ui/core';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';

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
    backgroundColor: theme.palette.primary.main,
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
  }
}));

const Products = props => {
  const { className, data, ...rest } = props;
  const classes = useStyles();

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
              PRODUCTS
            </Typography>
            <Typography variant="h3">{numberWithCommas(data.total,0)}</Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <ShoppingBasketIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
        <div className={classes.items}>
          <Chip
            className={clsx(classes.medium,classes.leftItem)}
            color="primary"
            label={`${data.active ? numberWithCommas(data.active,0) : 0} Published`}
          />
          <Chip
            className={classes.medium}
            color="secondary"
            label={`${data.inactive ? numberWithCommas(data.inactive,0) : 0} Unpublished`}
          />
        </div>
      </CardContent>
    </Card>
  );
};

Products.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object
};

export default Products;
