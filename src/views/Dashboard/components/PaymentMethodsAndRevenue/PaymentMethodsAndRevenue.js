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

const PaymentMethodsAndRevenue = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  let orders = props.allOrders;
  const uniqueAvailableMethods = [...(new Set(orders.map(({ payment_method_title }) => payment_method_title)))];
  let finalPayment = [];

  for (let i = 0; i < uniqueAvailableMethods.length; i++) {
    let value = 0
    let completedValue = 0;
    let processingValue = 0;
 
    for (let y = 0; y < orders.length; y++) {
      if (orders[y].status === "processing" && orders[y].payment_method_title === uniqueAvailableMethods[i]){
        value += Number(orders[y].total);
        processingValue += Number(orders[y].total);
      }else if (orders[y].status === "completed" && orders[y].payment_method_title === uniqueAvailableMethods[i]){
        value += Number(orders[y].total);
        completedValue += Number(orders[y].total);
      }
    }
    finalPayment.push({id:'payMethod'+i, name:uniqueAvailableMethods[i], total:value, processingValue:processingValue, completedValue: completedValue })
    
  }
  
  orders = finalPayment;


  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        title="Revenue per Payment Methods"
      />
      <Divider />
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Payment Method</TableCell>
                  <TableCell>Processing Orders</TableCell>
                  <TableCell>Completed Orders</TableCell>
                  <TableCell>Total Revenue</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map(order => (
                  <TableRow hover key={order.id} >
                    <TableCell>{order.name}</TableCell>
                    <TableCell>{Number(order.processingValue).toFixed(2)+currencySymbol}</TableCell>
                    <TableCell>{Number(order.completedValue).toFixed(2)+currencySymbol}</TableCell>
                    <TableCell>{Number(order.total).toFixed(2)+currencySymbol}</TableCell>
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

PaymentMethodsAndRevenue.propTypes = {
  className: PropTypes.string
};

export default PaymentMethodsAndRevenue;
