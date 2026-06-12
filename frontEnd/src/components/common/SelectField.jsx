// Labeled select that mirrors InputField's API.
// `options` is an array of { value, label } or plain strings.
const SelectField = ({
  label,
  name,
  value,
  onChange,
  error,
  options = [],
  ...props
}) => (
  <div className="space-y-1">
    {label && (
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
    )}
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className={`block w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 ${
        error
          ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
      }`}
      {...props}
    >
      {options.map((opt) => {
        const val = typeof opt === 'string' ? opt : opt.value;
        const text = typeof opt === 'string' ? opt : opt.label;
        return (
          <option key={val} value={val}>
            {text}
          </option>
        );
      })}
    </select>
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
);

export default SelectField;
