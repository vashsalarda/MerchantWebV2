import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Avatar, Typography } from '@material-ui/core';
// import { getSession } from '../../../../../../config/session';
import { getInitials } from 'helpers';
import { UserContext } from '../../../../../../Store';


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  avatar: {
    width: 60,
    height: 60
  },
  name: {
    marginTop: theme.spacing(1),
    textAlign: 'center'
  }
}));

const Profile = props => {
  const { className, ...rest } = props
  const classes = useStyles()
  // const userData = JSON.parse(getSession('userData'))
  const [ user ] = useContext(UserContext)
  const { place } = user

  // const user = {
  //   name: place?.name,
  //   avatar: place?.photos?.[0]?.thumb
  // };
  
  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Avatar
        alt="Person"
        className={classes.avatar}
        component={RouterLink}
        src={place?.photos?.[0]?.thumb}
        to="/settings"
      >
        {getInitials(place?.name)}
      </Avatar>
      <Typography
        className={classes.name}
        variant="h4"
      >
        {place?.name}
      </Typography>
    </div>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;
