import React from 'react';
import clsx from 'clsx';
// import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  // Tooltip,
  // TableSortLabel
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

// import { StatusBullet } from 'components';

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

// const statusColors = {
//   delivered: 'success',
//   pending: 'info',
//   refunded: 'danger'
// };

const LatestOrders = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const orders = props.allOrders;
  const uniqueAvailableMethods = [...(new Set(orders.map(({ payment_method }) => payment_method)))];
  let finalPayment = []
// debugger;
  for (let i = 0; i < uniqueAvailableMethods.length; i++) {
    var value = 0
    // debugger;
    for (let y = 0; y < orders.length; y++) {
    // orders.forEach( function (element, index) {
      if (orders[y].status === 'completed' && orders[y].payment_method === uniqueAvailableMethods[i].payment_method){
        debugger;
        value += Number(orders[y].total)
        if (y == orders.length){
          finalPayment.push({id:orders[y].payment_method, name:orders[y].payment_method_title, total:value })
        }
      }
    }
  }
  // debugger;
  // let paymentMethods = [];
  // paymentMethods = orders.forEach( function (element, index) {
  //   if (element.status === 'completed'){
      
  //   }
  // })

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        // action={
        //   <Button
        //     color="primary"
        //     size="small"
        //     variant="outlined"
        //   >
        //     New entry
        //   </Button>
        // }
        title="Latest Orders"
      />
      <Divider />
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Payment Method</TableCell>
                  <TableCell>Revenue</TableCell>
                  {/* <TableCell sortDirection="desc">
                    <Tooltip
                      enterDelay={300}
                      title="Sort"
                    >
                      <TableSortLabel
                        active
                        direction="desc"
                      >
                        Date
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>
                  <TableCell>Status</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map(order => (
                  <TableRow
                    hover
                    key={order.id}
                  >
                    <TableCell>{order.payment_method_title}</TableCell>
                    <TableCell>{order.shipping_total}</TableCell>
                    {/* <TableCell>
                      {moment(order.date_created).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell>
                      <div className={classes.statusContainer}>
                        <StatusBullet
                          className={classes.status}
                          color={statusColors[order.status]}
                          size="sm"
                        />
                        {order.status}
                      </div>
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <Divider />
      <CardActions className={classes.actions}>
        <Button
          color="primary"
          size="small"
          variant="text"
        >
          View all <ArrowRightIcon />
        </Button>
      </CardActions>
    </Card>
  );
};

LatestOrders.propTypes = {
  className: PropTypes.string
};

export default LatestOrders;
