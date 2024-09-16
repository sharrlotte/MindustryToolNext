import LoginButton from '@/components/button/login-button';

export function RequireLogin() {
  return (
    <div>
      <p>Please login to access your server list.</p>
      <LoginButton />
    </div>
  );
}
