import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { itemsForRole } from '../../utils/menuConfig';

const Sidebar = () => {
  const { role } = useAuth();
  const items = itemsForRole(role);

  const linkClass = ({ isActive }) =>
    `block rounded-md px-3 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <aside className="flex w-60 flex-shrink-0 flex-col bg-gray-800">
      <div className="border-b border-gray-700 px-6 py-4">
        <span className="text-lg font-semibold text-white">Ticket System</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map((item) => (
          <NavLink key={item.path} to={item.path} className={linkClass} end>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
