import React, { Component } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Button, CardHeader, Divider } from '@material-ui/core';
import { currencySymbol, facebookApi  } from '../../Config';
import { formatDate } from "../../helpers/Utils";
import { DatePicker } from "../../helpers";
import { Table } from './components';
import { Box } from '../Analytics/components';

export default class Facebook extends Component {

  state = {
    fbTotals : [],
    fbCampaigns : [],
    allActiveCampaigns : [],
    ads : [],
    fromDate : formatDate(new Date()),
    toDate : formatDate(new Date()),
    loading: true,
  };

  

  getDataAds = (campaign_id) => {

    const self = this;
    const fromDate = this.state.fromDate;
    const toDate = this.state.toDate;

    window.FB.api(
      '/'+campaign_id+'/insights?access_token='+facebookApi.access_token,
      'GET',
      {"fields":"campaign_id,ad_id,ad_name,action_values,clicks,impressions,purchase_roas,cpc,ctr,cpm,spend,reach,frequency","time_range":{"since":fromDate,"until":toDate},"level":"ad"},
      function(response) {
        self.collectAds(response.data.length > 0 ? response.data : [])
      }
    );
  }

  collectAds = (ads) => {
    let allAds = [];
    if(this.state.ads.length > 0){
      allAds = this.state.ads;

      ads.forEach( function (element, index) {

         if(allAds.findIndex(x => x.ad_id === element.ad_id) > -1){  //CHECK IF VALUES EXISTS AND REPLACE WITH LAST ONE
           allAds[allAds.findIndex(x => x.ad_id === element.ad_id)] = element
         }else{ //IF VALUES ARE NEW ONES PUSH IT
           allAds.push(element)
         }
      })
    }else{
      allAds = ads;
    }

    this.setState({
      ads: allAds,
    })
  }

  getData = () => {

    //DATE
    const self = this;
    const fromDate = this.state.fromDate;
    const toDate = this.state.toDate;

    //GET ACCOUNT DATA
    window.FB.api(
       '/act_'+facebookApi.account_id+'/insights?access_token='+facebookApi.access_token,
       'GET',
       {"fields":"action_values,clicks,impressions,purchase_roas,cpc,ctr,cpm,spend,reach,frequency","level":"account","time_range":{"since":fromDate,"until":toDate}},
       function(response) {
          self.setState({
            fbTotals: response.data.length > 0 ? response.data[0] : [],
            loading : false
          })
        }
    );
        
    //GET CAMPAIGN DATA
    window.FB.api(
       '/act_'+facebookApi.account_id+'/insights?access_token='+facebookApi.access_token,
       'GET',
       {"level":"campaign","fields":"campaign_name,reach,clicks,impressions,action_values,quality_ranking,purchase_roas,cpc,ctr,cpm,spend,objective,frequency,campaign_id","time_range":{"since":fromDate,"until":toDate}},
          function(response) {
            // Insert your code here
            self.setState({
                fbCampaigns : response.data
            })
        }
    );

    // FB.api(
    //   '/'+facebookApi.account_id+'/campaigns'+facebookApi.access_token,
    //   'GET',
    //   {"summary":"insights","fields":"effective_status,name,objective"},
    //   function(response) {
    //       // Insert your code here
    //   }
    // );
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

  callbackFunctionService = (campaign_id) => {
    this.getDataAds(campaign_id);
  }

  

  loadFbLoginApi() {

    const self = this;
    window.fbAsyncInit = function() {
      
      window.FB.init({
        appId      : facebookApi.app_id,
        xfbml      : true,
        version    : facebookApi.app_version
      });
      self.getData()
    }

    // Load the SDK asynchronously
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
}

  componentDidMount() {
    this.loadFbLoginApi();
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
    const finalRevenue = fbData && fbData.action_values && fbData.action_values.length > 0 ? fbData.action_values.find(x => x.action_type  === 'offsite_conversion.fb_pixel_purchase') : ''
    const revenue = finalRevenue ? Number( finalRevenue.value).toFixed(2) + currencySymbol : '0'+ currencySymbol;
    const cost = Math.round(Number(this.state.fbTotals.spend)) + currencySymbol;
    const roas = fbData.purchase_roas ? Number(fbData.purchase_roas[0].value).toFixed(2) + '' : '0';
    const finaladdToCart = fbData && fbData.action_values && fbData.action_values.length > 0 ? fbData.action_values.find(x => x.action_type  === 'offsite_conversion.fb_pixel_add_to_cart') : ''
    const addToCart = finaladdToCart ? Number( finaladdToCart.value).toFixed(2) + currencySymbol : '0' + currencySymbol;
    const finalinitiated_checkout = fbData && fbData.action_values && fbData.action_values.length > 0 ? fbData.action_values.find(x => x.action_type  === 'offsite_conversion.fb_pixel_initiate_checkout') : ''
    const initiated_checkout = finalinitiated_checkout ? Number( finalinitiated_checkout.value).toFixed(2) + currencySymbol : '0'+ currencySymbol;
    const cpc = this.state.fbTotals.cpc + currencySymbol;
    const ctr = this.state.fbTotals.ctr + '%';
    const cpm = this.state.fbTotals.cpm ;
    const reach = this.state.fbTotals.reach;
    const frequency = this.state.fbTotals.frequency;
    const allCampaigns = this.state.fbCampaigns;
    const ads = this.state.ads;
  
    return (
      <div className={classes.root}>
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
        <Card className={classes.root}>
          <CardHeader title="Active Campaigns" />
          <Divider />
          <CardContent>
            <Grid container spacing={4} >
              <Grid item lg={12} sm={12} xl={12} xs={12}>
                <Table ads={ads} tabledata={allCampaigns} parentCallbackData={this.callbackFunctionService}/>
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

// https://developers.facebook.com/tools/explorer/?method=GET&path=loveshoesgreece%2F%3Ffields%3Dinsights.metric(page_fans_online)&version=v6.0