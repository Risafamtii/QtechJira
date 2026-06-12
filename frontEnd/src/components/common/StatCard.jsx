// Small summary card for the dashboard. `accent` is a Tailwind text color class.
const StatCard = ({ label, value, accent = 'text-gray-900' }) => (
  <div className="rounded-lg border bg-white p-5 shadow-sm">
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`mt-1 text-3xl font-semibold ${accent}`}>{value}</p>
  </div>
);

export default StatCard;
