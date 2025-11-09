import React, { useState, useEffect } from "react";
import { AlertCircle, X } from "lucide-react";
import "./maintenancealert.css";

const MaintenanceAlert = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState("id"); // 'id', 'en', 'btk'

  useEffect(() => {
    // Detect browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith("id")) {
      setLanguage("id");
    } else if (browserLang.startsWith("btk") || browserLang.includes("batak")) {
      setLanguage("btk");
    } else {
      setLanguage("en");
    }

    // Show modal on first load
    setIsOpen(true);

    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    document.body.style.overflow = "unset";
  };

  const content = {
    id: {
      title: "Website Dalam Pengembangan",
      description:
        "Website ini masih dalam tahap pengembangan dan merupakan konsep prototipe. Beberapa fitur mungkin belum berfungsi dengan sempurna atau masih dalam proses penyempurnaan. Kami mohon maaf atas ketidaknyamanan yang mungkin terjadi.",
      button: "Saya Mengerti",
      feedbackText: "Punya masukan untuk website kami?",
      feedbackLink: "Isi Formulir Masukan",
    },
    en: {
      title: "Website Under Development",
      description:
        "This website is still under development and represents a prototype concept. Some features may not work perfectly or are still being refined. We apologize for any inconvenience this may cause.",
      button: "I Understand",
      feedbackText: "Have suggestions for our website?",
      feedbackLink: "Fill Feedback Form",
    },
    btk: {
      title: "Website di tingki Paradehon.",
      description:
        "Situs web on tong dope dibahen jala konsep prototipe do i. Adong do pigapiga fitur na so boi dope dipangke manang na ingkon dipadenggan dope. Molo adong na so denggan alani on, mangido maaf ma hami.",
      button: "Hu Boto",
      feedbackText: "Adong do masukan tu situs web on?",
      feedbackLink: "Jala isi ma formulir on (Gabe masukan tu hami)",
    },
  };

  const currentContent = content[language];

  if (!isOpen) return null;

  return (
    <>
      <div className="maintenance-overlay" onClick={handleClose}></div>
      <div className="maintenance-modal">
        <button
          className="maintenance-close"
          onClick={handleClose}
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <div className="maintenance-icon">
          <AlertCircle size={56} strokeWidth={2} />
        </div>

        <h2 className="maintenance-title">{currentContent.title}</h2>

        <p className="maintenance-description">{currentContent.description}</p>

        <div className="maintenance-language-switcher">
          <button
            className={`lang-btn ${language === "id" ? "active" : ""}`}
            onClick={() => setLanguage("id")}
          >
            ID
          </button>
          <button
            className={`lang-btn ${language === "en" ? "active" : ""}`}
            onClick={() => setLanguage("en")}
          >
            EN
          </button>
          <button
            className={`lang-btn ${language === "btk" ? "active" : ""}`}
            onClick={() => setLanguage("btk")}
          >
            BTK
          </button>
        </div>

        <button className="maintenance-button" onClick={handleClose}>
          {currentContent.button}
        </button>

        <div className="maintenance-feedback">
          <p>{currentContent.feedbackText}</p>
          <a
            href="https://forms.google.com/your-form-id"
            target="_blank"
            rel="noopener noreferrer"
            className="feedback-link"
          >
            {currentContent.feedbackLink} →
          </a>
        </div>
      </div>
    </>
  );
};

export default MaintenanceAlert;
