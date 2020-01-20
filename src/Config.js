//ENABLE REST API TO YOUR WOOCOMMERCE STORE AND PROVIDE THE INFOS
const rest_api_creds = {
  website : "https://lovefashionpoint.gr",  // WEBSITE URL
  consumer_key: "ck_74731bc686c7a4c3a5a26110d7d813b8268d5b83",  // CONSUMER KEY
  consumer_secret: "cs_562201b3c09564fce2ad01c8b52c96d6e54b5851",  // CONSUMER SECRET
}

export const currencySymbol = "€";


const token = "consumer_key="+rest_api_creds.consumer_key+"&consumer_secret="+rest_api_creds.consumer_secret;
export const topSellersEndPoint = rest_api_creds.website+"/wp-json/wc/v3/reports/top_sellers?"+ token;
export const salesEndPoint = rest_api_creds.website+"/wp-json/wc/v3/reports/sales?"+ token;
export const ordersEndPoint = rest_api_creds.website+"/wp-json/wc/v3/orders?"+ token;
export const ordersTotalsEndPoint = rest_api_creds.website+"/wp-json/wc/v3/reports/orders/totals?"+ token;