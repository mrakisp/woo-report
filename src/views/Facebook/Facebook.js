import React, { Component } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Button, CardHeader, Divider } from '@material-ui/core';
import { currencySymbol  } from '../../Config';
import { formatDate } from "../../helpers/Utils";
import { DatePicker } from "../../helpers";
import { AdsCampaign, UsersByDevice, Tabs, Table } from './components';
import { Box } from '../Analytics/components';

export default class Facebook extends Component {

  state = {
    fbTotals : [],
    fbCampaigns : [],
    allActiveCampaigns : [],
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
           {"fields":"action_values,clicks,impressions,purchase_roas,cpc,ctr,cpm,spend,reach,frequency","level":"account","time_range":{"since":fromDate,"until":toDate}},
          function(response) {
            self.setState({
              fbTotals: response.data[0],
              loading : false
            })
          }
        );
        
        //GET CAMPAIGN DATA
        window.FB.api(
          '/act_108444649307331/campaigns?access_token=EAAHYjkSnDusBAPELxGyLRCOfxZBKEuUwqVWserTUPMT5fLZCwj41m62lSzsH2ZAqDQT2YHP7DdI4plccA9CMQzKCBZCxpbSL1FVZAkfjeSxR66tCm4wxpayeNwxPO07EsNNwlb3tdUd7fLVJpr4rBzLSYx161RgvH87IF5n2S6PtQ0mWxaE6I',
          'GET',
          {"summary":"insights","fields":"effective_status,name,objective"},
          function(response) {
            self.setState({
              fbCampaigns : response.data,
            } , () => { 

              // debugger;//GET ADS DATA
              const activeCampaigns = self.state.fbCampaigns.filter(function(active) {
                return active.effective_status == "ACTIVE";
              });
              let allActiveCampaigns = [];
              
              activeCampaigns.forEach( function (element, index) {
                  window.FB.api(
                    '/'+element.id+'/insights?access_token=EAAHYjkSnDusBAPELxGyLRCOfxZBKEuUwqVWserTUPMT5fLZCwj41m62lSzsH2ZAqDQT2YHP7DdI4plccA9CMQzKCBZCxpbSL1FVZAkfjeSxR66tCm4wxpayeNwxPO07EsNNwlb3tdUd7fLVJpr4rBzLSYx161RgvH87IF5n2S6PtQ0mWxaE6I',
                    'GET',
                    {"fields":"campaign_name,clicks,impressions,action_values,quality_ranking,purchase_roas,cpc,ctr,cpm,spend,reach,objective,frequency","time_range":{"since":fromDate,"until":toDate}},
                    function(response) {
                        // Insert your code here
                        allActiveCampaigns.push(response.data[0])
                        // debugger;
                        if(index == activeCampaigns.length-1){
                          self.setState({
                            allActiveCampaigns : allActiveCampaigns
                          }); 
                        }
                    }
                  );
              })

              
                
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
   
    const fbData = this.state.fbTotals;
    const clicks = this.state.fbTotals.clicks;
    const impressions = this.state.fbTotals.impressions;
    const revenue = fbData.action_values ? Number( this.state.fbTotals.action_values[5].value).toFixed(2) + currencySymbol : '';
    const cost = Math.round(Number(this.state.fbTotals.spend)) + currencySymbol;
    const roas = fbData.purchase_roas ? Number(this.state.fbTotals.purchase_roas[0].value).toFixed(2) + '%' : '';
    const addToCart = fbData.action_values ? Number( this.state.fbTotals.action_values[3].value).toFixed(2) + currencySymbol : '';
    const initiated_checkout = fbData.action_values ? Number( this.state.fbTotals.action_values[2].value).toFixed(2) + currencySymbol : '';
    const cpc = this.state.fbTotals.cpc + currencySymbol;
    const ctr = this.state.fbTotals.ctr + '%';
    const cpm = this.state.fbTotals.cpm ;
    const reach = this.state.fbTotals.reach;
    const frequency = this.state.fbTotals.frequency;
    const allCampaigns = this.state.fbCampaigns;
    const activeCampaigns = allCampaigns.filter(function(active) {
      return active.effective_status == "ACTIVE";
    });
    let allActiveCampaigns = this.state.allActiveCampaigns;
    debugger;
    return (
      <div className={classes.root}>
        {/* {allActiveCampaigns} */}
        {/* TOP BAR */}
        <Grid container spacing={4} >
          <Grid item lg={6} sm={12} xl={6} xs={12}>
            <DatePicker parentCallback={this.callbackFunction} />
          </Grid>
        </Grid>
        {/* END TOP BAR */}

        <Card className={classes.root}>
          <CardHeader title="Total Facebook Campatings Metrics" />
          <Divider />
          <CardContent>
            <Grid container spacing={4} >
              <Grid container spacing={4} >
                <Grid item lg={2} sm={6} xl={2} xs={6} >
                  <Box title={'Clicks'} data={clicks} loading={this.state.loading}/>
                </Grid>
                <Grid item lg={2} sm={6} xl={2} xs={6} >
                  <Box title={'Reach'} data={reach} loading={this.state.loading} />
                </Grid>
                <Grid item lg={2} sm={6} xl={2} xs={6} >
                  <Box title={'Impressions'} data={impressions} loading={this.state.loading} />
                </Grid>
                <Grid item lg={2} sm={6} xl={2} xs={6} >
                  <Box title={'CPM'} data={cpm} loading={this.state.loading} />
                </Grid>
                <Grid item lg={2} sm={6} xl={2} xs={6} >
                  <Box title={'Frequency'} data={frequency} loading={this.state.loading} />
                </Grid>
                <Grid item lg={2} sm={6} xl={2} xs={6} >
                  <Box title={'CPC'} data={cpc} loading={this.state.loading} />
                </Grid>
                <Grid item lg={2} sm={6} xl={2} xs={6} >
                  <Box title={'CTR'} data={ctr} loading={this.state.loading} />
                </Grid>
                <Grid item lg={2} sm={6} xl={2} xs={6} >
                  <Box title={'Add To Cart'} data={addToCart} loading={this.state.loading}/>
                </Grid>
                <Grid item lg={2} sm={6} xl={2} xs={6} >
                  <Box title={'Checkout Process'} data={initiated_checkout} loading={this.state.loading}/>
                </Grid>
                <Grid item lg={2} sm={6} xl={2} xs={6} >
                  <Box title={'Revenue'} data={revenue} loading={this.state.loading} />
                </Grid>
                <Grid item lg={2} sm={6} xl={2} xs={6} >
                  <Box title={'Cost'} data={cost} loading={this.state.loading}/>
                </Grid>
                <Grid item lg={2} sm={6} xl={2} xs={6} >
                  <Box title={'Roas'} data={roas} loading={this.state.loading}/>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* CAMPAIGN SECTION */}
        {/* <Card
          className={classes.root}>
          <CardHeader title="Active Campaigns Metrics Section" />
          <Divider />
          <CardContent>
            <Grid container spacing={4} >
              <Grid item lg={12} sm={12} xl={12} xs={12}>
                <AdsCampaign campaigndata={activeCampaigns}/>
              </Grid>
            </Grid>
          </CardContent>
        </Card> */}
        {/* END CAMPAIGN SECTION */}

        {/* CAMPAIGN SECTION */}
        <Card
          className={classes.root}>
          <CardHeader title="Active Campaigns Ecommerce Data" />
          <Divider />
          <CardContent>
            <Grid container spacing={4} >
              <Grid item lg={12} sm={12} xl={12} xs={12}>
                <Table tabledata={allActiveCampaigns} loading={this.state.loading}/>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {/* END CAMPAIGN SECTION */}

      </div>
    );
  };
}



//https://developers.facebook.com/docs/marketing-api/reference/ad-account/insights/
//https://developers.facebook.com/tools/explorer/519580525465323/?method=GET&path=act_108444649307331%2Finsights%3Ffields%3Daction_values%2Cimpressions%2Cclicks%2Cpurchase_roas%2Ccpc%2Cctr%2Ccpm%2Cspend%2Creach%2Cfrequency%26level%3Daccount%26time_range[since]%3D2020-02-04%26time_range[until]%3D2020-02-05&version=v6.0
//https://developers.facebook.com/tools/explorer/519580525465323/?method=GET&path=act_108444649307331%2Fcampaigns%3Fsummary%3Dinsights%26fields%3Deffective_status%2Cname%2Cobjective&version=v6.0
//https://developers.facebook.com/tools/explorer/519580525465323/?method=GET&path=6151162695307%2Finsights%3Ffields%3Daction_values%2Cquality_ranking%2Cpurchase_roas%2Ccpc%2Cctr%2Ccpm%2Cspend%2Creach%2Cobjective%2Cfrequency&version=v6.0
//https://developers.facebook.com/tools/explorer/519580525465323/?method=GET&path=6151162695307%2Finsights%3Ffields%3Dcampaign_name&version=v6.0
