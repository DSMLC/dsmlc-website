"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "../../contexts/AdminAuthContext";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, user, loading: authLoading } = useAdminAuth();
  const router = useRouter();

  // redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      router.push("/admin-dash");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        setError(error.message || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-dsmlcTangerine"></div>
          <p className="mt-4 text-lg font-redHat dark:text-dark-dsmlcBlack text-light-dsmlcBlack">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite border border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment shadow-lg dark:shadow-dark-dsmlcParchment shadow-light-dsmlcParchment rounded-4xl p-8">
          {/* header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-redHat text-dsmlcTangerine mb-2">
              Admin Portal
            </h1>
            <p className="text-sm dark:text-dark-dsmlcBlack text-light-dsmlcBlack opacity-70">
              Sign in with your credentials to access the admin dashboard
            </p>
          </div>

          {/* error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300 rounded-xl">
              <span className="font-medium">Error: </span>
              <span>{error}</span>
            </div>
          )}

          {/* login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium dark:text-dark-dsmlcBlack text-light-dsmlcBlack mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input input-bordered w-full bg-transparent border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment focus:border-dsmlcTangerine focus:ring-dsmlcTangerine dark:text-dark-dsmlcBlack text-light-dsmlcBlack"
                placeholder="email@example.com"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium dark:text-dark-dsmlcBlack text-light-dsmlcBlack mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input input-bordered w-full bg-transparent border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment focus:border-dsmlcTangerine focus:ring-dsmlcTangerine dark:text-dark-dsmlcBlack text-light-dsmlcBlack"
                placeholder="Password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn w-full bg-dsmlcTangerine hover:bg-dsmlcTangerine/90 border-dsmlcTangerine text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
