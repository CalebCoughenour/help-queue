import React from 'react';
import NewTicketForm from './NewTicketForm';
import TicketList from './TicketList';
import TicketDetail from './TicketDetails';
import EditTicketForm from './EditTicketForm';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import * as a from './../actions';


class TicketControl extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      selectedTicket: null,
      editing: false
      // count: 0 commented out counter
    };
  }

  componentDidMount() {
    this.waitTimeUpdateTimer = setInterval(() =>
      this.updateTicketElapsedWaitTime(),
    60000
    );
  }

  componentDidUpdate() {
    console.log("component updated!");
  }

  componentWillUnmount(){
    clearInterval(this.waitTimeUpdateTimer);
  }

  updateTicketElapsedWaitTime = () => {
    const { dispatch } = this.props;
    Object.values(this.props.mainTicketList).forEach(ticket => {
      const newFormattedWaitTime = ticket.timeOpen.fromNow(true);
      const action = a.updateTime(ticket.id, newFormattedWaitTime);
      dispatch(action);
    });
  }

  handleClick = () => {
    if (this.state.selectedTicket != null) {
      this.setState({
        selectedTicket: null,
        editing: false
      });
    } else {
      const { dispatch } = this.props;
      const action = a.toggleForm();
      dispatch(action);
    }
  }

  handleAddingNewTicketToList = () => {
    const { dispatch } = this.props;
    const action = a.toggleForm();
    dispatch(action);
  }

  handleChangingSelectedTicket = (id) => {
    const selectedTicket = this.props.mainTicketList[id];
    this.setState({selectedTicket: selectedTicket});
  }

  handleDeletingTicket = (id) => {
    const { dispatch } = this.props;
    const action = a.deleteTicket(id);
    dispatch(action);
    this.setState({selectedTicket: null});
  }

  handleEditingTicketInList = (ticketToEdit) => {
    const { dispatch } = this.props;
    const action = a.addTicket(ticketToEdit);
    dispatch(action);
    this.setState({
      editing: false,
      selectedTicket: null
    });
  }

  handleEditClick = () => {
    console.log("handleEditClick reached!");
    this.setState({editing: true});
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 })
  }

  decrement = () => {
    this.setState({ count: this.state.count - 1 })
  }

  render() {
    let currentlyVisibleState = null;
    let buttonText = null;

    if(this.state.editing) {
      currentlyVisibleState = <EditTicketForm ticket = {this.state.selectedTicket} onEditTicket = {this.handleEditingTicket} />
      buttonText= "Return to List";
    } else if (this.state.selectedTicket != null) {
        currentlyVisibleState = <TicketDetail 
        ticket = {this.state.selectedTicket} 
        onClickingDelete = {this.handleDeletingTicket} 
        onClickingEdit = {this.handleEditClick}
      />
      buttonText= "Return to List";
    }
    else if (this.props.formVisibileOnPage) {
      currentlyVisibleState = <NewTicketForm onNewTicketCreation={this.handleAddingNewTicketToList} />;
      buttonText = "Return to Ticket List";
    } else {
      currentlyVisibleState = <TicketList ticketList={this.props.mainTicketList} onTicketSelection={this.handleChangingSelectedTicket} />;
      buttonText = "Add Ticket";
    }
    return(
      <React.Fragment>
        {currentlyVisibleState}
        <button onClick={this.handleClick}>{buttonText}</button>
        {/* <button onClick={this.increment} className="counter">+</button>
        <button onClick={this.decrement} className="counter">-</button>
        <h4>{this.state.count}</h4> */}
      </React.Fragment>
    );
  }
}

TicketControl.propTypes = {
  mainTicketList: PropTypes.object,
  formVisibileOnPage: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    mainTicketList: state.mainTicketList,
    formVisibleOnPage: state.formVisibleOnPage
  }
}

TicketControl = connect(mapStateToProps)(TicketControl);

export default TicketControl;