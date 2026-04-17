// src/components/ui/Toast.jsx
import "../../../src/styles/user.css";

const ICONS = { success: "✓", error: "✕", warning: "⚠", info: "ℹ" };

export const ToastContainer = ({ toasts, removeToast }) => (
  <div className="toast-container">
    {toasts.map((t) => (
      <div key={t.id} className={`toast-item toast-item-${t.type}`}>
        <span className="toast-item-icon">{ICONS[t.type]}</span>
        <span className="toast-item-msg">{t.message}</span>
        <button className="toast-item-close" onClick={() => removeToast(t.id)}>
          ✕
        </button>
      </div>
    ))}
  </div>
);
