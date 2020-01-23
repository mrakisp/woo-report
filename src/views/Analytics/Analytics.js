import React, { Component } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Typography, CardHeader, Divider } from '@material-ui/core';
import { analytics } from '../../Config';
import { formatDate } from "../../helpers/Utils";
import DatePicker from "../../helpers/Date";


import {
  Box,
} from './components';


export default class Analytics extends Component {

  constructor() {
    super();
    this.state = {
      analyticsData: [],
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
      // loading: true,
    };
  }

  googleSDK = () => {
    window['googleSDKLoaded'] = () => {
      window['gapi'].load('auth2', () => {
        this.auth2 = window['gapi'].auth2.init({
          client_id: '462148689287-omlkrm6phhnahdkr4vdqam352t3sujpn.apps.googleusercontent.com',
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
                  "name": "ga:source"
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
          analyticsData: response.result.reports[2].data.rows
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
    this.googleSDK();
    //LOAD GA API SCRIPT
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/client:platform.js";
    script.async = true;
    document.body.appendChild(script);
    //ONLOAD GA API SCRIPT AND AUTH CALL INIT
    script.onload = () => {
      window.gapi.load('client:auth2', _ => {
        this.getData()
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
    const avgSessionDuration = Math.round(this.state.avgSessionDuration * 0.0166666667) + 'min';
    const bounceRate = Math.round(this.state.bounceRate) + '%';

    const avgPageLoadTime = Number(this.state.avgPageLoadTime).toFixed(3) + ' sec';
    const avgDomainLookupTime = Number(this.state.avgDomainLookupTime).toFixed(3) + ' sec';
    const avgServerConnectionTime = Number(this.state.avgServerConnectionTime).toFixed(3) + ' sec';
    const avgServerResponseTime = Number(this.state.avgServerResponseTime).toFixed(3) + ' sec';
    const avgDomInteractiveTime = Number(this.state.avgDomInteractiveTime).toFixed(3) + ' sec';
    const avgDomContentLoadedTime = Number(this.state.avgDomContentLoadedTime).toFixed(3) + ' sec';

    const sourcesArray = this.state.analyticsData
    let fbvalue = 0
    let googlevalue = 0
    let instavalue = 0;
    let sources = [
      { label: 'facebook', value: this.state.fbval },
      { label: 'google', value: this.state.googleval },
      { label: 'instagram', value: this.state.instaval }
    ]
    if (sourcesArray.length > 0) {

      sourcesArray.forEach(element => {
        if (element.dimensions[0].includes('facebook') || element.dimensions[0].includes('Facebook')) {
          // debugger
          fbvalue += Number(element.metrics[0].values[0])
          sources[0].value = fbvalue;
        }
        else if (element.dimensions[0].includes('google') || element.dimensions[0].includes('Google')) {
          googlevalue += Number(element.metrics[0].values[0])
          sources[1].value = googlevalue;
        }
        else if (element.dimensions[0].includes('instagram') || element.dimensions[0].includes('Instagram')) {
          instavalue += Number(element.metrics[0].values[0])
          sources[2].value = instavalue;
        }
        else {
          sources.push({ label: element.dimensions[0], value: element.metrics[0].values[0] })
        }
      })
    }

    let sourcesf = sources.map((elem, i) => {
      return (
        <Grid key={i}
          item
          lg={2}
          sm={6}
          xl={3}
          xs={12}
        >
          <Box title={elem.label} data={elem.value} />
        </Grid>
      )
    })

    return (
      <div className={classes.root}>

        <DatePicker parentCallback={this.callbackFunction} />
        <button className="loginBtn loginBtn--google" ref="googleLoginBtn">
          Login with Google
        </button>
        <Card
          className={classes.root}>
          <CardHeader
            title="Sources"
          />
          <Divider />
          <CardContent>
            <Grid
              container
              spacing={4}
            >
              {sourcesf}

            </Grid>
          </CardContent>
        </Card>


        <Card
          className={classes.root}>
          <CardHeader
            title="Users Activity Section"
          />
          <Divider />
          <CardContent>
            <Grid
              container
              spacing={4}
            >
              <Grid
                item
                lg={2}
                sm={6}
                xl={3}
                xs={12}
              >
                <Box title={'All Visitors'} data={users} />
              </Grid>
              <Grid
                item
                lg={2}
                sm={6}
                xl={3}
                xs={12}
              >
                <Box title={'New Visitors'} data={newUsers} />
              </Grid>
              <Grid
                item
                lg={2}
                sm={6}
                xl={3}
                xs={12}
              >
                <Box title={'Returning Visitors'} data={users - newUsers} />
              </Grid>
              <Grid
                item
                lg={2}
                sm={6}
                xl={3}
                xs={12}
              >
                <Box title={'Sessions'} data={sessions} />
              </Grid>
              <Grid
                item
                lg={2}
                sm={6}
                xl={3}
                xs={12}
              >
                <Box title={'Avg Session Duration'} data={avgSessionDuration} />
              </Grid>
              <Grid
                item
                lg={2}
                sm={6}
                xl={3}
                xs={12}
              >
                <Box title={'Bounce Rate'} data={bounceRate} />
              </Grid>

            </Grid>
          </CardContent>
        </Card>

        <Card
          className={classes.root}>
          <CardHeader
            title="Store Performance Section"
          />
          <Divider />
          <CardContent>
            <Grid
              container
              spacing={4}
            >
              <Grid
                item
                lg={2}
                sm={6}
                xl={3}
                xs={12}
              >
                <Box title={'Avg Page Load'} data={avgPageLoadTime} />
              </Grid>
              <Grid
                item
                lg={2}
                sm={6}
                xl={3}
                xs={12}
              >
                <Box title={'Avg Domain LookUp'} data={avgDomainLookupTime} />
              </Grid>
              <Grid
                item
                lg={2}
                sm={6}
                xl={3}
                xs={12}
              >
                <Box title={'Avg Server Connection'} data={avgServerConnectionTime} />
              </Grid>
              <Grid
                item
                lg={2}
                sm={6}
                xl={3}
                xs={12}
              >
                <Box title={'Avg Server Response'} data={avgServerResponseTime} />
              </Grid>
              <Grid
                item
                lg={2}
                sm={6}
                xl={3}
                xs={12}
              >
                <Box title={'Avg Dom Interactive'} data={avgDomInteractiveTime} />
              </Grid>
              <Grid
                item
                lg={2}
                sm={6}
                xl={3}
                xs={12}
              >
                <Box title={'Avg Dom Content Load'} data={avgDomContentLoadedTime} />
              </Grid>

            </Grid>
          </CardContent>
        </Card>
      </div>
    );
  };
}



//https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet?apix_params=%7B"resource"%3A%7B"reportRequests"%3A%5B%7B"viewId"%3A"133587325"%2C"dateRanges"%3A%5B%7B"startDate"%3A"2020-01-15"%2C"endDate"%3A"2020-01-22"%7D%5D%2C"metrics"%3A%5B%7B"expression"%3A"ga%3Ausers"%7D%2C%7B"expression"%3A"ga%3Asessions"%7D%5D%2C"dimensions"%3A%5B%7B"name"%3A"ga%3Amedium"%7D%5D%7D%5D%7D%7D 
//https://developers.google.com/analytics/devguides/reporting/core/v4/samples
//https://ga-dev-tools.appspot.com/dimensions-metrics-explorer/



