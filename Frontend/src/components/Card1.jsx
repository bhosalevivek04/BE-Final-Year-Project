import React from 'react';
// import PropTypes from 'prop-types'; // Importing PropTypes for prop validation
import '../styles/Card.css';

const Card = ({ title, description, onClick }) => {
  return (
    <div className="card" onClick={onClick}>
      <div className="card-content">
        <h2 className="card-title">{title}</h2>
        <p className="card-description">{description}</p>
        <button className='clickhere'>Click Here..</button>
      </div>
    </div>
  );
};

export default Card;