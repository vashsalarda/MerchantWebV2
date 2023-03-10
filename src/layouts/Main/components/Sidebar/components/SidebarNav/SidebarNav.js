/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { forwardRef } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { List, ListItem, Button, colors } from '@material-ui/core';
import SwitchAccountIcon from '@material-ui/icons/SyncAlt';

const useStyles = makeStyles(theme => ({
  root: {},
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color: colors.blueGrey[800],
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium
  },
  icon: {
    color: theme.palette.icon,
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
  },
  active: {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    '& $icon': {
      color: theme.palette.primary.main
    }
  }
}));

const CustomRouterLink = forwardRef((props, ref) => (
  <div
    ref={ref}
    style={{ flexGrow: 1 }}
  >
    <RouterLink {...props} />
  </div>
));

const SidebarNav = props => {
  const { pages, className, onClose, onLogout, onShowSwitcher, ...rest } = props;

  const classes = useStyles();

  return (
    <List
      {...rest}
      className={clsx(classes.root, className)}
    >
      {pages.map(page => (
        <ListItem
          className={classes.item}
          disableGutters
          key={page.title}
        >
          {page.href === '/logout' ? (
            <Button
              className={classes.button}
              onClick={onLogout}
            >
              <div className={classes.icon}>{page.icon}</div>
              {page.title}
            </Button>
          ) : (
            <Button
              activeClassName={classes.active}
              className={classes.button}
              component={CustomRouterLink}
              onClick={onClose}
              to={page.href}
            >
              <div className={classes.icon}>{page.icon}</div>
              {page.title}
            </Button>
          )}
        </ListItem>
      ))}
      <ListItem
        className={classes.item}
        disableGutters
      >
        <Button
          className={classes.button}
          onClick={onShowSwitcher}
        >
          <div className={classes.icon}>
            <SwitchAccountIcon />
          </div>
          Switch Page
        </Button>
      </ListItem>
    </List>
  );
};

SidebarNav.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  onLogout: PropTypes.func,
  onShowSwitcher: PropTypes.func,
  pages: PropTypes.array.isRequired
};

export default SidebarNav;
