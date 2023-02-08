import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Avatar,
  Typography
} from '@material-ui/core';
import { format } from 'date-fns'

const tzName = Intl.DateTimeFormat().resolvedOptions().timeZone;
const useStyles = makeStyles(theme => ({
  root: {},
  details: {
    display: 'flex'
  },
  avatar: {
    marginLeft: 'auto',
    height: 110,
    width: 100,
    flexShrink: 0,
    flexGrow: 0
  },
  progress: {
    marginTop: theme.spacing(2)
  },
  uploadButton: {
    marginRight: theme.spacing(2)
  }
}));

const AccountProfile = (props) => {
  
  const { className, user, ...rest } = props;

  const classes = useStyles();

  

  // const user = {
  //   name: 'Vash Salarda',
  //   city: 'Malaybalay City',
  //   country: 'PH',
  //   timezone: 'GMT+8',
  //   avatar: '/images/avatars/avatar_11.png'
  // };


  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <div className={classes.details}>
          <div>
            <Typography
              gutterBottom
              variant="h2"
            >
              {user.firstName} {user.lastName}
            </Typography>
            <Typography
              className={classes.locationText}
              color="textSecondary"
              variant="body1"
            >
              {user.homeAddress}
            </Typography>
            <Typography
              className={classes.dateText}
              color="textSecondary"
              variant="body1"
            >
              {format(new Date(),'hh:mm a')} ({tzName})
            </Typography>
          </div>
          <Avatar
            className={classes.avatar}
            src={user.photos?.[0]?.thumb}
          />
        </div>
      </CardContent>
    </Card>
  );
};

AccountProfile.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object
};

export default AccountProfile;
