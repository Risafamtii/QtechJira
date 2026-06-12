import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStats } from '../../features/dashboard/dashboardSlice';
import useAuth from '../../hooks/useAuth';
import {
  ROLES,
  TICKET_STATUSES,
  TICKET_PRIORITIES,
  STATUS_BADGE,
  PRIORITY_BADGE,
} from '../../utils/constants';
import StatCard from '../../components/common/StatCard';
import Spinner from '../../components/common/Spinner';

// Reuse the badge color maps to tint the matching stat values.
const accentFromBadge = (badgeClass) =>
  badgeClass?.split(' ').find((c) => c.startsWith('text-')) || 'text-gray-900';

const SCOPE_LABEL = {
  [ROLES.ADMIN]: 'All tickets',
  [ROLES.AGENT]: 'Tickets assigned to you',
  [ROLES.USER]: 'Your tickets',
};

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { stats, status, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        {user ? `Welcome back, ${user.name}.` : ''}{' '}
        {user && (
          <span className="text-gray-400">· {SCOPE_LABEL[user.role]}</span>
        )}
      </p>

      {status === 'loading' && (
        <div className="mt-12 flex items-center justify-center gap-2 py-16 text-gray-500">
          <Spinner className="h-5 w-5" /> Loading statistics…
        </div>
      )}

      {status === 'failed' && (
        <div className="mt-6 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {status === 'succeeded' && stats && (
        <div className="mt-6 space-y-8">
          {/* Status summary */}
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              By status
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              <StatCard label="Total" value={stats.total} accent="text-indigo-600" />
              {TICKET_STATUSES.map((s) => (
                <StatCard
                  key={s}
                  label={s}
                  value={stats.byStatus?.[s] ?? 0}
                  accent={accentFromBadge(STATUS_BADGE[s])}
                />
              ))}
            </div>
          </section>

          {/* Priority summary */}
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              By priority
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {TICKET_PRIORITIES.map((p) => (
                <StatCard
                  key={p}
                  label={p}
                  value={stats.byPriority?.[p] ?? 0}
                  accent={accentFromBadge(PRIORITY_BADGE[p])}
                />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
