import { signInWithGoogle } from "../services/firebaseAuth";
import axios from "../api/axios";

export default function GoogleLoginButton() {

  const handleGoogleLogin = async () => {
    try {

      const firebaseUser = await signInWithGoogle();

      const res = await axios.post("/auth/google", {
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        photo: firebaseUser.photoURL,
        uid: firebaseUser.uid,
      });

      localStorage.setItem("token", res.data.token);

      window.location.href = "/dashboard";

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="google-btn"
    >
      Continue with Google
    </button>
  );
}