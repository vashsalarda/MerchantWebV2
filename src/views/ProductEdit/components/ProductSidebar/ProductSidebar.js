import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Typography,
  Divider,
  Button
} from '@material-ui/core';

import { format } from 'date-fns'
import { getInitials } from 'helpers';

const tzName = Intl.DateTimeFormat().resolvedOptions().timeZone;

const useStyles = makeStyles(theme => ({
  root: {},
  details: {
    display: 'flex'
  },
  avatar: {
    marginLeft: 'auto',
    height: 110,
    width: 100,
    flexShrink: 0,
    flexGrow: 0
  },
  progress: {
    marginTop: theme.spacing(2)
  },
  uploadButton: {
    marginRight: theme.spacing(2)
  }
}));

const ProductSidebar = props => {
  const { className, product, ...rest } = props;
  const classes = useStyles();

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <div>
          <Typography
            color="primary"
            gutterBottom
            variant="h4"
          >
            {product.name}
          </Typography>
        </div>
        <div className={classes.details}>
          <div>
            <Typography
              className={classes.locationText}
              color="textSecondary"
              variant="h5"
            >
              &#8369;{product?.price > 0 ? numberWithCommas(product.price) : '0.00'}
            </Typography>
            <Typography
              className={classes.dateText}
              color="textSecondary"
              variant="body1"
            >
              Created: {product.createdAt ? `${format(new Date(product.createdAt),'MMM dd, yyyy hh:mm a')} (${tzName})` : ''}
            </Typography>
          </div>
          <Avatar
            alt={getInitials(product.name)}
            className={classes.avatar}
            src={product?.photos?.[0]?.thumb}
            variant="square"
          >
            {getInitials(product.name)}
          </Avatar>
        </div>
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          className={classes.uploadButton}
          color="primary"
          variant="text"
        >
          Upload picture
        </Button>
        <Button variant="text">Remove picture</Button>
      </CardActions>
       
    </Card>
  );
};

const numberWithCommas = x => {
  return priceRound(x).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const priceRound = (price, dec) => {
  if (dec === undefined) {
    dec = 2;
  }
  if (price !== 0) {
    if (!price || isNaN(price)) {
      throw new Error('price is not a number' + price);
    }
  }
  const str = parseFloat(Math.round(price * 100) / 100).toFixed(dec);
  return str;
};

ProductSidebar.propTypes = {
  className: PropTypes.string,
  product: PropTypes.object
};

export default ProductSidebar;
