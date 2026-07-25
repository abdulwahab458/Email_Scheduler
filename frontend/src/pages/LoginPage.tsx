import { GoogleLoginButton } from '../components/Auth/GoogleLoginButton';

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-2xl font-semibold">Email Scheduler</h1>
        <p className="mb-6 text-sm text-slate-600">Sign in with Google to manage scheduled emails.</p>
        <GoogleLoginButton />
      </div>
    </div>
  );
}
