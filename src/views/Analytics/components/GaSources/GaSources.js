import React, { Component }  from 'react';
import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import {Box} from '../../components';
import { analytics } from '../../../../Config';

export default class GaSources extends Component {
  constructor() {
    super();
    this.state = {
      visible : false
    };
  }

  showMore = () => {
    this.setState({ visible: !this.state.visible })
  } 

  render() {
    
    const sourcesArray = this.props.sourcesarray;
    let finalArrayLength = analytics.groupSources ? 0 : 9 ;
    let loading = this.props.loading 

    if ( analytics.groupSources ){
      sourcesArray.forEach(element => {
        if ( !element.dimensions[0].includes('facebook') && !element.dimensions[0].includes('Facebook')
            && !element.dimensions[0].includes('instagram') && !element.dimensions[0].includes('Instagram'))
        {
          finalArrayLength++
        }
      });
    }
    const TableBody = () => {

      let fbvalue = 0
      
      let instavalue = 0;
      let sources = analytics.groupSources 
      ? [
        { label: 'facebook referral', value: fbvalue },
        { label: 'instagram', value: instavalue }
      ] 
      : []
      
      if (sourcesArray.length > 0) {
          sourcesArray.forEach(element => {
            if ( analytics.groupSources ){ // if grouping is true
              if ( element.dimensions[0].includes('referral') && 
                  (element.dimensions[0].includes('facebook') || element.dimensions[0].includes('Facebook')) ) 
              {
                fbvalue += Number(element.metrics[0].values[0])
                sources[0].value = fbvalue;
              }
              else if (element.dimensions[0].includes('referral') && 
                    (element.dimensions[0].includes('instagram') || element.dimensions[0].includes('Instagram'))) 
              {
                instavalue += Number(element.metrics[0].values[0])
                sources[1].value = instavalue;
              }
              else {
                sources.push({ label: element.dimensions[0], value: Number(element.metrics[0].values[0]) })
              }
            }
            else {
              sources.push({ label: element.dimensions[0], value: Number(element.metrics[0].values[0]) })
            }
          })
      }
      let sourcesFinal = [];  
      sources = sources.sort((a,b) => (a.value > b.value) ? -1 : ((b.value > a.value) ? 1 : 0)); //sort array
      sourcesFinal = sources.map((elem, i) => {
        return (
          <Grid className={i > 11 ? this.state.visible ? '' : 'hidden' : '' } key={i} item lg={2} sm={6} xl={2} xs={6} >
            <Box title={elem.label} data={elem.value} loading={loading}/>
          </Grid>
        )
      })

      return (
        <Grid container spacing={4} >
          {sourcesFinal}
        </Grid>  
      )
    };

    return (
      <div>
        <TableBody sourcesArray={sourcesArray} />
        {finalArrayLength+2 > 11 ? <Button className="btn--more" onClick={this.showMore} variant="outlined" color="primary">
          {this.state.visible ? 'Show Less': 'Show More'}
        </Button> : ''}
      </div>
    );
  }
}

