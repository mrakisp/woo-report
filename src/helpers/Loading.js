import React, { Component } from 'react';

export default class Loading extends Component {

  componentDidMount() {

  }

  render() {
    return (
      <div className="loading"></div>
    );
  };
}


// const Loading = props => {
  
//   let data = props.data;
//   let title = props.title;
//   const { className, ...rest } = props;

//   const classes = useStyles();

//   return (
//     <Card
//       {...rest}
//       className={clsx(classes.root, className)}
//     >
//       <CardContent>
//         <Grid
//           container
//           justify="space-between"
//         >
//           <Grid item>
//             <Typography
//               className={`metrics__title--background ` + classes.title}
//               color="inherit"
//               gutterBottom
//               variant="h5"
//             >
//               {title}
//             </Typography>
//             <Typography variant="inherit">{data}</Typography>
//           </Grid>
//         </Grid>
//       </CardContent>
//     </Card>
//   );
// };

// Box.propTypes = {
//   className: PropTypes.string
// };

// export default Box;



