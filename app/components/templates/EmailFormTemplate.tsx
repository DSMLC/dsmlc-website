"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const EmailFormTemplate = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    const res = await fetch("/api/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setStatus(res.ok ? "sent" : "error");
  };

  const getButtonLabel = () => {
    switch (status) {
      case "sending":
        return "Sending...";
      case "sent":
        return "Message Sent!";
      case "error":
        return "Try Again";
      default:
        return "Send Message";
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto space-y-4 p-6 mb-8 bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite border dark:border-dark-dsmlcEnhancedParchment border-light-dsmlcEnhancedParchment shadow-lg dark:shadow-dark-dsmlcParchment shadow-light-dsmlcParchment rounded-4xl"
    >
      <input
        type="text"
        name="name"
        required
        placeholder="Your Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-3 border rounded-md dark:border-dark-dsmlcEnhancedParchment border-light-dsmlcEnhancedParchment shadow-lg dark:shadow-dark-dsmlcParchment shadow-light-dsmlcParchment "
      />
      <input
        type="email"
        name="email"
        required
        placeholder="Your Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-3 border rounded-md dark:border-dark-dsmlcEnhancedParchment border-light-dsmlcEnhancedParchment shadow-lg dark:shadow-dark-dsmlcParchment shadow-light-dsmlcParchment "
      />
      <textarea
        name="message"
        required
        placeholder="Your Message"
        value={formData.message}
        onChange={handleChange}
        className="w-full p-3 border rounded-md h-32 dark:border-dark-dsmlcEnhancedParchment border-light-dsmlcEnhancedParchment shadow-lg dark:shadow-dark-dsmlcParchment shadow-light-dsmlcParchment "
      />
      <div className="flex justify-center">
        <motion.button
          type="submit"
          disabled={status === "sending" || status === "sent"}
          whileHover={{ scale: status === "idle" ? 1.05 : 1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className={`group relative inline-flex items-center justify-center px-14 py-4 
          md:text-lg sm:text-base text-sm font-bold tracking-wider 
          ${
            status === "sending"
              ? "bg-gray-300 text-gray-400 cursor-not-allowed"
              : status === "sent"
                ? "bg-green-500 text-white"
                : status === "error"
                  ? "bg-red-500 text-white"
                  : "text-light-dsmlcBlack bg-dsmlcTangerine shadow-2xl transition-all duration-300 ease-out"
          } 
          rounded-full overflow-hidden 
          focus:outline-none focus:ring-2 focus:ring-offset-2 
          ${
            status === "sending"
              ? "focus:ring-transparent"
              : "focus:ring-dsmlcTangerine"
          }`}
        >
          <span className="relative z-10">{getButtonLabel()}</span>

          {status === "idle" && (
            <>
              <motion.span
                className="absolute right-4 transform -translate-y-1/2"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
              ></motion.span>
              <motion.span
                className="absolute inset-0 z-0 bg-dsmlcTangerine opacity-20"
                initial={{ scale: 0 }}
                animate={{ scale: 1.5 }}
                transition={{ duration: 0.4 }}
              />
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
};

export default EmailFormTemplate;
