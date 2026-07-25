import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <div>
        <h1 className="text-lg font-semibold">Email Scheduler</h1>
        <p className="text-sm text-slate-500">Schedule and track outbound emails</p>
      </div>
      {user ? (
        <div className="flex items-center gap-3">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="h-9 w-9 rounded-full" />
          ) : null}
          <div className="text-right text-sm">
            <p className="font-medium">{user.name}</p>
            <p className="text-slate-500">{user.email}</p>
          </div>
          <Button variant="secondary" onClick={logout}>
            Logout
          </Button>
        </div>
      ) : null}
    </header>
  );
}
