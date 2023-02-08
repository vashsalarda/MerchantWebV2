import React, { useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import { blue, green, red } from '@material-ui/core/colors';
import { UserContext } from '../../../../Store';

import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';

import { StatusBullet } from 'components';
import { numberWithCommas } from 'helpers';
import { capitalize } from 'helpers';

const useStyles = makeStyles(theme => ({
  root: {},
  table: {
    fontSize: '12px',
  },
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  miniTable: {
    width: '100%',
    overflow: 'auto'
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  large: {
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
  actions: {
    justifyContent: 'flex-end'
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  status: {
    marginRight: theme.spacing(1)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  orderInfo: {
    [theme.breakpoints.down('sm')]: {
      width: '100vw'
    },
    [theme.breakpoints.up('md')]: {
      width: 450
    },
    [theme.breakpoints.up('lg')]: {
      width: 600
    }
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  deletedProduct: {
    backgroundColor: red[100],
    textDecoration: 'line-through', 
    opacity: '65%', 
    fontStyle: 'italic'
  },
  addedProduct: {
    backgroundColor: green[100]
  },
  blue: {
    color: '#fff',
    backgroundColor: blue[200]
  },
  loading: {
    textAlign: 'center',
    margin: theme.spacing(5)
  },
  diningOption: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  paymentMethod: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  success: {
    backgroundColor: green[500]
  },
  danger: {
    backgroundColor: red[500]
  },
  warning: {
    backgroundColor: '#ffb300'
  },
  center: { textAlign: 'center' },
  details: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '12px',
    marginBottom: '12px',
    width: '100%'
  },
  detailsItalic: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '12px',
    marginBottom: '12px',
    fontStyle: 'italic',
    width: '100%'
  },
  notes: {
    flexDirection: 'row',
    marginTop: '12px',
    marginBottom: '12px',
    width: '100%'
  },
  iconContainer: {
    display: 'flex'
  },
  iconSmall: {
    fontSize: '1rem', 
    marginRight: '2px'
  },
  fw500: {
    fontWeight: 500
  }
}));

const statusColors = {
  paid: 'primary',
  payment_pending: 'success',
  cancelled: 'danger',
  void: 'secondary'
};

const SalesReportTable = (
  { 
    className, 
    txns, 
    loadingText,
    ...rest 
  }
) => {
  const [user] = useContext(UserContext)
  const { isGrocery } = user;
  const classes = useStyles();

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  {isGrocery ? (
                    <>
                      <TableCell>Date Placed</TableCell>
                      <TableCell>Booked For Date</TableCell>
                      <TableCell>Date Paid</TableCell>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Payment Method</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Gross Amount</TableCell>
                      <TableCell>SB Points</TableCell>
                      <TableCell>SB Wallet</TableCell>
                      <TableCell>SB Discounts</TableCell>
                      <TableCell>SB Promos</TableCell>
                      <TableCell>Merchant Promos</TableCell>
                      <TableCell>Net Amount</TableCell>
                      <TableCell>Fee</TableCell>
                      <TableCell>Booking Option</TableCell>
                      <TableCell>Customer Name</TableCell>
                      <TableCell>Customer Email</TableCell>
                      <TableCell>Customer Location</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>Date Placed</TableCell>
                      <TableCell>Booked For Date</TableCell>
                      <TableCell>Date Paid</TableCell>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Payment Method</TableCell>
                      <TableCell>Gross Sales</TableCell>
                      <TableCell>SB Points</TableCell>
                      <TableCell>SB Wallet</TableCell>
                      <TableCell>SB Discounts</TableCell>
                      <TableCell>SB Promos</TableCell>
                      <TableCell>Merchant Promos</TableCell>
                      <TableCell>Net Customer Payout</TableCell>
                      <TableCell>StreetBy Fees</TableCell>
                      <TableCell>Merchant Net</TableCell>
                      <TableCell>Product Charges/Fees</TableCell>
                      <TableCell>Booking Option</TableCell>
                      <TableCell>Customer Name</TableCell>
                      <TableCell>Customer Email</TableCell>
                      <TableCell>Customer Location</TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {txns && txns.length > 0 ?
                  txns ?
                    txns.map(txn => (
                      <TableRow
                        hover
                        key={txn?._id}
                      >
                        <TableCell style={{ whiteSpace: 'nowrap' }}>{format(new Date(txn?.createdAt), 'MMM dd, yyyy')}<br/>{format(new Date(txn?.createdAt), 'hh:mm:aa')}</TableCell>
                        <TableCell style={{ whiteSpace: 'nowrap' }}>{format(new Date(txn?.bookedForDate), 'MMM dd, yyyy')}<br/>{format(new Date(txn?.bookedForDate), 'hh:mm:aa')}</TableCell>
                        <TableCell style={{ whiteSpace: 'nowrap' }}>{ txn?.datePaid && format(new Date(txn?.datePaid), 'MMM dd, yyyy')}<br/>{txn?.datePaid && format(new Date(txn?.datePaid), 'hh:mm:aa')}</TableCell>
                        <TableCell>{txn?._id?.substring(txn?._id?.length, txn?._id?.length - 6)}</TableCell>
                        <TableCell>{capitalize(txn?.selectedPaymentOption)}</TableCell>
                        <TableCell>
                          <div className={classes.statusContainer}>
                            <StatusBullet
                              className={classes.status}
                              color={statusColors[txn.status]}
                              size="sm"
                            />
                            {txn.status === 'payment_pending' ?
                              'pending'
                              :
                              txn.status
                            }
                          </div>
                        </TableCell>
                        <TableCell>&#8369;{numberWithCommas(txn?.grossSales)}</TableCell>
                        <TableCell>&#8369;{numberWithCommas(txn?.pointsAmountUsed)}</TableCell> 
                        <TableCell>&#8369;{numberWithCommas(txn?.walletAmountUsed)}</TableCell>
                        <TableCell>&#8369;{numberWithCommas(txn?.discount)}</TableCell>
                        <TableCell>&#8369;{numberWithCommas(txn?.promosAmountStreetby)}</TableCell>
                        <TableCell>&#8369;{numberWithCommas(txn?.promosAmountMerchant)}</TableCell>
                        <TableCell>&#8369;{numberWithCommas(txn?.merchantNet)}</TableCell>
                        <TableCell>&#8369;0.00</TableCell>
                        <TableCell>{capitalize(txn?.bookingOption)}</TableCell>
                        <TableCell style={{width:'500px'}}>{`${txn?.customer?.firstName} ${txn?.customer?.lastName}`}</TableCell>
                        <TableCell>{txn.customer.email}</TableCell>
                        <TableCell style={{width:'500px'}}>{txn?.customerLocation}</TableCell>
                      </TableRow>
                    ))
                    :
                    txns.map(txn => (
                      <TableRow
                        hover
                        key={txn?._id}
                      >
                        <TableCell style={{ whiteSpace: 'nowrap' }}>{format(new Date(txn.createdAt), 'MMM dd, yyyy')}<br/>{format(new Date(txn.createdAt), 'hh:mm:aa')}</TableCell>
                        <TableCell style={{ whiteSpace: 'nowrap' }}>{format(new Date(txn.bookedForDate), 'MMM dd, yyyy')}<br/>{format(new Date(txn.bookedForDate), 'hh:mm:aa')}</TableCell>
                        <TableCell style={{ whiteSpace: 'nowrap' }}>{txn.datePaid && format(new Date(txn.datePaid), 'MMM dd, yyyy')}<br/>{txn.datePaid && format(new Date(txn.datePaid), 'hh:mm:aa')}</TableCell>
                        <TableCell>{txn?._id?.substring(txn?._id?.length, txn?._id?.length - 6)}</TableCell>
                        <TableCell style={{ whiteSpace: 'nowrap' }}>{txn.selectedPaymentOption ? txn.selectedPaymentOption.toUpperCase() : 'N/A'}</TableCell>
                        <TableCell>
                          <div className={classes.statusContainer}>
                            <StatusBullet
                              className={classes.status}
                              color={statusColors[txn.status]}
                              size="sm"
                            />
                            {txn.status === 'payment_pending' ?
                              'pending'
                              :
                              txn.status
                            }
                          </div>
                        </TableCell>
                        <TableCell>&#8369;{numberWithCommas(txn.grossSales)}</TableCell>
                        <TableCell>&#8369;{numberWithCommas(txn.pointsAmountUsed)}</TableCell>
                        <TableCell>&#8369;{numberWithCommas(txn.walletAmountUsed)}</TableCell>
                        <TableCell>&#8369;{numberWithCommas(txn.discount)}</TableCell>
                        <TableCell>&#8369;{numberWithCommas(txn.promosAmountStreetby)}</TableCell>
                        <TableCell>&#8369;{numberWithCommas(txn.promosAmountMerchant)}</TableCell>
                        <TableCell>&#8369;{numberWithCommas(txn.netCustomerPayout)}</TableCell>
                        <TableCell>&#8369;{numberWithCommas(txn.streetbyFees)}</TableCell>
                        <TableCell>&#8369;{numberWithCommas(txn.merchantNet)}</TableCell>
                        <TableCell>&#8369;{numberWithCommas(txn.extraFees)}</TableCell>
                        <TableCell>{capitalize(txn.bookingOption)}</TableCell>
                        <TableCell style={{width:'500px'}}>{`{txn.customer.firstName} ${txn.customer.lastName}`}</TableCell>
                        <TableCell>{txn.customer.email}</TableCell>
                        <TableCell style={{width:'500px'}}>{txn.customerLocation}</TableCell>
                      </TableRow>
                    ))
                  :
                  <TableRow>
                    <TableCell colSpan="9">
                      <Typography variant="body1">{loadingText}</Typography>
                    </TableCell>
                  </TableRow>
                }
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
    </Card>
  );
};

SalesReportTable.propTypes = {
  className: PropTypes.string,
  loadingText: PropTypes.string,
  txns: PropTypes.array
};

export default SalesReportTable;