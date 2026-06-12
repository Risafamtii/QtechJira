// Lightweight stand-in for destinations that aren't built yet.
const PlaceholderPage = ({ title, description = 'This page is coming soon.' }) => (
  <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
    <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
    <p className="mt-2 text-sm text-gray-500">{description}</p>
  </div>
);

export default PlaceholderPage;
