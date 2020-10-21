const InputString = ({
  value,
  handleChange,
  label,
  name,
  required = false,
}: any) => {
  return (
    <>
      <div className="font-bold text-gray-600 text-sm">{label}</div>
      <input
        className="rounded-md border border-gray-400 py-2 px-4 w-full"
        value={value}
        onChange={(e) => handleChange(name, e.target.value)}
        placeholder={label}
        name={name}
        required={required}
      />
    </>
  );
};

export default InputString;
