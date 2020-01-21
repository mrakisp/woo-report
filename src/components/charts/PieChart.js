import React, { Component } from 'react';
import CanvasJSReact from '../../assets/Chart/canvasjs.react';
import { makeStyles } from '@material-ui/styles';
import {
	Card,
	CardHeader,
	Divider
  } from '@material-ui/core';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class ColumnChart extends Component {

	render() {

		let dataPoints = [];
		const data = this.props.topSellers;
	
		if(data.length > 0){
	
			data.forEach((row) => {
				dataPoints.push({ y: row.quantity, label: row.name + ' - ID: ' + row.product_id })
			});
		}

		const options = {

			// title: {
			// 	text: "Top Sellers"
			// },
			//theme: "dark2",
			theme: "light",
			// exportEnabled: true,
			animationEnabled: true,
			data: [
			{
				// Change type to "doughnut", "line", "splineArea", etc.
				type: "doughnut",
				dataPoints: dataPoints
			}
			]

		}

		return (

			<Card>
				<CardHeader
					title="Top Sellers"
				/>
				<Divider/>
			<CanvasJSChart options={options} />
			</Card>
			
		);
	}
}

export default ColumnChart;