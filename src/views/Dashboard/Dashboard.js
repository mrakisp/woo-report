import React, { Component }  from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import LineChart from "../../components/charts/LineChart";
import PieChart from "../../components/charts/PieChart";
import {topSellersEndPoint, salesEndPoint } from '../../Config';
import {formatDate} from "../../helpers/Utils";
import DatePicker from "../../helpers/Date";
import axios from 'axios';


import {
  Orders,
  TotalUsers,
  TotalItems,
  TotalProfit,
  UsersByDevice,
  LatestProducts,
  LatestOrders,
  TopSellers
} from './components';


export default class Dashboard extends Component {

  state = {
    sales : null,
    customers : null,
    total_sales: null,
    total_orders : null,
    total_items : null,
    total_customers : null,
    total_refunds: null,
    topSellers : [],
    fromDate : formatDate(new Date()),
    toDate : formatDate(new Date()),
    loading: true,
  };
  
  componentDidMount() {
    this.getData() 
  }

  getData = () =>{
    //DATE
    const fromDate = this.state.fromDate;
    const toDate = this.state.toDate;
    const endpointParams = "&date_min=" + fromDate + "&date_max=" + toDate ;
    
    // const urlTopSellers = topSellersEndPoint + endpointParams;
    const urlSales = salesEndPoint + endpointParams;
    axios.get(urlSales)
          .then(res => {
            this.setState({ 
              sales : res.data[0],
              customers : res.data[0],
              total_sales: res.data[0].total_sales ,
              total_orders : res.data[0].total_orders ,
              total_items : res.data[0].total_items ,
              total_customers : res.data[0].total_customers ,
              total_refunds: res.data[0].total_refunds ,
            })  
    })
    const urlTopSellers = topSellersEndPoint + endpointParams;
    axios.get(urlTopSellers)
    .then(res => {
      this.setState({ 
        topSellers : res.data
      })  
})
  }

   //GET DATA FROM CHILD COMPONENT
   callbackFunction = (from,to) => {
    this.setState({
        fromDate : formatDate(from),
        toDate : formatDate(to),
        loading : true
    }, () => { //CALL FUNCTION AFTER STATE IS UPDATED
      this.getData() 
    });
    
  }

  render() {
    
    const classes = makeStyles(theme => ({
      root: {
        padding: theme.spacing(4)
      }
    }));
  
    const sales = this.state.sales;
    const customers = this.state.customers;
    const total_sales = this.state.total_sales;
    const total_orders = this.state.total_orders;
    const total_items = this.state.total_items;
    const total_customers = this.state.total_customers;
    const total_refunds = this.state.total_refunds;
    const topSellers = this.state.topSellers;

  return (
    <div className={classes.root}>
      <DatePicker parentCallback = {this.callbackFunction}/>
      <Grid container spacing={4} >
        <Grid item lg={3} sm={6} xl={3} xs={12} >  
          <Orders total_orders={total_orders}/>
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12} >
          <TotalUsers total_customers={total_customers}/>
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12} >
          <TotalItems total_items={total_items}/>
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12} >
          <TotalProfit total_sales={total_sales}/>
        </Grid>
        <Grid item lg={12} sm={12} xl={12} xs={12} >
          <LineChart sales={sales}/>
          {/* <LatestSales /> */}
        </Grid>
        <Grid item lg={4} sm={6} xl={4} xs={12} >
           <TopSellers topSellers={topSellers} />
          {/* <LatestProducts /> */}
        </Grid>
        <Grid item lg={8} sm={6} xl={8} xs={12} >
          <PieChart topSellers={topSellers}/>
        </Grid>
      </Grid>
    </div>
  );
};
}

