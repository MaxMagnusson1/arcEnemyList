import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

export default function GoogleLoginButton({ onSuccess }) {
  return (
    <div>
      <GoogleLogin
        onSuccess={credentialResponse => {
          if (credentialResponse.credential) {
            const decoded = jwtDecode(credentialResponse.credential);
            
            onSuccess(decoded);
          }
        }}
        onError={() => {
        }}
      />
    </div>
  );
}


