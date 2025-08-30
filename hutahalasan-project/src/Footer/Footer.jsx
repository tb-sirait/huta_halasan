import React from "react";
import "./footer.css";

function Footer() {
  return (
    <>
      <div className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-left">
              <div className="footer-logo">
                <div className="footer-logo-icon"></div>
                <div>
                  <p className="footer-brand">Parmalim Bale Pasogit</p>
                  <p className="footer-brand-sub">Huta Halasan</p>
                </div>
              </div>
              <div className="footer-map">
                <div className="map-placeholder">
                  <p>
                    Huta Halasan
                    <br />
                    1005+GH, Sionggang, Tapanuli Utara,
                    <br />
                    Lumban Julu, Toba, Sumatera Utara
                    <br />
                    North Sumatera 22316, Indonesia
                  </p>
                </div>
              </div>
            </div>
            <div className="footer-right">
              <div className="footer-links">
                <ul>
                  <li>
                    <a href="#">Check the Latest News</a>
                  </li>
                  <li>
                    <a href="#">Learning the stories/news</a>
                  </li>
                  <li>
                    <a href="#">Improve the Knowledges</a>
                  </li>
                  <li>
                    <a href="#">Our Legalized Authorities</a>
                  </li>
                  <li>
                    <a href="#">Community Structure</a>
                  </li>
                </ul>
              </div>
              <div className="footer-description">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                  tempor leo elit, nec fringilla ipsum bibendum sed. Nulla
                  iaculisque ligula vel arcu bibendum molestie. Donec vehicula
                  est posuere facilisi mauris. Mauris varius sagittis arcu. Nec
                  convallis pettentesque bibendum nam netus consequat tellus.
                  Cras laoreet. Donec non elit magna.
                </p>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>2023 © Bale Pasogit Huta Halasan | All Rights Reserved</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
