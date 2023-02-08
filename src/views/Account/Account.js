import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { AccountDetails, Password } from './components';
import { UserContext } from '../../Store'
import api from '../../config/api';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Account = (props) => {
  const { history } = props
  const classes = useStyles();

  const [ user ] = useContext(UserContext)
  const [ account, setAccount ] = useState({})
  const { token, loggedIn } = user

  useEffect(() => {
    if(loggedIn) {
      let didCancel = false
      const getAccount = async (token) => {
        if(token) {
          await api(token).get('/provider/profile')
            .then(resp => {
              if(resp?.data) {
                if(!didCancel) {
                  setAccount(resp?.data)
                }
              }
            })
            .catch(err => {
              console.error({message:err?.message,err})
            });
        }
      }

      getAccount(token)
      
      return () => {
        didCancel = true;
      };  
    }
  },[ history, loggedIn, token ]);

  return (
    <div className={classes.root}>
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
          <AccountDetails user={account} />
        </Grid>
        <Grid
          item
          lg={4}
          md={6}
          xl={4}
          xs={12}
        >
          <Password />
        </Grid>
      </Grid>
    </div>
  );
};

Account.propTypes = {
  history: PropTypes.object
};

export default Account;
