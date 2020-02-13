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

import Fade from '@material-ui/core/Fade';


function createData(campaign_name, objective, clicks, reach, impressions, cpm, frequency, cpc, ctr, addToCart ,checkoutProcess,revenue,spend,roas) {
  return { campaign_name, objective, clicks, reach, impressions, cpm, frequency , cpc , ctr, addToCart ,checkoutProcess,revenue,spend,roas};
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
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'left' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              
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
  polygon: {
    fill: theme.palette.common.white,
    stroke: theme.palette.divider,
    strokeWidth: 1,
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
        element.purchase_roas && element.purchase_roas.length > 0 && element.purchase_roas[0] && element.purchase_roas[0].action_type === 'omni_purchase' ? Number(element.purchase_roas[0].value) : '0'
        ))
    })
  }


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

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = event => {
    setDense(event.target.checked);
  };

  const handleChange = name => event => {
    if(event.target.checked){
        document.getElementById('checked'+event.target.value).style.display = "block";
    }else{
      document.getElementById('checked'+event.target.value).style.display = "none";
    }
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody className="facebook__table">
              {stableSort(rows, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                 <span style={{display: "contents"}}>
                    <TableRow key={index}>
                      <Tooltip title={row.campaign_name} placement="left-start">
                        <TableCell className="first-column" component="th" id={labelId} scope="row" >
                          {row.campaign_name}
                          <Switch value={index} onChange={handleChange("checked")} />
                        </TableCell>
                      </Tooltip>
                      <TableCell align="left">{row.objective}</TableCell>
                      <TableCell align="left">{row.clicks}</TableCell>
                      <TableCell align="left">{row.reach}</TableCell>
                      <TableCell align="left">{row.impressions}</TableCell>
                      <TableCell align="left">{row.cpm}</TableCell>
                      <TableCell align="left">{row.frequency}</TableCell>
                      <TableCell align="left">{row.cpc}{currencySymbol}</TableCell>
                      <TableCell align="left">{row.ctr}%</TableCell>
                      <TableCell align="left">{row.addToCart}{currencySymbol}</TableCell>
                      <TableCell align="left">{row.checkoutProcess}{currencySymbol}</TableCell>
                      <TableCell align="left">{row.revenue}{currencySymbol}</TableCell>
                      <TableCell align="left">{row.spend}{currencySymbol}</TableCell>
                      <TableCell align="left">{row.roas}</TableCell>
                    </TableRow>
                    {/* <div id={'checked'+index}  style={{display: "none"}}>123</div> */}
                    <TableRow id={'checked'+index} style={{display: "none"}}>
                        dasdasdad
                    </TableRow>
                    </span>
                  );
                })}
            </TableBody>
          
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 30]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
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