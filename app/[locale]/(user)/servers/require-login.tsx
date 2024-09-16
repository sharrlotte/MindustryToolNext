import LoginButton from '@/components/button/login-button';
import Tran from '@/components/common/tran';

export function RequireLogin() {
  return (
    <div>
      <p>
        <Tran text="server.require-login" />
      </p>
      <LoginButton />
    </div>
  );
}
