import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Backdrop,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CircularProgress,
  Collapse,
  Divider,
  Fade,
  Grid,
  IconButton,
  Button,
  Snackbar,
  TextField,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { Close as CloseIcon } from '@material-ui/icons';
import api from '../../../../config/api';
import { UserContext } from '../../../../Store';
import { isMobilePhone } from 'validator';

const schema = {
  firstName: {
    presence: { allowEmpty: false, message: 'First Name is required' },
    length: {
      maximum: 512,
      minimum: 2
    }
  },
  lastName: {
    presence: { allowEmpty: false, message: 'Last Name is required' },
    length: {
      maximum: 512,
      minimum: 2
    }
  },
  email: {
    email: true,
    presence: { allowEmpty: false, message: 'Email is required' },
    length: {
      maximum: 512,
      minimum: 2
    }
  },
  phoneNumber: {
    presence: { allowEmpty: false, message: 'Phone Number is required' },
    length: {
      maximum: 512,
      minimum: 2
    }
  },
  city: {
    presence: false,
    length: {
      maximum: 512,
      tooLong: 'City/Town must not exceed 512 characters'
    }
  }
};

const useStyles = makeStyles((theme) => ({
  root: {},
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const AccountDetails = props => {
  const { className, user, ...rest } = props;
  const classes = useStyles();
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
  const [openError, setOpenError] = useState(true);
  const [error, setError] = useState('');

  const [ userData ] = useContext(UserContext)
  const token = userData?.token

  useEffect(() => {
    setFormState(formState => ({
      ...formState,
      values: {
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        phoneNumber: user?.mobileNumbers?.[0]?.number,
        city: user?.homeAddress
      }
    }))
  }, [user]);

  useEffect(() => {
    let errors = validate(formState.values, schema, {fullMessages:false});
    if(formState.values?.phoneNumber?.length) {
      const isValidPhone = isMobilePhone(formState.values?.phoneNumber,'en-PH',{strictMode:false})
      if(!isValidPhone) {
        errors = {
          phoneNumber: ['Phone number is not valid']
        }
      }
    }
    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleChange = event => {
    event.persist();
    setOpenError(false)
    setError('')
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
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const handleSubmit = () => {
    const payload = formState.values
    payload.homeAddress = formState.values.city
    delete payload.city
    setOpenBackdrop(true)
    api(token)
      .patch('provider/update-profile', payload)
      .then(resp => {
        if (resp && resp.data) {
          setTimeout(() => {
            setOpenBackdrop(false)
            const message = 'Account has been updated!'
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
        console.error({err})
      });
  }

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

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
          subheader="The account information can be edited"
          title="Profile"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xs={12}
            >
              <Collapse in={openError}>
                <Alert 
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      onClick={() => {
                        setOpenError(false);
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
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={hasError('firstName')}
                fullWidth
                helperText={
                  hasError('firstName') ? formState.errors.firstName[0] : null
                }
                label="First name"
                margin="dense"
                name="firstName"
                onChange={handleChange}
                required
                value={formState.values.firstName ?? ''}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={hasError('lastName')}
                fullWidth
                helperText={
                  hasError('lastName') ? formState.errors.lastName[0] : null
                }
                label="Last name"
                margin="dense"
                name="lastName"
                onChange={handleChange}
                required
                value={formState.values.lastName ?? ''}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={hasError('email')}
                fullWidth
                helperText={
                  hasError('email') ? formState.errors.email[0] : null
                }
                label="Email Address"
                margin="dense"
                name="email"
                onChange={handleChange}
                required
                value={formState.values.email ?? ''}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={hasError('phoneNumber')}
                fullWidth
                helperText={
                  hasError('phoneNumber') ? formState.errors.phoneNumber[0] : null
                }
                label="Phone Number"
                margin="dense"
                name="phoneNumber"
                onChange={handleChange}
                required
                value={formState.values.phoneNumber ?? ''}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={hasError('city')}
                fullWidth
                helperText={
                  hasError('city') ? formState.errors.city[0] : null
                }
                label="City/Town"
                margin="dense"
                name="city"
                onChange={handleChange}
                value={formState.values.city ?? ''}
                variant="outlined"
              />
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
            Save details
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

AccountDetails.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object
};

export default AccountDetails;
