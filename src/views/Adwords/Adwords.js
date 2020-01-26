import React, { Component } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Button, CardHeader, Divider } from '@material-ui/core';
import { analytics, currencySymbol  } from '../../Config';
import { formatDate } from "../../helpers/Utils";
import { DatePicker, Google } from "../../helpers";
import { AdsCampaign, UsersByDevice, Tabs } from './components';
import { Box } from '../Analytics/components';

export default class Adwords extends Component {

  constructor() {
    super();
    this.state = {
      isSignedIn: false,
      adsData: [],
      adsDataTotals: [],
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
            }
          ]
        }
      }).then(function (response) {
        self.setState({
          adsData: response.result.reports[0].data.rows,
          adsDataTotals: response.result.reports[0].data.totals[0].values
        })
      }, console.error.bind(console));
    });

  }

  //GET DATA FROM CHILD COMPONENT
  callbackFunction = (from, to) => {
    this.setState({
      fromDate: formatDate(from),
      toDate: formatDate(to),
      loading: true
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
    const roas = Number(this.state.adsDataTotals[3]).toFixed(2) +'%';
    const cost = Math.round(Number(this.state.adsDataTotals[6])) + currencySymbol;
    // const bounceRate = Math.round(this.state.bounceRate) + '%';

    // const avgPageLoadTime = Number(this.state.avgPageLoadTime).toFixed(3) + ' sec';
    // const avgDomainLookupTime = Number(this.state.avgDomainLookupTime).toFixed(3) + ' sec';
    // const avgServerConnectionTime = Number(this.state.avgServerConnectionTime).toFixed(3) + ' sec';
    // const avgServerResponseTime = Number(this.state.avgServerResponseTime).toFixed(3) + ' sec';
    // const avgDomInteractiveTime = Number(this.state.avgDomInteractiveTime).toFixed(3) + ' sec';
    // const avgDomContentLoadedTime = Number(this.state.avgDomContentLoadedTime).toFixed(3) + ' sec';
    
    // const devicesarray = this.state.devicesData;
    // const agearray = this.state.ageData

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

        <Card
          className={classes.root}>
          <CardHeader title="Total Metrics" />
          <Divider />
          <CardContent>
            <Grid container spacing={4} >
              <Grid container spacing={4} >
                <Grid item lg={3} sm={6} xl={2} xs={6} >
                  <Box title={'Clicks'} data={clicks} />
                </Grid>
                <Grid item lg={3} sm={6} xl={2} xs={6} >
                  <Box title={'Imporessions'} data={impressions} />
                </Grid>
                <Grid item lg={3} sm={6} xl={2} xs={6} >
                  <Box title={'Roas'} data={roas} />
                </Grid>
                <Grid item lg={3} sm={6} xl={2} xs={6} >
                  <Box title={'Cost'} data={cost} />
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
                <AdsCampaign campaigndata={campaignData} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {/* END CAMPAIGN SECTION */}


        {/* PERFORMANCE SECTION */}
        <Card className={classes.root}>
          <CardHeader  title="Store Performance Section" />
          <Divider />
          <CardContent>
            <Grid container spacing={4} >
              <Grid item lg={2} sm={6} xl={3} xs={12} >
                {/* <Box title={'Avg Page Load'} data={avgPageLoadTime} /> */}
              </Grid>
              <Grid item lg={2} sm={6} xl={3} xs={12} >
                {/* <Box title={'Avg Domain LookUp'} data={avgDomainLookupTime} /> */}
              </Grid>
              <Grid item lg={2} sm={6} xl={3} xs={12} >
                {/* <Box title={'Avg Server Connection'} data={avgServerConnectionTime} /> */}
              </Grid>
              <Grid item lg={2} sm={6} xl={3} xs={12} >
                {/* <Box title={'Avg Server Response'} data={avgServerResponseTime} /> */}
              </Grid>
              <Grid item lg={2} sm={6} xl={3} xs={12} >
                {/* <Box title={'Avg Dom Interactive'} data={avgDomInteractiveTime} /> */}
              </Grid>
              <Grid item lg={2} sm={6} xl={3} xs={12} >
                {/* <Box title={'Avg Dom Content Load'} data={avgDomContentLoadedTime} /> */}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {/* END PERFORMANCE SECTION */}
      </div>
    );
  };
}



//https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet?apix_params=%7B"resource"%3A%7B"reportRequests"%3A%5B%7B"viewId"%3A"133587325"%2C"dateRanges"%3A%5B%7B"startDate"%3A"2020-01-15"%2C"endDate"%3A"2020-01-22"%7D%5D%2C"metrics"%3A%5B%7B"expression"%3A"ga%3Ausers"%7D%2C%7B"expression"%3A"ga%3Asessions"%7D%5D%2C"dimensions"%3A%5B%7B"name"%3A"ga%3Amedium"%7D%5D%7D%5D%7D%7D 
//https://developers.google.com/analytics/devguides/reporting/core/v4/samples
//https://ga-dev-tools.appspot.com/dimensions-metrics-explorer/



