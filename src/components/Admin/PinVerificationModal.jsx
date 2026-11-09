import React, { useState, useRef, useEffect } from "react";
import { FaShieldAlt, FaLock, FaTimes, FaKey, FaExclamationTriangle, FaCheck } from "react-icons/fa";

const PinVerificationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Authorize Sensitive Administrative Operation",
  description = "A 4-digit security PIN is required to confirm and execute this critical administrative operation.",
  actionLabel = "Confirm & Execute",
  targetDetails = "",
  loading = false,
}) => {
  const [pinDigits, setPinDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    if (isOpen) {
      setPinDigits(["", "", "", ""]);
      setError("");
      setTimeout(() => {
        if (inputRefs[0].current) {
          inputRefs[0].current.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDigitChange = (index, value) => {
    // Only accept numeric digit
    const clean = value.replace(/[^0-9]/g, "");
    if (!clean && value !== "") return;

    const newDigits = [...pinDigits];
    newDigits[index] = clean.slice(-1); // Take latest single digit
    setPinDigits(newDigits);
    setError("");

    // Auto-advance to next input
    if (clean && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !pinDigits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (/^\d{4}$/.test(pasteData)) {
      const digits = pasteData.split("");
      setPinDigits(digits);
      inputRefs[3].current?.focus();
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const fullPin = pinDigits.join("");
    if (fullPin.length !== 4) {
      setError("Please enter all 4 digits of your security PIN.");
      return;
    }
    onConfirm(fullPin);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#131E4A] to-[#164C82] p-5 sm:p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            aria-label="Close modal"
          >
            <FaTimes size={13} />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-[#07162c] shadow-xs">
              <FaShieldAlt className="text-[10px]" />
              Security PIN Required
            </span>
            <span className="text-xs text-blue-200 font-medium">Step-Up Auth</span>
          </div>

          <h3 className="text-xl font-black text-white tracking-tight">
            {title}
          </h3>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            {description}
          </p>

          {targetDetails && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 break-all">
              <span className="font-bold text-slate-500 uppercase text-[10px] block font-sans mb-0.5">
                Target Operation:
              </span>
              {targetDetails}
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 flex items-center gap-2">
              <FaExclamationTriangle className="text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 4-Digit Input Boxes */}
          <form onSubmit={handleSubmit} className="pt-2 space-y-5">
            <div>
              <label className="block text-center text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Enter 4-Digit PIN
              </label>

              <div className="flex justify-center items-center gap-3" onPaste={handlePaste}>
                {pinDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={inputRefs[idx]}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    disabled={loading}
                    className={`w-14 h-14 text-center text-2xl font-black rounded-2xl border-2 transition-all outline-hidden ${
                      digit
                        ? "border-[#131E4A] bg-blue-50/40 text-[#131E4A]"
                        : "border-slate-200 bg-slate-50 text-slate-800 focus:border-[#131E4A] focus:bg-white"
                    } shadow-xs`}
                  />
                ))}
              </div>
            </div>

            {/* Quick Demo Helper Hint */}
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-2.5 text-center text-[11px] text-amber-900 flex items-center justify-between">
              <span className="font-semibold">Demo Evaluation PIN:</span>
              <button
                type="button"
                onClick={() => {
                  setPinDigits(["2", "0", "2", "6"]);
                  setError("");
                }}
                className="font-mono font-extrabold text-[#131E4A] bg-white px-2 py-0.5 rounded-lg border border-amber-300 hover:bg-amber-100 transition cursor-pointer"
              >
                Auto-Fill 2026
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || pinDigits.some((d) => !d)}
                className="px-6 py-2.5 rounded-xl bg-[#131E4A] hover:bg-[#164C82] text-white text-xs font-bold shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying PIN...</span>
                  </>
                ) : (
                  <>
                    <FaCheck size={11} />
                    <span>{actionLabel}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PinVerificationModal;
