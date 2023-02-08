import React, { useContext, useEffect, useState  } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import {
  Backdrop,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Checkbox,
  CircularProgress,
  Fade,
  FormControlLabel,
  Grid,
  Divider,
  Button,
  Paper,
  Snackbar,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';

import api from '../../../../config/api';
import { UserContext } from '../../../../Store';

function TabPanel(props) {
  const { children, val, index, ...other } = props;

  return (
    <div
      aria-labelledby={`vertical-tab-${index}`}
      hidden={val !== index}
      id={`vertical-tabpanel-${index}`}
      role="tabpanel"
      {...other}
    >
      {val === index && (
        <>{children}</>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  val: PropTypes.any.isRequired,
};

function tabProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const schema = {
  name: {
    presence: { allowEmpty: false, message: 'Page Name is required' },
  },
  pageType: {
    presence: { allowEmpty: false, message: 'Industry is required' },
  },
  addressLine1: {
    presence: { allowEmpty: false, message: 'Address (Line 1) is required' },
  },
  city: {
    presence: { allowEmpty: false, message: 'City is required'},
  },
  province: {
    presence: { allowEmpty: false, message: 'City is required'},
  },
  country: {
    presence: { allowEmpty: false, message: 'City is required'},
  }
}

const useStyles = makeStyles((theme) => ({
  root: {},
  item: {
    display: 'flex',
    flexDirection: 'column'
  },
  tabs: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  tabItem: {
    padding: '24px 0'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  children: {
    float: 'left' ,
    [theme.breakpoints.down('sm')]: {
      width: '100vw'
    },
    [theme.breakpoints.up('md')]: {
      width: 300
    },
    [theme.breakpoints.up('lg')]: {
      width: 300
    }
  },
}));

const Page = props => {
  const { 
    history, amenities, className, place, pageTypes, destinations, pageCategories, ...rest 
  } = props;
  const classes = useStyles();
  const [ user ] = useContext(UserContext)
  const { token } = user
  const [value, setValue] = useState(0);
  const [selected, setSelected] = useState([])
  const [expanded, setExpanded] = useState([])
  const [selectedAmnty, setSelectedAmnty] = useState([])
  const [expandedAmnty, setExpandedAmnty] = useState([])
  const [openBackdrop, setOpenBackdrop] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    color: 'primary',
    message: '',
    Transition: Fade,
  });

  const [formState, setFormState] = useState({
    isValid: true,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    setFormState(formState => ({
      ...formState,
      values: {
        name: place?.name || '',
        pageType: place?.pageType || '',
        about: place?.about || '',
        addressLine1: place?.addressLine1 || '',
        addressLine2: place?.addressLine2 || '',
        city: place?.city || '',
        province: place?.province || '',
        country: place?.country || '',
        postalCode: place?.postalCode || '',
        paymentMethod: place?.paymentMethod || [],
        cancellationPolicy: place?.cancellationPolicy || [],
        pagecategories: place?.pagecategories || [],
        amenities: place?.amenities || [],
        useCreatedProductCategory: place?.useCreatedProductCategory || false,
        showCreatedProductSubCategory: place?.showCreatedProductSubCategory || false,
        productsViewGrid: place?.productsViewGrid || false,
        bankaccount: {
          accountName: place?.bankaccount?.accountName || '',
          accountNumber: place?.bankaccount?.accountNumber || '',
          bankName: place?.bankaccount?.bankName || ''
        },
        location: place?.location || {}
      }
    }))

    let categoriesIdArray = [];
    if(place?.pagecategories) {
      if(place?.pagecategories?.length > 0) {
        place.pagecategories.forEach(cat => {
          if(cat?._id) {
            let catId = cat?._id;
            categoriesIdArray.push(catId);
          }
        });
      }
    }
    setSelected(categoriesIdArray)
    let amenitiesArray = [];
    if(place?.amenities?.length > 0) {
      place.amenities.forEach(item => {
        let itemId = item._id;
        amenitiesArray.push(itemId);
      });
    }
    setSelectedAmnty(amenitiesArray)
  },[place]);

  useEffect(() => {
    let errors = validate(formState.values, schema, {fullMessages:true});
    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  useEffect(() => {
    const parentAmnty = amenities?.length && amenities.map(item => item._id)
    setExpandedAmnty(parentAmnty)
  },[amenities])

  const parentCategories = pageCategories?.filter(item => !item.parent);
  const childCategoriesMain = pageCategories?.filter(item => item.parent);
  let childCategories = [];

  if(childCategoriesMain?.length > 0) {
    childCategoriesMain.forEach(item => {
      childCategories.push(item);
    });
  }

  let categories = [];
  if (parentCategories) {
    parentCategories.forEach(cat => {
      const id = cat._id.toString();
      const name = cat.name;
      let sublist = [];
      sublist = childCategories.filter( item => item?.parent?.toString() === id )
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

  let amenitiesArr = []
  if (amenities) {
    amenities.forEach(item => {
      const id = item._id;
      const name = item.type[0].name;
      const sublist = item.features;
      let children1 = [];
      if (sublist instanceof Array && sublist.length > 0) {
        let feature1 = [];
        sublist.forEach(subItem => {
          const id = subItem._id;
          const name = subItem.name;
          const feature = {
            id,
            name
          };
          feature1.push(feature);
        });
        children1 = feature1;
      }
      const children = children1;
      const amenity = {
        id,
        name,
        children: children
      };
      amenitiesArr.push(amenity);
    });
    amenitiesArr.sort(function (a, b) {
      if (a.name === b.name) {
        return 0;
      } else {
        return a.name < b.name ? -1 : 1;
      }
    });
  }

  const renderPageInformation = () => {
    return(
      <Grid
        container
        spacing={3}
      >
        <Grid
          item
          lg={4}
          md={6}
          xs={12}
        >
          <TextField
            error={hasError('name')}
            fullWidth
            helperText={
              hasError('name') ? formState.errors.name : 'Please specify the name'
            }
            label="Name"
            margin="dense"
            name="name"
            onChange={handleChange}
            required
            value={formState.values.name || ''}
            variant="outlined"
          />
        </Grid>
        <Grid
          item
          lg={4}
          md={6}
          xs={12}
        >
          <TextField
            error={hasError('pageType')}
            fullWidth
            helperText={
              hasError('pageType') ? formState.errors.pageType : 'Please specify the Industry'
            }
            margin="dense"
            name="pageType"
            onChange={handleChange}
            required
            select
            SelectProps={{ native: true }}
            value={formState.values.pageType || ''}
            variant="outlined"
          >
            <option value="">Select</option>
            {pageTypes?.length && pageTypes?.map(option => (
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
          lg={8}
          md={12}
          xs={12}
        >
          <TextField
            fullWidth
            helperText="Add a  about the page"
            label="About"
            margin="dense"
            multiline
            name="about"
            onChange={handleChange}
            rows={4}
            value={formState.values.about || ''}
            variant="outlined"
          />
        </Grid>
      </Grid>
    )
  }

  const renderAddress = () => {
    return(
      <Grid
        container
        spacing={3}
      >
        <Grid
          item
          lg={4}
          md={6}
          xs={12}
        >
          <TextField
            error={hasError('addressLine1')}
            fullWidth
            helperText={
              hasError('addressLine1') ? formState.errors.addressLine1 : 'Please specify the Address (Line 1) specify the Industry'
            }
            label="Address (Line 1)"
            margin="dense"
            name="addressLine1"
            onChange={handleChange}
            required
            value={formState.values.addressLine1 || ''}
            variant="outlined"
          />
        </Grid>
        <Grid
          item
          lg={4}
          md={6}
          xs={12}
        >
          <TextField
            fullWidth
            helperText="Please specify the Address (Line 2)"
            label="Address (Line 2)"
            margin="dense"
            name="addressLine2"
            onChange={handleChange}
            value={formState.values.addressLine2 || ''}
            variant="outlined"
          />
        </Grid>
        <Grid
          item
          lg={4}
          md={6}
          xs={12}
        >
          <TextField
            error={hasError('city')}
            fullWidth
            helperText={
              hasError('city') ? formState.errors.city : 'Please specify the City/Town'
            }
            margin="dense"
            name="city"
            onChange={handleChange}
            required
            select
            SelectProps={{ native: true }}
            value={formState.values.city || ''}
            variant="outlined"
          >
            <option value="select">Select</option>
            {destinations?.length && destinations?.map(option => (
              <option
                key={option._id}
                value={option.name}
              >
                {option.name}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid
          item
          lg={4}
          md={6}
          xs={12}
        >
          <TextField
            error={hasError('province')}
            fullWidth
            helperText={
              hasError('province') ? formState.errors.province : 'Please specify the Province'
            }
            label="Province"
            margin="dense"
            name="province"
            onChange={handleChange}
            required
            value={formState.values.province || ''}
            variant="outlined"
          />
        </Grid>
        <Grid
          item
          lg={4}
          md={6}
          xs={12}
        >
          <TextField
            error={hasError('country')}
            fullWidth
            helperText={
              hasError('country') ? formState.errors.country : 'Please specify the Country'
            }
            label="Country"
            margin="dense"
            name="country"
            onChange={handleChange}
            required
            value={formState.values.country || ''}
            variant="outlined"
          />
        </Grid>
        <Grid
          item
          lg={4}
          md={6}
          xs={12}
        >
          <TextField
            error={hasError('postalCode')}
            fullWidth
            helperText={
              hasError('postalCode') ? formState.errors.postalCode : 'Please specify the Postal Code'
            }
            label="Postal Code"
            margin="dense"
            name="postalCode"
            onChange={handleChange}
            required
            value={formState.values.postalCode || ''}
            variant="outlined"
          />
        </Grid>
      </Grid>
    )
  }

  const renderPageCategories = () => {
    return(
      <Grid
        container
        spacing={3}
      >
        <Grid
          item
          lg={4}
          md={6}
          xs={12}
        >
          
          <Typography variant="h6">
            Select Page Categories
          </Typography>
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
    )
  }

  const renderAmenities = () => {
    return(
      <Grid
        container
        spacing={3}
      >
        <Grid
          item
          xs={12}
        >
          <Typography variant="h6">
            Amenities
          </Typography>
          {amenitiesArr && amenitiesArr.length > 0 &&
            <TreeView
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
              expanded={expandedAmnty}
              onNodeToggle={handleNodeToggleAmnty}
            >
              { amenitiesArr.map((item) => renderTreeAmnty(item) ) }
            </TreeView>
          }
        </Grid>
      </Grid>
    )
  }

  const renderBankInformation = () => {
    return(
      <Grid
        container
        spacing={3}
      >
        <Grid
          item
          lg={4}
          md={6}
          xs={12}
        >
          <TextField
            fullWidth
            helperText="Please specify Bank Name"
            label="Bank Name"
            margin="dense"
            name="bankName"
            onChange={handleChange}
            value={formState?.values?.bankaccount?.bankName || ''}
            variant="outlined"
          />
        </Grid>
        <Grid
          item
          lg={4}
          md={6}
          xs={12}
        >
          <TextField
            fullWidth
            helperText="Please specify the Account Name"
            label="Account Name"
            margin="dense"
            name="accountName"
            onChange={handleChange}
            value={formState?.values?.bankaccount?.accountName || ''}
            variant="outlined"
          />
        </Grid>
        <Grid
          item
          lg={4}
          md={6}
          xs={12}
        >
          <TextField
            fullWidth
            helperText="Please specify the Account No."
            label="Account No."
            margin="dense"
            name="accountNumber"
            onChange={handleChange}
            value={formState?.values?.bankaccount?.accountNumber || ''}
            variant="outlined"
          />
        </Grid>
      </Grid>
    )
  }

  const renderOtherSettings = () => {
    return(
      <Grid
        container
        spacing={3}
      >
        <Grid
          item
          xs={12}
        >
          <Typography
            gutterBottom
            variant="h6"
          >
            Other Settings
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={formState.values.useCreatedProductCategory}
                color="primary"
                inputProps={{ 'aria-label': 'primary checkbox' }}
                name="useCreatedProductCategory"
                onChange={handleSwitch}
                value="useCreatedProductCategory"
              />
            }
            label="Use Product Categories"
          />
          <FormControlLabel
            control={
              <Switch
                checked={formState.values.showCreatedProductSubCategory}
                color="primary"
                inputProps={{ 'aria-label': 'primary checkbox' }}
                name="showCreatedProductSubCategory"
                onChange={handleSwitch}
                value="showCreatedProductSubCategory"
              />
            }
            label="Show Product Sub-Categories"
          />
          <FormControlLabel
            control={
              <Switch
                checked={formState.values.productsViewGrid}
                color="primary"
                inputProps={{ 'aria-label': 'primary checkbox' }}
                name="productsViewGrid"
                onChange={handleSwitch}
                value="productsViewGrid"
              />
            }
            label="Product Grid View"
          />
        </Grid>
      </Grid>
    )
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

  const renderTreeAmnty = (nodes) => (
    <TreeItem
      className={!nodes.children ? classes.children : ''}
      key={nodes.id}
      label={nodes.children ?
        nodes.name 
        :
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedAmnty.some((item) => item === nodes.id)}
              className={classes.checkbox}
              color="primary"
              name={nodes.name}
              onChange={handleCheckAmnty}
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
      {Array.isArray(nodes.children) ? nodes.children.map((item) => renderTreeAmnty(item)) : null}
    </TreeItem>
    
  );

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  }

  const handleChange = event => {
    event.persist();
    const { name, value } = event.target
    if(name === 'bankName' || name === 'accountName'  || name === 'accountNumber' ) {
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values,
          bankaccount: {
            ...formState.values.bankaccount,
            [name]: value
          }
        },
        touched: {
          ...formState.touched,
          [name]: value
        }
      }));
    } else {
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values,
          [event.target.name]: event.target.value
        },
        touched: {
          ...formState.touched,
          [event.target.name]: true
        }
      }));
    }
  }

  const handleNodeToggle = (_,value) => {
    setExpanded(value)
  }

  const handleNodeToggleAmnty = (_,value) => {
    setExpandedAmnty(value)
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
        childCategories = children?.map(item => item.id)
        newSelected = newSelected?.filter(function(item) {
          return !childCategories.includes(item); 
        })
        setSelected(newSelected)
      } else {
        const childCategoriesAll = categories.map(item => item.children).reduce((flat, val) => flat.concat(val), [])
        const category = childCategoriesAll.find(item => item.id === value)
        const parent = category?.parent
        const prevChildren = categories?.find(item => item.id === parent)?.children.map(i => i.id)
        let newChildren = prevChildren?.filter(function(item) {
          return newSelected.includes(item)
        })
        if(!newChildren?.length) {
          newSelected = newSelected?.filter(item => item !== parent)
        }
        setSelected(newSelected)
      }
      let newExpanded = expanded.filter(item => item !== value)
      setExpanded(newExpanded)
    }
  }

  const handleCheckAmnty = event => {
    const { checked, value } = event.target
    if(checked) {
      setSelectedAmnty([...selectedAmnty,value])
    } else {
      let newSelected = selectedAmnty.filter(item => item !== value)
      setSelectedAmnty(newSelected)
    }
  }

  const handleSwitch = event => {
    const { checked, name, value } = event.target
    if(name === 'containerFeeDelivery') {
      setFormState(formState => ({
        ...formState,
        values: {
          containerFee: {
            ...formState.values.containerFee,
            supportedOrderOption: {
              ...formState.values.containerFee.supportedOrderOption,
              [value]: checked
            }
          }
        }
      }))
    } else {
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values,
          [name]: checked
        },
        touched: {
          ...formState.touched,
          [name]: true
        }
      }));
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const handleSubmit = (e) =>{
    e.preventDefault();
    const payload = formState.values
    const placeId = place?._id
    if(!user) {
      this.showNotificationError('You are not logged in. Please login to continue.');
      setTimeout(() => { 
        history.push('/login');
        window.location.reload();
      },2000);
    }

    if (payload?.name && payload?.pageType && payload?.addressLine1 && payload?.city) {

      if (!window.confirm('Do you want to save the changes made to this page?')) {
        return false;
      }

      setOpenBackdrop(true)
      
      if (payload) {
        if (selected) {
          const categoriesArr = selected
          categoriesArr.forEach(item => {
            const category = pageCategories.find(cat => cat._id === item);
            const categoryObj = {
              _id: category._id,
              name: category.name,
              slug: category.slug
            };
            payload.pagecategories.push(categoryObj);
          });
        } else {
          payload.pagecategories = [];
        }

        let allFeatures = [];
        amenities.forEach(item => {
          const features = item.features;
          allFeatures = allFeatures.concat(features);
        });

        if (selectedAmnty?.length) {
          const amenitiesArr = new Set(selectedAmnty);
          let amenities = []
          amenitiesArr.forEach(item => {
            const amenity = allFeatures.find(amty => amty._id === item);
            const amenityObj = {
              _id: amenity._id,
              name: amenity.name,
              description: amenity.description,
              icon: amenity.icon,
              isTop: false
            };
            amenities.push(amenityObj);
          });
          payload.amenities = amenities;
        } else {
          payload.amenities = [];
        }
         
        api(token)
          .patch(`/provider/places/${placeId}`, payload)
          .then(resp => {
            if (resp && resp.data) {
              setTimeout(() => {
                setOpenBackdrop(false)
                const message = `${formState.values.name} has been updated!`
                setSnackbar({
                  open: true,
                  color: 'success',
                  message
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
              message
            });
          });
      } else {
        setOpenBackdrop(false);
        const message = 'Page information is missing.'
        setSnackbar({
          open: true,
          color: 'error',
          message
        });
      }
    } else {
      const message = 'Some fields are required. Please fill the required fields.'
      setSnackbar({
        open: true,
        color: 'error',
        message
      });
    }
  }

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form>
        <CardHeader
          subheader="Manage the page settings"
          title="Page Settings"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={6}
            wrap="wrap"
          >
            <Grid
              className={classes.item}
              item
              xs={12}
            >
              <div className={classes.tabs}>
                <Paper square>
                  <Tabs
                    aria-label="Vertical tabs example"
                    indicatorColor="primary"
                    onChange={handleChangeTab}
                    textColor="primary"
                    value={value}
                    variant="scrollable"
                  >
                    <Tab 
                      label="Page Information"
                      {...tabProps(0)}
                    />
                    <Tab 
                      label="Address"
                      {...tabProps(1)}
                    />
                    <Tab 
                      label="Categories &amp; Amenities"
                      {...tabProps(2)}
                    />
                    <Tab 
                      label="Other Settings"
                      {...tabProps(3)}
                    />
                    <Tab 
                      label="Bank Details"
                      {...tabProps(3)}
                    />
                  </Tabs>
                </Paper>
                <TabPanel
                  className={classes.tabItem}
                  index={0}
                  val={value}
                >
                  {renderPageInformation()}
                </TabPanel>
                <TabPanel
                  className={classes.tabItem}
                  index={1}
                  val={value}
                >
                  {renderAddress()}
                </TabPanel>
                <TabPanel
                  className={classes.tabItem}
                  index={2}
                  val={value}
                >
                  {renderPageCategories()}
                  {renderAmenities()}
                </TabPanel>
                <TabPanel
                  className={classes.tabItem}
                  index={3}
                  val={value}
                >
                  {renderOtherSettings()}
                </TabPanel>
                <TabPanel
                  className={classes.tabItem}
                  index={4}
                  val={value}
                >
                  {renderBankInformation()}
                </TabPanel>
              </div>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            color="primary"
            disabled={!formState.isValid}
            onClick={handleSubmit}
            variant="contained"
          >
            Save
          </Button>
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

Page.propTypes = {
  amenities: PropTypes.array,
  className: PropTypes.string,
  destinations: PropTypes.array,
  history: PropTypes.object,
  pageCategories: PropTypes.array,
  pageTypes: PropTypes.array,
  place: PropTypes.object
};

export default Page;
