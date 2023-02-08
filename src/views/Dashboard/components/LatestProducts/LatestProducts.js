import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { differenceInDays, format, formatDistance } from 'date-fns';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Avatar,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Typography
} from '@material-ui/core';
import { 
  ArrowRight as ArrowRightIcon,
  Edit as EditIcon
} from '@material-ui/icons';
import { getInitials } from 'helpers';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  },
  content: {
    padding: 0
  },
  image: {
    height: 48,
    width: 48
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const LatestProducts = props => {
  const { className, data: products , ...rest } = props;
  const classes = useStyles();

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        subtitle={`${products.length} in total`}
        title="Latest Products"
      />
      <Divider />
      <CardContent className={classes.content}>
        <List>
          {products.map((product, i) => (
            <ListItem
              divider={i < products.length - 1}
              key={product._id}
            >
              <ListItemAvatar>
                <Avatar
                  alt={getInitials(product.name)}
                  className={classes.avatar}
                  src={product?.photos?.[0]?.thumb}
                  variant="rounded"
                >
                  {getInitials(product.name)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={product.name}
                secondary={ 
                  differenceInDays(new Date(), new Date(product.updatedAt)) < 30 ?
                    `Updated ${formatDistance(new Date(product.updatedAt), new Date(), { addSuffix: true })}` :
                    `Updated ${format(new Date(product.updatedAt),'MMM dd, yyyy')}`
                }
              />
              <IconButton
                edge="end"
                size="small"
              >
                <Link 
                  to={`/products/edit/${product._id}`}
                >
                  <EditIcon />
                </Link>
              </IconButton>
            </ListItem>
          ))}
        </List>
      </CardContent>
      <Divider />
      <CardActions className={classes.actions}>
        <Button
          color="primary"
          size="small"
          variant="text"
        >
          <Typography variant="body1">
            <Link 
              to={'/products'}
            >
              View all
            </Link>
          </Typography>
          <ArrowRightIcon />
        </Button>
      </CardActions>
    </Card>
  );
};

LatestProducts.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array
};

export default LatestProducts;
