import React, { useState, useEffect, memo, useContext } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import {
  Collapse,
  Grid,
  Button,
  IconButton,
  TextField,
  Link,
  Typography
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';

import { UserContext } from '../../Store'
import api from '../../config/api';
import { setSession, getSession } from '../../config/session';

import logo from 'assets/img/sb-logo.png';

const schema = {
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true,
    length: {
      maximum: 64
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128
    }
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  grid: {
    height: '100%'
  },
  leftContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  leftContent: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.light,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  leftInner: {
    textAlign: 'center',
    flexBasis: '250px'
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.white
  },
  bio: {
    color: theme.palette.white
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  socialButtons: {
    marginTop: theme.spacing(3)
  },
  socialIcon: {
    marginRight: theme.spacing(1)
  },
  sugestion: {
    marginTop: theme.spacing(2)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  signInButton: {
    margin: theme.spacing(2, 0)
  }
}));

const SignIn = memo(({history}) => {
  const classes = useStyles();
  const [user, setUser] = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const userData = JSON.parse(getSession('userData'));
    let defaultPage = JSON.parse(getSession('defaultPage'));
    const token = userData?.token;
    if(userData && userData.loggedIn) {
      if(user && user.loggedIn) {
        history.push('/dashboard');
      } else {
        setUser(userData);
        console.log('✅ "user" state restored');
        if(defaultPage) {
          setUser(user => ({
            ...user,
            defaultPage
          }));
          console.log('✅ "user.defaultPage" state restored');
          api(token).get('/provider/places')
            .then(async response => {
              if(response && response.data) {
                const { places } = response.data;
                let place = {}
                if(places && places instanceof Array && places.length > 0 ) {
                  if(defaultPage) {
                    place = places.find(item => item._id.toString() === defaultPage)
                    const isGrocery = place?.pageType === '5cd141d10d437be772373ddb' ? true : false
                    const useCreatedProductCategory = place?.useCreatedProductCategory || false
                    setUser(user => ({
                      ...user,
                      place,
                      places,
                      isGrocery,
                      useCreatedProductCategory
                    }));
                    console.log('✅ "user.place" state restored');
                    let productCategoriesUrl = '/product-categories/all'
                    if(isGrocery || useCreatedProductCategory) {
                      productCategoriesUrl = `/places/${defaultPage}/product-categories/all?status=active`
                    }
                    const productCategories = await api(token).get(productCategoriesUrl)
                    setUser(user => ({
                      ...user,
                      productCategories: productCategories?.data
                    }))
                    const pageTypes = await api().get('/provider/page-types')
                    setUser(user => ({
                      ...user,
                      pageTypes: pageTypes?.data
                    }))
                    const destinations = await api().get('/provider/supported-cities')
                    setUser(user => ({
                      ...user,
                      destinations: destinations?.data
                    }))
                    const pageCategories = await api().get('/page-categories/all')
                    setUser(user => ({
                      ...user,
                      pageCategories: pageCategories?.data
                    }))
                    const amenities = await api().get('/provider/amenities')
                    setUser(user => ({
                      ...user,
                      amenities: amenities?.data
                    }))
                  } else {
                    const defaultPlace = places.find(item => item.isDefault)
                    if(defaultPlace && defaultPlace._id) {
                      defaultPage = defaultPlace._id;
                      place = defaultPlace;
                    } else {
                      defaultPage = places[0]._id;
                      place = places[0];
                    }
                    const isGrocery = place?.pageType === '5cd141d10d437be772373ddb' ? true : false
                    const useCreatedProductCategory = place?.useCreatedProductCategory || false
                    setUser(user => ({
                      ...user,
                      place,
                      places,
                      isGrocery,
                      useCreatedProductCategory
                    }));
                    console.log('✅ "user.place" state restored');
                    let productCategoriesUrl = '/product-categories/all'
                    if(isGrocery || useCreatedProductCategory) {
                      productCategoriesUrl = `/places/${defaultPage}/product-categories/all?status=active`
                    }
                    const productCategories = await api(token).get(productCategoriesUrl)
                    setUser(user => ({
                      ...user,
                      productCategories: productCategories?.data
                    }))
                    const pageTypes = await api().get('/provider/page-types')
                    setUser(user => ({
                      ...user,
                      pageTypes: pageTypes?.data
                    }))
                    const destinations = await api().get('/provider/supported-cities')
                    setUser(user => ({
                      ...user,
                      destinations: destinations?.data
                    }))
                    const pageCategories = await api().get('/page-categories/all')
                    setUser(user => ({
                      ...user,
                      pageCategories: pageCategories?.data
                    }))
                    const amenities = await api().get('/provider/amenities')
                    setUser(user => ({
                      ...user,
                      amenities: amenities?.data
                    }))
                  }
                }
              }
            })
            .catch(error => {
              console.error({error});
            })
        }
        history.push('/');
      }
    }
  },[user, setUser, history])

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleChange = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  const handleSignIn = async(event) => {
    setOpen(false);
    event.preventDefault();
    const { email, password } = formState.values;
    const payload = {
      email,
      password
    }
    if(!email || !password) {
      setOpen(true);
      setError('Missing username or password!');
    } else {
      await api().post('/provider/login', payload)
        .then(async response => {
          if(response && response.data) {
            const userData = response.data;
            const { sessionToken: token } = userData;
            setUser({
              id: userData.objectId,
              firstName: userData.info.firstName,
              lastName: userData.info.lastName,
              loggedIn: true,
              avatar: userData.info?.photos?.[0]?.thumb ?? `https://ui-avatars.com/api/?name=${userData?.info?.firstName}+${userData?.info?.lastName}&background=0D8ABC&color=fff`,
              token
            });
            setSession('userData',JSON.stringify({
              id: userData.objectId,
              firstName: userData.info.firstName,
              lastName: userData.info.lastName,
              loggedIn: true,
              avatar: userData.info?.photos?.[0]?.thumb ?? `https://ui-avatars.com/api/?name=${userData?.info?.firstName}+${userData?.info?.lastName}&background=0D8ABC&color=fff`,
              token
            }));
            await api(token).get('/provider/places')
              .then(response => {
                if(response && response.data) {
                  const { places } = response.data;
                  let place = {};
                  let defaultPage;
                  if(places && places instanceof Array && places.length > 0 ) {
                    if(defaultPage) {
                      place = places.find(item => item._id.toString() === defaultPage);
                      const isGrocery = place?.pageType === '5cd141d10d437be772373ddb' ? true : false
                      const useCreatedProductCategory = place?.useCreatedProductCategory || false
                      setUser(user => ({
                        ...user,
                        place: place,
                        places: places,
                        defaultPage: defaultPage,
                        isGrocery,
                        useCreatedProductCategory
                      }));
                      setSession('defaultPage',JSON.stringify(defaultPage))
                      if(isGrocery || useCreatedProductCategory) {
                        getProductCategoriesV2(defaultPage, {}, token)
                      } else {
                        getProductCategories(defaultPage, {}, token)
                      }
                    } else {
                      const defaultPlace = places.find(item => item.isDefault)
                      
                      if(defaultPlace?._id) {
                        defaultPage = defaultPlace?._id
                        place = defaultPlace
                      } else {
                        defaultPage = places?.[0]?._id
                        place = places?.[0]
                      }
                      const isGrocery = place?.pageType === '5cd141d10d437be772373ddb' ? true : false
                      const useCreatedProductCategory = place?.useCreatedProductCategory || false
                      setUser(user => ({
                        ...user,
                        place: place,
                        places: places,
                        defaultPage: defaultPage,
                        isGrocery,
                        useCreatedProductCategory
                      }));
                      setSession('defaultPage',JSON.stringify(defaultPage))
                      if(isGrocery || useCreatedProductCategory) {
                        getProductCategoriesV2(defaultPage, {}, token)
                      } else {
                        getProductCategories(defaultPage, {}, token)
                      }
                    }
                  }
                }
              })
              .catch(error => {
                console.error({error});
              })
            
          }
        })
        .catch(error => {
          console.error({error});
          setOpen(true);
          setError('Invalid username or password!');
        })

      const pageTypes = await api().get('/provider/page-types')
      setUser(user => ({
        ...user,
        pageTypes: pageTypes?.data
      }))
      
      const destinations = await api().get('/provider/supported-cities')
      setUser(user => ({
        ...user,
        destinations: destinations?.data
      }))

      const pageCategories = await api().get('/page-categories/all')
      setUser(user => ({
        ...user,
        pageCategories: pageCategories?.data
      }))

      const amenities = await api().get('/provider/amenities')
      setUser(user => ({
        ...user,
        amenities: amenities?.data
      }))
    }
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  async function getProductCategories(placeId, query, token) {
    const productCategories = await api(token).get('/product-categories/all',{ params: query })
    console.log({productCategories})
    setUser(user => ({
      ...user,
      productCategories: productCategories?.data
    }))
  }

  async function getProductCategoriesV2(placeId, query, token) {
    const productCategories = await api(token).get(`/places/${placeId}/product-categories/all`,{ params: query })
    setUser(user => ({
      ...user,
      productCategories: productCategories?.data
    }))
  }

  return (
    <>
      <div className={classes.root}>
        <Grid
          className={classes.grid}
          container
        >
          <Grid
            className={classes.leftContainer}
            item
            lg={5}
          >
            <div className={classes.leftContent}>
              <div className={classes.leftInner}>
                <img 
                  alt="Streetby"
                  src={logo}
                  style={{width:'100%'}}
                />
              </div>
            </div>
          </Grid>
          <Grid
            className={classes.content}
            item
            lg={7}
            xs={12}
          >
            <div className={classes.content}>
              <div className={classes.contentBody}>
                <form
                  className={classes.form}
                  onSubmit={handleSignIn}
                >
                  <Typography
                    className={classes.title}
                    variant="h2"
                  >
                    Sign in
                  </Typography>
                  <Typography
                    align="left"
                    className={classes.sugestion}
                    color="textSecondary"
                    variant="body1"
                  >
                    Sign in to your Streetby account
                  </Typography>
                  <Collapse in={open}>
                    <Alert 
                      action={
                        <IconButton
                          aria-label="close"
                          color="inherit"
                          onClick={() => {
                            setOpen(false);
                          }}
                          severity="error"
                          size="small"
                        >
                          <CloseIcon fontSize="inherit" />
                        </IconButton>
                      }
                      severity="error"
                      variant="outlined"
                    >
                      {error}
                    </Alert>
                  </Collapse>
                  <TextField
                    className={classes.textField}
                    error={hasError('email')}
                    fullWidth
                    helperText={
                      hasError('email') ? formState.errors.email[0] : null
                    }
                    label="Email address"
                    name="email"
                    onChange={handleChange}
                    type="text"
                    value={formState.values.email || ''}
                    variant="outlined"
                  />
                  <TextField
                    className={classes.textField}
                    error={hasError('password')}
                    fullWidth
                    helperText={
                      hasError('password') ? formState.errors.password[0] : null
                    }
                    label="Password"
                    name="password"
                    onChange={handleChange}
                    type="password"
                    value={formState.values.password || ''}
                    variant="outlined"
                  />
                  <Button
                    className={classes.signInButton}
                    color="primary"
                    disabled={!formState.isValid}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign in now
                  </Button>
                  <Typography
                    color="textSecondary"
                    variant="body1"
                  >
                    Don't have an account?{' '}
                    <Link
                      component={RouterLink}
                      to="/sign-up"
                      variant="h6"
                    >
                      Sign up
                    </Link>
                  </Typography>
                </form>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </>
  );
});

SignIn.propTypes = {
  history: PropTypes.object
};

export default withRouter(SignIn);
