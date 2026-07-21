import { useState } from "react";
import { auth } from "@/firebase/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true); // <-- Added state to track mode
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // One single submit handler that checks the current mode
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login p-4 w-full min-h-screen flex items-center justify-center transition-colors duration-300 bg-gray-100 text-gray-900">
      <div
        className="p-15 rounded-2xl shadow-xl border transition-colors duration-300 bg-white text-gray-900 border-gray-200 w-full max-w-md"
        role="region"
        aria-labelledby="login-heading"
      >
        <header className="text-center mb-6">
          <h3 id="login-heading" className="text-3xl italic text-gray-900">
            my board
          </h3>
          <p className="text-sm mt-1 text-gray-500">
            {isLoginMode ? "Access your account" : "Create a new account"}
          </p>
        </header>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 rounded-lg border bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              autoComplete={isLoginMode ? "current-password" : "new-password"}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 w-full px-4 py-2 rounded-lg border bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {isLoginMode && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <a href="#" className="text-indigo-600">
                Forgot?
              </a>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : isLoginMode
                ? "Sign in"
                : "Create account"}
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError(null);
              }}
              className="text-sm text-indigo-600 hover:underline focus:outline-none cursor-pointer"
            >
              {isLoginMode
                ? "Need an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
