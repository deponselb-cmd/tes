import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSignIn } from '../hooks/useAuth';

const Login = () => {
  const { signIn } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signIn(email, password, rememberMe);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen flex flex-col relative overflow-x-hidden transition-colors duration-300">
      {/* Background Visuals */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(circle at 70% 20%, #36e27b 0%, transparent 25%), radial-gradient(circle at 30% 80%, #36e27b 0%, transparent 25%)`
        }}
      >
      </div>
      <div 
        className="absolute inset-0 z-0 opacity-5 pointer-events-none bg-cover bg-center mix-blend-overlay" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=2664&auto=format&fit=crop')"
        }}
        data-alt="Abstract financial graph chart background"
      ></div>

      <div className="layout-container flex h-full grow flex-col relative z-10 justify-center items-center p-4">
        {/* Login Card */}
        <div className="w-full max-w-[480px] bg-white dark:bg-surface-dark rounded-lg shadow-2xl overflow-hidden border border-gray-200 dark:border-border-dark backdrop-blur-sm">
          <div className="p-8 sm:p-10 flex flex-col gap-6">
            {/* Header / Logo */}
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-primary text-3xl">insights</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome Back</h1>
              <p className="text-slate-500 dark:text-[#9eb7a8] text-sm font-normal">Please enter your details to sign in to FinTrack.</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-700 dark:text-white text-sm font-medium ml-1">Email Address</label>
                <input 
                  className="form-input flex w-full rounded-xl border border-gray-300 dark:border-border-dark bg-transparent dark:bg-[#111714] text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 focus:border-primary h-12 px-5 text-base font-normal placeholder:text-slate-400 dark:placeholder:text-[#9eb7a8]/50 transition-shadow" 
                  placeholder="name@company.com" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-700 dark:text-white text-sm font-medium ml-1">Password</label>
                <div className="relative flex w-full items-center">
                  <input 
                    className="form-input flex w-full rounded-xl border border-gray-300 dark:border-border-dark bg-transparent dark:bg-[#111714] text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 focus:border-primary h-12 pl-5 pr-12 text-base font-normal placeholder:text-slate-400 dark:placeholder:text-[#9eb7a8]/50 transition-shadow" 
                    placeholder="Enter your password" 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <button 
                    className="absolute right-4 text-slate-400 dark:text-[#9eb7a8] hover:text-primary transition-colors flex items-center justify-center" 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span 
                      className="material-symbols-outlined" 
                      style={{fontSize: '20px'}}
                    >
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Controls: Remember Me & Forgot Password */}
              <div className="flex flex-wrap items-center justify-between gap-3 mt-1">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    className="h-5 w-5 rounded border-gray-300 dark:border-[#3d5245] bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0 transition-colors cursor-pointer" 
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                  />
                  <span className="text-slate-600 dark:text-[#9eb7a8] text-sm font-normal group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Remember for 30 days</span>
                </label>
                <a className="text-sm font-medium text-slate-600 dark:text-[#9eb7a8] hover:text-primary transition-colors" href="#">Forgot password?</a>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full h-12 bg-primary hover:bg-primary/90 text-background-dark text-base font-bold rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>


            </form>

            {/* Footer */}
            <div className="text-center">
              <p className="text-slate-500 dark:text-[#9eb7a8] text-sm">
                Don't have an account? 
                <Link className="text-primary font-medium hover:underline ml-1" to="/signup">Sign up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
