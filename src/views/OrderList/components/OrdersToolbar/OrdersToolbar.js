import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField 
} from '@material-ui/core'
import { SearchInput } from 'components';
import { format } from 'date-fns';

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

const OrdersToolbar = props => {
  const { className, onSearch, onChangeDate, onChangeStatus, onChangePaymentMethod, ...rest } = props
  const [keyword, setKeyword] = useState('')
  const [dateStart, setDateStart] = useState(format(new Date(),'yyyy-MM-dd'))
  const [dateEnd, setDateEnd] = useState(format(new Date(),'yyyy-MM-dd'))
  const [status, setStatus] = useState('all')
  const [paymentMethod, setPaymentMethod] = useState('all')

  const classes = useStyles()

  function handleChangeKeyword(e) {
    setKeyword(e.target.value)
  }

  function handleSearch(e) {
    if (e.key === 'Enter') {
      onSearch(keyword)
    }
  }

  const handleChangeDate = (e) => {
    const { value, name } = e.target
    const dateStr = format(new Date(value),'yyyy-MM-dd')
    if(name === 'dateStart') {
      setDateStart(dateStr)
    } else if(name === 'dateEnd') {
      setDateEnd(dateStr)
    }
    onChangeDate(name,dateStr)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    if(name==='status') {
      setStatus(value)
      onChangeStatus(value)
    } else if (name==='paymentMethod') {
      setPaymentMethod(value)
      onChangePaymentMethod(value)
    }
    
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
          placeholder="Search order"
        />
        <TextField
          className={classes.filters}
          InputLabelProps={{
            shrink: true,
          }}
          label="From"
          name="dateStart"
          onChange={handleChangeDate}
          type="date"
          value={dateStart}
        />
        <TextField
          className={classes.filters}
          InputLabelProps={{
            shrink: true,
          }}
          label="To"
          name="dateEnd"
          onChange={handleChangeDate}
          type="date"
          value={dateEnd}
        />
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
            <MenuItem value="payment_pending">Pending</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
            <MenuItem value="void">Void</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.filters}>
          <InputLabel>Payment Method</InputLabel>
          <Select
            name="paymentMethod"
            onChange={handleChange}
            value={paymentMethod}
          >
            <MenuItem value="all">
              <em>All</em>
            </MenuItem>
            <MenuItem value="cash">Cash</MenuItem>
            <MenuItem value="gcash">G-Cash</MenuItem>
            <MenuItem value="paypal">PayPal</MenuItem>
            <MenuItem value="paynamics">Paynamics</MenuItem>
            <MenuItem value="paymongo">Paymongo</MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

OrdersToolbar.propTypes = {
  className: PropTypes.string,
  onChangeDate: PropTypes.func,
  onChangePaymentMethod: PropTypes.func,
  onChangeStatus: PropTypes.func,
  onSearch: PropTypes.func
};

export default OrdersToolbar;
