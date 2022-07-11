import React from "react";
import ticketImage from "./../img/ticket.png";


function Header() {
  return (
    <React.Fragment>
      <h1>Help Queue</h1>
      <img src={ticketImage} alt="An image of a ticket" />
    </React.Fragment>
  );
}

export default Header;