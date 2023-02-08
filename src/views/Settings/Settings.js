import React , { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { LinearProgress } from '@material-ui/core';
import { Page } from './components';
import { UserContext } from '../../Store';
import api from '../../config/api';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Settings = () => {
  const classes = useStyles();
  const [ user ] = useContext(UserContext)
  const [ placeData, setPlaceData ] = useState({})
  const { amenities, defaultPage, pageTypes, destinations, pageCategories, token } = user
  useEffect(() => {
    let didCancel = false
    if(defaultPage && token) {
      api(token).get(`/provider/places/${defaultPage}`)
        .then(resp => {
          if (!didCancel) {
            if(resp) {
              const { page } = resp?.data
              setPlaceData(page)
            } else {
              setPlaceData({})
            }
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
    return () => {
      didCancel = true;
    };
  }, [defaultPage,token]);

  return (
    <div className={classes.root}>
      { placeData ?
        <Page 
          amenities={amenities}
          destinations={destinations}
          pageCategories={pageCategories}
          pageTypes={pageTypes}
          place={placeData}
        />
        :
        <LinearProgress />
      }
    </div>
  );
};

export default Settings;
