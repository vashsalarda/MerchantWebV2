import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/styles';
import { 
  Backdrop,
  CircularProgress,
  Typography,
  useMediaQuery
} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { Sidebar, Topbar, Footer, Switcher } from './components';

import { UserContext } from '../../Store'
import api from '../../config/api';
import { getSession } from '../../config/session';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 56,
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      paddingTop: 64
    }
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  shiftContent: {
    paddingLeft: 240
  },
  content: {
    height: '100%'
  }
}));

const Main = props => {
  let { children, history } = props;
  const [ user, setUser ] = useContext(UserContext);
  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true
  });

  const [ openSidebar, setOpenSidebar ] = useState(false);
  const [ showSwitcher, setShowSwitcher ] = useState(false);
  const [ waiting, setWaiting ] = useState(false);
  const [ openBackdrop, setOpenBackdrop ] = useState(false);

  let pathName = window.location.pathname;
  if (pathName === '/') {
    pathName = '/dashboard';
  }

  useEffect(() => {
    const userData = JSON.parse(getSession('userData'));
    let defaultPage = JSON.parse(getSession('defaultPage'));
    if(userData && userData.loggedIn) {
      const token = userData?.token;
      if(!user?.loggedIn || user?.id !== userData?.id) {
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
        history.push(pathName);
      }
    } else {
      history.push('/sign-in');
    }
  },[user, setUser, pathName, history])

  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  const handleShowSwitcher = () => {
    setOpenSidebar(false);
    setShowSwitcher(true)
  }

  const handleHideSwitcher = () => {
    setShowSwitcher(false)
  }

  const showBackdrop = (show) => {
    setOpenBackdrop(show)
  }

  const shouldOpenSidebar = isDesktop ? true : openSidebar

  const handleLogout = () => {
    if (!window.confirm('Are you sure you want to logout?')) {
      return false
    }
    
    const userData = JSON.parse(getSession('userData'))
    const { token } = userData
    setWaiting(true)
    api(token).post('/provider/logout',{})
      .then(response => {
        if(response && response.data) {
          localStorage.removeItem('userData')
          localStorage.removeItem('defaultPage')
          setWaiting(false)
          if(user)
            setUser({})
          history && history.length > 0 && history.push('/sign-in')
        }
      })
      .catch(error => {
        setWaiting(false)
        console.error({error});
      })
  };

  return (
    <>
      {waiting ?
        <Typography 
          color="primary"
          style={{margin: '.5rem'}}
          variant="h5"
        >
          Please wait...
        </Typography>
        :  
        <div
          className={clsx({
            [classes.root]: true,
            [classes.shiftContent]: isDesktop
          })}
        >
          <Topbar 
            onLogout={handleLogout} 
            onSidebarOpen={handleSidebarOpen} 
          />
          <Sidebar
            onClose={handleSidebarClose}
            onLogout={handleLogout}
            onShowSwitcher={handleShowSwitcher}
            open={shouldOpenSidebar}
            variant={isDesktop ? 'persistent' : 'temporary'}
          />
          <Switcher 
            hide={handleHideSwitcher}
            show={showSwitcher}
            showBackdrop={showBackdrop}
          />
          <Backdrop 
            className={classes.backdrop} 
            open={openBackdrop}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <main className={classes.content}>
            {children}
            <Footer />
          </main>
        </div>
      }
    </>
  );
};

Main.propTypes = {
  children: PropTypes.node,
  history: PropTypes.object
};

export default withRouter(Main);