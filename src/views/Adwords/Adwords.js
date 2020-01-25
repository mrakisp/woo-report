import React, { Component } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Button, CardHeader, Divider } from '@material-ui/core';
import { analytics } from '../../Config';
import { formatDate } from "../../helpers/Utils";
import DatePicker from "../../helpers/Date";
import { Google as GoogleIcon } from 'icons';
import { Box, AdsCampaign, UsersByDevice, Tabs } from './components';

export default class Adwords extends Component {

  constructor() {
    super();
    this.state = {
      adsData: [],
      fromDate: formatDate(new Date()),
      toDate: formatDate(new Date()),
    };
  }

  googleSDK = () => {
    window['googleSDKLoaded'] = () => {
      window['gapi'].load('auth2', () => {
        this.auth2 = window['gapi'].auth2.init({
          client_id: analytics.client_id,
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        });
        this.prepareLoginButton();
      });
    }

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'google-jssdk'));

  }

  prepareLoginButton = () => {
    this.auth2.attachClickHandler(this.refs.googleLoginBtn, {},
      (googleUser) => {
        let profile = googleUser.getBasicProfile();
      }, (error) => {
        alert(JSON.stringify(error, undefined, 2));
      });
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
          adsData: response.result.reports[0].data.rows
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

  componentDidMount() {
    //this.googleSDK();
    //LOAD GA API SCRIPT
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/client:platform.js";
    script.async = true;
    document.body.appendChild(script);
    //ONLOAD GA API SCRIPT AND AUTH CALL INIT
    script.onload = () => {
      window.gapi.load('client:auth2', _ => {
        this.getData()
        this.googleSDK();
      });
    };
  }

  render() {

    const classes = makeStyles(theme => ({
      root: {
        padding: theme.spacing(4)
      }
    }));

    // const users = this.state.users;
    // const newUsers = this.state.newUsers;
    // const sessions = this.state.sessions;
    // const avgSessionDuration = Math.round(this.state.avgSessionDuration * 0.0166666667) + ' min';
    // const bounceRate = Math.round(this.state.bounceRate) + '%';

    // const avgPageLoadTime = Number(this.state.avgPageLoadTime).toFixed(3) + ' sec';
    // const avgDomainLookupTime = Number(this.state.avgDomainLookupTime).toFixed(3) + ' sec';
    // const avgServerConnectionTime = Number(this.state.avgServerConnectionTime).toFixed(3) + ' sec';
    // const avgServerResponseTime = Number(this.state.avgServerResponseTime).toFixed(3) + ' sec';
    // const avgDomInteractiveTime = Number(this.state.avgDomInteractiveTime).toFixed(3) + ' sec';
    // const avgDomContentLoadedTime = Number(this.state.avgDomContentLoadedTime).toFixed(3) + ' sec';
    const campaignData = this.state.adsData;
    // const devicesarray = this.state.devicesData;
    // const agearray = this.state.ageData

    return (
      <div className={classes.root}>

        {/* TOP BAR */}
        <Grid container spacing={4} >
          <Grid item lg={6} sm={12} xl={6} xs={12}>
            <DatePicker parentCallback={this.callbackFunction} />
          </Grid>
          <Grid item lg={6} sm={12} xl={6} xs={12}>
            <Button size="large" variant="contained">
              <GoogleIcon className="loginBtn loginBtn--google" ref="googleLoginBtn" />
              {/* <GoogleIcon className="loginBtn loginBtn--google" /> */}
              Login with Google
              </Button>
          </Grid>
        </Grid>
        {/* END TOP BAR */}

        {/* <Card
          className={classes.root}>
          <CardHeader title="Active Campaigns Metrics Section" />
          <Divider />
          <CardContent>
            <Grid container spacing={4} >
              <Grid container spacing={4} >
                <Grid item lg={3} sm={6} xl={2} xs={6} >
                  <Box title={'All Visitors'} data={users} />
                </Grid>
                <Grid item lg={3} sm={6} xl={2} xs={6} >
                  <Box title={'New Visitors'} data={newUsers} />
                </Grid>
                <Grid item lg={3} sm={6} xl={2} xs={6} >
                  <Box title={'Returning Visitors'} data={users - newUsers} />
                </Grid>
                <Grid item lg={3} sm={6} xl={2} xs={6} >
                  <Box title={'Sessions'} data={sessions} />
                </Grid>
                <Grid item lg={3} sm={6} xl={2} xs={6} >
                  <Box title={'Avg Session Duration'} data={avgSessionDuration} />
                </Grid>
                <Grid item lg={3} sm={6} xl={2} xs={6} >
                  <Box title={'Bounce Rate'} data={bounceRate} />
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card> */}

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
        <Card
          className={classes.root}>
          <CardHeader
            title="Store Performance Section"
          />
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



