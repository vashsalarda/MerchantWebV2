import React, { useState } from 'react';
import PropTypes from 'prop-types';

export const UserContext = React.createContext({
  id: '',
  firstName: '',
  lastName: '',
  loggedIn: false,
  avatar: '',
  token: '',
  defaultPage: '',
  place: {},
  places: [],
  productCategories: [],
  pageTypes: [],
  destinations: [],
  pageCategories: [],
  amenities: [],
  isGrocery: false
});

const Store = ({children}) => {
  const [ user, setUser ] = useState({});

  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  );
};

Store.propTypes = {
  children: PropTypes.object
};

export default Store