import React from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {  currencySymbol } from '../../../../Config';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 800
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  status: {
    marginRight: theme.spacing(1)
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const TopCustomers = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  let orders = props.allorders;

  let topCustomersArray = [];
  let id = '';
  let full_name = '';
  let email = '';
  let Phone = '';
  let City = '';
  let total_purchases = 0;
  let total = 0;

  for (let y = 0; y < orders.length; y++) {
    if(orders[y].status ==='completed' && orders[y].customer_id > 0) {
      full_name = orders[y].billing.first_name+' '+orders[y].billing.last_name;
      id = orders[y].customer_id;
      email = orders[y].billing.email;
      Phone = orders[y].billing.phone;
      City = orders[y].billing.city;
      total_purchases = 0
      for (let i = 0; i < orders[y].line_items.length; i++) {
        total_purchases += Number( orders[y].line_items[i].quantity )
      }
      total =  Number(orders[y].total);

      if (topCustomersArray.findIndex(person => person.id === id) > -1){
        topCustomersArray[topCustomersArray.findIndex(person => person.id === id)].total_purchases += total_purchases;
        topCustomersArray[topCustomersArray.findIndex(person => person.id === id)].total += total;
      }else{
        topCustomersArray.push({id:id, fullName:full_name, email:email , phone: Phone, city: City, total_purchases: total_purchases, total: total})
      }
    }
  }
  let dataSorted = topCustomersArray.sort((a,b) => (a.total > b.total) ? -1 : ((b.total > a.total) ? 1 : 0));


  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        title="Top Customers"
      />
      <Divider />
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Purchased Items</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataSorted.map(topCustomer => (
                  <TableRow hover key={topCustomer.id} >
                    <TableCell>{topCustomer.fullName}</TableCell>
                    <TableCell>{topCustomer.email}</TableCell>
                    <TableCell>{topCustomer.phone}</TableCell>
                    <TableCell>{topCustomer.city}</TableCell>
                    <TableCell>{topCustomer.total_purchases}</TableCell>
                    <TableCell>{topCustomer.total+currencySymbol}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <Divider />
    </Card>
  );
};

TopCustomers.propTypes = {
  className: PropTypes.string
};

export default TopCustomers;
