import React, { Component }  from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core';

import {
  Box,

} from './components';

class Test extends Component {
  render() {
    debugger;
    const data = this.props.data;
    let rowsSales = []

    const TableBody = () => {
      rowsSales = data.map((row, index) => {
        return (
          <div key={index}>
          <Grid 
          item
          lg={2}
          sm={6}
          xl={3}
          xs={12}
        >
        <Box title={row.dimensions[0]} data={row.metrics[0]}/>
      </Grid>
      </div>
        );
      });

      return (
        {rowsSales}
        
      );
    };

    return (
      <TableBody data={data} />
    );
  }
}

export default Test;


