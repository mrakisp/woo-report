//DASHBOARD VIEWS CONFIGURATION
export const showView = {
  dashboard : true,
  analytics: true,
  adwords: true,
  facebook: true
}

//ENABLE REST API TO YOUR WOOCOMMERCE STORE AND PROVIDE THE INFOS
const rest_api_creds = {
  website : "",  // WEBSITE URL
  consumer_key: "",  // CONSUMER KEY
  consumer_secret: "",  // CONSUMER SECRET
}

//ANALYTICS CREDS AND CONFIGURATION
export const analytics = {
  client_id : "",
  view_id: "",
  groupSources : true //show all sources from facebok & instagram as one parent source ( e.x => i.facebook , m.facebook etc)
}

//FACEBOOK API CREDS AND CONFIGURATION
export const facebookApi = {
  access_token : "",
  account_id: "", // BUSINESS ID
  app_id : "",  //APP ID FOR window.FB.init
  app_version : "v6.0"
}


export const AdwordsCampatingsGoal = [
  null,                  //'CLICKS'
  null,                 //'IMPRESIONS'
  null,                 //'CTR'
  500,                 //ROAS'
  null,                 //'CPC'
  null,                 //'CPT'
  null,                 //'COST'
  null                  //'RPC'
]

//PROVIDE CURRENCY
export const currencySymbol = "€";

//PROVIDE NAME 
export const PoweredName = {
  name : "Menu",
  subname : ""
};


//WP REST API TOKEN AND ENDPOINTS
const token = "consumer_key="+rest_api_creds.consumer_key+"&consumer_secret="+rest_api_creds.consumer_secret;
export const topSellersEndPoint = rest_api_creds.website+"/wp-json/wc/v3/reports/top_sellers?"+ token;
export const salesEndPoint = rest_api_creds.website+"/wp-json/wc/v3/reports/sales?"+ token;
export const ordersEndPoint = rest_api_creds.website+"/wp-json/wc/v3/orders?"+ token;
export const ordersTotalsEndPoint = rest_api_creds.website+"/wp-json/wc/v3/reports/orders/totals?"+ token;
