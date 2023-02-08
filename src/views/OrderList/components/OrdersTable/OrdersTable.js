import React, { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { format, formatDistanceToNow } from 'date-fns';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import { blue, green, grey, red } from '@material-ui/core/colors';
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Chip,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  TextField
} from '@material-ui/core';

import { StatusBullet } from 'components';
import { getInitials } from 'helpers';
import { numberWithCommas } from 'helpers';
import { capitalize } from 'helpers';

import { UserContext } from '../../../../Store';
import api from '../../../../config/api';

import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import RoomIcon from '@material-ui/icons/Room';
import HomeIcon from '@material-ui/icons/Home';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import PhoneCallbackIcon from '@material-ui/icons/PhoneCallback';

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
  row: {
    cursor: 'pointer'
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

const OrdersTable = props => {
  const { 
    className, 
    orders, 
    loadingText, 
    orderCount, 
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    ...rest 
  } = props;

  const [ user ] = useContext(UserContext)
  const { token, defaultPage:pageId } = user
  const classes = useStyles();
  const [order, setOrder] = useState(false);
  const [orderId, setOrderId] = useState(false);

  const [fetchingOrder, setFetchingOrder] = useState(false);
  const [fetchingOrderText, setFetchingOrderText] = useState('Fetching order information...');
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isGrocery] = useState(true);

  useEffect(() => {
    if(token && pageId && orderId) {
      setFetchingOrder(true)
      api(token).get(`places/${pageId}/orders/${orderId}`)
        .then(resp => {
          if(resp) {
            const orderData = resp?.data
            setOrder(orderData)
            setFetchingOrder(false)
            if(!orderData) {
              setFetchingOrderText('Order not found.')
            }
          }
        })
        .catch(err => {
          console.error(err);
          setOrder({})
          setFetchingOrder(false)
          setFetchingOrderText('Order not found.')
        });
    }
  },[orderId,token,pageId]);

  const handleClickOpen = (e) => {
    setOpenDrawer(true)
    const dataId = e.currentTarget.dataset.id
    setOrderId(dataId)
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  const handlePageChange = (event, page) => {
    onPageChange(page);
  };

  const handleRowsPerPageChange = event => {
    onRowsPerPageChange(event.target.value);
  };

  const toggleDrawer = (openDrawer) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    } else if (event && event.type === 'click' && event.target.className !== 'MuiBackdrop-root') {
      return;
    }
    setOpenDrawer(openDrawer);
  };

  const handleChangePaymentStatus = (e) => {
    const status = e.target.value
    console.log({status})
  }

  const deliveryStatusBadge = (orderStatus) => {
    if(orderStatus && orderStatus instanceof Array && orderStatus.length > 0) {
      const finalStatus = orderStatus[orderStatus.length - 1];
      const status = finalStatus.status;
      if(status==='Confirmed') {
        return(
          <Chip 
            className={classes.warning} 
            color="secondary"
            label="Confirmed"
            size="small"
          />
        )
      } else if (status==='Deployed') {
        return(
          <Chip 
            className={classes.warning} 
            color="secondary"
            label="Deployed"
            size="small"
          />
        )
      } else if (status==='Picked up') {
        return(
          <Chip 
            color="primary"
            label="Picked up"
            size="small"
          />
        )
      } else if (status==='Requested for void') {
        return(
          <Chip 
            className={classes.warning} 
            color="secondary"
            label="Requested for void"
            size="small"
          />
        )
      } else if (status==='Order Completed') {
        return(
          <Chip 
            className={classes.success} 
            color="secondary"
            label="Order Completed"
            size="small"
          />
        )
      } else if (status==='Paid') {
        return(
          <Chip 
            color="primary"
            label="Paid"
            size="small"
          />
        )
      } else if (status==='Cancelled') {
        return(
          <Chip 
            className={classes.danger} 
            color="secondary"
            label="Cancelled"
            size="small"
          />
        )
      } else if (status==='Received Order') {
        return(
          <Chip 
            className={classes.success} 
            color="secondary"
            label="Received Order"
            size="small"
          />
        )
      } else {
        return(
          <Chip 
            color="secondary"
            label="N/A"
            size="small"
          />
        )
      }
    } else {
      return(
        <Chip
          color="secondary"
          label="N/A"
          size="small"
        />
      )
    }
  }

  const orderProducts = (products) => {
    if(products?.length > 0) {
      return products.map((prod, index) => (
        <TableRow 
          className={prod.unavailable ? classes.deletedProduct : ''}
          key={index} 
        >
          <TableCell size="small">{index+1}.</TableCell>
          <TableCell size="small">
            <div className={classes.nameContainer}>
              <Avatar
                alt={getInitials(prod.name)}
                className={clsx(classes.avatar,classes.blue)}
                src={prod?._id?.photos?.[0]?.thumb}
                variant="rounded"
              >
                {getInitials(prod.name)}
              </Avatar>
              <Typography variant="body2">
                {prod.name}
              </Typography>
            </div>
          </TableCell>
          <TableCell size="small">{prod.quantity}</TableCell>
          <TableCell size="small">
            &#8369;{numberWithCommas(prod.price)}
          </TableCell>
          <TableCell size="small">
            &#8369;{numberWithCommas(prod.price * prod.quantity)}
          </TableCell>
        </TableRow>
      ));
    } else {
      return(
        <TableRow>
          <TableCell colSpan={5}>No products found</TableCell>
        </TableRow>
      )
    }
  }

  const addedProducts = (products,totalOldProducts) => {
    if(products?.length > 0) {
      return products.map((prod, index) => (
        <TableRow
          className={prod.unavailable ? classes.deletedProduct : classes.addedProduct}
          key={index} 
        >
          <TableCell size="small">{totalOldProducts+index+1}.</TableCell>
          <TableCell size="small">
            <div className={classes.nameContainer}>
              <Avatar
                alt={getInitials(prod.name)}
                className={clsx(classes.avatar,classes.blue)}
                src={prod?._id?.photos?.[0]?.thumb}
                variant="rounded"
              >
                {getInitials(prod.name)}
              </Avatar>
              <Typography variant="body2">
                {prod.name}
              </Typography>
            </div>
          </TableCell>
          <TableCell size="small">{prod.quantity}</TableCell>
          <TableCell size="small">&#8369;{numberWithCommas(prod.price)}</TableCell>
          <TableCell size="small">&#8369;{numberWithCommas(prod.price * prod.quantity)}</TableCell>
        </TableRow>
      ));
    }
  }

  const paymentInfo = (order) => {
    const { page } = order;
    const markupValue = page && page.markup && page.markup.value ? page.markup.value : 0;
    const markupRate = markupValue/100;
    let containerFee = 0;
    const serviceCharge = (order.extraFees && order.extraFees.serviceCharge) || 0;
    let { products, addedProducts } = order;
    if(addedProducts && addedProducts instanceof Array && addedProducts.length > 0) {
      products = [...products,...addedProducts];
    }
    const newProducts = products.filter(item => item.unavailable !== true);
    let grandTotal = 0;
    let itemsTotal = 0;
    let convenienceFee = 0;
    const deliveryFee = order.delivery && order.delivery[0] && order.delivery[0].fee ? order.delivery[0].fee : 0;
    const cargoFee = order.convenienceFee && order.convenienceFee.value ? order.convenienceFee.value : 0;
    const pointsAmountUsed = order.pointsAmountUsed ? order.pointsAmountUsed : 0;
    const walletAmountUsed = order.walletAmountUsed ? order.walletAmountUsed : 0;
    let promos = order.orderPromoDiscount ? order.orderPromoDiscount : 0;
    let productPromos = 0;
    newProducts.forEach(item => {
      itemsTotal += item.price * item.quantity;
      if(item.markup && item.markup > 0) {
        convenienceFee += item.markup * item.quantity;
      } else {
        convenienceFee += item.price * item.quantity * markupRate;
      }
      if(item.containerFee && item.containerFee.amount) {
        const delivery = item.containerFee.supportedOrderOption && item.containerFee.supportedOrderOption.delivery ? item.containerFee.supportedOrderOption.delivery : false
        const pickup = item.containerFee.supportedOrderOption && item.containerFee.supportedOrderOption.pickup ? item.containerFee.supportedOrderOption.pickup : false
        const days = item.days > 1 ? item.days : 1
        if(item.diningOption==='delivery' && delivery) {
          containerFee += item.containerFee.amount * item.quantity * days
        } else if (item.diningOption==='pickup' && pickup) {
          containerFee += item.containerFee.amount * item.quantity * days
        }
      }
      if(item.promos && item.promos.length > 0) {
        const promo = item.promos[0];
        const promoType = promo.calculation.type;
        const promoValue = promo.calculation.value;
        let days = 1;
        if(item.days && item.days > 1) {
          days = item.days;
        }
        if (promoType === 'percent') {
          productPromos += (item.price * item.quantity * days) * (promoValue / 100);
        } else {
          productPromos += promoValue;
        }
      }
      promos += productPromos;
    })

    let gatewayFees = 0
    const totalCustomer = itemsTotal + convenienceFee + cargoFee + containerFee + serviceCharge + deliveryFee
    if (order.selectedPaymentOption === 'paynamics') {
      const commissionRate = order.paynamicsDetail.commissionPercentage;
      if (order.paynamicsDetail.commissionType === 'customer') {
        gatewayFees = (totalCustomer / (1 - commissionRate)) - totalCustomer;
      }
    } else if (order.selectedPaymentOption === 'paymongo') {
      const commissionRate = order.paymongoDetail.commissionPercentage
      const commissionFixed = order.paymongoDetail.commissionFixed
      const commissionFixedCondition = order.paymongoDetail.commissionFixedCondition ? order.paymongoDetail.commissionFixedCondition : 0
      if (order.paymongoDetail.commissionType === 'customer') {
        gatewayFees = ((totalCustomer + commissionFixed) / (1 - commissionRate)) - totalCustomer;
      } else if (order.paymongoDetail.commissionType === 'streetby' && totalCustomer > commissionFixedCondition ) {
        gatewayFees = commissionFixed
      }
    }
    
    if(isGrocery) {
      grandTotal = itemsTotal + convenienceFee + cargoFee + containerFee + serviceCharge + deliveryFee + gatewayFees
    } else {
      grandTotal = itemsTotal + convenienceFee + cargoFee + containerFee + serviceCharge + gatewayFees
    }
    const customerPayout = grandTotal - (pointsAmountUsed + walletAmountUsed + promos)
    
    return (
      <>
        <div className={classes.details}>
          <Typography variant="h6">
            Items Total
          </Typography>
          <Typography variant="h6">
            &#8369;{numberWithCommas(itemsTotal)}
          </Typography>
        </div>
        <Divider />
        { isGrocery
          ?
          <>
            <div className={classes.details}>
              <Typography variant="body1">
                Cargo Fee
              </Typography>
              <Typography variant="body1">
                &#8369;{numberWithCommas(cargoFee)}
              </Typography>
            </div>
            <div className={classes.details}>
              <Typography variant="body1">
                Convenience Fee
              </Typography>
              <Typography variant="body1">
                &#8369;{numberWithCommas(convenienceFee)}
              </Typography>
            </div>
          </>
          :
          <>
            <div className={classes.details}>
              <Typography variant="body1">
                Container Fee
              </Typography>
              <Typography variant="body1">
                &#8369;{numberWithCommas(containerFee)}
              </Typography>
            </div>
            <div className={classes.details}>
              <Typography variant="body1">
                Service Fee
              </Typography>
              <Typography variant="body1">
                &#8369;{numberWithCommas(serviceCharge)}
              </Typography>
            </div>
          </>
        }
        { isGrocery &&
          <div className={classes.details}>
            <Typography variant="body1">
              Delivery Fee
            </Typography>
            <Typography variant="body1">
              &#8369;{numberWithCommas(deliveryFee)}
            </Typography>
          </div>
        }
        { gatewayFees > 0 &&
          <div className={classes.details}>
            <Typography className="body1">
              Gateway Fees
            </Typography>
            <Typography className="body1">
              &#8369;{numberWithCommas(gatewayFees)}
            </Typography>
          </div>
        }
        { promos > 0 &&
          <div className={classes.detailsItalic}>
            <Typography className="body1">
              Promos
            </Typography>
            <Typography className="body1">
              &#8369;{numberWithCommas(promos)}
            </Typography>
          </div>
        }
        { walletAmountUsed > 0 &&
          <div className={classes.detailsItalic}>
            <Typography className="body1">
              Wallet
            </Typography>
            <Typography className="body1">
              &#8369;{numberWithCommas(walletAmountUsed)}
            </Typography>
          </div>
        }
        { pointsAmountUsed > 0 &&
          <div className={classes.detailsItalic}>
            <Typography className="body1">
              Points
            </Typography>
            <Typography className="body1">
              &#8369;{numberWithCommas(pointsAmountUsed)}
            </Typography>
          </div>
        }
        <Divider />
        <div className={classes.details}>
          <Typography variant="h6">
            Grand Total
          </Typography>
          <Typography variant="h6">
            &#8369;{numberWithCommas(grandTotal)}
          </Typography>
        </div>
        <div className={classes.details}>
          <Typography variant="h6">
            Customer Payout
          </Typography>
          <Typography variant="h6">
            &#8369;{numberWithCommas(customerPayout)}
          </Typography>
        </div>
        <Divider />
      </>
    )
  }

  const deliveryInfo = (order) => {
    const delivery = order?.delivery?.[order?.delivery?.length - 1]
    return (
      <>
        <div className={classes.details}>
          <Typography variant="body1">
            Est. Delivery Pick-up Time
          </Typography>
          <Typography variant="body1">
            {delivery && delivery.pickupDate
              ? format(new Date(delivery.pickupDate),'MMM dd, yyyy hh:mm a')
              : 'No date selected'
            }
          </Typography>
        </div>
        <div className={classes.details}>
          <Typography variant="body1">
            Ordered On
          </Typography>
          <Typography variant="body1">
            {format(new Date(order.createdAt),'MMM dd, yyyy hh:mm a')}
          </Typography>
        </div>
        { delivery && delivery.deliveryEstimateDescription ?
          <div className={classes.details}>
            <Typography variant="body1">
              Estimated Time
            </Typography>
            <Typography variant="body1">
              {delivery.deliveryEstimateDescription}
            </Typography>
          </div>
          :
          <div className={classes.details}>
            <Typography variant="body1">
              Booked For
            </Typography>
            <Typography variant="body1">
              { delivery && delivery.to 
                ? format(new Date(delivery.to),'MMM dd, yyyy hh:mm a')
                : 'No date selected'
              }
            </Typography>
          </div>
        }
        <div className={classes.details}>
          <Typography variant="body1">
            Dining Option
          </Typography>
          <Typography variant="body1">
            {capitalize(order?.products?.[0]?.diningOption)}
          </Typography>
        </div>
        <div className={classes.details}>
          <Typography variant="body1">
            Payment Method
          </Typography>
          <Typography variant="body1">
            { order?.selectedPaymentOption === 'gcash' && order?.paymongoDetail?.commissionPercentage
              ?
              'Paymongo GCash'
              :
              capitalize(order?.selectedPaymentOption)
            }
          </Typography>
        </div>
        <Divider />
        <div className={classes.notes}>
          <Typography variant="body1">Notes from the Customer</Typography>
          <Typography variant="subtitle2"><em>{order.consumerNotes || 'No note added'}</em></Typography>
        </div>
        <Divider />
        { order.status !== 'for_confirmation' ?
          <div className={classes.notes}>
            <Typography variant="body1">Provider Notes</Typography>
            <Typography variant="subtitle2"><em>{order.notes || 'No note added'}</em></Typography>
          </div>
          :
          <div className={classes.notes}>
            <Typography variant="body1">Provider Notes</Typography>
            <div>
              <textarea
                autoComplete="off"
                onChange={() => {}}
                placeholder={'Type something...'}
                rows="8"
                style={{
                  borderColor: 'rgba(169,169,169,0.5)',
                  width: '100%',
                  marginTop: 10,
                  resize: 'none',
                  maxHeight: '450px',
                }}
              />
            </div>
          </div>
        }
        <Divider />
      </>
    );
  }

  const customerInfo = (order) => {
    const deliveryAddress =
      order.isDelivery && order.delivery[0].deliveryAddress.address
        ? order.delivery[0].deliveryAddress.address
        : '';
    const landmark =
      order.isDelivery && order.delivery[0].deliveryAddress.landmark
        ? order.delivery[0].deliveryAddress.landmark
        : '';
    const googleAddress =
      order.isDelivery && order.delivery[0].deliveryAddress.googleAddress
        ? order.delivery[0].deliveryAddress.googleAddress
        : '';
    const receiverName =
      order.isDelivery && order.delivery[0].deliveryAddress.name
        ? order.delivery[0].deliveryAddress.name
        : '';
    const receiverPhone =
      order.isDelivery && order.delivery[0].deliveryAddress.phone
        ? order.delivery[0].deliveryAddress.phone
        : '';
    return (
      <>
        <div className={classes.details}>
          <Typography variant="h6">Customer</Typography>
        </div>
        <div className={classes.details}>
          <div className={classes.iconContainer}>
            <AccountBoxIcon className={classes.iconSmall} />
            <Typography variant="body1">
              {order.customer.firstName} {order.customer.lastName}
            </Typography>
          </div>
        </div>
        <div className={classes.details}>
          <div className={classes.iconContainer}>
            <PhoneIphoneIcon className={classes.iconSmall} />
            <Typography variant="body1">
              {order.customer.mobileNumbers[0]}
            </Typography>
          </div>
        </div>
        <div className={classes.details}>
          <div className={classes.iconContainer}>
            <EmailIcon className={classes.iconSmall} />
            <Typography variant="body1">
              {order.customer.email}
            </Typography>
          </div>
        </div>
        <div className={classes.details}>
          <Typography variant="h6">Delivery</Typography>
        </div>
        <div className={classes.details}>
          <div className={classes.iconContainer}>
            <HomeIcon className={classes.iconSmall} />
            <Typography variant="body1">
              {deliveryAddress}
            </Typography>
          </div>
        </div>
        { landmark && landmark.length > 0 &&
          <div className={classes.details}>
            <div className={classes.iconContainer}>
              <AccountBalanceIcon className={classes.iconSmall} />
              <Typography variant="body1">
                {landmark}
              </Typography>
            </div>
          </div>
        }
        <div className={classes.details}>
          <div className={classes.iconContainer}>
            <RoomIcon className={classes.iconSmall} />
            <Typography variant="body1">
              {googleAddress}
            </Typography>
          </div>
        </div>
        <div className={classes.details}>
          <Typography variant="h6">Recipient</Typography>
        </div>
        <div className={classes.details}>
          <div className={classes.iconContainer}>
            <AccountBoxIcon className={classes.iconSmall} />
            <Typography variant="body1">
              {receiverName}
            </Typography>
          </div>
        </div>
        <div className={classes.details}>
          <div className={classes.iconContainer}>
            <PhoneCallbackIcon className={classes.iconSmall} />
            <Typography variant="body1">
              {receiverPhone}
            </Typography>
          </div>
        </div>
        <Divider />
      </>
    );
  }

  const orderStatus = (order) => {
    const updated = () => {
      if(order?.orderStatus?.length > 0) {
        return(
          <TableRow>
            <TableCell 
              className={classes.fw500}
              size="small" 
            >
              Updated
            </TableCell>
            <TableCell 
              size="small"
              style={{whiteSpace:'nowrap'}}
            >
              {format(new Date(order?.updatedAt),'MMM dd, yyyy')}<br />
              {format(new Date(order?.updatedAt),'hh:mm a')}
            </TableCell>
            <TableCell 
              size="small"
              style={{whiteSpace:'nowrap'}}
            >
              {formatDistanceToNow(new Date(order?.updatedAt)) }
            </TableCell>
            <TableCell size="small">{order?.orderStatus?.[order?.orderStatus?.length - 1]?.email}</TableCell>
          </TableRow>
        )
      } else {
        return(
          <TableRow>
            <TableCell 
              className={classes.fw500}
              size="small" 
            >
              Updated
            </TableCell>
            <TableCell 
              size="small"
              style={{whiteSpace:'nowrap'}}
            >
              {format(new Date(order?.updatedAt),'MMM dd, yyyy')}<br />
              {format(new Date(order?.updatedAt),'hh:mm a')}
            </TableCell>
            <TableCell 
              size="small"
              style={{whiteSpace:'nowrap'}}
            >
              {formatDistanceToNow(new Date(order?.updatedAt)) }
            </TableCell>
            <TableCell size="small">{order?.customer?.email}</TableCell>
          </TableRow>
        )
      }
    }
    
    const	created = () => {
      return(
        <TableRow>
          <TableCell 
            className={classes.fw500}
            size="small" 
          >
            Created
          </TableCell>
          <TableCell 
            size="small"
            style={{whiteSpace:'nowrap'}}
          >
            {format(new Date(order?.createdAt),'MMM dd, yyyy')}<br />
            {format(new Date(order?.createdAt),'hh:mm a')}
          </TableCell>
          <TableCell 
            size="small"
            style={{whiteSpace:'nowrap'}}
          >
            {formatDistanceToNow(new Date(order?.createdAt)) }
          </TableCell>
          <TableCell size="small">{order?.customer?.email}</TableCell>
        </TableRow>
      )
    }

    const confirmed = () => {  
      const confirmedCheck = order?.orderStatus?.findIndex(item => item.status === 'Confirmed');
      if(confirmedCheck !== -1) {
        return(
          <TableRow>
            <TableCell 
              className={classes.fw500}
              size="small" 
            >
              Confirmed
            </TableCell>
            <TableCell 
              size="small"
              style={{whiteSpace:'nowrap'}}
            >
              {order?.orderStatus ? format(new Date(order?.orderStatus?.[confirmedCheck]?.time),'MMM dd, yyyy') : '-' }<br />
              {order?.orderStatus ? format(new Date(order?.orderStatus?.[confirmedCheck]?.time),'hh:mm a') : '' }
            </TableCell>
            <TableCell 
              size="small"
              style={{whiteSpace:'nowrap'}}
            >
              {order?.orderStatus ? formatDistanceToNow(new Date(order?.orderStatus?.[confirmedCheck]?.time)) : '-' }
            </TableCell>
            <TableCell size="small">{order?.orderStatus?.[confirmedCheck]?.email ? order?.orderStatus?.[confirmedCheck]?.email : 'n/a'}</TableCell>
          </TableRow>
        )
      }
      else
      {
        return(
          <TableRow>
            <TableCell 
              className={classes.fw500}
              size="small" 
            >
              Confirmed
            </TableCell>
            <TableCell size="small">-</TableCell>
            <TableCell size="small">-</TableCell>
            <TableCell size="small">n/a</TableCell>
          </TableRow>
        )
      }
    }

    const deployed = () => {  
      const deployedCheck = order.orderStatus.findIndex(item => item.status === 'Deployed');
      if(deployedCheck === -1) {
        return(
          <TableRow>
            <TableCell 
              className={classes.fw500}
              size="small" 
            >
              Deployed
            </TableCell>
            <TableCell size="small">-</TableCell>
            <TableCell size="small">-</TableCell>
            <TableCell size="small">n/a</TableCell>
          </TableRow>
        )
      }
      else
      {
        return(
          <TableRow>
            <TableCell 
              className={classes.fw500}
              size="small" 
            >
              Deployed
            </TableCell>
            <TableCell 
              size="small"
              style={{whiteSpace:'nowrap'}}
            >
              {order?.orderStatus ? format(new Date(order?.orderStatus?.[deployedCheck]?.time),'MMM dd, yyyy') : '-' }<br />
              {order?.orderStatus ? format(new Date(order?.orderStatus?.[deployedCheck]?.time),'hh:mm a') : '' }
            </TableCell>
            <TableCell 
              size="small"
              style={{whiteSpace:'nowrap'}}
            >
              {order?.orderStatus ? formatDistanceToNow(new Date(order?.orderStatus?.[deployedCheck]?.time)) : '-' }
            </TableCell>
            <TableCell size="small">{order?.orderStatus?.[deployedCheck]?.email ? order?.orderStatus?.[deployedCheck]?.email : 'n/a'}</TableCell>
          </TableRow>
        )
      }
    }

    const pickedup = () => {
      const pickedupCheck = order.orderStatus.findIndex(item =>  item.status === 'Picked up');
      if(pickedupCheck === -1) {
        return(
          <TableRow>
            <TableCell 
              className={classes.fw500}
              size="small" 
            >
              Picked up
            </TableCell>
            <TableCell size="small">-</TableCell>
            <TableCell size="small">-</TableCell>
            <TableCell size="small">n/a</TableCell>
          </TableRow>
        )
      }
      else
      {
        return(
          <TableRow>
            <TableCell 
              className={classes.fw500}
              size="small" 
            >
              Picked up
            </TableCell>
            <TableCell 
              size="small"
              style={{whiteSpace:'nowrap'}}
            >
              {order?.orderStatus ? format(new Date(order?.orderStatus?.[pickedupCheck]?.time),'MMM dd, yyyy') : '-' }<br />
              {order?.orderStatus ? format(new Date(order?.orderStatus?.[pickedupCheck]?.time),'hh:mm a') : '' }
            </TableCell>
            <TableCell 
              size="small"
              style={{whiteSpace:'nowrap'}}
            >
              {order?.orderStatus ? formatDistanceToNow(new Date(order?.orderStatus?.[pickedupCheck]?.time)) : '-' }
            </TableCell>
            <TableCell size="small">{order?.orderStatus?.[pickedupCheck]?.email ? order?.orderStatus?.[pickedupCheck]?.email : 'n/a'}</TableCell>
          </TableRow>
        )
      }
    }

    const acknowledged = () => {
      const acknowledgedCheck = order.orderStatus.findIndex(item =>  item.status === 'Order Acknowledged');
      if(acknowledgedCheck === -1) {
        return(
          <TableRow>
            <TableCell 
              className={classes.fw500}
              size="small" 
            >
              Acknowledged
            </TableCell>
            <TableCell size="small">-</TableCell>
            <TableCell size="small">-</TableCell>
            <TableCell size="small">n/a</TableCell>
          </TableRow>
        )
      }
      else
      {
        return(
          <TableRow>
            <TableCell 
              className={classes.fw500}
              size="small" 
            >
              Acknowledged
            </TableCell>
            <TableCell 
              size="small"
              style={{whiteSpace:'nowrap'}}
            >
              {order?.orderStatus ? format(new Date(order?.orderStatus?.[acknowledgedCheck]?.time),'MMM dd, yyyy') : '-' }<br />
              {order?.orderStatus ? format(new Date(order?.orderStatus?.[acknowledgedCheck]?.time),'hh:mm a') : '' }
            </TableCell>
            <TableCell 
              size="small"
              style={{whiteSpace:'nowrap'}}
            >
              {order?.orderStatus ? formatDistanceToNow(new Date(order?.orderStatus?.[acknowledgedCheck]?.time)) : '-' }
            </TableCell>
            <TableCell size="small">{order?.orderStatus?.[acknowledgedCheck]?.email ? order?.orderStatus?.[acknowledgedCheck]?.email : 'n/a'}</TableCell>
          </TableRow>
        )
      }
    }
    
    const prepared = () => {
      const preparedOrderCheck = order.orderStatus.findIndex(item =>  item.status === 'Prepared Order');
      if(preparedOrderCheck === -1) {
        return(
          <TableRow>
            <TableCell 
              className={classes.fw500}
              size="small" 
            >
              Prepared Order
            </TableCell>
            <TableCell size="small">-</TableCell>
            <TableCell size="small">-</TableCell>
            <TableCell size="small">n/a</TableCell>
          </TableRow>
        )
      }
      else
      {
        return(
          <TableRow>
            <TableCell 
              className={classes.fw500}
              size="small" 
            >
              Prepared Order
            </TableCell>
            <TableCell 
              size="small"
              style={{whiteSpace:'nowrap'}}
            >
              {order?.orderStatus ? format(new Date(order?.orderStatus?.[preparedOrderCheck]?.time),'MMM dd, yyyy') : '-' }<br />
              {order?.orderStatus ? format(new Date(order?.orderStatus?.[preparedOrderCheck]?.time),'hh:mm a') : '' }
            </TableCell>
            <TableCell 
              size="small"
              style={{whiteSpace:'nowrap'}}
            >
              {order?.orderStatus ? formatDistanceToNow(new Date(order?.orderStatus?.[preparedOrderCheck]?.time)) : '-' }
            </TableCell>
            <TableCell size="small">{order?.orderStatus?.[preparedOrderCheck]?.email ? order?.orderStatus?.[preparedOrderCheck]?.email : 'n/a'}</TableCell>
          </TableRow>
        )
      }
    }

    const received = () => {
      const receivedCheck = order.orderStatus.findIndex(item =>  item.status === 'Received Order');
      if(receivedCheck === -1) {
        return(
          <TableRow>
            <TableCell 
              className={classes.fw500}
              size="small" 
            >
              Received
            </TableCell>
            <TableCell size="small">-</TableCell>
            <TableCell size="small">-</TableCell>
            <TableCell size="small">n/a</TableCell>
          </TableRow>
        )
      }
      else
      {
        return(
          <TableRow style={{backgroundColor:green[200]}}>
            <TableCell 
              className={classes.fw500}
              size="small" 
            >
              Received
            </TableCell>
            <TableCell 
              size="small"
              style={{whiteSpace:'nowrap'}}
            >
              {order?.orderStatus ? format(new Date(order?.orderStatus?.[receivedCheck]?.time),'MMM dd, yyyy') : '-' }<br />
              {order?.orderStatus ? format(new Date(order?.orderStatus?.[receivedCheck]?.time),'hh:mm a') : '' }
            </TableCell>
            <TableCell 
              size="small"
              style={{whiteSpace:'nowrap'}}
            >
              {order?.orderStatus ? formatDistanceToNow(new Date(order?.orderStatus?.[receivedCheck]?.time)) : '-' }
            </TableCell>
            <TableCell size="small">{order?.orderStatus?.[receivedCheck]?.email ? order?.orderStatus?.[receivedCheck]?.email : 'n/a'}</TableCell>
          </TableRow>
        )
      }
    }

    const completed = () => {
      const completedCheck = order.orderStatus.findIndex(item =>  item.status === 'Order Completed');
      if(completedCheck === -1) {
        return(
          <TableRow>
            <TableCell 
              className={classes.fw500}
              size="small" 
            >
              Completed
            </TableCell>
            <TableCell size="small">-</TableCell>
            <TableCell size="small">-</TableCell>
            <TableCell size="small">n/a</TableCell>
          </TableRow>
        )
      }
      else
      {
        return(
          <TableRow style={{backgroundColor:green[200]}}>
            <TableCell 
              className={classes.fw500}
              size="small" 
            >
              Completed
            </TableCell>
            <TableCell 
              size="small"
              style={{whiteSpace:'nowrap'}}
            >
              {order?.orderStatus ? format(new Date(order?.orderStatus?.[completedCheck]?.time),'MMM dd, yyyy') : '-' }<br />
              {order?.orderStatus ? format(new Date(order?.orderStatus?.[completedCheck]?.time),'hh:mm a') : '' }
            </TableCell>
            <TableCell 
              size="small"
              style={{whiteSpace:'nowrap'}}
            >
              {order?.orderStatus ? formatDistanceToNow(new Date(order?.orderStatus?.[completedCheck]?.time)) : '-' }
            </TableCell>
            <TableCell size="small">{order?.orderStatus?.[completedCheck]?.email ? order?.orderStatus?.[completedCheck]?.email : 'n/a'}</TableCell>
          </TableRow>
        )
      }
    }

    const paid = () => {
      const paidCheck = order.orderStatus.findIndex(item =>  item.status === 'Paid');
      if(paidCheck === -1) {
        return(
          <TableRow>
            <TableCell 
              className={classes.fw500}
              size="small" 
            >
              Paid
            </TableCell>
            <TableCell size="small">-</TableCell>
            <TableCell size="small">-</TableCell>
            <TableCell size="small">n/a</TableCell>
          </TableRow>
        )
      }
      else
      {
        return(
          <TableRow style={{backgroundColor:green[200]}}>
            <TableCell 
              className={classes.fw500}
              size="small" 
            >
              Paid
            </TableCell>
            <TableCell 
              size="small"
              style={{whiteSpace:'nowrap'}}
            >
              {order?.orderStatus ? format(new Date(order?.orderStatus?.[paidCheck]?.time),'MMM dd, yyyy') : '-' }<br />
              {order?.orderStatus ? format(new Date(order?.orderStatus?.[paidCheck]?.time),'hh:mm a') : '' }
            </TableCell>
            <TableCell 
              size="small"
              style={{whiteSpace:'nowrap'}}
            >
              {order?.orderStatus ? formatDistanceToNow(new Date(order?.orderStatus?.[paidCheck]?.time)) : '-' }
            </TableCell>
            <TableCell size="small">{order?.orderStatus?.[paidCheck]?.email ? order?.orderStatus?.[paidCheck]?.email : 'n/a'}</TableCell>
          </TableRow>
        )
      }
    }

    const requestedForVoid = () => {
      const voidCheck = order.orderStatus.findIndex(item =>  item.status === 'Requested for void');
      if(order.requestedForVoid === false || order.laundry) {
        return(
          <TableRow>
            <TableCell 
              className={classes.fw500}
              size="small" 
            >
              Requested for void
            </TableCell>
            <TableCell size="small">-</TableCell>
            <TableCell size="small">-</TableCell>
            <TableCell size="small">n/a</TableCell>
          </TableRow>
        )
      }
      else
      {
        return(
          <TableRow style={{backgroundColor:grey[200]}}>
            <TableCell 
              className={classes.fw500}
              size="small" 
            >
              Requested for void
            </TableCell>
            <TableCell 
              size="small"
              style={{whiteSpace:'nowrap'}}
            >
              {order?.orderStatus ? format(new Date(order?.orderStatus?.[voidCheck]?.time),'MMM dd, yyyy') : '-' }<br />
              {order?.orderStatus ? format(new Date(order?.orderStatus?.[voidCheck]?.time),'hh:mm a') : '' }
            </TableCell>
            <TableCell 
              size="small"
              style={{whiteSpace:'nowrap'}}
            >
              {order?.orderStatus ? formatDistanceToNow(new Date(order?.orderStatus?.[voidCheck]?.time)) : '-' }
            </TableCell>
            <TableCell size="small">{order?.orderStatus?.[voidCheck]?.email ? order?.orderStatus?.[voidCheck]?.email : 'n/a'}</TableCell>
          </TableRow>
        )
      }
    }
    
    const cancelled = () => {
      const cancelledCheck = order.orderStatus.findIndex(item =>  item.status === 'Cancelled');
      if(cancelledCheck === -1) {
        return(
          <TableRow>
            <TableCell 
              className={classes.fw500}
              size="small" 
            >
              Cancelled
            </TableCell>
            <TableCell size="small">-</TableCell>
            <TableCell size="small">-</TableCell>
            <TableCell size="small">n/a</TableCell>
          </TableRow>
        )
      }
      else
      {
        return(
          <TableRow style={{backgroundColor:red[200]}}>
            <TableCell 
              className={classes.fw500}
              size="small" 
            >
              Cancelled
            </TableCell>
            <TableCell 
              size="small"
              style={{whiteSpace:'nowrap'}}
            >
              {order?.orderStatus ? format(new Date(order?.orderStatus?.[cancelledCheck]?.time),'MMM dd, yyyy') : '-' }<br />
              {order?.orderStatus ? format(new Date(order?.orderStatus?.[cancelledCheck]?.time),'hh:mm a') : '' }
            </TableCell>
            <TableCell 
              size="small"
              style={{whiteSpace:'nowrap'}}
            >
              {order?.orderStatus ? formatDistanceToNow(new Date(order?.orderStatus?.[cancelledCheck]?.time)) : '-' }
            </TableCell>
            <TableCell size="small">{order?.orderStatus?.[cancelledCheck]?.email ? order?.orderStatus?.[cancelledCheck]?.email : 'n/a'}</TableCell>
          </TableRow>
        )
      }
    }

    const ridersApp = () => {
      if(order) {
        return(
          <TableRow>
            <TableCell 
              className={classes.fw500}
              size="small" 
            >
              Riders App
            </TableCell>
            <TableCell size="small">
              {order?.dateAssigned ? format(new Date(order?.dateAssigned),'MMM dd, yyyy') : '-' }<br />
              {order?.dateAssigned ? format(new Date(order?.dateAssigned),'hh:mm a') : '' }
            </TableCell>
            <TableCell size="small">{order?.dateAssigned ? formatDistanceToNow(new Date(order?.dateAssigned)) : '-' }</TableCell>
            <TableCell size="small">{order?.assignedDriver ? order?.assignedDriver : 'n/a'}</TableCell>
          </TableRow>
        )
      }
    }

    return(
      <>
        <div className={classes.details}>
          <Typography variant="h6">
            Order Status
          </Typography>
        </div>
        <div className={classes.miniTable}>
          <Table style={{maxWidth:'900px'}}>
            <TableHead>
              <TableRow>
                <TableCell size="small">Status</TableCell>
                <TableCell size="small">Date</TableCell>
                <TableCell size="small">Update</TableCell>
                <TableCell size="small">Trigger</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {updated()}
              {created()}
              {confirmed()}
              {deployed()}
              {pickedup()}
              {acknowledged()}
              {prepared()}
              {received()}
              {completed()}
              {paid()}
              {requestedForVoid()}
              {cancelled()}
              {ridersApp()}
            </TableBody>
          </Table>
        </div>
      </>
    )
  }

  const orderInfo = (order) => (
    <div
      className={classes.orderInfo}
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
      role="presentation"
    >
      <div>
        <div className={classes.toolbar}>
          <Typography variant="h4">Order Information</Typography>
          <IconButton 
            aria-label="close" 
            className={classes.closeButton}
            onClick={handleDrawerClose}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <Divider />
        {!fetchingOrder ?
          order._id ?
            <>
              <CardHeader
                avatar={
                  <Avatar
                    alt={`${order.fistName} ${order.lastName}`}
                    className={clsx(classes.avatar,classes.blue,classes.large)}
                    src={order?.customer?._id?.photos?.[0]?.small}
                    variant="rounded"
                  >
                    {getInitials(`${order?.customer?.firstName} ${order?.customer?.lastName}`)}
                  </Avatar>
                }
                subheader={order?.customer?.mobileNumbers?.[0]}
                title={`${order?.customer?.firstName} ${order?.customer?.lastName}`}
                titleTypographyProps={{variant:'h5'}}
              />
              <CardContent>
                <Typography
                  variant="h5"
                >
                  Order No.: {order?._id?.toString()}
                </Typography>
                <Grid
                  container
                  spacing={6}
                  wrap="wrap"
                >
                  
                  <Grid
                    item
                    md={6}
                    sm={12}
                    style={{paddingBottom:'10px'}}
                    xs={12}
                  >
                    <Typography
                      gutterBottom
                      variant="h6"
                    >
                      Payment Status: {
                        order.status==='for_confirmation' ?
                          <Chip
                            className={classes.warning} 
                            color="secondary"
                            label="For Confirmation"
                            size="small"
                          /> :
                          order.status==='payment_pending' ?
                            <Chip 
                              className={classes.success} 
                              color="secondary"
                              label="Pending"
                              size="small"
                            /> :
                            order.status==='paid' ?
                              <Chip 
                                color="primary"
                                label="Paid"
                                size="small"
                              /> :
                              order.status==='cancelled' ?
                                <Chip
                                  className={classes.danger} 
                                  color="secondary"
                                  label="Cancelled"
                                  size="small"
                                /> :
                                order.status==='void' ?
                                  <Chip
                                    color="secondary"
                                    label="Void"
                                    size="small"
                                  /> :
                                  <Chip 
                                    color="secondary"
                                    label="N/A"
                                    size="small"
                                  />
                      }
                    </Typography>
                    <TextField
                      fullWidth
                      label=""
                      margin="dense"
                      name="paymentStatus"
                      onChange={handleChangePaymentStatus}
                      select
                      SelectProps={{ native: true }}
                      size="small"
                      value={order.status ? order.status : ''}
                      variant="outlined"
                    >
                      <option value="">Select</option>
                      <option 
                        disabled
                        value="payment_pending" 
                      >
                        Pending
                      </option>
                      <option value="paid">Paid</option>
                      <option value="cancelled">Cancel</option>
                      <option value="void">Void</option>
                    </TextField>
                  </Grid>
                  <Grid
                    item
                    md={6}
                    sm={12}
                    style={{paddingBottom:'10px'}}
                    xs={12}
                  >
                    <Typography
                      gutterBottom
                      variant="h6"
                    >
                      Order Status: {deliveryStatusBadge(order.orderStatus)}
                    </Typography>
                    <TextField
                      fullWidth
                      label=""
                      margin="dense"
                      name="orderStatus"
                      onChange={handleChangePaymentStatus}
                      select
                      SelectProps={{ native: true }}
                      size="small"
                      value={order?.orderStatus?.length > 0 ? order?.orderStatus?.[order?.orderStatus?.length-1]?.status : ''}
                      variant="outlined"
                    >
                      <option value="">Select</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Deployed">Deployed</option>
                      <option value="Picked up">Picked Up</option>
                      <option value="Order Completed">Order Completed</option>
                    </TextField>
                  </Grid>
                  <Grid
                    item
                    sm={12}
                    style={{paddingTop:'10px'}}
                  >
                    <>
                      <Chip
                        className={classes.diningOption}
                        color="primary"
                        icon={<ShoppingCartIcon />}
                        label={capitalize(order?.products[order?.products?.length - 1].diningOption)}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        className={classes.paymentMethod}
                        color="primary"
                        icon={<AccountBalanceWalletIcon />}
                        label={
                          order?.selectedPaymentOption === 'gcash' && order?.paymongoDetail && order?.paymongoDetail?.commissionPercentage
                            ?
                            <>
                              Paymongo G-Cash
                            </>
                            :
                            <>
                              {capitalize(order?.selectedPaymentOption)}
                            </>
                        }
                        size="small"
                        variant="outlined"
                      />
                    </>
                  </Grid>
                  <Grid 
                    item
                    sm={12}
                    style={{paddingTop:'10px'}}
                  >
                    <>
                      <div className={classes.miniTable}>
                        <Table style={{maxWidth:'900px'}}>
                          <TableHead>
                            <TableRow>
                              <TableCell size="small">&nbsp;</TableCell>
                              <TableCell size="small">Item</TableCell>
                              <TableCell size="small">Qty</TableCell>
                              <TableCell size="small">Price</TableCell>
                              <TableCell size="small">Total</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {orderProducts(order?.products)}
                            {addedProducts(order?.addedProducts,order?.products?.length)}
                          </TableBody>
                        </Table>
                      </div>
                    </>
                  </Grid>
                  <Grid
                    item
                    sm={12}
                    style={{paddingTop:'10px'}}
                  >
                    {paymentInfo(order)}
                    {deliveryInfo(order)}
                    {customerInfo(order)}
                  </Grid>
                  <Grid
                    item
                    sm={12}
                    style={{paddingTop:0}}
                  >
                    {orderStatus(order)}
                  </Grid>
                </Grid>
              </CardContent>
            </>
            :
            <>
              <CardContent>
                <Typography
                  className={clsx(classes.center)}
                  variant="h5"
                >
                  {fetchingOrderText}
                </Typography>
              </CardContent>
            </>
          :
          <div 
            className={classes.loading} 
          >
            <CircularProgress />
          </div>
        }
      </div>
    </div>
  );

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
                  <TableCell>Order ID</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell>&nbsp;</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Placed</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders && orders.length > 0 ?
                  orders.map(order => (
                    <TableRow
                      className={classes.row}
                      data-id={order?._id}
                      hover
                      key={order?._id}
                      onClick={handleClickOpen}
                    >
                      <TableCell>...{order.orderId}</TableCell>
                      <TableCell>
                        {
                          order?.selectedPaymentOption === 'gcash'
                            ?
                              order?.paymongoDetail && order?.paymongoDetail?.commissionPercentage
                                ?
                                <>
                                  Paymongo G-Cash
                                </>
                                :
                                <>
                                  G-Cash
                                </>
                            :
                            <>
                              {capitalize(order?.selectedPaymentOption)}
                            </>
                        }
                      </TableCell>
                      <TableCell>
                        <Avatar
                          alt={`${order.fistName} ${order.lastName}`}
                          className={clsx(classes.avatar,classes.blue)}
                          src={order?.customer?._id?.photos?.[0]?.thumb}
                          variant="rounded"
                        >
                          {getInitials(`${order?.customer?.firstName} ${order?.customer?.lastName}`)}
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        {`${order.customer.firstName} ${order.customer.lastName}`}
                      </TableCell>
                      <TableCell>
                        {format(new Date(order.createdAt),'EEE MMM dd, yyyy hh:mm a')}
                      </TableCell>
                      <TableCell>&#8369;{numberWithCommas(order.grandTotal)}</TableCell>
                      <TableCell>
                        <div className={classes.statusContainer}>
                          <StatusBullet
                            className={classes.status}
                            color={statusColors[order.status]}
                            size="sm"
                          />
                          {order.status === 'payment_pending' ?
                            'pending'
                            :
                            order.status
                          }
                        </div>
                      </TableCell>
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
          <SwipeableDrawer
            anchor="right"
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
            open={openDrawer}
          >
            {orderInfo(order)}
          </SwipeableDrawer>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={orderCount}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </CardActions>
    </Card>
  );
};

OrdersTable.propTypes = {
  className: PropTypes.string,
  loadingText: PropTypes.string,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  orderCount: PropTypes.number,
  orders: PropTypes.array,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};

export default OrdersTable;