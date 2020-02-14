import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core';
// import Loading from '../../../../helpers/Loading';

// const useStyles = makeStyles(theme => ({
//   root: {
//     height: '100%'
//   },
//   content: {
//     alignItems: 'center',
//     display: 'flex'
//   },
//   title: {
//     fontWeight: 700,
//     color: 'white'
//   },
//   avatar: {
//     backgroundColor: theme.palette.error.main,
//     height: 56,
//     width: 56
//   },
//   icon: {
//     height: 32,
//     width: 32
//   },
//   difference: {
//     marginTop: theme.spacing(2),
//     display: 'flex',
//     alignItems: 'center'
//   },
//   differenceIcon: {
//     color: theme.palette.error.dark
//   },
//   differenceValue: {
//     color: theme.palette.error.dark,
//     marginRight: theme.spacing(1)
//   }
// }));

const Ads = props => {
  debugger;
  let data = props.adsData;
  // let title = props.title;

  const { className, ...rest } = props;

  // const classes = useStyles();
  let CampaignAds = props.adsData.map((element, i) => {
    if(element.campaign_id ===  props.campaign_id)
      return (
        <div className={'item'} key={i}> 
          <div className="item__title">
            {element.ad_name}
          </div> 
          <div className="item__value">
            <div className="item__value__title">{'clicks: '}</div>
            <div className="item__value__key">{element.clicks}</div>
          </div>
          <div className="item__value">
            <div className="item__value__title">{'impressions: '}</div>
            <div lassName="item__value__key">{element.impressions}</div>
          </div>
          <div className="item__value">
            <div className="item__value__title">{'cpc: '}</div>
            <div className="item__value__key">{element.cpc}</div>
          </div>
          <div className="item__value">
            <div className="item__value__title">{'reach: '}</div>
            <div className="item__value__key">{element.reach}</div>
          </div>
        </div>
      )
  })

  return (
    <div className={'ads-container'}>
      {CampaignAds}
    </div>
      
  );
};

export default Ads;
