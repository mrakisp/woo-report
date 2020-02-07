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

// function createData(name, productDetailViews, productAddsToCart, productRemovesFromCart, productCheckouts, itemRevenue, itemQuantity, cartToDetailRate, buyToDetailRate) {
//   return { name, productDetailViews, productAddsToCart, productRemovesFromCart, productCheckouts, itemRevenue, itemQuantity , cartToDetailRate , buyToDetailRate};
// }

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
  { id: 'name', numeric: false, disablePadding: false, label: 'Campaign' , toolTips: 'The value of the utm_campaign campaign or Adwords Campaign name' },
  { id: 'productDetailViews', numeric: true, disablePadding: false, label: 'Objective'  , toolTips: 'Number of times users viewed the product-detail page (Enhanced Ecommerce).' },
  { id: 'productAddsToCart', numeric: true, disablePadding: false, label: 'Clicks', toolTips:"Number of times the product was added to the shopping cart (Enhanced Ecommerce)." },
  { id: 'productRemovesFromCart', numeric: true, disablePadding: false, label: 'Reach', toolTips: "Number of times the product was removed from the shopping cart (Enhanced Ecommerce)." },
  { id: 'productCheckouts', numeric: true, disablePadding: false, label: 'Impressions', toolTips: "Number of times the product was included in the check-out process (Enhanced Ecommerce). " },
  { id: 'itemRevenue', numeric: true, disablePadding: false, label: 'CPM', toolTips:"The total revenue from purchased product items." },
  { id: 'itemQuantity', numeric: true, disablePadding: false, label: 'Frequency', toolTips:"Total number of items purchased. For example, if users purchase 2 frisbees and 5 tennis balls, this will be 7." },
  { id: 'cartToDetailRate', numeric: true, disablePadding: false, label: 'CPC', toolTips:"Product adds divided by views of product details (Enhanced Ecommerce)." },
  { id: 'buyToDetailRate', numeric: true, disablePadding: false, label: 'CTR', toolTips:"Unique purchases divided by views of product detail pages (Enhanced Ecommerce)." },
  { id: 'addToCart', numeric: true, disablePadding: false, label: 'Add to Cart', toolTips:"Unique purchases divided by views of product detail pages (Enhanced Ecommerce)." },
  { id: 'checkoutProcess', numeric: true, disablePadding: false, label: 'Checkout Process', toolTips:"Unique purchases divided by views of product detail pages (Enhanced Ecommerce)." },
  { id: 'revenue', numeric: true, disablePadding: false, label: 'Revenue', toolTips:"Unique purchases divided by views of product detail pages (Enhanced Ecommerce)." },
  { id: 'cost', numeric: true, disablePadding: false, label: 'Cost', toolTips:"Unique purchases divided by views of product detail pages (Enhanced Ecommerce)." },
  { id: 'roas', numeric: true, disablePadding: false, label: 'ROAS', toolTips:"Unique purchases divided by views of product detail pages (Enhanced Ecommerce)." },
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
}));

export default function EnhancedTable(props) {

  //GET DATA AND PASS IT TO ARRAY
  let rows = [];
  if (props.tabledata.length > 0){
    rows = props.tabledata;
  }

  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('itemRevenue');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

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
            <TableBody>
              {stableSort(rows, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  debugger;
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow key={index}>
                      <Tooltip title={row.campaign_name} placement="left-start">
                        <TableCell className="first-column" component="th" id={labelId} scope="row" >
                          {row.campaign_name}
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
                      <TableCell align="left">{row.action_values && row.action_values.length > 0 && row.action_values[3] ? row.action_values[3].value : ''}{currencySymbol}</TableCell>
                      <TableCell align="left">{row.action_values && row.action_values.length > 0 && row.action_values[4] ? row.action_values[4].value : ''}{currencySymbol}</TableCell>
                      <TableCell align="left">{row.action_values && row.action_values.length > 0 && row.action_values[5] ? row.action_values[5].value : ''}{currencySymbol}</TableCell>
                      <TableCell align="left">{row.spend}{currencySymbol}</TableCell>
                      <TableCell align="left">{row.purchase_roas && row.purchase_roas.length > 0 && row.purchase_roas[0] ? row.purchase_roas[0].value : ''}%</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
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