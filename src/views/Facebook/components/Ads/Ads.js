import React from 'react';
import {  currencySymbol } from '../../../../Config';

const Ads = props => {
  debugger;
  let data = props.adsData;

  const { className, ...rest } = props;

  let CampaignAds = props.adsData.map((element, i) => {
    // const aa = element.action_values && element.action_values.length > 0  ? element.action_values.find(x => x.action_type  === 'offsite_conversion.fb_pixel_add_to_cart') : 'a'
    if(element.campaign_id ===  props.campaign_id)
      return (
        <div className={'item'} key={i}> 
          <div className="item__title">
            {element.ad_name}
          </div> 
          <div className="item__value">
            <div className="item__value__title">{'Clicks: '}</div>
            <div className="item__value__key">{element.clicks}</div>
          </div>
          <div className="item__value">
            <div className="item__value__title">{'Reach: '}</div>
            <div className="item__value__key">{element.reach}</div>
          </div>
          <div className="item__value">
            <div className="item__value__title">{'Impressions: '}</div>
            <div className="item__value__key">{element.impressions}</div>
          </div>
          <div className="item__value">
            <div className="item__value__title">{'CPM: '}</div>
            <div className="item__value__key">{element.cpm}</div>
          </div>
          <div className="item__value">
            <div className="item__value__title">{'Frequency: '}</div>
            <div className="item__value__key">{element.frequency}</div>
          </div>
          <div className="item__value">
            <div className="item__value__title">{'CPC: '}</div>
            <div className="item__value__key">{element.cpc}{currencySymbol}</div>
          </div>
          <div className="item__value">
            <div className="item__value__title">{'CTR: '}</div>
            <div className="item__value__key">{element.ctr}%</div>
          </div>
          <div className="item__value">
            <div className="item__value__title">{'Add to Cart: '}</div>
            <div className="item__value__key">{element.addToCart ? element.addToCart+currencySymbol : '0'+currencySymbol}</div>
          </div>
          <div className="item__value">
            <div className="item__value__title" title="Proceed to Checkout Process">{'Checkout Pr.: '}</div>
            <div className="item__value__key">{element.checkoutProcess ? element.checkoutProcess+currencySymbol : '0'+currencySymbol}</div></div>
          <div className="item__value">
            <div className="item__value__title">{'Revenue: '}</div>
            <div className="item__value__key">{element.purchase ? element.purchase+currencySymbol : '0'+currencySymbol}</div></div>
          <div className="item__value">
            <div className="item__value__title">{'Spend: '}</div>
            <div className="item__value__key">{element.spend}{currencySymbol}</div>
          </div>
          <div className="item__value">
            <div className="item__value__title">{'Roas: '}</div>
            <div className="item__value__key">{element.purchase_roas ? element.purchase_roas[0].value : '0'}</div>
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
