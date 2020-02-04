import React, { Component } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Button, CardHeader, Divider } from '@material-ui/core';
import { analytics, currencySymbol  } from '../../Config';
import { formatDate } from "../../helpers/Utils";
import { DatePicker, Google } from "../../helpers";
import { AdsCampaign, UsersByDevice, Tabs, Table } from './components';
import { Box } from '../Analytics/components';

export default class Adwords extends Component {

  constructor() {
    super();
    this.state = {
      isSignedIn: false,
      loading: true,
      adsData: [],
      adsDataTotals: [],
      adsEcommerce: [],
      fromDate: formatDate(new Date()),
      toDate: formatDate(new Date()),
    };
  }

  getData = () => {

    //DATE
    const self = this;
    const fromDate = this.state.fromDate;
    const toDate = this.state.toDate;
    
    
    //CALL API AUTH AND ON SUCCESS GET REPORTS
    window.gapi.auth2.init({
      client_id: analytics.client_id
    }).then(() => {

      //console.log('signed in', window.gapi.auth2.getAuthInstance().isSignedIn.get());
      window.gapi.client.request({
        path: '/v4/reports:batchGet',
        root: 'https://analyticsreporting.googleapis.com/',
        method: 'POST',
        body: {
          "reportRequests": [
            {
              "viewId": analytics.view_id,
              "dateRanges": [
                {
                  "startDate": fromDate,
                  "endDate": toDate
                }
              ],
              "metrics": [
                {
                  "expression": "ga:adClicks"
                },
                {
                  "expression": "ga:impressions"
                },
                {
                  "expression": "ga:CTR"
                },
                {
                  "expression": "ga:ROAS"
                },
                {
                  "expression": "ga:costPerConversion"
                },
                {
                  "expression": "ga:costPerTransaction"
                },
                {
                  "expression": "ga:adCost"
                },
                {
                  "expression": "ga:RPC"
                }
              ],
              "dimensions": [
                {
                  "name": "ga:campaign"
                },
                {
                  "name": "ga:adDistributionNetwork"
                }
              ]
            },{
              "viewId": analytics.view_id,
              "dateRanges": [
                {
                  "startDate": fromDate,
                  "endDate": toDate
                }
              ],
              "metrics": [
                {
                  "expression": "ga:productDetailViews"
                },
                {
                  "expression": "ga:productAddsToCart"
                },
                {
                  "expression": "ga:productRemovesFromCart"
                },
                {
                  "expression": "ga:productCheckouts"
                },
                {
                  "expression": "ga:itemRevenue"
                },
                {
                  "expression": "ga:itemQuantity"
                },
                {
                  "expression": "ga:cartToDetailRate"
                },
                {
                  "expression": "ga:buyToDetailRate"
                }
              ],
              "dimensions": [
                {
                  "name": "ga:campaign"
                }
              ]
            }
          ]
        }
      }).then(function (response) {
        self.setState({
          adsData: response.result.reports[0].data.rows,
          revenue: response.result.reports[1].data.totals[0].values[5],
          adsDataTotals: response.result.reports[0].data.totals[0].values,
          adsEcommerce : response.result.reports[1].data.rows,
          loading : false
        })
      }, console.error.bind(console));
    });

  }

  //GET DATA FROM CHILD COMPONENT
  callbackFunction = (from, to) => {
    this.setState({
      fromDate: formatDate(from),
      toDate: formatDate(to),
      // loading: true
    }, () => { //CALL FUNCTION AFTER STATE IS UPDATED
      this.getData()
    });
  }

  googleLogedIn = (login) => {
    if (login) {
      this.setState({
        isSignedIn: true
      })
      this.getData()
    }
  }

  componentDidMount() {
    if(this.state.isSignedIn){
      window.gapi.load('client:auth2', _ => {
        this.getData()
      });
    }
  }

  render() {

    const classes = makeStyles(theme => ({
      root: {
        padding: theme.spacing(4)
      }
    }));
   
    const campaignData = this.state.adsData;
    const clicks = this.state.adsDataTotals[0];
    const impressions = this.state.adsDataTotals[1];
    const revenue = Number(this.state.revenue).toFixed(2) + currencySymbol;
    const cost = Math.round(Number(this.state.adsDataTotals[6])) + currencySymbol;
    const adsEcommerceData = this.state.adsEcommerce;

    return (
      <div className={classes.root}>
         {this.state.isSignedIn ? '' : <Google logedIn={this.googleLogedIn} isloged={this.state.isSignedIn} />}
        {/* TOP BAR */}
        <Grid container spacing={4} >
          <Grid item lg={6} sm={12} xl={6} xs={12}>
            <DatePicker parentCallback={this.callbackFunction} />
          </Grid>
        </Grid>
        {/* END TOP BAR */}

        <Card className={classes.root}>
          <CardHeader title="Total Metrics" />
          <Divider />
          <CardContent>
            <Grid container spacing={4} >
              <Grid container spacing={4} >
                <Grid item lg={3} sm={6} xl={2} xs={6} >
                  <Box title={'Clicks'} data={clicks} loading={this.state.loading}/>
                </Grid>
                <Grid item lg={3} sm={6} xl={2} xs={6} >
                  <Box title={'Imporessions'} data={impressions} loading={this.state.loading} />
                </Grid>
                <Grid item lg={3} sm={6} xl={2} xs={6} >
                  <Box title={'Revenue'} data={revenue} loading={this.state.loading} />
                </Grid>
                <Grid item lg={3} sm={6} xl={2} xs={6} >
                  <Box title={'Cost'} data={cost} loading={this.state.loading}/>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* CAMPAIGN SECTION */}
        <Card
          className={classes.root}>
          <CardHeader title="Active Campaigns Metrics Section" />
          <Divider />
          <CardContent>
            <Grid container spacing={4} >
              <Grid item lg={12} sm={12} xl={12} xs={12}>
                <AdsCampaign campaigndata={campaignData} loading={this.state.loading}/>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {/* END CAMPAIGN SECTION */}

        {/* CAMPAIGN SECTION */}
        <Card
          className={classes.root}>
          <CardHeader title="Active Campaigns Ecommerce Data" />
          <Divider />
          <CardContent>
            <Grid container spacing={4} >
              <Grid item lg={12} sm={12} xl={12} xs={12}>
                <Table tabledata={adsEcommerceData} loading={this.state.loading}/>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {/* END CAMPAIGN SECTION */}

      </div>
    );
  };
}



//https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet?apix_params=%7B"resource"%3A%7B"reportRequests"%3A%5B%7B"viewId"%3A"133587325"%2C"dateRanges"%3A%5B%7B"startDate"%3A"2020-01-15"%2C"endDate"%3A"2020-01-22"%7D%5D%2C"metrics"%3A%5B%7B"expression"%3A"ga%3Ausers"%7D%2C%7B"expression"%3A"ga%3Asessions"%7D%5D%2C"dimensions"%3A%5B%7B"name"%3A"ga%3Amedium"%7D%5D%7D%5D%7D%7D 
//https://developers.google.com/analytics/devguides/reporting/core/v4/samples
//https://ga-dev-tools.appspot.com/dimensions-metrics-explorer/



