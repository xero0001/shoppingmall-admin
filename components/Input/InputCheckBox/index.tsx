const InputCheckBox = ({ value, handleChange, label }: any) => {
  return (
    <>
      <div className="font-bold text-gray-600 text-sm">{label}</div>
      <style jsx>
        {`
          .container {
            margin-bottom: 24px;
            cursor: pointer;
            font-size: 24px;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }

          /* Hide the browser's default checkbox */
          .container input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
            height: 0;
            width: 0;
          }

          /* Create a custom checkbox */
          .checkmark {
            position: absolute;
            top: 0;
            left: 0;
            height: 24px;
            width: 24px;
            background-color: white;
            border-width: 1px !important;
            border-radius: 2px;
          }

          /* On mouse-over, add a grey background color */
          .container:hover input ~ .checkmark {
            background-color: rgb(226, 232, 240);
          }

          /* When the checkbox is checked, add a blue background */
          .container input:checked ~ .checkmark {
            background-color: #a0aec0;
            border-color: #a0aec0;
          }

          /* Create the checkmark/indicator (hidden when not checked) */
          .checkmark:after {
            content: '';
            position: absolute;
            display: none;
          }

          /* Show the checkmark when checked */
          .container input:checked ~ .checkmark:after {
            display: block;
          }

          /* Style the checkmark/indicator */
          .container .checkmark:after {
            left: 8px;
            top: 4px;
            width: 7px;
            height: 12px;
            border: solid white;
            border-width: 0 3px 3px 0;
            -webkit-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            transform: rotate(45deg);
          }
        `}
      </style>
      <label className="container block relative w-6 cursor-pointer rounded transition duration-100 ease-in-out">
        <input
          type="checkbox"
          className="rounded-md border-gray-400 transition duration-100 ease-in-out"
          checked={value}
          onChange={() => handleChange()}
        />
        <span className="checkmark transition duration-100 ease-in-out"></span>
      </label>
    </>
  );
};

export default InputCheckBox;
