import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Form submitted");
  };

  const handleSignUp = () => {
    navigate("/board");
  };

  return (
    <section className="login p-4 w-full min-h-screen flex items-center justify-center transition-colors duration-300 bg-gray-100 text-gray-900">
      <div
        className="p-15 rounded-2xl shadow-xl border transition-colors duration-300 bg-white text-gray-900 border-gray-200"
        role="region"
        aria-labelledby="login-heading"
      >
        <header className="text-center mb-6">
          <h3 id="login-heading" className="text-3xl italic text-gray-900">
            my board
          </h3>
          <p className="text-sm mt-1 text-gray-500">Access your account</p>
        </header>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              type="email"
              className="mt-1 w-full px-4 py-2 rounded-lg border bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="mt-1 w-full px-4 py-2 rounded-lg border bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <a href="#" className="text-indigo-600">
              Forgot?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            Sign in
          </button>

          <button
            type="button"
            onClick={handleSignUp}
            className="w-full py-2.5 rounded-lg bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:outline-none"
          >
            Sign up
          </button>
        </form>
      </div>
    </section>
  );
};
export default Login;
