import React, { use, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const SignUpPage = () => {
  const [ showPassword, setShowPassword ] = useState(false);
  const [ formData, setFormData ] = useState({
    email: "",
    name: "",
    username: "",
    password: "",
  });

  const { signUp, isSigningUp } = useAuthStore();

  const validateUsername = (username) => {
    const usernameRegex = /^@[a-z0-9_]{2,29}$/;
    if (!username.trim()) {
      return "Username is required";
    }
    if(username.length < 5) return "Username must be at least 5 characters";
    if(username[0] !== "@") return "Username must start with @";
    if (!usernameRegex.test(username)) {
      return "Username must start with @, be 3-30 characters long, and only contain lowercase letters, numbers, and underscores. No additional '@' allowed.";
    }
    return ""; // No error
  };

  const validateForm = () => {
    console.log(formData);
    if (!formData.name.trim()) return toast.error("Name is required");
    const usernameError = validateUsername(formData.username);
    if (usernameError) return toast.error(usernameError);

    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    return true;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    
    const success = validateForm();
    if(success) {
      signUp(formData);
    }
  }

  return (
    <div className="h-[100dvh] pt-[6rem]">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8 p-6">
          {/* LOGO */}
          <div className="text-center mb-2">
            <div className="flex items-center gap-4 group">
              <div
                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
              >
                <MessageSquare className="size-6 text-primary" />
              </div>
              <div className='text-left'>
                <h1 className="text-2xl font-bold">Create Account</h1>
                <p className="text-base-content/60">Get started with your free account</p>
              </div>
            </div>
          </div>
          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40 z-10" />
                </div>
                <input
                  required
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Username</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40 z-10" />
                </div>
                <input
                  required
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="@johndoe01"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40 z-10" />
                </div>
                <input
                  required
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40 z-10" />
                </div>
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40 z-10" />
                  ) : (
                    <Eye className="size-5 text-base-content/40 z-10" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary mt-4 w-full" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : "Create Account"}
            </button>
          </form>
          {/* FOOTER */}
          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
