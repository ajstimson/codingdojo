const FancyBorder = ({ children }) => {
  return (
    <div className="outer-border">
      <div className="mid-border">
        <div className="inner-border">{children}</div>
      </div>
    </div>
  );
};

export default FancyBorder;
