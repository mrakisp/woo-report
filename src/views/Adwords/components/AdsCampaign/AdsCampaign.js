import React, { Component }  from 'react';
import { Grid } from '@material-ui/core';
import {Box} from '..';
import {  currencySymbol, AdwordsCampatingsGoal } from '../../../../Config';

export default class AdsCampaign extends Component {
  render() {

    const data = this.props.campaigndata
    const metricsTitle = ['CLICKS','IMPRES.','CTR','ROAS','CPC','CPT','COST','RPC'];
    const goal = AdwordsCampatingsGoal;

    const TableBody = () => {
      
      // sources = data.sort((a,b) => (a.value > b.value) ? -1 : ((b.value > a.value) ? 1 : 0));
      //LOOP THROUGH DIMENSIONS
      let CampaignAds = data.map((elem, i) => {
        //LOOP THROUGH METRICS
        let CampaignAdsMetrics = data[i].metrics[0].values.map((element, i) => {
          const value = element
          if(element.length > 10 && element.includes('.')){
            element = Number(element).toFixed(2)
          }
          if(i == 2 || i == 3){
            element = element + '%'
          }
          if(i == 4 || i == 5 || i == 6 || i == 7){
            element = element + currencySymbol
          }
          return (
          <div key={i} className={`metrics ${Number(value) >= goal[i] && goal[i] !==null ? 'metrics--achieved' : Number(value) <  goal[i] ? 'metrics--notachieved' : ''}`}> 
            <div className="metrics__title">
              {metricsTitle[i]}{':'}
            </div> 
            <div className="metrics__value">
              {element} 
            </div>
          </div>
          )
        })

        return (
          <Grid  key={i} item lg={3} sm={4} xl={2} xs={12} >
            <Box title={elem.dimensions[0]} data={CampaignAdsMetrics} className={`adtype ` + elem.dimensions[1].replace(/\s/g, '')}/>
          </Grid>
        )
      })

      return (
        <Grid container spacing={4} >
          {CampaignAds}
        </Grid>  
      )
    };

    return (
      <TableBody data={data} />
    );
  }
}
