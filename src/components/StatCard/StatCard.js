import "./StatCard.css";

const StatCard = ({ icon, label, value }) => {
  return (
    <>
      <div className="stat-div">
        <div className="icon-text-div">
          <img src={icon} alt={`${label} Icon`} className="stat-icon" />
          <p className="stat-name">{label}</p>
        </div>

        <p className="stat-value">{value}</p>
      </div>
    </>
  );
};

export default StatCard;
