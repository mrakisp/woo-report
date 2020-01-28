import React, { Component }  from 'react';
import { Grid } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import {Box} from '..';
import {  currencySymbol, AdwordsCampatingsGoal } from '../../../../Config';

export default class AdsCampaign extends Component {
  constructor() {
    super();
    this.state = {
      searchPartners : true,
      googleSearch : true,
      content : true,
      cross : true,
      visibleTypes: ['Searchpartners','GoogleSearch','Content','Cross-network']
    };
  }
  render() {

    const data = this.props.campaigndata
    const metricsTitle = ['CLICKS','IMPRES.','CTR','ROAS','CPC','CPT','COST','RPC'];
    const goal = AdwordsCampatingsGoal;

    const TableBody = () => {

      // const handleChange = name => event => {
      //   this.setState({ 
      //     searchPartners : !this.state.searchPartners
      //   })
      //   let list = this.state.visibleTypes
      //   if(!this.state.searchPartners){
      //     list.push(event.currentTarget.value)
      //   }else{
      //     list.splice( this.state.visibleTypes.indexOf(event.currentTarget.value), 1 );
      //   }
      //   this.setState({ 
      //     visibleTypes : list
      //   })
      // };

      const handleChange1 = name => event => {
        this.setState({ 
          googleSearch : !this.state.googleSearch
        })
        let list = this.state.visibleTypes
        if(!this.state.googleSearch){
          list.push(event.currentTarget.value)
        }else{
          list.splice( this.state.visibleTypes.indexOf(event.currentTarget.value), 1 );
        }
        this.setState({ 
          visibleTypes : list
        })
      };

      const handleChange2 = name => event => {
        this.setState({ 
          content : !this.state.content
        })
        let list = this.state.visibleTypes
        if(!this.state.content){
          list.push(event.currentTarget.value)
        }else{
          list.splice( this.state.visibleTypes.indexOf(event.currentTarget.value), 1 );
        }
        this.setState({ 
          visibleTypes : list
        })
      };

      const handleChange3 = name => event => {
        this.setState({ 
          cross : !this.state.cross
        })
        let list = this.state.visibleTypes
        if(!this.state.cross){
          list.push(event.currentTarget.value)
        }else{
          list.splice( this.state.visibleTypes.indexOf(event.currentTarget.value), 1 );
        }
        this.setState({ 
          visibleTypes : list
        })
      };

      let dataSorted = data.sort((a,b) => (a.dimensions[1] > b.dimensions[1]) ? -1 : ((b.dimensions[1] > a.dimensions[1]) ? 1 : 0));
      //LOOP THROUGH DIMENSIONS
      let CampaignAds = dataSorted.map((elem, i) => {
        //LOOP THROUGH METRICS
        let CampaignAdsMetrics = dataSorted[i].metrics[0].values.map((element, i) => {
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
  
        if (elem.dimensions[1] !== 'Search partners' && this.state.visibleTypes.includes(elem.dimensions[1].replace(/\s/g, ''))){
            return (
              <Grid  key={i} item lg={2} sm={4} xl={2} xs={12} >
                <Box title={elem.dimensions[0]} data={CampaignAdsMetrics} className={`adtype ` + elem.dimensions[1].replace(/\s/g, '')}/> 
              </Grid> 
            )
        }
      })

      return (
        <div>
          <FormControl component="fieldset" className="visible-filters">
            <FormGroup aria-label="position" row>
              {/* <FormControlLabel
                value="top"
                control={<Switch checked={this.state.searchPartners} onChange={handleChange('Searchpartners')} value="Searchpartners" inputProps={{ 'aria-label': 'secondary checkbox' }} />}
                label="Search Partners"
                labelPlacement="top"
              /> */}
              <FormControlLabel
                value="top"
                control={ <Switch checked={this.state.googleSearch} onChange={handleChange1('GoogleSearch')} value="GoogleSearch" inputProps={{ 'aria-label': 'secondary checkbox' }} />}
                label="Search"
                labelPlacement="top"
              />
                <FormControlLabel
                value="top"
                control={ <Switch checked={this.state.content} onChange={handleChange2('Content')} value="Content" inputProps={{ 'aria-label': 'secondary checkbox' }} />}
                label="Google Display Network"
                labelPlacement="top"
              />
              <FormControlLabel
                value="top"
                control={ <Switch checked={this.state.cross} onChange={handleChange3('Cross-network')} value="Cross-network" inputProps={{ 'aria-label': 'secondary checkbox' }} />}
                label="Cross Network"
                labelPlacement="top"
              />
              </FormGroup>
            </FormControl>
            <Grid container spacing={4} >
              {CampaignAds}
            </Grid>  
        </div>
      )
    };

    return (
      <TableBody data={data} />
    );
  }
}
