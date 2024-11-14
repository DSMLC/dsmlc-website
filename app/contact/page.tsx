"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      setFormStatus(result);
    } catch (error) {
      setFormStatus({ success: false, message: "Error sending email." });
    }
  };

  return (
    <div className="bg-dsmlcWhite flex items-center justify-center px-4 sm:px-6 lg:px-8 py-48">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl w-full bg-dsmlcParchment shadow-2xl rounded-4xl overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row">
          {/* Left Side: Contact Information */}
          <div className="lg:w-2/5 bg-dsmlcDataOrange p-12 flex flex-col justify-center">
            <h2 className="text-4xl font-extrabold text-dsmlcWhite font-redHat mb-6">
              Get in Touch
            </h2>
            <p className="text-xl text-dsmlcParchment font-quicksand mb-8">
              We&apos;d love to hear from you. Send us a message and we&apos;ll respond as
              soon as possible.
            </p>
            <div className="space-y-6">
              <div className="flex items-center text-dsmlcWhite">
                {/* Email Icon and Email Address */}
                <span className="font-quicksand text-lg">
                  datascienceclub@ucalgary.ca
                </span>
              </div>
            </div>
          </div>
          {/* Right Side: Contact Form */}
          <div className="lg:w-3/5 p-12">
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-lg font-medium text-dsmlcBlack font-redHat mb-2"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="block w-full px-4 py-3 border border-dsmlcTangerine rounded-md shadow-sm placeholder-dsmlcBlack/60 focus:outline-none focus:ring-dsmlcDataOrange focus:border-dsmlcDataOrange text-base font-quicksand"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-lg font-medium text-dsmlcBlack font-redHat mb-2"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full px-4 py-3 border border-dsmlcTangerine rounded-md shadow-sm placeholder-dsmlcBlack/60 focus:outline-none focus:ring-dsmlcDataOrange focus:border-dsmlcDataOrange text-base font-quicksand"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-lg font-medium text-dsmlcBlack font-redHat mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="block w-full px-4 py-3 border border-dsmlcTangerine rounded-md shadow-sm placeholder-dsmlcBlack/60 focus:outline-none focus:ring-dsmlcDataOrange focus:border-dsmlcDataOrange text-base font-quicksand"
                  placeholder="Your message here..."
                ></textarea>
              </div>
              <div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-dsmlcWhite bg-dsmlcDataOrange hover:bg-dsmlcTangerine focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dsmlcDataOrange font-redHat transition-colors duration-200"
                >
                  Send Message
                </motion.button>
              </div>
            </form>
            {formStatus && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`mt-6 p-4 rounded-md ${
                  formStatus.success
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                } font-quicksand text-lg`}
              >
                {formStatus.message}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
