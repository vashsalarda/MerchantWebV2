import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Backdrop,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
  Fade,
  Snackbar,
  TextField
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import api from '../../../../config/api';
import { UserContext } from '../../../../Store';
import { Close as CloseIcon } from '@material-ui/icons';

const schema = {
  oldPassword: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 64,
      minimum: 6
    }
  },
  newPassword: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 64,
      minimum: 6
    },
  },
  confirmPassword: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 64,
      minimum: 6
    },
    equality: 'newPassword'
  }
};

const useStyles = makeStyles((theme) => ({
  root: {},
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const Password = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const [openBackdrop, setOpenBackdrop] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    color: 'primary',
    message: '',
    Transition: Fade,
  });
  const [ userData ] = useContext(UserContext)
  const { token } = userData

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

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
    let { oldPassword, newPassword, confirmPassword } = formState.values;
    if(oldPassword !== '' && newPassword !== ''  && confirmPassword !== '' ) {
      if(oldPassword === newPassword) {
        setOpen(true);
        setError('New password is the same as the old password!');
      } else {
        if(newPassword === confirmPassword) {
          setOpenBackdrop(true)
          const payload = {
            oldPassword,
            password: formState.values.newPassword,
            confirmPassword,
          }
          api(token).patch('/provider/change-password',payload)
            .then(res => {
              setOpenBackdrop(false)
              setFormState({
                isValid: false,
                values: {},
                touched: {},
                errors: {}
              })
              if(res?.data?.status === 'error') {
                const message = res?.data?.message
                setOpenBackdrop(false)
                setOpen(true)
                setError(message)
              } else {
                setError('')
                setOpen(false)
                const message = 'Password was changed successfully.'
                setSnackbar({
                  open: true,
                  color: 'success',
                  message: message
                });
              }
            })
            .catch(err => {
              setFormState({
                isValid: false,
                values: {},
                touched: {},
                errors: {}
              })
              setOpenBackdrop(false)
              setOpen(true);
              setError(err?.message ?? 'There is error on changing the password. Please try again');
            })
        } else {
          setOpenBackdrop(false)
          setOpen(true);
          setError('New password did not match!');
        }
      }
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
          subheader="Update password"
          title="Password"
        />
        <Divider />
        <CardContent>
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
            error={hasError('oldPassword')}
            fullWidth
            helperText={
              hasError('oldPassword') ? formState.errors.oldPassword[0] : null
            }
            label="Old password"
            margin="dense"
            name="oldPassword"
            onChange={handleChange}
            type="password"
            value={formState.values.oldPassword ?? ''}
            variant="outlined"
          />
          <TextField
            error={hasError('newPassword')}
            fullWidth
            helperText={
              hasError('newPassword') ? formState.errors.newPassword[0] : null
            }
            label="New password"
            margin="dense"
            name="newPassword"
            onChange={handleChange}
            style={{ marginTop: '1rem' }}
            type="password"
            value={formState.values.newPassword ?? ''}
            variant="outlined"
          />
          <TextField
            error={hasError('confirmPassword')}
            fullWidth
            helperText={
              hasError('confirmPassword') ? formState.errors.confirmPassword[0] : null
            }
            label="Confirm password"
            margin="dense"
            name="confirmPassword"
            onChange={handleChange}
            style={{ marginTop: '1rem' }}
            type="password"
            value={formState.values.confirmPassword ?? ''}
            variant="outlined"
          />
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            color="primary"
            disabled={!formState.isValid}
            onClick={handleSubmit}
            variant="contained"
          >
            Update Password
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

Password.propTypes = {
  className: PropTypes.string
};

export default Password;
