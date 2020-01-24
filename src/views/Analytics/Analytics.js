import React, { Component } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Button, CardHeader, Divider } from '@material-ui/core';
import { analytics } from '../../Config';
import { formatDate } from "../../helpers/Utils";
import DatePicker from "../../helpers/Date";
import { Google as GoogleIcon } from 'icons';
import { Box, GaSources, UsersByDevice, Tabs } from './components';

export default class Analytics extends Component {

  constructor() {
    super();
    this.state = {
      sourcesData: [],
      devicesData: [],
      ageData: [],
      users: 0,
      newUsers: 0,
      sessions: 0,
      avgSessionDuration: 0,
      bounceRate: 0,
      avgPageLoadTime: 0,
      avgDomainLookupTime: 0,
      avgServerConnectionTime: 0,
      avgServerResponseTime: 0,
      avgDomInteractiveTime: 0,
      avgDomContentLoadedTime: 0,
      fromDate: formatDate(new Date()),
      toDate: formatDate(new Date()),
    };
  }

  googleSDK = () => {
    window['googleSDKLoaded'] = () => {
      window['gapi'].load('auth2', () => {
        this.auth2 = window['gapi'].auth2.init({
          client_id:  analytics.client_id,
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
                  "expression": "ga:users"
                },
                {
                  "expression": "ga:newUsers"
                },
                {
                  "expression": "ga:sessions"
                },
                {
                  "expression": "ga:avgSessionDuration"
                },
                {
                  "expression": "ga:bounceRate"
                }
              ]
            },
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
                  "expression": "ga:avgPageLoadTime"
                },
                {
                  "expression": "ga:avgDomainLookupTime"
                },
                {
                  "expression": "ga:avgServerConnectionTime"
                },
                {
                  "expression": "ga:avgServerResponseTime"
                },
                {
                  "expression": "ga:avgDomInteractiveTime"
                },
                {
                  "expression": "ga:avgDomContentLoadedTime"
                }

              ]
            }, {
              "viewId": analytics.view_id,
              "dateRanges": [
                {
                  "startDate": fromDate,
                  "endDate": toDate
                }
              ],
              "metrics": [
                {
                  "expression": "ga:users"
                }
              ],
              "dimensions": [
                {
                  "name": "ga:sourceMedium"
                }
              ]
            },
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
                  "expression": "ga:users"
                }
              ],
              "dimensions": [
                {
                  "name": "ga:deviceCategory"
                }
              ]
            },
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
                  "expression": "ga:users"
                }
              ],
              "dimensions": [
                {
                  "name": "ga:userAgeBracket"
                }
              ]
            }
          ]

        }
      }).then(function (response) {
        self.setState({
          users: response.result.reports[0].data.totals[0].values[0],
          newUsers: response.result.reports[0].data.totals[0].values[1],
          sessions: response.result.reports[0].data.totals[0].values[2],
          avgSessionDuration: response.result.reports[0].data.totals[0].values[3],
          bounceRate: response.result.reports[0].data.totals[0].values[4],
          avgPageLoadTime: response.result.reports[1].data.totals[0].values[0],
          avgDomainLookupTime: response.result.reports[1].data.totals[0].values[1],
          avgServerConnectionTime: response.result.reports[1].data.totals[0].values[2],
          avgServerResponseTime: response.result.reports[1].data.totals[0].values[3],
          avgDomInteractiveTime: response.result.reports[1].data.totals[0].values[4],
          avgDomContentLoadedTime: response.result.reports[1].data.totals[0].values[5],
          sourcesData: response.result.reports[2].data.rows,
          devicesData: response.result.reports[3].data.rows,
          ageData: response.result.reports[4].data.rows
        })

        //let formattedJson = JSON.stringify(response.result, null, 2)
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

    const users = this.state.users;
    const newUsers = this.state.newUsers;
    const sessions = this.state.sessions;
    const avgSessionDuration = Math.round(this.state.avgSessionDuration * 0.0166666667) + ' min';
    const bounceRate = Math.round(this.state.bounceRate) + '%';

    const avgPageLoadTime = Number(this.state.avgPageLoadTime).toFixed(3) + ' sec';
    const avgDomainLookupTime = Number(this.state.avgDomainLookupTime).toFixed(3) + ' sec';
    const avgServerConnectionTime = Number(this.state.avgServerConnectionTime).toFixed(3) + ' sec';
    const avgServerResponseTime = Number(this.state.avgServerResponseTime).toFixed(3) + ' sec';
    const avgDomInteractiveTime = Number(this.state.avgDomInteractiveTime).toFixed(3) + ' sec';
    const avgDomContentLoadedTime = Number(this.state.avgDomContentLoadedTime).toFixed(3) + ' sec';
    const sourcesarray = this.state.sourcesData;
    const devicesarray = this.state.devicesData;
    const agearray = this.state.ageData

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
        
        {/* USERS SECTION */}
        <Card
          className={classes.root}>
          <CardHeader
            title="Visitors Activity Section"
          />
          <Divider />
          <CardContent>
            <Grid container spacing={4} >
              <Grid item lg={8} sm={6} xl={9} xs={12}>
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
                  <Divider />
                   {/* SOURCES SECTION */}
                  <Card className={classes.root}>
                    <CardHeader title="Traffic Sources"/>
                    <Divider />
                    <CardContent>
                        <GaSources sourcesarray={sourcesarray}/>
                    </CardContent>
                  </Card>
                  {/* END SOURCES SECTION */}
              </Grid>
              {/* DEVICES SECTION */}
              <Grid item lg={4} sm={6} xl={3} xs={12}> 
                <Tabs devicesarray={devicesarray} agearray={agearray}/>
                {/* <UsersByDevice devicesarray={devicesarray}/> */}
              </Grid> 
               {/* END DEVICES SECTION */}
            </Grid>
          </CardContent>
        </Card>
        {/* END USERS SECTION */}
        

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
                <Box title={'Avg Page Load'} data={avgPageLoadTime} />
              </Grid>
              <Grid item lg={2} sm={6} xl={3} xs={12} >
                <Box title={'Avg Domain LookUp'} data={avgDomainLookupTime} />
              </Grid>
              <Grid item lg={2} sm={6} xl={3} xs={12} >
                <Box title={'Avg Server Connection'} data={avgServerConnectionTime} />
              </Grid>
              <Grid item lg={2} sm={6} xl={3} xs={12} >
                <Box title={'Avg Server Response'} data={avgServerResponseTime} />
              </Grid>
              <Grid item lg={2} sm={6} xl={3} xs={12} >
                <Box title={'Avg Dom Interactive'} data={avgDomInteractiveTime} />
              </Grid>
              <Grid item lg={2} sm={6} xl={3} xs={12} >
                <Box title={'Avg Dom Content Load'} data={avgDomContentLoadedTime} />
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



