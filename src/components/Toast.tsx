
import React from 'react';

interface ToastProps {
  id: string;
}

const Toast: React.FC<ToastProps> = ({ id }) => {
  return (
    <div id={id} className="toast">
      <div className="toast-content">
        <span id="toast-message"></span>
      </div>
    </div>
  );
};

export default Toast;
