import React, { Component } from 'react';
import CanvasJSReact from '../../assets/Chart/canvasjs.react';
import {
	Card,
	CardHeader,
	Divider
  } from '@material-ui/core';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class ColumnChart extends Component {

	render() {

		let dataPoints = [];
		let data = this.props.agearray;

		if(data.length > 0){
		
				const firstage = data[0].metrics[0].values[0]
				const secondage = data[1].metrics[0].values[0]
				const thridage = data[2].metrics[0].values[0]
				const fourthage = data[3].metrics[0].values[0]
				const fifthage = data[4].metrics[0].values[0]
				const sixthage = data[5].metrics[0].values[0]
				const totalUsers = Number(firstage) +  Number(secondage) +  Number(thridage) + Number(fourthage) +  Number(fifthage) +  Number(sixthage)
				let firstagePercent = Math.round((firstage/totalUsers)*100)
				let secondagePercent = Math.round((secondage/totalUsers)*100)
				let thridagePercent = Math.round((thridage/totalUsers)*100)
				let fourthagePercent = Math.round((fourthage/totalUsers)*100)
				let fifthagePercent = Math.round((fifthage/totalUsers)*100)
				let sixthagePercent = Math.round((sixthage/totalUsers)*100)

				dataPoints = [
					{y: firstagePercent, label: data[0].dimensions[0]},
					{y: secondagePercent, label: data[1].dimensions[0]},
					{y: thridagePercent, label: data[2].dimensions[0]},
					{y: fourthagePercent, label: data[3].dimensions[0]},
					{y: fifthagePercent, label: data[4].dimensions[0]},
					{y: sixthagePercent, label: data[5].dimensions[0]}
				]	

		}

		const options = {
			theme: "light",
			animationEnabled: true,
			data: [
			{
				type: "pie",
				startAngle: 25,
				toolTipContent: "<b>{label}</b>: {y}%",
				showInLegend: "true",
				legendText: "{label}",
				indexLabelFontSize: 23,
				indexLabel: "{y}%",
				radius: "80%",
				dataPoints: dataPoints
			}
			]
		}

		return (
			<Card>
				<CardHeader title="Visitors By Age" />
				<Divider/>
				<CanvasJSChart options={options} />
			</Card>
		);
	}
}

export default ColumnChart;