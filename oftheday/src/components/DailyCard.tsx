import React from 'react';
import '../css/DailyCard.css';

const DailyCard = ({ type, data }) => {
  if (!data) {
    return <div className="daily-card loading">Loading...</div>;
  }

  return (
    <div className={`daily-card ${type}-card`}>
      {data.image && (
        <div className="card-image-container">
          <img src={data.image} alt={`${type} artwork`} className="card-image" />
        </div>
      )}
      <div className="card-content">
        <h3 className="card-title">{data.title}</h3>
        <p className="card-description">{data.description}</p>
        {data.extra && <p className="card-extra">{data.extra}</p>}
      </div>
    </div>
  );
};

export default DailyCard;