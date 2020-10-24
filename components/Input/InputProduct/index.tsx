const InputProduct = ({
  value,
  handleChange,
  label,
  name,
  type = 'text',
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
        type={type}
        required={required}
      />
    </>
  );
};

export default InputProduct;
