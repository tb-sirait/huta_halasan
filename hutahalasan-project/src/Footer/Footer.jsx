import React from "react";
import "./footer.css";
import imgLogo from "../assets/logo_huta_halasan.jpg";

function Footer() {
  return (
    <>
      <div className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-left">
              <div className="footer-logo">
                <div className="footer-logo-icon">
                  <img src={imgLogo} alt="Huta Halasan Logo" />
                </div>
                <div>
                  <p className="footer-brand">Parmalim Bale Pasogit</p>
                  <p className="footer-brand-sub">Huta Halasan</p>
                </div>
              </div>

              <div className="map-embed">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.1!2d99.0766!3d2.5733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMsKwMzQnMjQuMCJOIDk5wrAwNCczNi4wIkU!5e0!3m2!1sen!2sid"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Huta Halasan"
                />
                <div className="map-address">
                  📍 Huta Halasan, H2G5+82, Sionggang Tengah,<br />
                  Kec. Lumban Julu, Toba, Sumatera Utara, Indonesia 22386
                </div>
              </div>
            </div>

            <div className="footer-right">
              <div className="footer-links">
                <ul>
                  <li><a href="#">Check the Latest News</a></li>
                  <li><a href="#">Learning the stories/news</a></li>
                  <li><a href="#">Improve the Knowledges</a></li>
                  <li><a href="#">Our Legalized Authorities</a></li>
                  <li><a href="#">Community Structure</a></li>
                </ul>
              </div>

              <div className="footer-legal-links">
                <a href="/terms">Terms &amp; Conditions</a>
                <a href="/about">About Us</a>
              </div>

              <div className="footer-description">
                <p>
                  Ugamo Malim adalah kepercayaan tradisional masyarakat Batak
                  yang berakar pada ajaran leluhur. Bale Pasogit Huta Halasan
                  hadir sebagai pusat kegiatan spiritual dan kebudayaan
                  Parmalim di Sumatera Utara.
                </p>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>
              {new Date().getFullYear()} © Parmalim Bale Pasogit Huta Halasan | All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;