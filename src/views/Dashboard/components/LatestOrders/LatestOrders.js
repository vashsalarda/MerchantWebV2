import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import {format} from 'date-fns';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  TableSortLabel,
  Typography
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

import { StatusBullet } from 'components';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 800
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  status: {
    marginRight: theme.spacing(1)
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const statusColors = {
  paid: 'primary',
  pending: 'success',
  cancelled: 'danger',
  void: 'secondary'
};

const LatestOrders = props => {
  const { className, data:orders, ...rest } = props;

  const classes = useStyles();

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        title="Latest Orders"
      />
      <Divider />
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell sortDirection="desc">
                    <Tooltip
                      enterDelay={300}
                      title="Sort"
                    >
                      <TableSortLabel
                        active
                        direction="desc"
                      >
                        Placed
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map(order => (
                  <TableRow
                    hover
                    key={order._id}
                  >
                    <TableCell>...{order.orderId}</TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>
                      {format(new Date(order.createdAt),'EEE MMM dd, yyyy hh:mm a')}
                    </TableCell>
                    <TableCell>&#8369;{order.grandTotal}</TableCell>
                    <TableCell>
                      <div className={classes.statusContainer}>
                        <StatusBullet
                          className={classes.status}
                          color={statusColors[order.status]}
                          size="sm"
                        />
                        {order.status}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
          <Typography variant="body1">
            <Link 
              to={'/orders'}
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

LatestOrders.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array
};

export default LatestOrders;
