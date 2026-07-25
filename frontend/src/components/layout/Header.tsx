import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { BrandMark } from './BrandMark';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <BrandMark size="sm" />
          <div>
            <h1 className="text-base font-bold tracking-tight text-white sm:text-lg">
              Email Scheduler
            </h1>
            <p className="hidden text-xs text-zinc-500 sm:block">
              Schedule and track outbound emails
            </p>
          </div>
        </div>
        {user ? (
          <div className="flex items-center gap-3 sm:gap-4">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt=""
                className="h-9 w-9 rounded-full ring-2 ring-violet-500/30"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold text-violet-300">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="hidden text-right text-sm sm:block">
              <p className="font-semibold text-zinc-100">{user.name}</p>
              <p className="text-xs text-zinc-500">{user.email}</p>
            </div>
            <Button variant="secondary" className="px-3 py-2 text-xs sm:text-sm" onClick={logout}>
              Logout
            </Button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
