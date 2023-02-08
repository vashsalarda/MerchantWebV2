import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import { Fade, LinearProgress, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { OrdersToolbar, OrdersTable } from './components'
import { UserContext } from '../../Store';
import api from '../../config/api';
import { format } from 'date-fns';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  },
  pagination: {
    marginTop: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  fixedTop: {
    position: 'fixed !important',
    top: 0,
    right: 0,
    left: 0,
    zIndex: 10001
  }
}))

const OrderList = () => {
  const [user] = useContext(UserContext)
  const [orders, setOrders] = useState([])
  const [orderCount, setOrderCount] = useState(0)
  const [keyword, setKeyword] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [page, setPage] = useState(0)
  const [status, setStatus] = useState('all')
  const [paymentMethod, setPaymentMethod] = useState('all')
  const [dateStart, setDateStart] = useState(new Date())
  const [dateEnd, setDateEnd] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('Loading orders...')
  const [state, setState] = useState({
    open: false,
    color: 'primary',
    message: '',
    Transition: Fade
  })

  const classes = useStyles();
  const { token, defaultPage } = user;

  useEffect(() => {
    let didCancel = false
    const getTxns = async (token, pageId, query) => {
      if(token && pageId) {
        await api(token).get(`/provider/orders/${pageId}`, { params: query })
          .then(res => {
            if(!didCancel) {
              if(res?.data) {
                const { docs: orders, pagination } = res.data;
                setOrders(orders);
                setOrderCount(pagination.total);
                setLoading(false);
                if(!orders?.length) {
                  setLoadingText('No orders found.');
                }
              } else {
                setLoading(false)
                setLoadingText('No orders found.');
              }
            }
          })
          .catch(error => {
            if(!didCancel) {
              console.log({message:error?.message});
              setLoading(false);
              if(error?.response?.data?.message) {
                const message = error?.response?.data?.message;
                console.error({message});
                setOrders([]);
                setOrderCount(0);
                setState({
                  open: true,
                  color: 'error',
                  message: message
                });
                setLoadingText('No orders found.');
              } else if (error?.message === 'Network Error') {
                console.error('Network Error: Could not connect to server. Please try again.');
                setOrders([]);
                setOrderCount(0);
                setState({
                  open: true,
                  color: 'error',
                  message: 'Network Error: Could not connect to server. Please try again.'
                });
                setLoadingText('No orders found.');
              } else {
                console.error('Something went wrong. Please try again.');
                setOrders([]);
                setOrderCount(0);
                setState({
                  open: true,
                  color: 'error',
                  message: 'Something went wrong. Please try again.'
                })
                setLoadingText('No orders found.');
              }
            }
          });
      }
    }
    const query = {
      size: rowsPerPage,
      page: page + 1,
      dateStart: format(dateStart,'yyyy-MM-dd'), 
      dateEnd: format(dateEnd,'yyyy-MM-dd')
    };
    if(keyword && keyword !== '') {
      query.keyword = keyword;
    }
    if(status && status !== 'all') {
      query.status = status;
    }
    if(paymentMethod && paymentMethod !== 'all') {
      query.selectedPaymentMethod = paymentMethod;
    }
    getTxns(token, defaultPage, query);
    return () => {
      didCancel = true;
    };
  },[token, defaultPage, page, rowsPerPage, keyword, status, paymentMethod, dateStart, dateEnd]);

  function handleSearch(keywordStr) {
    setLoading(prevStatus => !prevStatus)
    if (typeof keywordStr === 'string') {
      setPage(0)
      setKeyword(keywordStr)
    }
  }

  function handlePageChange(page) {
    setPage(page)
    setLoading(prevStatus => !prevStatus)
  }

  function handleRowsPerPageChange(value) {
    setRowsPerPage(value)
    setPage(0)
    setLoading(prevStatus => !prevStatus)
  }
  
  function handleChangeStatus(status) {
    setStatus(status)
    setPage(0)
    setLoading(prevStatus => !prevStatus)
  }

  function handleChangePaymentMethod(status) {
    setPaymentMethod(status)
    setPage(0)
    setLoading(prevStatus => !prevStatus)
  }

  const handleCloseSnackbar = () => {
    setState({
      ...state,
      open: false,
    });
  };

  const onChangeDate = (name, value) => {
    setLoading(prevStatus => !prevStatus)
    if(name === 'dateStart') {
      setDateStart(new Date(value))
    } else if(name === 'dateEnd') {
      setDateEnd(new Date(value))
    }
  }

  return (
    <>
      {loading && 
        <LinearProgress
          className={classes.fixedTop}
        />
      }
      <div className={classes.root}>
        <OrdersToolbar
          onChangeDate={onChangeDate}
          onChangePaymentMethod={handleChangePaymentMethod}
          onChangeStatus={handleChangeStatus} 
          onSearch={handleSearch} 
        />
        <div className={classes.content}>
          <OrdersTable
            loadingText={loadingText}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            orderCount={orderCount}
            orders={orders}
            page={page}
            rowsPerPage={rowsPerPage}
          />
        </div>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          autoHideDuration={3000}
          key={state.Transition}
          onClose={(handleCloseSnackbar)}
          open={state.open}
          TransitionComponent={state.Transition}
        >
          <Alert 
            onClose={handleCloseSnackbar}
            severity={state.color}
            variant="filled"
          >
            {state.message}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

OrderList.propTypes = {
  history: PropTypes.object
};

export default OrderList;
