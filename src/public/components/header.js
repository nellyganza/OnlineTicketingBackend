import React from "react";

class header extends React.Component {
  render() {
    return (
      <header
        className="header"
        style={{
          backgroundColor: "#0873bb"
        }}
      >
        <div
          className="topbar clearfix"
          style={{
            backgroundColor: "#0873bb"
          }}
        >
          <div className="container">
            <div className="row-fluid">
              <div
                className="col-md-6 col-sm-6 text-left"
                style={{
                  backgroundColor: "#0873bb"
                }}
              >
                <p>
                  <strong>
                    <i className="fa fa-phone" />
                  </strong>{" "}
                  +250781182427   
                  <strong>
                    <i className="fa fa-envelope" />
                  </strong>{" "}
                  <a href="mailto:intercoregroup@gmail.com">
                    intercoregroup@gmail.com
                  </a>
                </p>
              </div>
              {}
              <div className="col-md-6 col-sm-6 hidden-xs text-right">
                <div className="social">
                  <a
                    className="facebook"
                    href="#"
                    data-tooltip="tooltip"
                    data-placement="bottom"
                    title="Facebook"
                  >
                    <i className="fa fa-facebook" />
                  </a>
                  <a
                    className="twitter"
                    href="#"
                    data-tooltip="tooltip"
                    data-placement="bottom"
                    title="Twitter"
                  >
                    <i className="fa fa-twitter" />
                  </a>
                  <a
                    className="linkedin"
                    href="#"
                    data-tooltip="tooltip"
                    data-placement="bottom"
                    title="Linkedin"
                  >
                    <i className="fa fa-linkedin" />
                  </a>
                  <a
                    className="pinterest"
                    href="#"
                    data-tooltip="tooltip"
                    data-placement="bottom"
                    title="Pinterest"
                  >
                    <i className="fa fa-pinterest" />
                  </a>
                </div>
                {}
              </div>
              {}
            </div>
            {}
          </div>
          {}
        </div>
        {}
        <div className="container">
          <nav className="navbar navbar-default yamm">
            <div className="navbar-header">
              <button
                type="button"
                className="navbar-toggle collapsed"
                data-toggle="collapse"
                data-target="#navbar"
                aria-expanded="false"
                aria-controls="navbar"
              >
                <span className="sr-only" />
                <span className="icon-bar" />
                <span className="icon-bar" />
                <span className="icon-bar" />
              </button>
              <div className="logo-normal-img">
                <a className="navbar-brand-img" href="index.html">
                  <img
                    src="assets/images/logo.png"
                    alt="Intercore Logo"
                    width="50px"
                    height="50px"
                  />
                </a>
              </div>
            </div>
            <div id="navbar" className="navbar-collapse collapse">
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <a href="index.html">Home</a>
                </li>
                <li className="dropdown yamm-fw yamm-half">
                  <a
                    href="#"
                    data-toggle="dropdown"
                    className="dropdown-toggle active"
                  >
                    live stream <b className="fa fa-angle-down" />
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <div className="yamm-content clearfix">
                        <div className="row-fluid">
                          <div className="col-md-6 col-sm-6">
                            <ul>
                              <li>
                                <a
                                  style={{
                                    whiteSpace: "nowrap"
                                  }}
                                  href="html/live.html"
                                >
                                  Music Concert
                                </a>
                              </li>
                              <li>
                                <a href="html/live.html">Sport </a>
                              </li>
                              <li>
                                <a href="html/live.html">Fashion</a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
                <li></li>
                <li>
                  <a href="html/ticket.html">Tickets</a>
                </li>
                <li className="dropdown yamm-fw yamm-half">
                  <a
                    href="#"
                    data-toggle="dropdown"
                    className="dropdown-toggle active"
                  >
                    Join us <b className="fa fa-angle-down" />
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <div className="yamm-content clearfix">
                        <div className="row-fluid">
                          <div className="col-md-6 col-sm-6">
                            <ul>
                              <li>
                                <a
                                  style={{
                                    whiteSpace: "nowrap"
                                  }}
                                  href="html/register-individual.html"
                                >
                                  Join as individual{" "}
                                </a>
                              </li>
                              <li>
                                <a
                                  style={{
                                    whiteSpace: "nowrap"
                                  }}
                                  href="html/register-organisation.html"
                                >
                                  Join as Organisation{" "}
                                </a>
                              </li>
                              <li>
                                <a href="html/login.html">Login</a>
                              </li>
                              <li hidden>
                                <a href="#">Logout</a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="html/page-contact.html">Contact</a>
                </li>
              </ul>
            </div>
          </nav>
          {}
        </div>
        {}
      </header>
    );
  }
}

export default header;
