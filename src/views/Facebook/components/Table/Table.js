import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import {  makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import {  currencySymbol } from '../../../../Config';
import { Ads } from '..'

function createData(campaign_name, objective, clicks, reach, impressions, cpm, frequency, cpc, ctr, addToCart ,checkoutProcess,revenue,spend,roas,campaign_id) {
  return { campaign_name, objective, clicks, reach, impressions, cpm, frequency , cpc , ctr, addToCart ,checkoutProcess,revenue,spend,roas,campaign_id};
}

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return 1;
  }
  if (b[orderBy] > a[orderBy]) {
    return -1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const headCells = [
  { id: 'campaign_name', numeric: false, disablePadding: false, label: 'Campaign' , toolTips: 'The Campaign name' },
  { id: 'objective', numeric: false, disablePadding: false, label: 'Objective'  , toolTips: 'The objective reflecting the goal you want to achieve with your advertising. It may be different from the selected objective of the campaign in some cases' },
  { id: 'clicks', numeric: true, disablePadding: false, label: 'Clicks', toolTips:"The number of clicks on your ads" },
  { id: 'reach', numeric: true, disablePadding: false, label: 'Reach', toolTips: "The number of people who saw your ads at least once. Reach is different from impressions, which may include multiple views of your ads by the same people." },
  { id: 'impressions', numeric: true, disablePadding: false, label: 'Impressions', toolTips: "The number of times your ads were on screen" },
  { id: 'cpm', numeric: true, disablePadding: false, label: 'CPM', toolTips:"The average cost for 1,000 impressions." },
  { id: 'frequency', numeric: true, disablePadding: false, label: 'Frequency', toolTips:"The average number of times each person saw your ad" },
  { id: 'cpc', numeric: true, disablePadding: false, label: 'CPC', toolTips:"The average cost for each click (all)." },
  { id: 'ctr', numeric: true, disablePadding: false, label: 'CTR', toolTips:"The percentage of times people saw your ad and performed a click (all)." },
  { id: 'addToCart', numeric: true, disablePadding: false, label: 'Add to Cart', toolTips:"Add to cart value" },
  { id: 'checkoutProcess', numeric: true, disablePadding: false, label: 'Checkout Process', toolTips:"Checkout Process Value" },
  { id: 'revenue', numeric: true, disablePadding: false, label: 'Revenue', toolTips:"Total Purchases" },
  { id: 'spend', numeric: true, disablePadding: false, label: 'Cost', toolTips:"The estimated total amount of money you've spent on your campaign" },
  { id: 'roas', numeric: true, disablePadding: false, label: 'ROAS', toolTips:"The total return on ad spend (ROAS) from purchases" },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <Tooltip key={headCell.id} title={headCell.toolTips} placement="top-end">
          <TableCell key={headCell.id} align={headCell.numeric ? 'center' : 'center'}  padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false} >
            <TableSortLabel active={orderBy === headCell.id} direction={orderBy === headCell.id ? order : 'asc'} onClick={createSortHandler(headCell.id)} >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
              
            </TableSortLabel>
          </TableCell>
          </Tooltip>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  container: {
    display: 'flex',
  },

}));

export default function EnhancedTable(props) {

  //GET DATA AND PASS IT TO ARRAY
  let rows = [];
  if (props.tabledata.length > 0){
    props.tabledata.forEach( function (element, index) {
      rows.push(createData(
        element.campaign_name,
        element.objective,
        Number(element.clicks),
        Number(element.reach),
        Number(element.impressions),
        Number(element.cpm),
        Number(element.frequency),
        Number(element.cpc),
        Number(element.ctr),
        element.action_values && element.action_values.length > 0 && element.action_values.find(x => x.action_type  === 'offsite_conversion.fb_pixel_add_to_cart') ? Number(element.action_values.find(x => x.action_type  === 'offsite_conversion.fb_pixel_add_to_cart').value) : '0',
        element.action_values && element.action_values.length > 0 && element.action_values.find(x => x.action_type  === 'offsite_conversion.fb_pixel_initiate_checkout') ? Number(element.action_values.find(x => x.action_type  === 'offsite_conversion.fb_pixel_initiate_checkout').value) : '0',
        element.action_values && element.action_values.length > 0 && element.action_values.find(x => x.action_type  === 'offsite_conversion.fb_pixel_purchase') ? Number(element.action_values.find(x => x.action_type  === 'offsite_conversion.fb_pixel_purchase').value) : '0',
        Number(element.spend),
        element.purchase_roas && element.purchase_roas.length > 0 && element.purchase_roas[0] && element.purchase_roas[0].action_type === 'omni_purchase' ? Number(element.purchase_roas[0].value) : '0',
        element.campaign_id
        ))
    })
  }

  const ads = props.ads.length > 0 ? props.ads : []
  ads.forEach( function (element, index) {
     if (element.action_values && element.action_values.find(x => x.action_type  === 'offsite_conversion.fb_pixel_initiate_checkout')){
      element.checkoutProcess = element.action_values.find(x => x.action_type  === 'offsite_conversion.fb_pixel_initiate_checkout').value
     }
     if (element.action_values && element.action_values.find(x => x.action_type  === 'offsite_conversion.fb_pixel_add_to_cart')){
      element.addToCart = element.action_values.find(x => x.action_type  === 'offsite_conversion.fb_pixel_add_to_cart').value
     }
     if (element.action_values && element.action_values.find(x => x.action_type  === 'offsite_conversion.fb_pixel_purchase')){
      element.purchase = element.action_values.find(x => x.action_type  === 'offsite_conversion.fb_pixel_purchase').value
     }
  })
 
  const [modal, setModal] = React.useState(false);
  const [selectedModal, setSelectedModal] = React.useState("-1");
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('revenue');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  
  const handleChangeModal = event => {
    setModal(false)
    setSelectedModal("-1");
  };


  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = event => {
    setDense(event.target.checked);
  };

  const handleChange = name => event => {

    const str = event.target.value;
    const words = str.split(',');
    if(event.target.checked){
        props.parentCallbackData(words[1]);
         setModal(true);
         setSelectedModal(words[0]);
    }else{
      setModal(false);
      setSelectedModal("-1");
    }
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table className={classes.table}  aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'} aria-label="enhanced table" >
            <EnhancedTableHead classes={classes} numSelected={selected.length} order={order} orderBy={orderBy} onRequestSort={handleRequestSort} rowCount={rows.length}/>
            <TableBody className="facebook__table">
              {stableSort(rows, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                        <TableRow key={index}>
                          
                          <TableCell className="first-column" component="th" id={labelId} scope="row" >
                            {row.campaign_name}
                            <Switch className={'hidden-row'} checked={modal && Number(selectedModal) == index ? "true" : ''} value={index+','+row.campaign_id} onChange={handleChange("checked")} />
                          </TableCell>
                          {/* <Tooltip title={row.objective} placement="right-end"> */}
                            <TableCell title={row.objective} align="center">{row.objective}</TableCell>
                          {/* </Tooltip> */}
                          <TableCell align="center">{row.clicks}</TableCell>
                          <TableCell align="center">{row.reach}</TableCell>
                          <TableCell align="center">{row.impressions}</TableCell>
                          <TableCell align="center">{row.cpm}</TableCell>
                          <TableCell align="center">{row.frequency}</TableCell>
                          <TableCell align="center">{row.cpc}{currencySymbol}</TableCell>
                          <TableCell align="center">{row.ctr}%</TableCell>
                          <TableCell align="center">{row.addToCart}{currencySymbol}</TableCell>
                          <TableCell align="center">{row.checkoutProcess}{currencySymbol}</TableCell>
                          <TableCell align="center">{row.revenue}{currencySymbol}</TableCell>
                          <TableCell align="center">{row.spend}{currencySymbol}</TableCell>
                          <TableCell align="center">{row.roas}</TableCell>
                          {modal && Number(selectedModal) == index ? <div className="modal" id={'checked'+index} >
                            <div className="modal__container">
                              <div className="modal__header">
                                {row.campaign_name} 
                                <div onClick={handleChangeModal} >
                                  <svg height="25px" viewBox="0 0 512 512" width="25px" xmlns="http://www.w3.org/2000/svg"><path d="m504.5 256c0 137.242188-111.257812 248.5-248.5 248.5s-248.5-111.257812-248.5-248.5 111.257812-248.5 248.5-248.5 248.5 111.257812 248.5 248.5zm0 0" fill="#ff929f"/><path d="m229.980469 145.316406c51.125-39.453125 76.753906-95.589844 88.414062-129.917968-19.9375-5.15625-40.84375-7.898438-62.394531-7.898438-137.242188 0-248.5 111.257812-248.5 248.5s111.257812 248.5 248.5 248.5c10.285156 0 20.429688-.625 30.386719-1.839844-108.003907-90.65625-124.167969-183.746094-117.097657-248.828125 4.660157-42.886719 26.542969-82.15625 60.691407-108.515625zm0 0" fill="#ff737d"/><path d="m331.691406 242.90625 57.597656-57.597656c17.214844-17.214844 17.214844-45.382813 0-62.59375-17.214843-17.214844-45.382812-17.214844-62.597656 0l-57.597656 57.597656c-7.230469 7.230469-18.953125 7.230469-26.1875 0l-57.597656-57.597656c-17.210938-17.214844-45.378906-17.214844-62.59375 0-17.214844 17.210937-17.214844 45.378906 0 62.59375l57.597656 57.597656c7.230469 7.230469 7.230469 18.957031 0 26.1875l-57.597656 57.597656c-17.214844 17.214844-17.214844 45.382813 0 62.59375 17.214844 17.214844 45.382812 17.214844 62.59375 0l57.597656-57.597656c7.234375-7.230469 18.957031-7.230469 26.1875 0l57.597656 57.597656c17.214844 17.214844 45.382813 17.214844 62.597656 0 17.214844-17.210937 17.214844-45.378906 0-62.59375l-57.597656-57.597656c-7.234375-7.230469-7.234375-18.957031 0-26.1875zm0 0" fill="#fff"/><path d="m218.082031 155.484375-32.773437-32.773437c-17.210938-17.214844-45.378906-17.214844-62.59375 0-17.214844 17.214843-17.214844 45.382812 0 62.597656l49.757812 49.757812c7.042969-30.402344 22.890625-58.132812 45.609375-79.582031zm0 0" fill="#bdfaff"/><path d="m185.308594 389.285156 5.726562-5.722656c-17-36.753906-22.996094-71.527344-23.171875-102.023438l-45.152343 45.152344c-17.214844 17.214844-17.214844 45.382813 0 62.59375 17.214843 17.214844 45.382812 17.214844 62.597656 0zm0 0" fill="#ccf8ff"/><path d="m256 512c-68.378906 0-132.667969-26.628906-181.019531-74.980469-48.351563-48.351562-74.980469-112.640625-74.980469-181.019531s26.628906-132.667969 74.980469-181.019531c48.351562-48.351563 112.640625-74.980469 181.019531-74.980469 45.660156 0 90.480469 12.171875 129.621094 35.195312 37.988281 22.347657 69.769531 54.304688 91.902344 92.410157 2.082031 3.582031.863281 8.171875-2.71875 10.253906-3.582032 2.082031-8.171876.863281-10.253907-2.71875-20.839843-35.882813-50.761719-65.972656-86.53125-87.015625-36.839843-21.671875-79.03125-33.125-122.019531-33.125-64.375 0-124.894531 25.066406-170.414062 70.585938-45.519532 45.519531-70.585938 106.039062-70.585938 170.414062s25.066406 124.894531 70.585938 170.414062c45.519531 45.519532 106.039062 70.585938 170.414062 70.585938s124.894531-25.066406 170.414062-70.585938c45.519532-45.519531 70.585938-106.039062 70.585938-170.414062 0-31.632812-6.03125-62.378906-17.929688-91.386719-1.570312-3.832031.261719-8.214843 4.09375-9.785156 3.832032-1.574219 8.214844.261719 9.785157 4.09375 12.640625 30.820313 19.050781 63.484375 19.050781 97.078125 0 68.378906-26.628906 132.667969-74.980469 181.019531-48.351562 48.351563-112.640625 74.980469-181.019531 74.980469zm0 0"/><path d="m321.386719 394.589844-57.597657-57.597656c-4.292968-4.292969-11.285156-4.296876-15.578124 0l-57.597657 57.597656c-20.183593 20.183594-53.023437 20.183594-73.203125 0-20.183594-20.183594-20.183594-53.023438 0-73.203125 2.929688-2.929688 7.675782-2.929688 10.605469 0 2.929687 2.929687 2.929687 7.675781 0 10.605469-6.910156 6.910156-19.171875 33.777343 0 51.988281 19.171875 18.214843 45.082031 6.910156 51.988281 0l57.597656-57.597657c10.144532-10.140624 26.652344-10.140624 36.792969 0l57.597657 57.597657c6.910156 6.910156 32.285156 20.734375 51.992187 0 22.214844-23.367188 6.910156-45.078125 0-51.988281l-57.597656-57.597657c-10.144531-10.144531-10.144531-26.648437 0-36.792969l57.597656-57.597656c6.910156-6.910156 19.304687-32.777344 0-51.992187-22.851563-22.746094-45.082031-6.90625-51.992187 0l-57.597657 57.597656c-10.140625 10.144531-26.648437 10.144531-36.792969 0l-57.597656-57.597656c-6.90625-6.90625-30.34375-19.542969-51.988281 0-21.648437 19.546875-6.910156 45.082031 0 51.992187l57.597656 57.597656c10.144531 10.144532 10.144531 26.648438 0 36.792969l-35.464843 35.460938c-2.929688 2.929687-7.675782 2.929687-10.605469 0-2.929688-2.929688-2.929688-7.675781 0-10.605469l35.464843-35.460938c4.292969-4.296874 4.292969-11.285156 0-15.582031l-57.597656-57.597656c-20.183594-20.179687-20.183594-53.019531 0-73.203125s53.019532-20.183594 73.203125 0l57.597657 57.597656c4.296874 4.296875 11.285156 4.296875 15.578124 0l57.601563-57.597656c20.179687-20.179688 53.019531-20.179688 73.203125 0 20.179688 20.183594 20.179688 53.023438 0 73.203125l-57.601562 57.601563c-4.292969 4.292968-4.292969 11.28125 0 15.578124l57.597656 57.597657c20.183594 20.183593 20.183594 53.019531 0 73.203125-10.089844 10.09375-43.011719 29.859375-73.203125 0zm0 0"/></svg></div>
                              </div>
                              <Ads adsData={ads} campaign_id={row.campaign_id}/>
                            </div>
                          </div> : ''}                          
                        </TableRow>
                  );
                })}
            </TableBody>
          
          </Table>
        </TableContainer>
        <TablePagination rowsPerPageOptions={[10, 20, 30]} component="div" count={rows.length} rowsPerPage={rowsPerPage} page={page}
          onChangePage={handleChangePage} onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Show Minimal"
      />
    </div>
  );
}

//https://developers.facebook.com/tools/explorer/519580525465323/?method=GET&path=act_108444649307331%2Finsights%3Flevel%3Dcampaign%26fields%3Dcampaign_name%2Creach%2Cclicks%2Cimpressions%2Caction_values%2Cquality_ranking%2Cpurchase_roas%2Ccpc%2Cctr%2Ccpm%2Cspend%2Cobjective%2Cfrequency%26time_range[since]%3D2020-02-08%26time_range[until]%3D2020-02-08&version=v6.0

// https://developers.facebook.com/tools/explorer/519580525465323/?method=GET&path=act_108444649307331%2Fcampaigns%3Fsummary%3Dinsights%26fields%3Deffective_status%2Cname%2Cobjective&version=v6.0
// https://developers.facebook.com/tools/explorer/519580525465323/?method=GET&path=act_108444649307331%2Fads%3Ffields%3Deffective_status%2Cname&version=v6.0
// https://developers.facebook.com/tools/explorer/519580525465323/?method=GET&path=6151154260107%2Fads%3Finsights%26fields%3Dname&version=v6.0
// https://developers.facebook.com/tools/explorer/?method=GET&path=6151154260107%2Fads%3Ffields%3Dinsights.date_preset(yesterday)%7Bad_name%2Cadset_name%2Ccampaign_name%2Caccount_name%2Caccount_id%2Cimpressions%2Cinline_link_clicks%2Cspend%2Cad_id%7D%2Cadcreatives%7Bobject_story_spec%7D&version=v6.0


// https://developers.facebook.com/tools/explorer/519580525465323/?method=GET&path=act_108444649307331%2Finsights%3Ffields%3Dcampaign_id%2Cad_name%2Caction_values%2Cclicks%2Cimpressions%2Cpurchase_roas%2Ccpc%2Cctr%2Ccpm%2Cspend%2Creach%2Cfrequency%26time_range[since]%3D2020-02-13%26time_range[until]%3D2020-02-13%26level%3Dad&version=v6.0
// https://developers.facebook.com/tools/explorer/519580525465323/?method=GET&path=act_108444649307331%2Fcampaigns%3Fsummary%3Dinsights%26fields%3Deffective_status%2Cname%2Cobjective%26time_range[since]%3D2020-02-13%26time_range[until]%3D2020-02-13&version=v6.0
// https://developers.facebook.com/tools/explorer/519580525465323/?method=GET&path=6151154260107%2Finsights%3Ffields%3Dcampaign_id%2Cad_name%2Caction_values%2Cclicks%2Cimpressions%2Cpurchase_roas%2Ccpc%2Cctr%2Ccpm%2Cspend%2Creach%2Cfrequency%26time_range[since]%3D2020-02-13%26time_range[until]%3D2020-02-13%26level%3Dad&version=v6.0