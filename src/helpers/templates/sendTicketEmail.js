import dotenv from 'dotenv';

dotenv.config();

export const sentTicket = (emailData) => {
  const template2 = `<!DOCTYPE html>
        <html>
        <head>
            <style>
                html { -webkit-print-color-adjust: exact;zoom: 0.75; }
                @import url('https://fonts.googleapis.com/css?family=Oswald');
                * {
                    margin: 0 !important;
                    padding: 0 !important;
                    border: 0 !important;
                    box-sizing: border-box !important;
                }

                body {
                    background-color: #dadde6 !important;
                    font-family: arial !important;
                    height:100px !important;
                }
                    
                h1 {
                    text-transform: uppercase !important;
                    font-weight: 900 !important;
                    border-left: 10px solid #fec500 !important;
                    padding-left: 10px !important;
                    margin-bottom: 30px !important;
                }

                .row {
                    overflow: hidden;
                    padding-top: 50px;
                    margin:30px;
                    padding: 50px;
                    padding-left: 10%;
                    background-image: url(${process.env.HOST}/api/v1/files/${emailData.bgTicket}) !important;
                    background-repeat: no-repeat;
                    background-position: center;
                    background-size: cover;
                    width: 100%;
                    /* adjust as needed */
                    height: 450px;
                    /* adjust as needed */
                    border-radius: 10px;
                    box-shadow: #989898 2px;
                    border: 3px white solid;
                }

                 .card {
                    display: grid;
                    grid-template-areas: 'info info info info qr';
                    width: 50%;
                    right: 0 !important;
                    position: absolute;
                    background-color: #fff;
                    color: #989898;
                    border-radius: 4px; 
                }
                .vericaltext {
                    writing-mode: vertical-lr !important;
                    text-orientation: upright !important;
                    position: absolute !important;
                    right: 0 !important;
                    background-color: green !important;
                    height: 90% !important;
                    text-align: center !important;
                    color: white !important;
                    padding: 5px 5px 0px 0px !important;
                    margin-right: -13px !important;
                }

                .card-cont {
                    grid-area: info !important;
                    font-size: 85% !important;
                    position: relative !important;
                    padding: 5px 5px 15px 15px !important;
                    border-right: 2px dashed #dadde6 !important;
                    border: 2px solid black !important;
                    display: flex !important;
                    flex-direction: column !important;
                    justify-content: center !important;
                    text-transform: uppercase !important;
                    font-family: 'Oswald', sans-serif !important;
                }

                .date {
                    grid-area: qr !important;
                    display: flex !important;
                    flex-direction: column !important;
                    justify-content: center !important;
                    align-items: center !important;
                } 

                .card-cont >h3 {
                    font: bold !important;
                }

                .card-cont:before,
                .card-cont:after {
                    content: "" !important;
                    display: block !important;
                    width: 30px !important;
                    height: 30px !important;
                    background-color: dimgrey !important;
                    position: absolute !important;
                    top: -15px !important;
                    right: -15px !important;
                    z-index: 1 !important;
                    border-radius: 50% !important;
                }

                .card-cont:after {
                    top: auto !important;
                    bottom: -15px !important;
                }

                .card-cont>div>p {
                    padding: 10px 10px 0px 0px !important;
                }
            </style>
        </head>

        <body>
            <section class="container">
                <div class="row">
                    <div>
                        <article class="card">
                            <section class="card-cont">
                                <h3>${emailData.eventName}</h3>
                                <div class="event-date">
                                    <p>Price: ${emailData.price}</p>
                                    <p>Date: ${emailData.date} ${emailData.time}</p>
                                    <p>Venue: ${emailData.place}</p>
                                    <p>Order: ${emailData.userName}</p>
                                    <p>Category: ${emailData.type}</p>
                                    <p>Seat: ${emailData.seat}</p>
                                    <p>Ticket ID: ${emailData.nationalId}</p>
                                </div>
                                <div class="vericaltext">
                                    ${emailData.type}
                                </div>
                            </section>
                            <section class="date">
                                <div>
                                    <p>www.eventicore.com</p>
                                </div>
                                <div>
                                    <img src="${emailData.fileName}" alt="" height="400" />
                                </div>
                                <div>
                                    <p>From INTERCORE GROUP</p>
                                </div>
                            </section>
                        </article>
                    </div>
                </div>
            </section>
        </body>
        </html>
        `;
  return template2;
};

export const sentGuestTicket = (emailData) => {
  const template2 = `<!DOCTYPE html>
          <html>
          <head>
              <style>
                  html { -webkit-print-color-adjust: exact; }
                  @import url('https://fonts.googleapis.com/css?family=Oswald');
                  * {
                        margin: 0;
                        padding: 0;
                        border: 0;
                        box-sizing: border-box
                    }

                    .SmallerPage {
            -webkit-transform: scale(0.67);
            -moz-transform: scale(0.67);
            -ms-transform: scale(0.67);
            transform: scale(0.67);
            -ms-transform-origin: 0 0;
            -webkit-transform-origin: 0 0;
            -moz-transform-origin: 0 0;
            transform-origin: 0 0;
        }

                    body {
                        background-color: #dadde6;
                        font-family: arial
                    }

                    .fl-left {
                        float: left
                    }

                    .fl-right {
                        float: right
                    }

                    h1 {
                        text-transform: uppercase;
                        font-weight: 900;
                        border-left: 10px solid #fec500;
                        padding-left: 10px;
                        margin-bottom: 30px
                    }

                    .row {
                        overflow: hidden; 
                        background-image: url('./tick-bg.jpeg');
                        background-repeat: no-repeat;
                        background-position: center;
                        background-size: cover;
                        padding: 50px;
                        width: 40vh; 
                        height: 50vh;
                        /* adjust as needed */
                        border-radius: 10px;
                        box-shadow: #989898 2px;
                        border: 3px white solid;
                    }

                    .card { 
                        right: 0 !important; 
                        background-color: #fff;
                        color: #989898;
                        border-radius: 4px; 
                    }
                    .vericaltext {  
                        background-color: green; 
                        text-align: center;
                        color: white;
                        padding: 5px 5px; 
                    }

                    .card-cont { 
                        font-size: 85%;
                        position: relative;
                        padding: 10px;
                        border-right: 2px dashed #dadde6;
                        border: 2px solid black;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        text-transform: uppercase;
                        font-family: 'Oswald', sans-serif;
                    }

                    .barcode {
                        text-align: center;
                        padding: 10px;
                    }
                    .barcode > .footer {
                        display: flex;
                        font-size: 8px;
                        justify-content: space-between;
                    }

                    .date>div {
                        display: flex;
                        flex-direction: column;
                    }

                    .card-cont >h3 {
                        font: bold;
                    }

                </style>
            </head>

            <body class="SmallerPage">
                <section>
                    <div class="row">
                        <div>
                            <article class="card">
                                <section class="card-cont">
                                    <h3>${emailData.eventName}</h3>
                                    <div class="event-date">
                                        <p>Full Name: ${emailData.fullName}</p>
                                        <p>Institution: ${emailData.organization}</p>
                                        <p>Title: Guest</p>
                                        <p>Country: Rwanda</p>
                                        <p>Date: ${emailData.date} ${emailData.time}</p>
                                        <p>Venue: ${emailData.place}</p>
                                        <p>Badge ID: ${emailData.nationalId}</p>
                                    </div>
                                    <div class="vericaltext">
                                        ${emailData.type}
                                    </div>
                                </section>
                                <section class="barcode">
                                    <div class="container-img">
                                        <img src="./barcode.png" alt="" />
                                    </div>
                                    <div class="footer">
                                        <div>www.eventicore.com</div>
                                        <div>From INTERCORE GROUP</div>
                                    </div>
                                </section>
                            </article>
                        </div>
                    </div>
                </section>
            </body>

            </html>`;
  return template2;
};
