const InputRate = ({
  value,
  onChange = () => {},
  handleChange = () => {},
  label,
  name,
}: any) => {
  const inputRate = [1, 2, 3, 4, 5];

  return (
    <>
      <div className="text-black text-sm">{label}</div>
      <input
        className="hidden"
        type="number"
        min={1}
        max={5}
        value={value}
        required={true}
        name={name}
        onChange={(e: any) => {
          onChange(e);
        }}
      />
      <ul className="flex flex-row items-center">
        {inputRate.map((input: number) => {
          return (
            <li key={input}>
              <svg
                className={`mr-2 cursor-pointer ${
                  value >= input ? 'text-yellow-500' : 'text-gray-200'
                }`}
                onClick={() => handleChange(input)}
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
              </svg>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default InputRate;
