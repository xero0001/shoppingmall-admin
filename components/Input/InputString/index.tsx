const InputString = ({
  value,
  handleChange = () => {},
  onChange = null,
  label,
  name,
  type = 'text',
  required = false,
  disabled = false,
}: any) => {
  return (
    <>
      <div className="font-bold text-gray-600 text-sm">{label}</div>
      <input
        className="rounded-md border border-gray-400 py-2 px-4 w-full"
        value={value}
        onChange={(e: any) => {
          if (onChange === null) {
            handleChange(
              name,
              type === 'number'
                ? e.target.value === ''
                  ? 0
                  : parseInt(e.target.value)
                : e.target.value
            );
          } else {
            onChange(e);
          }
        }}
        onKeyPress={(e: any) => {
          if (e.key === 'Enter') {
            e.preventDefault();
          }
        }}
        placeholder={label}
        name={name}
        type={type}
        required={required}
        disabled={disabled}
      />
    </>
  );
};

export default InputString;
