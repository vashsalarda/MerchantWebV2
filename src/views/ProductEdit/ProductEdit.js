import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Grid, LinearProgress } from '@material-ui/core';
import { useParams } from 'react-router-dom';

import { ProductSidebar, ProductDetails } from './components';
import { UserContext } from '../../Store';
import api from '../../config/api';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const ProductEdit = (props) => {
  const { _id: productId } = useParams()
  const { history } = props
  const [ user ] = useContext(UserContext)
  const [ product, setProduct ] = useState({});
  const [ productTypes, setProductTypes ] = useState({});
  const classes = useStyles();
  
  const token = user?.token

  useEffect(() => {
    if(token) {
      api(token).get(`provider/products/${productId}`)
        .then(resp => {
          if(resp) {
            const productData = resp?.data?.product
            setProduct(productData)
          }
        })
        .catch(err => {
          console.error(err);
        });
      api().get('/provider/product-types')
        .then(resp => {
          if (resp) {
            const productTypesObj = resp?.data
            setProductTypes(productTypesObj)
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  },[productId,token]);

  const handleProductUpdate = (data) => {
    const updated = {
      ...product,
      name: data.name,
      price: data.price,
      comparePrice: data.comparePrice,
      barcode: data.barcode,
      itemCode: data.itemCode,
      description: data.description,
      categories: data.categories,
      productCategories: data.productCategories
    };
    setProduct(updated)
  };

  return (
    <div className={classes.root}>
      { product && product._id ?
        <Grid
          container
          spacing={4}
        >
          <Grid
            item
            lg={8}
            md={6}
            xl={8}
            xs={12}
          >
            <ProductDetails 
              history={history}
              product={product} 
              productTypes={productTypes}
              updateProduct={handleProductUpdate}
            />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={4}
            xs={12}
          >
            <ProductSidebar product={product} />
          </Grid>
        </Grid>
        :
        <LinearProgress />
      }
    </div>
  );
};

ProductEdit.propTypes = {
  history: PropTypes.object
};

export default ProductEdit;
