import React from "react";
import { ShieldCheck } from "lucide-react";

export const CookieStorageDisclosure = () => {
  return (
    <section
      aria-label="Cookie and Privacy Preference Storage Disclosure"
      className="rounded-2xl border border-amber-200/90 bg-amber-50/70 p-5 sm:p-6 shadow-xs text-slate-800 transition-all"
    >
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 flex-shrink-0 mt-0.5">
          <ShieldCheck size={22} className="text-amber-800" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-900">
            Cookie and Privacy Preference Storage
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
            Broadbeach Online Academy processes your cookie and privacy preference selections using the storage mechanisms implemented within your browser or device. Where preferences are retained locally, they remain within your browser's local storage or other applicable client-side storage. These selections are not transmitted to or retained on Broadbeach's application servers unless explicitly required by an identified backend consent-management function. Clearing your browser's stored site data may reset locally retained preferences, in which case you may be asked to provide your consent again.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CookieStorageDisclosure;
