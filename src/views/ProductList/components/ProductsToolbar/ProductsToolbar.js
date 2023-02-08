import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { 
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';

import { SearchInput } from 'components';
import { UserContext } from '../../../../Store'

const useStyles = makeStyles(theme => ({
  root: {},
  row: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'flex-start'
  },
  spacer: {
    flexGrow: 1
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  filters: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      width: '100vw',
      maxWidth: 340
    },
    [theme.breakpoints.up('md')]: {
      width: 250
    },
    [theme.breakpoints.up('lg')]: {
      width: 250
    }
  }
}));

const ProductsToolbar = props => {
  const { className, onChangeStatus, onSelectCategory, onSelectCategorySub, onSearch, ...rest } = props;
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('all');
  const [selectedCategory, setProductCategory] = useState('all');
  const [selectedCategorySub, setProductCategorySub] = useState('all');
  const [ user ] = useContext(UserContext);
  const { productCategories } = user;

  let productCategoriesAll = [];
  let productCategoriesMain = [];
  let productCategoriesSub = [];
  productCategories?.length && productCategories.forEach(item => {
    const category = {
      value: item._id,
      label: (item.isActive === true) ? item.name : item.name + ' - INACTIVE',
      parent: item.parent,
    }
    productCategoriesAll.push(category);
  });
  productCategoriesMain = productCategoriesAll.filter(item => !item.parent);
  const categoryFirst = [
    {
      value: 'no-category',
      label: 'Uncategorized',
      parent: '',
    }
  ]
  productCategoriesMain = [...categoryFirst,...productCategoriesMain];
  if(selectedCategory) {
    productCategoriesSub = productCategoriesAll.filter(item => item.parent && item.parent.id.toString() === selectedCategory);
  }

  const classes = useStyles();

  const handleChangeKeyword = (e) => {
    setKeyword(e.target.value)
  }

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      onSearch(keyword);
    }
  }

  const handleChange = (event) => {
    const { value } = event.target
    setStatus(value)
    onChangeStatus(value)
  };

  const handleSelectProductCategory = (event) => {
    const { value } = event.target
    productCategoriesSub?.length && productCategoriesSub.filter(item => item.parent && item.parent.id.toString() === value)
    setProductCategory(value)
    onSelectCategory(value)
  };

  const handleSelectProductCategorySub = (event) => {
    const { value } = event.target
    setProductCategorySub(value)
    onSelectCategorySub(value)
  };

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <div className={classes.row}>
        <SearchInput
          className={classes.searchInput}
          onChange={handleChangeKeyword}
          onKeyDown={handleSearch}
          placeholder="Search product"
        />
        <FormControl className={classes.filters}>
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            onChange={handleSelectProductCategory}
            value={selectedCategory}
          >
            <MenuItem value="all">
              <em>All</em>
            </MenuItem>
            {productCategoriesMain?.length && productCategoriesMain?.map(item => (
              <MenuItem
                key={item.value}
                value={item.value}
              >
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.filters}>
          <InputLabel>Sub Category</InputLabel>
          <Select
            name="subCategory"
            onChange={handleSelectProductCategorySub}
            value={selectedCategorySub}
          >
            <MenuItem value="all">
              <em>All</em>
            </MenuItem>
            {productCategoriesSub?.length && productCategoriesSub?.map(item => (
              <MenuItem
                key={item.value}
                value={item.value}
              >
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.filters}>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            onChange={handleChange}
            value={status}
          >
            <MenuItem value="all">
              <em>All</em>
            </MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inActive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

ProductsToolbar.propTypes = {
  className: PropTypes.string,
  onChangeStatus: PropTypes.func,
  onSearch: PropTypes.func,
  onSelectCategory: PropTypes.func,
  onSelectCategorySub: PropTypes.func
};

export default ProductsToolbar;
