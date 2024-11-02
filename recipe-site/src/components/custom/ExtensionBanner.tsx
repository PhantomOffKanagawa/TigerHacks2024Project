import { FC } from "react";
import { X } from "lucide-react";
import { useState } from "react";

export const ExtensionBanner: FC<{ dismissable: boolean }> = ({
  dismissable = true,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  if (dismissable) {
    return (
      <div className="fixed bottom-0 left-0 w-full bg-primary-600 border-b border-primary/20 px-4 py-2">
        <div className="flex justify-between items-center">
          <p className="text-sm text-primary">
            📦 Get our Chrome extension to save recipes from anywhere!{" "}
            <a
              // TODO: Add extension ID
              href="https://chrome.google.com/webstore/extension-id"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium hover:text-primary/80"
            >
              Install now
            </a>
          </p>
          <button
            onClick={() => setIsVisible(false)}
            className="text-primary/60 hover:text-primary"
            aria-label="Close banner"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <a
        href="https://chrome.google.com/webstore"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block group"
      >
        <div className="fixed bottom-0 left-0 w-full flex items-center justify-center p-4 bg-[#004D40]/90 backdrop-blur">
          <div className="w-full flex items-center space-x-4 bg-[#00BFA5] hover:bg-[#00A896] transition-all transform hover:scale-105 rounded-lg py-4 px-8">
            <div
              className="w-12 h-12 p-0 mt-[-24px] ms-[-12px]"
              style={{ fontSize: "48px" }}
            >
              📦
            </div>
            <div>
              <h3 className="font-bold text-xl">Get Our Chrome Extension</h3>
              <p className="opacity-90">
                Transform any recipe into an eco-friendly version
              </p>
            </div>
            <div className="flex-grow"></div>
            <svg
              className="w-6 h-6 transform group-hover:translate-x-2 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </a>
    );
  }

  return null;
};
