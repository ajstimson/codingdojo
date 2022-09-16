const SubContents = (instance) => {
  const i = instance.prop;
  const rutherford =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/President_Rutherford_Hayes_1870_-_1880_Restored.jpg/197px-President_Rutherford_Hayes_1870_-_1880_Restored.jpg";
  const garfield =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/James_Abram_Garfield%2C_photo_portrait_seated.jpg/200px-James_Abram_Garfield%2C_photo_portrait_seated.jpg";
  const abe =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Abraham_Lincoln_November_1863.jpg/194px-Abraham_Lincoln_November_1863.jpg";
  return (
    <div className="sub-contents">
      <img
        src={i === 1 ? rutherford : i === 2 ? abe : garfield}
        alt="a presidential beard"
      />
    </div>
  );
};

export default SubContents;
