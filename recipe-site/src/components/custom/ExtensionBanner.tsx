import { FC } from 'react';
import { X } from 'lucide-react';
import { useState } from 'react';

export const ExtensionBanner: FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-primary-600 border-b border-primary/20 px-4 py-2">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <p className="text-sm text-primary">
          📦 Get our Chrome extension to save recipes from anywhere!{' '}
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
};