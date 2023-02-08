import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { blue } from '@material-ui/core/colors';
import {
  Avatar,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  SwipeableDrawer,
  Typography
} from '@material-ui/core';

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { getInitials } from 'helpers';
import { UserContext } from '../../../../Store';
import { setSession } from '../../../../config/session';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  pageSwitcher: {
    width: 350
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  blue: {
    color: '#fff',
    backgroundColor: blue[200]
  },
  listItem: {
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'none',
      backgroundColor: 'rgba(38, 50, 56, 0.04)'
    }
  },
  activeItem: {
    backgroundColor: blue[100]
  }
}));

const Switcher = props => {
  const { className, show, hide, showBackdrop, ...rest } = props;
  const [openDrawer, setOpenDrawer] = useState(false);
  const [ user ] = useContext(UserContext)
  const { places, defaultPage } = user
  const classes = useStyles();


  useEffect(() => {
    setOpenDrawer(show)
  },[ show ]);

  const toggleDrawer = (openDrawer) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    } else if (event && event.type === 'click' && event.target.className !== 'MuiBackdrop-root') {
      return;
    }
    setOpenDrawer(openDrawer);
    hide()
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
    hide()
  };

  const switchPage = (e) => {
    if (!window.confirm('Are you sure you want to switch page?')) {
      return false;
    }
    const pageId = e.currentTarget.dataset.id
    setOpenDrawer(false)
    showBackdrop(true)
    hide()
    setTimeout(() => {
      setSession('defaultPage',JSON.stringify(pageId))
      showBackdrop(false)
      window.location.reload()
    },1000)
  }

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <SwipeableDrawer
        anchor="right"
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        open={openDrawer}
      >
        <div
          className={classes.pageSwitcher}
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
          role="presentation"
        >
          <div>
            <div className={classes.toolbar}>
              <Typography variant="h5">SWITCH PAGE</Typography>
              <IconButton 
                aria-label="close" 
                className={classes.closeButton}
                onClick={handleDrawerClose}
              >
                <CloseIcon />
              </IconButton>
            </div>
            <Divider />
            <CardContent className={classes.content}>
              <List>
                {places?.map((place, i) => (
                  <ListItem
                    className={(place._id !== defaultPage) ? classes.listItem : classes.activeItem}
                    data-id={place?._id}
                    divider={i < places?.length - 1}
                    key={place._id}
                    onClick={(place._id !== defaultPage) ? switchPage : () => {}}
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt={getInitials(place?.name)}
                        className={clsx(classes.avatar,classes.blue)}
                        src={place?.photos?.[0]?.thumb}
                        variant="rounded"
                      >
                        {getInitials(place?.name)}
                      </Avatar>
                    </ListItemAvatar>
                    <Typography variant="h6">{place?.name}</Typography>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </div>
        </div>
      </SwipeableDrawer>
    </div>
  );
};

Switcher.propTypes = {
  className: PropTypes.string,
  hide: PropTypes.func,
  show: PropTypes.bool,
  showBackdrop: PropTypes.func
};

export default Switcher;