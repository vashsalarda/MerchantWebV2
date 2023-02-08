import React, { useContext, useEffect, useState } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import MuiAlert from '@material-ui/lab/Alert';
import {
  Grid,
  Button,
  IconButton,
  TextField,
  Link,
  FormHelperText,
  Checkbox,
  Typography,
  Snackbar
} from '@material-ui/core';

import { UserContext } from '../../Store'
import api from '../../config/api';
import { getSession } from '../../config/session';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

function Alert(props) {
  return (
    <MuiAlert 
      elevation={6} 
      variant="filled" 
      {...props}
    />
  );
}

const schema = {
  firstName: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32
    }
  },
  lastName: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32
    }
  },
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
      maximum: 128,
      minimum: 6
    }
  },
  phoneNumber: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 16
    }
  },
  policy: {
    presence: { allowEmpty: false, message: 'is required' },
    checked: true
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%',
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    }
  },
  grid: {
    height: '100%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  quote: {
    backgroundColor: theme.palette.neutral,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(/images/auth.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  quoteInner: {
    textAlign: 'center',
    flexBasis: '600px'
  },
  quoteText: {
    color: theme.palette.white,
    fontWeight: 300
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
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  logoImage: {
    marginLeft: theme.spacing(4)
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
  textField: {
    marginTop: theme.spacing(2)
  },
  policy: {
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center'
  },
  policyCheckbox: {
    marginLeft: '-14px'
  },
  signUpButton: {
    margin: theme.spacing(2, 0)
  }
}));

const SignUp = ({history}) => {
  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  const VERTICAL = 'top', HORIZONTAL = 'right';

  const [open, setOpen] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useContext(UserContext);

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
  }, [user, setUser, history])

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

  const handleBack = () => {
    history.goBack();
  };

  const handleSignUp = event => {
    event.preventDefault();
    const { firstName, lastName, email, password, phoneNumber: contactNumber } = formState.values;
    const payload = {
      firstName,
      lastName,
      email,
      contactNumber,
      password
    }
    if(firstName && lastName && email && password && contactNumber) {
      api().post('/provider/register', payload)
        .then(response => {
          if(response && response.data) {
            setOpen(true);
            setSuccess('You successfully created your Streetby account. You will be redirected to login.');
            setTimeout(() => {
              history.push('/');
            }, 1500);
          }
        })
        .catch(error => {
          console.log({error});
          setOpenError(true);
          if(error && error.response && error.response.data && error.response.data.message) {
            const message = error.response.data.message;
            if(message && typeof message === 'string') {
              setError(message);
            } else {
              setError('There is an error in signing up. Please try again.');
            }
          } else {
            setError('There is an error in signing up. Please try again.');
          }
        });
    } else {
      setError('Some field are required! Please fill the missing fields.');
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenError(false);
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <div className={classes.root}>
      <Snackbar 
        anchorOrigin={{ vertical: VERTICAL, horizontal: HORIZONTAL }}
        autoHideDuration={5000}
        onClose={handleClose}
        open={open} 
      >
        <Alert 
          onClose={handleClose} 
          severity="success"
        >
          {success}
        </Alert>
      </Snackbar>
      <Snackbar 
        anchorOrigin={{ vertical: VERTICAL, horizontal: HORIZONTAL }}
        autoHideDuration={5000}
        onClose={handleCloseError}
        open={openError} 
      >
        <Alert 
          onClose={handleCloseError} 
          severity="error"
        >
          {error}
        </Alert>
      </Snackbar>
      <Grid
        className={classes.grid}
        container
      >
        <Grid
          className={classes.quoteContainer}
          item
          lg={5}
        >
          <div className={classes.quote}>
            <div className={classes.quoteInner}>
              <Typography
                className={classes.quoteText}
                variant="h1"
              >
                Welcome to Streetby.
              </Typography>
              <div className={classes.person}>
                <Typography
                  className={classes.name}
                  variant="body1"
                >
                  By Agila Innovations Inc.
                </Typography>
              </div>
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
            <div className={classes.contentHeader}>
              <IconButton onClick={handleBack}>
                <ArrowBackIcon />
              </IconButton>
            </div>
            <div className={classes.contentBody}>
              <form
                className={classes.form}
                onSubmit={handleSignUp}
              >
                <Typography
                  className={classes.title}
                  variant="h2"
                >
                  Create new account
                </Typography>
                <Typography
                  color="textSecondary"
                  gutterBottom
                >
                  Use your email to create new account
                </Typography>
                <TextField
                  className={classes.textField}
                  error={hasError('firstName')}
                  fullWidth
                  helperText={
                    hasError('firstName') ? formState.errors.firstName[0] : null
                  }
                  label="First name"
                  name="firstName"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.firstName || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  error={hasError('lastName')}
                  fullWidth
                  helperText={
                    hasError('lastName') ? formState.errors.lastName[0] : null
                  }
                  label="Last name"
                  name="lastName"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.lastName || ''}
                  variant="outlined"
                />
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
                  error={hasError('phoneNumber')}
                  fullWidth
                  helperText={
                    hasError('phoneNumber') ? formState.errors.phoneNumber[0] : null
                  }
                  label="Phone Number"
                  name="phoneNumber"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.phoneNumber || ''}
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
                <div className={classes.policy}>
                  <Checkbox
                    checked={formState.values.policy || false}
                    className={classes.policyCheckbox}
                    color="primary"
                    name="policy"
                    onChange={handleChange}
                  />
                  <Typography
                    className={classes.policyText}
                    color="textSecondary"
                    variant="body1"
                  >
                    I have read the{' '}
                    <Link
                      color="primary"
                      component={RouterLink}
                      to="#"
                      underline="always"
                      variant="h6"
                    >
                      Terms and Conditions
                    </Link>
                  </Typography>
                </div>
                {hasError('policy') && (
                  <FormHelperText error>
                    {formState.errors.policy[0]}
                  </FormHelperText>
                )}
                <Button
                  className={classes.signUpButton}
                  color="primary"
                  disabled={!formState.isValid}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  Sign up now
                </Button>
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  Have an account?{' '}
                  <Link
                    component={RouterLink}
                    to="/sign-in"
                    variant="h6"
                  >
                    Sign in
                  </Link>
                </Typography>
              </form>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

SignUp.propTypes = {
  history: PropTypes.object
};

export default withRouter(SignUp);
