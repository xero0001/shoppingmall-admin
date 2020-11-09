const InputSwitch = ({ value, handleChange, label, name, options }: any) => {
  return (
    <>
      <div className="font-bold text-gray-600 text-sm">{label}</div>
      <select
        value={value}
        onChange={(e: any) => {
          handleChange(name, e.target.value);
        }}
        className="border border-gray-600 text-sm w-32 p-2"
      >
        {options.map((option: any) => {
          return <option key={option.id} value={option.id}>{option.name}</option>;
        })}
      </select>
    </>
  );
};

export default InputSwitch;
