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

function createData(name, productDetailViews, productAddsToCart, productRemovesFromCart, productCheckouts, itemRevenue, itemQuantity, cartToDetailRate, buyToDetailRate) {
  return { name, productDetailViews, productAddsToCart, productRemovesFromCart, productCheckouts, itemRevenue, itemQuantity , cartToDetailRate , buyToDetailRate};
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
  { id: 'name', numeric: false, disablePadding: true, label: 'Campaign' , toolTips: 'The value of the utm_campaign campaign or Adwords Campaign name' },
  { id: 'productDetailViews', numeric: true, disablePadding: false, label: 'View Product'  , toolTips: 'Number of times users viewed the product-detail page (Enhanced Ecommerce).' },
  { id: 'productAddsToCart', numeric: true, disablePadding: false, label: 'Add To Cart', toolTips:"Number of times the product was added to the shopping cart (Enhanced Ecommerce)." },
  { id: 'productRemovesFromCart', numeric: true, disablePadding: false, label: 'Remove From Cart', toolTips: "Number of times the product was removed from the shopping cart (Enhanced Ecommerce)." },
  { id: 'productCheckouts', numeric: true, disablePadding: false, label: 'Check Out Proccess', toolTips: "Number of times the product was included in the check-out process (Enhanced Ecommerce). " },
  { id: 'itemRevenue', numeric: true, disablePadding: false, label: 'Revenue', toolTips:"The total revenue from purchased product items." },
  { id: 'itemQuantity', numeric: true, disablePadding: false, label: 'Items Purchased', toolTips:"Total number of items purchased. For example, if users purchase 2 frisbees and 5 tennis balls, this will be 7." },
  { id: 'cartToDetailRate', numeric: true, disablePadding: false, label: 'Cart Detail Rate', toolTips:"Product adds divided by views of product details (Enhanced Ecommerce)." },
  { id: 'buyToDetailRate', numeric: true, disablePadding: false, label: 'Buy Detail Rate', toolTips:"Unique purchases divided by views of product detail pages (Enhanced Ecommerce)." },
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
          <Tooltip title={headCell.toolTips} placement="top-end">
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
  onSelectAllClick: PropTypes.func.isRequired,
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
  let rows = [];
  if (props.tabledata.length > 0){
    props.tabledata.forEach(element => {
      if(element.dimensions[0] !== '(not set)'){
        rows.push(createData(
          element.dimensions[0], 
          Number(element.metrics[0].values[0]),
          Number(element.metrics[0].values[1]),
          Number(element.metrics[0].values[2]),
          Number(element.metrics[0].values[3]),
          Number(element.metrics[0].values[4]),
          Number(element.metrics[0].values[5]),
          Number(element.metrics[0].values[6]),
          Number(element.metrics[0].values[7])
          ));   
        }
    });
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

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

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
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.name}
                      </TableCell>
                      <TableCell align="left">{row.productDetailViews}</TableCell>
                      <TableCell align="left">{row.productAddsToCart}</TableCell>
                      <TableCell align="left">{row.productRemovesFromCart}</TableCell>
                      <TableCell align="left">{row.productCheckouts}</TableCell>
                      <TableCell align="left">{row.itemRevenue}{currencySymbol}</TableCell>
                      <TableCell align="left">{row.itemQuantity}</TableCell>
                      <TableCell align="left">{Number(row.cartToDetailRate).toFixed(2) +'%'}</TableCell>
                      <TableCell align="left">{Number(row.buyToDetailRate).toFixed(2) +'%'}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
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