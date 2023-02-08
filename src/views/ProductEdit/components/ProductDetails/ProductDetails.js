import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Backdrop,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Checkbox,
  CircularProgress,
  Divider,
  Fade,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  Button,
  TextField,
  Typography,
  Snackbar,
  Switch
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';

import api from '../../../../config/api';
import { UserContext } from '../../../../Store';

import 'react-checkbox-tree/lib/react-checkbox-tree.css';

const useStyles = makeStyles((theme) => ({
  root: {},
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ProductDetails = props => {
  const { className, product, productTypes, updateProduct, ...rest } = props;
  const [ user ] = useContext(UserContext)
  const token = user?.token
  const place = user?.place
  const useCreatedProductCategory = user?.useCreatedProductCategory
  let productCategories = user?.productCategories
  if(user?.isGrocery) {
    productCategories = user?.productCategories ? user?.productCategories?.filter(item => item.isActive && item.isActive === true) : []
  }
  const classes = useStyles();
  const productId = product._id
  const [values, setValues] = useState({
    name: product.name,
    productType: product.productType._id,
    description: product.description,
    barcode: product.barcode,
    itemCode: product.itemCode,
    price: product.price,
    comparePrice: product.comparePrice,
    forSale: product.forSale ? product.forSale : false,
    isActive: product.isActive ? product.isActive : false,
    autofullfill: product.autofullfill ? product.autofullfill : false,
    options: {
      Delivery: product.options.Delivery ? product.options.Delivery : false,
      PickUp: product.options.PickUp ? product.options.PickUp : false,
      DineIn: product.options.DineIn ? product.options.DineIn : false,
    },
    containerFee: {
      amount: product.containerFee.amount,
      supportedOrderOption: {
        delivery: product.containerFee.supportedOrderOption.delivery ? product.containerFee.supportedOrderOption.delivery : false,
        pickup: product.containerFee.supportedOrderOption.pickup ? product.containerFee.supportedOrderOption.pickup : false
      }
    },
    unit: product.unit,
    limit: product.limit,
    categories: product.categories ? product.categories : [],
    productCategories: product.productCategories ? product.productCategories : []
  });

  const [selected, setSelected] = useState([])
  const [expanded, setExpanded] = useState([])
  useEffect(() => {
    let categoriesIdArray = [];
    if(place && place.useCreatedProductCategory) {
      if(product.productCategories instanceof Array && product.productCategories.length > 0) {
        product.productCategories.forEach(cat => {
          if(cat._id) {
            let catId = cat._id;
            categoriesIdArray.push(catId);
          }
        });
      }
    } else {
      if(product.categories instanceof Array && product.categories.length > 0) {
        product.categories.forEach(cat => {
          if(cat && cat._id) {
            let catId = cat._id;
            categoriesIdArray.push(catId);
          }
        });
      }
    }
    setSelected(categoriesIdArray)
  },[place,product])

  const parentCategories = productCategories?.filter(item => !item.parent);
  const childCategoriesMain = productCategories?.filter(item => item.parent);
  let childCategories = [];

  if(childCategoriesMain?.length > 0) {
    childCategoriesMain.forEach(item => {
      if(item.provider === undefined || item.provider.toString() === user?.id ) {
        childCategories.push(item);
      }
    });
  }

  let categories = [];
  if (parentCategories) {
    parentCategories.forEach(cat => {
      const id = cat._id.toString();
      const name = cat.name;
      let sublist = [];
      sublist = childCategories.filter( item => item.parent._id.toString() === id )
      let children1 = []
      if(sublist instanceof Array && sublist.length > 0) {
        let category1 = [];
        sublist.forEach(cat => {
          const id = cat._id
          const name = cat.name
          const parent = cat.parent._id
          const category = {
            id,
            name,
            parent,
            children: [],
          }
          category1.push(category)
        });
        children1 = category1
      }
      const children = children1
      const category = {
        id,
        name,
        children,
      }
      categories.push(category)
    });
  }

  const [openBackdrop, setOpenBackdrop] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    color: 'primary',
    message: '',
    Transition: Fade,
  });

  const handleChange = event => {
    const { name, value } = event.target
    if(name === 'containerFeeAmt') {
      setValues({
        ...values,
        containerFee: {
          ...values.containerFee,
          amount: value
        }
      })
    } else {
      setValues({
        ...values,
        [name]: value
      })
    }
  }

  const handleSwitch = event => {
    const {checked, name, value } = event.target
    if(name === 'containerFeeDelivery' || name === 'containerFeePickup') {
      setValues({
        ...values,
        containerFee: {
          ...values.containerFee,
          supportedOrderOption: {
            ...values.containerFee.supportedOrderOption,
            [value]: checked
          }
        }
      })
    } else {
      setValues({
        ...values,
        [name]: checked
      })
    }
  }

  const handleCheck = event => {
    const { checked, name, value } = event.target
    if(name === 'forDelivery' || name === 'forPickup' || name === 'forDinein') {
      setValues({
        ...values,
        options: {
          ...values.options,
          [value]: checked
        }
      })
    } else {
      setValues({
        ...values,
        [name]: checked
      })
    }
  }

  const handleSubmit = () => {
    setOpenBackdrop(true)
    const payload = values
    if (selected) {
      const categoriesArr = selected
      let newCategories = [];
      let parentArr = [];
      if(categoriesArr instanceof Array && categoriesArr.length > 0) {
        if(useCreatedProductCategory) {
          categoriesArr.forEach(item => {
            const category = productCategories.find(cat => cat._id === item);
            if(category) {
              const categoryObj = {
                _id: category._id,
                parent: (category.parent && category.parent._id) ? category.parent._id : null,
                name: category.name,
                slug: category.slug,
              }
              newCategories.push(categoryObj);
              if(category.parent && category.parent._id) {
                parentArr.push(category.parent._id);
              }
            }
          });
          payload.productCategories = newCategories
        } else {
          categoriesArr.forEach(item => {
            const category = productCategories.find(cat => cat._id === item);
            if(category) {
              const categoryObj = {
                _id: category._id,
                name: category.name,
                slug: category.slug,
              }
              newCategories.push(categoryObj);
            }
          });
          payload.categories = newCategories
        }
      } else {
        if(useCreatedProductCategory) {
          payload.productCategories = []
        } else {
          payload.categories = []
        }
      }
    }
    api(token)
      .patch(`/business/products/${productId}`, payload)
      .then(resp => {
        if (resp && resp.data) {
          setTimeout(() => {
            setOpenBackdrop(false)
            updateProduct(payload)
            const message = `${values.name} has been updated!`
            setSnackbar({
              open: true,
              color: 'success',
              message: message
            });
          },1500)
        }
      })
      .catch(err => {
        setOpenBackdrop(false);
        console.error(err)
        const message = 'There is error updating the product. Please try again.'
        setSnackbar({
          open: true,
          color: 'error',
          message: message
        });
      });
  }

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const handleNodeToggle = (_,value) => {
    setExpanded(value)
  }

  const handleCheckCategory = event => {
    const { checked, value } = event.target
    let childCategories = []
    if(checked) {
      let category = categories.find(item => item.id === value)
      const children = category?.children
      setSelected([...selected,value])
      if(children?.length) {
        childCategories = children.map(i => i.id)
        setSelected([...selected,value,...childCategories])
      } else {
        const childCategoriesAll = categories.map(item => item.children).reduce((flat, val) => flat.concat(val), [])
        category = childCategoriesAll.find(item => item.id === value)
        const parent = category?.parent
        if(parent) {
          setSelected([...selected,parent,value])
        } else {
          setSelected([...selected,value])
        }
      }
      setExpanded([...expanded,value])
    } else {
      const children = categories.find(item => item.id === value)?.children
      let newSelected = selected.filter(item => item !== value)
      setSelected(newSelected)
      if(children?.length) {
        childCategories = children.map(item => item.id)
        newSelected = newSelected.filter(function(item) {
          return !childCategories.includes(item); 
        })
        setSelected(newSelected)
      } else {
        const childCategoriesAll = categories.map(item => item.children).reduce((flat, val) => flat.concat(val), [])
        const category = childCategoriesAll.find(item => item.id === value)
        const parent = category?.parent
        const prevChildren = categories?.find(item => item.id === parent)?.children.map(i => i.id)
        let newChildren = prevChildren.filter(function(item) {
          return newSelected.includes(item)
        })
        if(!newChildren?.length) {
          newSelected = newSelected.filter(item => item !== parent)
        }
        setSelected(newSelected)
      }
      let newExpanded = expanded.filter(item => item !== value)
      setExpanded(newExpanded)
    }
  }

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      label={
        <FormControlLabel
          control={
            <Checkbox
              checked={selected.some((item) => item === nodes.id)}
              className={classes.checkbox}
              color="primary"
              name={nodes.name}
              onChange={handleCheckCategory}
              onClick={(e) => { e.stopPropagation() }}
              value={nodes.id}
            />
          }
          label={nodes.name}
          style={{marginLeft:'-7px'}}
        />
      }
      nodeId={nodes.id}
    >
      {Array.isArray(nodes.children) ? nodes.children.map((item) => renderTree(item)) : null}
    </TreeItem>
  );

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form
        autoComplete="off"
        noValidate
      >
        <CardHeader
          subheader="The product information can be edited"
          title="Product Information"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                helperText="Please specify the product name"
                label="Product name"
                margin="dense"
                name="name"
                onChange={handleChange}
                required
                value={values.name}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Product Type"
                margin="dense"
                name="productType"
                onChange={handleChange}
                required
                select
                SelectProps={{ native: true }}
                value={values.productType}
                variant="outlined"
              >
                {productTypes.map(option => (
                  <option
                    key={option._id}
                    value={option._id}
                  >
                    {option.name}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                defaultValue={values.description}
                fullWidth
                label="Description"
                multiline
                name="description"
                rows={4}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Barcode"
                margin="dense"
                name="barcode"
                onChange={handleChange}
                value={values.barcode}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Item Code"
                margin="dense"
                name="itemCode"
                onChange={handleChange}
                value={values.itemCode}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">&#8369;</InputAdornment>,
                }}
                label="Price"
                margin="dense"
                name="price"
                onChange={handleChange}
                type="number"
                value={values.price}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">&#8369;</InputAdornment>,
                }}
                label="Compare Price"
                margin="dense"
                name="comparePrice"
                onChange={handleChange}
                type="number"
                value={values.comparePrice ? values.comparePrice : ''}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardHeader
          title="Product Settings"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              lg={4}
              md={3}
              sm={12}
              xs={12}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={values.isActive ? values.isActive : false}
                    color="primary"
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                    name="isActive"
                    onChange={handleSwitch}
                    value="isActive"
                  />
                }
                label="Published"
              />
            </Grid>
            <Grid
              item
              lg={4}
              md={3}
              sm={12}
              xs={12}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={values.forSale ? values.forSale : false}
                    color="primary"
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                    name="forSale"
                    onChange={handleSwitch}
                    value="forSale"
                  />
                }
                label="For Sale"
              />
            </Grid>
            <Grid
              item
              lg={4}
              md={3}
              sm={12}
              xs={12}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={values.autofullfill ? values.autofullfill : false}
                    color="primary"
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                    name="autofullfill"
                    onChange={handleSwitch}
                    value="autofullfill"
                  />
                }
                label="Auto-confirm"
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              lg={6}
              md={12}
              sm={6}
              xs={12}
            >
              <FormControl 
                className={classes.formControl}
                component="fieldset" 
              >
                <Typography
                  gutterBottom
                  variant="h6"
                >
                  Pick-up Options
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={values.options.Delivery}
                        color="primary"
                        name="forDelivery"
                        onChange={handleCheck}
                        value="Delivery"
                      />
                    }
                    label="For Delivery"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={values.options.PickUp}
                        color="primary"
                        name="forPickup"
                        onChange={handleCheck}
                        value="PickUp"
                      />
                    }
                    label="For Pickup"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={values.options.DineIn}
                        color="primary"
                        name="forDinein"
                        onChange={handleCheck}
                        value="DineIn"
                      />
                    }
                    label="For Dine-in"
                  />
                </FormGroup>
              </FormControl>
            </Grid>
            <Grid
              item
              lg={6}
              md={12}
              sm={6}
              xs={12}
            >
              <Typography
                gutterBottom
                variant="h6"
              >
                Charges and Fees
              </Typography>
              <Grid
                item
                xs={12}
              >
                <TextField
                  fullWidth
                  InputProps={{
                    startAdornment: <InputAdornment position="start">&#8369;</InputAdornment>,
                  }}
                  label="Amount"
                  margin="dense"
                  name="containerFeeAmt"
                  onChange={handleChange}
                  type="number"
                  value={values.containerFee.amount ? values.containerFee.amount : ''}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                xs={12}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={values.containerFee.supportedOrderOption.delivery ? values.containerFee.supportedOrderOption.delivery : false}
                      color="primary"
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                      name="containerFeeDelivery"
                      onChange={handleSwitch}
                      value="delivery"
                    />
                  }
                  label="Applicable for Delivery"
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={values.containerFee.supportedOrderOption.pickup ? values.containerFee.supportedOrderOption.pickup : false}
                      color="primary"
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                      name="containerFeePickup"
                      onChange={handleSwitch}
                      value="pickup"
                    />
                  }
                  label="Applicable for Pickup"
                />
              </Grid>
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Product Unit"
                margin="dense"
                name="unit"
                onChange={handleChange}
                placeholder="Enter Unit (kg, lbs, L)"
                value={values.unit ? values.unit : ''}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Product Limit (per order)"
                margin="dense"
                name="limit"
                onChange={handleChange}
                placeholder="Enter product limit"
                type="number"
                value={values.limit ? values.limit : ''}
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Grid
            item
            sm={12}
            xs={12}
          >
            <Typography
              gutterBottom
              variant="h6"
            >
              Select Product Categories
            </Typography>
            <Grid
              item
              xs={12}
            >
              {categories?.length > 0 &&
                <TreeView
                  defaultCollapseIcon={<ExpandMoreIcon />}
                  defaultExpandIcon={<ChevronRightIcon />}
                  expanded={expanded}
                  onNodeToggle={handleNodeToggle}
                >
                  { categories.map((cat) => renderTree(cat)) }
                </TreeView>
              }
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Divider />
        <CardActions>
          <Button
            color="primary"
            onClick={handleSubmit}
            variant="contained"
          >
            Save details
          </Button>
          <Link
            to="/products"
          >
            <Button
              color="secondary"
              variant="contained"
            >
              Back
            </Button>
          </Link>
        </CardActions>
      </form>
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
    </Card>
  );
};

ProductDetails.propTypes = {
  className: PropTypes.string,
  history: PropTypes.object,
  product: PropTypes.object,
  productTypes: PropTypes.array,
  updateProduct: PropTypes.func
};

export default ProductDetails;
