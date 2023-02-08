import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import { Fade, LinearProgress, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { ProductsToolbar, ProductsTable } from './components';
import { UserContext } from '../../Store'
import api from '../../config/api';

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
}));

const ProductList = () => {
  const classes = useStyles();

  const [user] = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('all');
  const [category, setCategory] = useState('all');
  const [subCategory, setSubCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading products...');
  const { place } = user;
  const [state, setState] = useState({
    open: false,
    color: 'primary',
    message: '',
    Transition: Fade,
  });

  useEffect(() => {
    const { token, defaultPage, isGrocery } = user;
    const query = {
      size: rowsPerPage,
      page: page + 1
    }
    if(keyword && keyword !== '') {
      query.keyword = keyword
    }
    if(status && status !== 'all') {
      query.status = status
    }
    if(category && category !== 'all') {
      query.category = category
    }
    if(subCategory && subCategory !== 'all') {
      query.subCategory = subCategory
    }
    let didCancel = false
    const getProducts = async (token, pageId, query) => {
      if(token && pageId) {
        let productsURL = `/provider/places/${pageId}/products`
        if(isGrocery) {
          productsURL = `/provider/places/${pageId}/grocery-products`
        }
        await api(token).get(productsURL, { params: query })
          .then(res => {
            if(res?.data) {
              if (!didCancel) {
                const { products, pagination } = res.data
                setProducts(products)
                setProductCount(pagination.total)
                setLoading(false)
                if(!products?.length) {
                  setLoadingText('No products found.')
                }
              }
            } else {
              if (!didCancel) {
                setLoading(false)
                setLoadingText('No products found.')
              }
            }
          })
          .catch(error => {
            if (!didCancel) {
              console.log({message:error?.message});
              setLoading(false)
            }
            if(error?.response?.data?.message) {
              if (!didCancel) {
                const message = error?.response?.data?.message
                console.error({message})
                setProducts([])
                setProductCount(0)
                setState({
                  open: true,
                  color: 'error',
                  message: message
                });
                setLoadingText('No products found.')
              }
            } else if (error?.message === 'Network Error') {
              if (!didCancel) {
                console.error('Network Error: Could not connect to server. Please try again.')
                setProducts([])
                setProductCount(0)
                setState({
                  open: true,
                  color: 'error',
                  message: 'Network Error: Could not connect to server. Please try again.'
                });
                setLoadingText('No products found.')
              }
            } else {
              if (!didCancel) {
                console.error('Something went wrong. Please try again.')
                setProducts([])
                setProductCount(0)
                setState({
                  open: true,
                  color: 'error',
                  message: 'Something went wrong. Please try again.'
                })
                setLoadingText('No products found.')
              }
            }
          });
      }
    }
    getProducts(token, defaultPage, query)
    return () => {
      didCancel = true;
    };
  },[user, page, keyword, status, rowsPerPage, category, subCategory]);

  const handleSearch = (keywordStr) => {
    setLoading(true)
    if (typeof keywordStr === 'string') {
      setTimeout(() => {
        setPage(0)
        setKeyword(keywordStr)
      },2000)
    }
  }

  const handleChangeStatus = (status) => {
    setLoading(true)
    setStatus(status)
  }

  const handlePageChange = (page) => {
    setPage(page)
    setLoading(true)
    if(keyword && keyword !== '') {
      setKeyword(keyword)
    }
  }

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value)
    setPage(0)
    setLoading(true)
    if(keyword && keyword !== '') {
      setKeyword(keyword)
    }
  }

  const handleSelectCategory = (value) => {
    setPage(page)
    setLoading(true)
    setCategory(value)
  };

  const handleSelectCategorySub = (value) => {
    setPage(page)
    setLoading(true)
    setSubCategory(value)
  };

  function updateProducts(productId,nextStatus) {
    const newProducts = products.map((item) => {
      if (item._id === productId) {
        const updatedItem = {
          ...item,
          isActive: nextStatus,
        };
 
        return updatedItem;
      }
      return item;
    });
    setProducts(newProducts)
  }

  const handleCloseSnackbar = () => {
    setState({
      ...state,
      open: false,
    });
  };
  
  return (
    <>
      {loading && 
        <LinearProgress
          className={classes.fixedTop}
        />
      }
      <div className={classes.root}>
        <ProductsToolbar 
          onChangeStatus={handleChangeStatus}
          onSearch={handleSearch}
          onSelectCategory={handleSelectCategory}
          onSelectCategorySub={handleSelectCategorySub}
        />
        <div className={classes.content} >
          <ProductsTable
            loadingText={loadingText}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            page={page}
            pageInfo={place}
            productCount={productCount}
            products={products}
            rowsPerPage={rowsPerPage}
            updateProducts={updateProducts}
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

ProductList.propTypes = {
  history: PropTypes.object
};

export default ProductList;
