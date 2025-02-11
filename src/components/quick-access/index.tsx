import { useNavigate } from 'react-router-dom';

export function QuickAccessItem({
  icon,
  name,
  alias,
  navLink,
}: {
  icon: React.ReactNode;
  name: string;
  alias: string;
  navLink: string;
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (navLink) navigate(navLink);
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      className="flex items-center gap-3 p-3 transition bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
      <div className="text-blue-500">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{name}</div>
        <div className="text-xs text-gray-500 truncate">{alias}</div>
      </div>
    </div>
  );
}
