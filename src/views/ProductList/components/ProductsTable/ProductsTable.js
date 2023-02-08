import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { format } from 'date-fns'
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Checkbox,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination
} from '@material-ui/core';

import { UserContext } from '../../../../Store'
import api from '../../../../config/api';
import { getInitials } from 'helpers';
import { numberWithCommas } from 'helpers';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const ProductsTable = props => {
  const [ user ] = useContext(UserContext);
  const { 
    className,
    loadingText,
    products,
    rowsPerPage,
    page,
    pageInfo,
    productCount,
    onPageChange,
    onRowsPerPageChange,
    updateProducts,
    ...rest
  } = props;
  const classes = useStyles();
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleSelectAll = event => {

    let selectedUsers;

    if (event.target.checked) {
      selectedUsers = products.map(user => user.id);
    } else {
      selectedUsers = [];
    }

    setSelectedUsers(selectedUsers);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedUsers.indexOf(id);
    let newSelectedUsers = [];

    if (selectedIndex === -1) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers, id);
    } else if (selectedIndex === 0) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(1));
    } else if (selectedIndex === selectedUsers.length - 1) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedUsers = newSelectedUsers.concat(
        selectedUsers.slice(0, selectedIndex),
        selectedUsers.slice(selectedIndex + 1)
      );
    }
    setSelectedUsers(newSelectedUsers);
  };

  const handlePageChange = (event, page) => {
    onPageChange(page);
  };

  const handleRowsPerPageChange = event => {
    onRowsPerPageChange(event.target.value);
  };

  const renderCategories = (categories) => {
    if(categories instanceof Array && categories.length > 0) {
      if(categories.length === 1) {
        return categories.map(cat => cat.name);
      } else {
        return categories.map(cat => cat.name + ', ');
      }
    }
  }

  const handleChangeStatus = (event) => {
    const { token, id } = user;
    const { checked, value } = event.target;
    const nextStatus = checked;
    const productId = value;
    const body = {
      providerId: id,
      isActive: nextStatus
    };
    api(token).patch(`/business/products/${productId}`, body)
      .then(response => {
        if(response && response.data) {
          updateProducts(productId,nextStatus);
        }
      })
      .catch(error => {
        console.error({error});
        if(error && error.response && error.response.data && error.response.data.message) {
          const message = error.response.data.message;
          console.error({message});
        }
      });
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedUsers.length === products.length}
                      color="primary"
                      indeterminate={
                        selectedUsers.length > 0 &&
                        selectedUsers.length < products.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>NAME</TableCell>
                  <TableCell>PRICE</TableCell>
                  <TableCell>BARCODE</TableCell>
                  <TableCell>CATEGORY</TableCell>
                  <TableCell>ADDED</TableCell>
                  <TableCell>UPDATED</TableCell>
                  <TableCell>STATUS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { products && products.length > 0 ?
                  products.map(prod => (
                    <TableRow
                      className={classes.tableRow}
                      hover
                      key={prod._id}
                      selected={selectedUsers.indexOf(prod._id) !== -1}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedUsers.indexOf(prod._id) !== -1}
                          color="primary"
                          onChange={event => handleSelectOne(event, prod._id)}
                          value="true"
                        />
                      </TableCell>
                      <TableCell>
                        <div className={classes.nameContainer}>
                          <Avatar
                            alt={getInitials(prod.name)}
                            className={classes.avatar}
                            src={prod?.photos?.[0]?.thumb}
                            variant="square"
                          >
                            {getInitials(prod.name)}
                          </Avatar>
                          <Typography variant="body1">
                            <Link 
                              to={`/products/edit/${prod._id}`}
                            >
                              {prod.name}
                            </Link>
                          </Typography>
                        </div>
                      </TableCell>
                      <TableCell>&#8369;{prod.price ? numberWithCommas(prod.price) : '0.00'}</TableCell>
                      <TableCell>{prod.barcode}</TableCell>
                      <TableCell>
                        { pageInfo && pageInfo.useCreatedProductCategory 
                          ? renderCategories(prod.productCategories)
                          : renderCategories(prod.categories)
                        }
                      </TableCell>
                      <TableCell>
                        {format(new Date(prod.createdAt),'MMM/dd/yyyy')}<br/>
                        {format(new Date(prod.createdAt),'hh:mm a')}
                      </TableCell>
                      <TableCell>
                        {format(new Date(prod.updatedAt),'MMM/dd/yyyy')}<br/>
                        {format(new Date(prod.updatedAt),'hh:mm a')}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={prod.isActive ? prod.isActive : false}
                          color="primary"
                          inputProps={{ 'aria-label': 'primary checkbox' }}
                          name="status"
                          onChange={handleChangeStatus}
                          value={prod._id}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                  :
                  <TableRow>
                    <TableCell colSpan="8">
                      <Typography variant="body1">{loadingText}</Typography>
                    </TableCell>
                  </TableRow>
                }
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={productCount}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </CardActions>
    </Card>
  );
};

ProductsTable.propTypes = {
  className: PropTypes.string,
  isFetching: PropTypes.bool,
  loadingText: PropTypes.string,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  pageInfo: PropTypes.object,
  productCount: PropTypes.number,
  products: PropTypes.array,
  rowsPerPage: PropTypes.number,
  updateProducts: PropTypes.func
};

export default ProductsTable;
