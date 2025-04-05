import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

interface AlertProps {
  type: 'success' | 'error';
  message: string;
}

export function Alert({ type, message }: AlertProps) {
  return (
    <div
      className={clsx(
        'rounded-md p-4 mb-4',
        type === 'success' ? 'bg-green-50' : 'bg-red-50'
      )}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {type === 'success' ? (
            <CheckCircle2
              className="h-5 w-5 text-green-400"
              aria-hidden="true"
            />
          ) : (
            <AlertCircle
              className="h-5 w-5 text-red-400"
              aria-hidden="true"
            />
          )}
        </div>
        <div className="ml-3">
          <p
            className={clsx(
              'text-sm font-medium',
              type === 'success' ? 'text-green-800' : 'text-red-800'
            )}
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}