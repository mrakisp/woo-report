import React, { Component }  from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import LineChart from "../../components/charts/LineChart";
import PieChart from "../../components/charts/PieChart";
import {topSellersEndPoint, salesEndPoint ,ordersEndPoint } from '../../Config';
import {formatDate} from "../../helpers/Utils";
import DatePicker from "../../helpers/Date";
import { PaymentMethodsAndRevenue } from './components';
import axios from 'axios';
import { Box } from '../Analytics/components';

import {
  Orders,
  TotalUsers,
  TotalItems,
  TotalProfit,
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
    orders: [],
    topSellers : [],
    ordersInfo : [{processing:0, completed:0, pending:0, cancelled: 0, refunded:0, failed: 0}],
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
            }, () => { //CALL FUNCTION AFTER STATE IS UPDATED
                let per_page = 100;
                const pages = Math.ceil(this.state.total_orders/per_page);
                
                let urlOrders = ordersEndPoint + '&after='+fromDate+'T00:00:01&before='+toDate+'T23:59:59' + '&per_page='+per_page;
                if(pages <= 1){
                  axios.get(urlOrders).then(res => {
                      this.setState({ 
                        orders : res.data
                      }, () => { //CALL FUNCTION AFTER STATE IS UPDATED
                        this.calculateOrderStatus()
                      });   
                      if(pages == 1){
                        this.setState({ 
                          loading: false
                        }) 
                      }
                  })
                }else {
                  let allOrders = [];
                  for (let i = 0; i < pages; i++) {
                    let page = '';
                    page = '&page='+Number(i+1)
                    let pagedurlOrders = urlOrders+page
                    axios.get(pagedurlOrders).then(res => {
                      // existingOrders.push = res.data;
                      // const newOrders = res.data;
                      allOrders = allOrders.concat(res.data);
                      this.setState({
                        orders: allOrders,
                        loading: false
                      }, () => { //CALL FUNCTION AFTER STATE IS UPDATED
                        this.calculateOrderStatus()
                      }); 
                    })
                  }
                  
                }
            }); 
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

  calculateOrderStatus = () => {
    const allOrders = this.state.orders;
    let ordersInfo = []
    let processingOrders = 0;
    let completedOrders = 0;
    let pendingOrders = 0;
    let cancelledOrders = 0; 
    let refundedOrders = 0;
    let failedOrders = 0;

    for (let y = 0; y < allOrders.length; y++) {
      if (allOrders[y].status === "processing" ){
        processingOrders++; 
      }else if (allOrders[y].status === "completed" ){
        completedOrders ++;
      }else if (allOrders[y].status === "pending" ){
        pendingOrders++
      }else if (allOrders[y].status === "cancelled" ){
        cancelledOrders++
      }else if (allOrders[y].status === "refunded"){
        refundedOrders++
      }else if (allOrders[y].status === "failed"){
        failedOrders++
      }
    }
    ordersInfo.push({processing:processingOrders, completed:completedOrders, pending:pendingOrders, cancelled: cancelledOrders, refunded:refundedOrders, failed: failedOrders})
    this.setState({ 
      ordersInfo : ordersInfo
    }) 
  }

  render() {
    
    const classes = makeStyles(theme => ({
      root: {
        padding: theme.spacing(4)
      }
    }));
  
    const sales = this.state.sales;
    const total_sales = this.state.total_sales;
    const total_orders = this.state.total_orders;
    const total_items = this.state.total_items;
    const total_customers = this.state.total_customers;
    const topSellers = this.state.topSellers;
    const allOrders = this.state.orders;
    const ordersInfo = this.state.ordersInfo;

  return (
    <div className={classes.root}>
      <DatePicker parentCallback = {this.callbackFunction}/>
      <Grid container spacing={4} >
        <Grid item lg={3} sm={6} xl={3} xs={12} >  
          <Orders total_orders={total_orders} loading={this.state.loading}/>
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12} >
          <TotalUsers total_customers={total_customers} loading={this.state.loading}/>
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12} >
          <TotalItems total_items={total_items} loading={this.state.loading}/>
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12} >
          <TotalProfit total_sales={total_sales} loading={this.state.loading}/>
        </Grid>

         <Grid item lg={2} sm={3} xl={2} xs={6} >
            <Box title={'Processing Orders'} data={ordersInfo[0].processing} loading={this.state.loading}/>
         </Grid>
         <Grid item lg={2} sm={3} xl={2} xs={6} >
            <Box title={'Completed Orders'} data={ordersInfo[0].completed} loading={this.state.loading}/>
         </Grid>
         <Grid item lg={2} sm={3} xl={2} xs={6} >
            <Box title={'Pending Orders'} data={ordersInfo[0].pending} loading={this.state.loading}/>
         </Grid>
         <Grid item lg={2} sm={3} xl={2} xs={6} >
            <Box title={'Cancelled Orders'} data={ordersInfo[0].cancelled} loading={this.state.loading}/>
         </Grid>
         <Grid item lg={2} sm={3} xl={2} xs={6} >
            <Box title={'Refunded Orders'} data={ordersInfo[0].refunded} loading={this.state.loading}/>
         </Grid>
         <Grid item lg={2} sm={3} xl={2} xs={6} >
            <Box title={'Failed Orders'} data={ordersInfo[0].failed} loading={this.state.loading}/>
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
        <Grid item lg={12} sm={12} xl={12} xs={12} >
          <PaymentMethodsAndRevenue allOrders={allOrders}/>
        </Grid>
      </Grid>
    </div>
  );
};
}

