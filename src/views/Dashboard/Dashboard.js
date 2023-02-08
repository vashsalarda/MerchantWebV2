import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

import {
  Products,
  Transactions,
  TotalProfit,
  LatestSales,
  TopProducts,
  LatestProducts,
  LatestOrders
} from './components';
import { UserContext } from '../../Store'
import api from '../../config/api';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Dashboard = (props) => {
  const { history } = props
  const [ user ] = useContext(UserContext)
  const [ transactions, setTransactions ] = useState({
    paid: 0,
    cancelled: 0,
    void: 0,
    total: 0
  })
  const [ products, setProducts ] = useState({
    active: 0,
    inactive: 0,
    total: 0
  })
  const { token, defaultPage, loggedIn } = user

  const [ sales, setSales ] = useState([])
  const [ orders, setOrders ] = useState([])
  const [ latestProducts, setLatestProducts ] = useState([])
  const [ totalSales, setTotalSales ] = useState([])
  const [ productOrders, setProductOrders ] = useState([])
  const [ graph, setGraph ] = useState('Bar')
  const classes = useStyles()

  useEffect(() => {
    if(loggedIn) {
      let didCancel = false
      let payload = {
        page: defaultPage
      }
      const loadDashboard = async (token,payload) => {
        if(token) {
          await api(token).get('/provider/dashboard', { params: payload })
            .then(resp => {
              if(resp?.data) {
                if (!didCancel) {
                  const productsObj = resp?.data?.products
                  const txnsObj = resp?.data?.transactions
                  const salesArr = resp?.data?.sales
                  const ordersArr = resp?.data?.latest_orders
                  const latestProductsArr = resp?.data?.latest_products
                  const totalSalesArr = resp?.data?.total_sales
                  const productOrdersArr = resp?.data?.product_orders
                  setProducts(productsObj)
                  setTransactions(txnsObj)
                  setSales(salesArr)
                  setOrders(ordersArr)
                  setLatestProducts(latestProductsArr)
                  setTotalSales(totalSalesArr)
                  setProductOrders(productOrdersArr)
                }
              }
            })
            .catch(err => {
              console.error({message:err?.message})
            });
        }
      }

      loadDashboard(token,payload)
      
      return () => {
        didCancel = true;
      };
    }
  },[ loggedIn, history, token, defaultPage ]);

  const handleChangePeriod = (value) => {
    let didCancel = false
    let payload = {
      page: defaultPage,
      period: value
    }
    const loadGraph = async (token,payload) => {
      if(token) {
        await api(token).get('/provider/dashboard/graph', { params: payload })
          .then(resp => {
            if(resp?.data?.sales) {
              if (!didCancel) {
                setSales(resp?.data?.sales)
              }
            } else {
              setSales([])
            }
          })
          .catch(err => {
            console.error({message:err?.message})
          });
      }
    }
    loadGraph(token,payload)
    if (value === 'thisWeek' || value === 'last7Days' ) {
      setGraph('Line')
    } else {
      setGraph('Bar')
    }
  }

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          lg={4}
          md={4}
          sm={6}
          xs={12}
        >
          <Products data={products}/>
        </Grid>
        <Grid
          item
          lg={4}
          md={4}
          sm={6}
          xs={12}
        >
          <Transactions data={transactions}/>
        </Grid>
        <Grid
          item
          lg={4}
          md={4}
          sm={6}
          xs={12}
        >
          <TotalProfit data={totalSales}/>
        </Grid>
        <Grid
          item
          lg={6}
          md={12}
          xl={12}
          xs={12}
        >
          <LatestSales 
            data={sales}
            graph={graph}
            onChangePeriod={handleChangePeriod}
          />
        </Grid>
        <Grid
          item
          lg={6}
          md={12}
          xl={12}
          xs={12}
        >
          <TopProducts data={productOrders} />
        </Grid>
        <Grid
          item
          lg={4}
          md={6}
          xl={6}
          xs={12}
        >
          <LatestProducts data={latestProducts} />
        </Grid>
        <Grid
          item
          lg={8}
          md={6}
          xl={6}
          xs={12}
        >
          <LatestOrders data={orders} />
        </Grid>
      </Grid>
    </div>
  );
};

Dashboard.propTypes = {
  history: PropTypes.object
};

export default Dashboard;
