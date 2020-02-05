import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core';
import Loading from '../../../../helpers/Loading';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700,
    color: 'white'
  },
  avatar: {
    backgroundColor: theme.palette.error.main,
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  },
  difference: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  differenceIcon: {
    color: theme.palette.error.dark
  },
  differenceValue: {
    color: theme.palette.error.dark,
    marginRight: theme.spacing(1)
  }
}));

const Box = props => {
  
  let data = props.data;
  let title = props.title;
  let loading = props.loading;
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      {loading ? <Loading loading={loading}/> : ''}
      <CardContent>
        <Grid
          container
          justify="space-between"
        >
          <Grid item>
            <Typography
              className={`metrics__title--background ` + classes.title}
              color="inherit"
              gutterBottom
              variant="h5"
            >
              {title}
            </Typography>
            <Typography variant="inherit">{data}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

Box.propTypes = {
  className: PropTypes.string
};

export default Box;
