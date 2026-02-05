const StatCard = ({ icon, label, value }) => {
  return (
    <div
      className="flex-1 rounded-2xl flex flex-row justify-between p-1 px-2 items-center min-h-[50px] transition-all duration-300 text-text-primary font-medium hover:-translate-y-0.5 md:flex-col md:justify-center md:text-center md:p-2 md:min-h-[70px] md:gap-1 max-[480px]:p-1 max-[480px]:min-h-[44px]"
      style={{
        background: "rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "rgba(0, 0, 0, 0.08) 0px 4px 12px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "rgba(0, 0, 0, 0.1) 0px 8px 24px";
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "rgba(0, 0, 0, 0.08) 0px 4px 12px";
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
      }}
    >
      <div className="flex flex-row items-center gap-2 font-medium text-xs md:flex-col md:gap-0.5 max-[480px]:text-[13px] max-[480px]:gap-1">
        <img
          src={icon}
          alt={`${label} Icon`}
          className="w-7 h-7 p-[5px] rounded-xl transition-transform duration-300 md:w-8 md:h-8 max-[480px]:w-8 max-[480px]:h-8 max-[480px]:p-[5px] group-hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            boxShadow: "rgba(102, 126, 234, 0.3) 0px 5px 15px",
          }}
        />
        <p className="m-0 text-text-secondary">{label}</p>
      </div>

      <p className="text-sm font-semibold text-text-primary m-0 md:text-[15px] max-[480px]:text-sm">
        {value}
      </p>
    </div>
  );
};

export default StatCard;
