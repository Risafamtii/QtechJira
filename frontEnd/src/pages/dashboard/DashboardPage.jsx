import useAuth from '../../hooks/useAuth';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      {user && (
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user.name}.
        </p>
      )}

      <div className="mt-12 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white py-20 text-center">
        <h2 className="text-xl font-medium text-gray-700">Dashboard — coming soon</h2>
        <p className="mt-2 max-w-md text-sm text-gray-500">
          Ticket statistics and summary cards will appear here.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
