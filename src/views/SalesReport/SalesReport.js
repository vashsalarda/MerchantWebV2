import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import { Backdrop, CircularProgress, Fade, LinearProgress, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { SalesReportToolbar, SalesReportTable } from './components'
import { UserContext } from '../../Store';
import api from '../../config/api';
import { format } from 'date-fns';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
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

const SalesReport = () => {
  const [user] = useContext(UserContext)
  const [txns, setTxns] = useState([])
  const [status, setStatus] = useState('all')
  const [paymentMethod, setPaymentMethod] = useState('all')
  const [dateStart, setDateStart] = useState(new Date())
  const [dateEnd, setDateEnd] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('No transactions found.')
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    color: 'primary',
    message: '',
    Transition: Fade
  })

  const classes = useStyles()
  const { token, defaultPage, isGrocery } = user;

  // useEffect(() => {
  //   let didCancel = false
  //   const getTxns = async (token, pageId, query) => {
  //     if(token && pageId) {
  //       await api(token).get('/provider/grocery/sales', { params: query })
  //         .then(res => {
  //           console.log({res});
  //           if (!didCancel) {
  //             if(res?.data) {
  //               const txns = res.data
  //               setTxns(txns)
  //               setLoading(false)
  //               if(!txns?.length) {
  //                 setLoadingText('No transactions found.')
  //               }
  //             } else {
  //               setLoading(false)
  //               setLoadingText('No transactions found.')
  //             }
  //           }
  //         })
  //         .catch(error => {
  //           if (!didCancel) {
  //             console.log({message:error?.message});
  //             setLoading(false)
  //             if(error?.response?.data?.message) {
  //               const message = error?.response?.data?.message
  //               console.error({message})
  //               setTxns([])
  //               setSnackbar({
  //                 open: true,
  //                 color: 'error',
  //                 message: message
  //               });
  //               setLoadingText('No transactions found.')
  //             } else if (error?.message === 'Network Error') {
  //               console.error('Network Error: Could not connect to server. Please try again.')
  //               setTxns([])
  //               setSnackbar({
  //                 open: true,
  //                 color: 'error',
  //                 message: 'Network Error: Could not connect to server. Please try again.'
  //               });
  //               setLoadingText('No transactions found.')
  //             } else {
  //               console.error('Something went wrong. Please try again.')
  //               setTxns([])
  //               setSnackbar({
  //                 open: true,
  //                 color: 'error',
  //                 message: 'Something went wrong. Please try again.'
  //               })
  //               setLoadingText('No transactions found.')
  //             }
  //           }
  //         });
  //     }
  //   }
  //   const query = {
  //     showTests: true,
  //     pageId: defaultPage,
  //     dateStart: format(dateStart,'yyyy-MM-dd'), 
  //     dateEnd: format(dateEnd,'yyyy-MM-dd')
  //   }
  //   if(status && status !== 'all') {
  //     query.status = status;
  //   }
  //   if(paymentMethod && paymentMethod !== 'all') {
  //     query.selectedPaymentMethod = paymentMethod;
  //   }
  //   getTxns(token, defaultPage, query);
  //   return () => {
  //     didCancel = true;
  //   };
  // },[token, defaultPage, status, paymentMethod, dateStart, dateEnd]);
  
  const handleChangeStatus = (status) => {
    setStatus(status);
    // setLoading(prevStatus => !prevStatus);
  }

  const handleChangePaymentMethod = (status) => {
    setPaymentMethod(status);
    // setLoading(prevStatus => !prevStatus);
  }

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const onChangeDate = (name, value) => {
    // setLoading(prevStatus => !prevStatus);
    if(name === 'dateStart') {
      setDateStart(new Date(value));
    } else if(name === 'dateEnd') {
      setDateEnd(new Date(value));
    }
  }

  const handleGenerateList = () => {
    console.log('Generating list...');
    setLoading(true);
    setLoadingText('Loading transactions...');
    let url = '/provider/salesV2';
    if(isGrocery) {
      url = '/provider/grocery/sales';
    }
    console.log({url});
    let didCancel = false
    const getList = async (token, pageId, query) => {
      console.log({token, pageId});
      if(token && pageId) {
        await api(token).get(url, { params: query })
          .then(res => {
            console.log({res});
            if (!didCancel) {
              if(res?.data) {
                const txns = res.data;
                setTxns(txns);
                setLoading(false);
                if(!txns?.length) {
                  setLoadingText('No transactions found.');
                }
              } else {
                setLoading(false);
                setLoadingText('No transactions found.');
              }
            }
          })
          .catch(error => {
            if (!didCancel) {
              console.log({message:error?.message});
              setLoading(false)
              if(error?.response?.data?.message) {
                const message = error?.response?.data?.message;
                console.error({message});
                setTxns([]);
                setSnackbar({
                  open: true,
                  color: 'error',
                  message: message
                });
                setLoadingText('No transactions found.');
              } else if (error?.message === 'Network Error') {
                console.error('Network Error: Could not connect to server. Please try again.')
                setTxns([]);
                setSnackbar({
                  open: true,
                  color: 'error',
                  message: 'Network Error: Could not connect to server. Please try again.'
                });
                setLoadingText('No transactions found.');
              } else {
                console.error('Something went wrong. Please try again.');
                setTxns([]);
                setSnackbar({
                  open: true,
                  color: 'error',
                  message: 'Something went wrong. Please try again.'
                })
                setLoadingText('No transactions found.');
              }
            }
          });
      }
    }
    const query = {
      showTests: true,
      pageId: defaultPage,
      dateStart: format(dateStart,'yyyy-MM-dd'), 
      dateEnd: format(dateEnd,'yyyy-MM-dd')
    }
    if(status && status !== 'all') {
      query.status = status;
    }
    if(paymentMethod && paymentMethod !== 'all') {
      query.selectedPaymentMethod = paymentMethod;
    }
    getList(token, defaultPage, query);
    return () => {
      didCancel = true;
    };
  };

  const handleExportList = () => {
    console.log('Exporting list...');
    setOpenBackdrop(true);
    let url = '/provider/sales-list-xls';
    if(isGrocery) {
      url = '/provider/sales-list-grocery-xls';
    }
    const getList = async (token, query) => {
      if (token) {
        await api(token).get(url, { params: query })
          .then((res) => {
            if (res?.data?.status === 'success' && res?.data?.filename) {
              const fileName = res?.data?.filename;
              setOpenBackdrop(false);
              window.open(fileName);
            } else {
              setOpenBackdrop(false);
              setSnackbar({
                open: true,
                color: 'error',
                message: 'No transactions found.'
              });
            }
          })
          .catch((error) => {
            console.error({ message: error?.message });
            setLoading(false);
            if (error?.response?.data?.message) {
              const message = error?.response?.data?.message;
              console.error({ message });
              setTxns([]);
              setSnackbar({
                open: true,
                color: 'error',
                message
              });
              setLoadingText('No transactions found.');
            } else if (error?.message === 'Network Error') {
              console.error('Network Error: Could not connect to server. Please try again.');
              setTxns([]);
              setSnackbar({
                open: true,
                color: 'error',
                message: 'Network Error: Could not connect to server. Please try again.'
              });
              setLoadingText('No transactions found.');
            } else {
              console.error('Something went wrong. Please try again.');
              setTxns([]);
              setSnackbar({
                open: true,
                color: 'error',
                message: 'Something went wrong. Please try again.'
              });
              setLoadingText('No transactions found.');
            }
          });
      }
    };
    const query = {
      showTests: true,
      pageId: defaultPage,
      dateStart: format(dateStart,'yyyy-MM-dd'), 
      dateEnd: format(dateEnd,'yyyy-MM-dd')
    }
    if(status && status !== 'all') {
      query.status = status;
    }
    if(paymentMethod && paymentMethod !== 'all') {
      query.selectedPaymentMethod = paymentMethod;
    }
    getList(token, query);
  };

  return (
    <>
      {loading && 
        <LinearProgress
          className={classes.fixedTop}
        />
      }
      <div className={classes.root}>
        <SalesReportToolbar
          exportList={handleExportList}
          generateList={handleGenerateList}
          onChangeDate={onChangeDate}
          onChangePaymentMethod={handleChangePaymentMethod}
          onChangeStatus={handleChangeStatus}
        />
        <div className={classes.content}>
          <SalesReportTable
            loadingText={loadingText}
            txns={txns}
          />
        </div>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          autoHideDuration={3000}
          key={snackbar.Transition}
          onClose={(handleCloseSnackbar)}
          open={snackbar.open}
          TransitionComponent={snackbar.Transition}
        >
          <Alert 
            onClose={handleCloseSnackbar}
            severity={snackbar.color}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
        <Backdrop
          className={classes.backdrop}
          open={openBackdrop}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </>
  );
};

SalesReport.propTypes = {
  history: PropTypes.object
};

export default SalesReport;
