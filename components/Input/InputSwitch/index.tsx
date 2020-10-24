const InputSwitch = ({ value, handleChange, label, name, color }: any) => {
  return (
    <>
      <div className="font-bold text-gray-600 text-sm">{label}</div>
      <style jsx>
        {`
          .switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }

          .slider {
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 32px;
          }

          .slider:before {
            position: absolute;
            content: '';
            height: 24px;
            width: 24px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            border-radius: 50%;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            -webkit-transition: 200ms;
            transition: 200ms;
          }

          input:checked + .slider {
            background-color: #4a5568;
          }

          .green:checked + .slider {
            background-color: rgb(60, 210, 148) !important;
          }

          .red:checked + .slider {
            background-color: #e53e3e !important;
          }

          .blue:checked + .slider {
            background-color: rgb(77, 81, 255) !important;
          }

          input:checked + .slider:before {
            -webkit-transform: translateX(32px);
            -ms-transform: translateX(32px);
            transform: translateX(32px);
          }
        `}
      </style>
      <label className="switch relative inline-block w-16 h-8">
        <input
          type="checkbox"
          className={`${color === 'red' && `red`}
          ${color === 'green' && `green`}
            ${color === 'blue' && `blue`}
          `}
          checked={value}
          onChange={() => {
            if (value === true) {
              handleChange(name, false);
            } else {
              handleChange(name, true);
            }
          }}
        />
        <span className="slider absolute cursor-pointer transition duration-200 ease-in-out bg-gray-400"></span>
      </label>
    </>
  );
};

export default InputSwitch;
