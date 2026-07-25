import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginWithGoogle } from '../../services/auth.service';
import { useAuth } from '../../hooks/useAuth';

export function GoogleLoginButton() {
  const { setSession } = useAuth();
  const navigate = useNavigate();

  async function handleSuccess(response: CredentialResponse) {
    if (!response.credential) return;
    try {
      const session = await loginWithGoogle(response.credential);
      setSession(session.token, session.user);
      toast.success(`Welcome back, ${session.user.name}!`);
      navigate('/');
    } catch {
      toast.error('Login failed. Please try again.');
    }
  }

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => toast.error('Google sign-in was cancelled or failed.')}
      useOneTap={false}
    />
  );
}
