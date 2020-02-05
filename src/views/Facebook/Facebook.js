import React, { Component } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Button, CardHeader, Divider } from '@material-ui/core';
import { currencySymbol  } from '../../Config';
import { formatDate } from "../../helpers/Utils";
import { DatePicker } from "../../helpers";
// import { AdsCampaign, UsersByDevice, Tabs, Table } from './components';
// import { Box } from '../Analytics/components';

export default class Facebook extends Component {

  state = {
    fbCampaigns : [],
    fromDate : formatDate(new Date()),
    toDate : formatDate(new Date()),
    loading: true,
  };

  getData = () => {

    //DATE
    const self = this;
    const fromDate = this.state.fromDate;
    const toDate = this.state.toDate;

     window.fbAsyncInit = function() {
        window.FB.init({
          appId      : '519580525465323',
          xfbml      : true,
          version    : 'v6.0'
        });
        // FB.AppEvents.logPageView();


        //GET ACCOUNT DATA
        window.FB.api(
          '/act_108444649307331/insights?access_token=EAAHYjkSnDusBAPELxGyLRCOfxZBKEuUwqVWserTUPMT5fLZCwj41m62lSzsH2ZAqDQT2YHP7DdI4plccA9CMQzKCBZCxpbSL1FVZAkfjeSxR66tCm4wxpayeNwxPO07EsNNwlb3tdUd7fLVJpr4rBzLSYx161RgvH87IF5n2S6PtQ0mWxaE6I',
          'GET',
           {"fields":"social_spend,clicks,quality_ranking,purchase_roas,cpc,ctr,cpm,spend,reach,frequency","level":"account","time_range":{"since":"2020-02-04","until":"2020-02-05"}},
          function(response) {
              // Insert your code here
          }
        );
        
        //GET CAMPAIGN DATA
        window.FB.api(
          '/act_108444649307331/campaigns?access_token=EAAHYjkSnDusBAPELxGyLRCOfxZBKEuUwqVWserTUPMT5fLZCwj41m62lSzsH2ZAqDQT2YHP7DdI4plccA9CMQzKCBZCxpbSL1FVZAkfjeSxR66tCm4wxpayeNwxPO07EsNNwlb3tdUd7fLVJpr4rBzLSYx161RgvH87IF5n2S6PtQ0mWxaE6I',
          'GET',
          {"summary":"insights","fields":"effective_status,name,objective","time_range":{"since":"2020-02-05","until":"2020-02-05"}},
          function(response) {
            debugger;
            self.setState({
              fbCampaigns : response.data
            }, () => { 
              debugger;//GET ADS DATA
                window.FB.api(
                '/6151162695307/insights?access_token=EAAHYjkSnDusBAPELxGyLRCOfxZBKEuUwqVWserTUPMT5fLZCwj41m62lSzsH2ZAqDQT2YHP7DdI4plccA9CMQzKCBZCxpbSL1FVZAkfjeSxR66tCm4wxpayeNwxPO07EsNNwlb3tdUd7fLVJpr4rBzLSYx161RgvH87IF5n2S6PtQ0mWxaE6I',
                'GET',
                {"fields":"quality_ranking,purchase_roas,cpc,ctr,cpm,spend,reach,objective,frequency"},
                function(response) {
                    // Insert your code here
                     debugger;
                }
              );
            });
          }
        );

        
        // window.FB.api(
        //   '/6151162695307/insights?access_token=EAAHYjkSnDusBAPELxGyLRCOfxZBKEuUwqVWserTUPMT5fLZCwj41m62lSzsH2ZAqDQT2YHP7DdI4plccA9CMQzKCBZCxpbSL1FVZAkfjeSxR66tCm4wxpayeNwxPO07EsNNwlb3tdUd7fLVJpr4rBzLSYx161RgvH87IF5n2S6PtQ0mWxaE6I',
        //   'GET',
        //   {"fields":"campaign_name"},
        //   function(response) {
        //       // Insert your code here
        //       debugger;
        //   }
        // );

        // 
        // FB.api(
        //   '/6151162695307/insights',
        //   'GET',
        //   {"fields":"quality_ranking,purchase_roas,cpc,ctr,cpm,spend,reach,objective,frequency"},
        //   function(response) {
        //       // Insert your code here
        //   }
        // );
        // FB.api(
        //   '/act_108444649307331/campaigns',
        //   'GET',
        //   {"summary":"insights","fields":"campaign_name"},
        //   function(response) {
        //       // Insert your code here
        //   }
        // );
        //   FB.api(
        //   '/act_108444649307331/insights',
        //   'GET',
        //   {"fields":"spend,reach","level":"account","date_preset":"yesterday"},
        //   function(response) {
        //       // Insert your code here
        //   }
        // );

       

      };

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

  componentDidMount() {
   this.getData()
  }

  render() {

    const classes = makeStyles(theme => ({
      root: {
        padding: theme.spacing(4)
      }
    }));
   
    // const campaignData = this.state.adsData;
    // const clicks = this.state.adsDataTotals[0];
    // const impressions = this.state.adsDataTotals[1];
    // const revenue = Number(this.state.revenue).toFixed(2) + currencySymbol;
    // const cost = Math.round(Number(this.state.adsDataTotals[6])) + currencySymbol;
    // const adsEcommerceData = this.state.adsEcommerce;

    return (
      <div className={classes.root}>
        
        {/* TOP BAR */}
        <Grid container spacing={4} >
          <Grid item lg={6} sm={12} xl={6} xs={12}>
            <DatePicker parentCallback={this.callbackFunction} />
          </Grid>
        </Grid>
        {/* END TOP BAR */}

        {/* <Card className={classes.root}>
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
        </Card> */}

        {/* CAMPAIGN SECTION */}
        {/* <Card
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
        </Card> */}
        {/* END CAMPAIGN SECTION */}

        {/* CAMPAIGN SECTION */}
        {/* <Card
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
        </Card> */}
        {/* END CAMPAIGN SECTION */}

      </div>
    );
  };
}



//https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet?apix_params=%7B"resource"%3A%7B"reportRequests"%3A%5B%7B"viewId"%3A"133587325"%2C"dateRanges"%3A%5B%7B"startDate"%3A"2020-01-15"%2C"endDate"%3A"2020-01-22"%7D%5D%2C"metrics"%3A%5B%7B"expression"%3A"ga%3Ausers"%7D%2C%7B"expression"%3A"ga%3Asessions"%7D%5D%2C"dimensions"%3A%5B%7B"name"%3A"ga%3Amedium"%7D%5D%7D%5D%7D%7D 
//https://developers.google.com/analytics/devguides/reporting/core/v4/samples
//https://ga-dev-tools.appspot.com/dimensions-metrics-explorer/



