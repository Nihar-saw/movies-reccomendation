import { signInWithGoogle } from "../services/firebaseAuth";
import axios from "../api/axios";

export default function GoogleLoginButton({ onLogin, onError }) {

  const handleGoogleLogin = async () => {
    try {
      if (onError) onError('');
      const firebaseUser = await signInWithGoogle();
      const idToken = await firebaseUser.getIdToken();

      const res = await axios.post("/auth/google", { idToken });

      if (res.data && res.data.success) {
        localStorage.setItem("cineai_token", res.data.token);
        if (onLogin) {
          onLogin(res.data.user, res.data.token);
        } else {
          window.location.href = "/";
        }
      } else {
        if (onError) onError("Failed to verify Google account with server.");
      }
    } catch (err) {
      console.error(err);
      if (onError) onError(err.message || "Google authentication failed.");
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="btn-social"
      type="button"
    >
      <span className="social-icon-placeholder">
        <svg width="18" height="18" viewBox="0 0 24 24" style={{ display: 'block' }}>
          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69a5.74 5.74 0 0 1-2.48 3.77v3.1h3.98c2.33-2.14 3.55-5.3 3.55-8.72z" />
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.98-3.1c-1.1.74-2.52 1.18-3.95 1.18-3.04 0-5.63-2.06-6.55-4.83H1.38v3.2A11.99 11.99 0 0 0 12 24z" />
          <path fill="#FBBC05" d="M5.45 14.34a7.22 7.22 0 0 1 0-4.68V6.46H1.38a11.99 11.99 0 0 0 0 11.08l4.07-3.2z" />
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42A11.92 11.92 0 0 0 12 0 11.99 11.99 0 0 0 1.38 6.46l4.07 3.2c.92-2.77 3.51-4.83 6.55-4.83z" />
        </svg>
      </span>
      Continue with Google
    </button>
  );
}