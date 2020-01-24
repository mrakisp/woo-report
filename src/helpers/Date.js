import React from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import {
  Button
} from '@material-ui/core';

export default class SelectDate extends React.Component {
  constructor(props) {
    super(props);
    this.handleFromChange = this.handleFromChange.bind(this);
    this.handleToChange = this.handleToChange.bind(this);
    this.state = {
      from: undefined,
      to: undefined,
    };
  }

  showFromMonth() {
    const { from } = this.state;
    if (!from) {
      return;
    }
  }

  handleFromChange(from) {
    this.setState({ from });
  }

  handleToChange(to) {
    this.setState({ to }, this.showFromMonth);
    this.sendData();
  }

  sendData () {
    this.props.parentCallback(this.state.from,this.to.state.month);
  }

  sendTodayDate = () => {
    this.props.parentCallback(new Date(),new Date());
  }
  sendYesterdayDate = () => {
    let today = new Date();
    let yesterday = new Date(today);
    this.props.parentCallback( yesterday.setDate(today.getDate() - 1), yesterday.setDate(today.getDate() - 1));
  }

  render() {
    const { from, to } = this.state;
    const modifiers = { start: from, end: to };
    return (
      <div className="filter-criteria">
        <DayPickerInput
          value={from}
          placeholder="From"
          format="LL"
          dayPickerProps={{
            selectedDays: [from, { from, to }],
            //disabledDays: { after: to },
            toMonth: to,
            modifiers,
            numberOfMonths: 2,
            onDayClick: () => this.to.getInput().focus(),
          }}
          onDayChange={this.handleFromChange}
        />{' '} <div className="spacing">-</div> 
          {' '}
        <div className="InputFromTo-to">
          <DayPickerInput
            ref={el => (this.to = el)}
            value={to}
            placeholder="To"
            format="LL"
            dayPickerProps={{
              selectedDays: [from, { from, to }],
              disabledDays: { before: from },
              modifiers,
              month: from,
              fromMonth: from,
              numberOfMonths: 2,
            }}
            onDayChange={this.handleToChange}
          />
        </div>
        <Button className="btn-search" onClick={this.sendTodayDate}
						size="small"
						variant="text"
					>
						Today
				</Button>
        <Button className="btn-search" onClick={this.sendYesterdayDate}
						size="small"
						variant="text"
					>
						Yesterday
				</Button>
        {/* <div className="btn" onClick={this.sendTodayDate}>Today</div> */}
      </div>
    );
  }
}