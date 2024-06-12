import dotenv from 'dotenv';

dotenv.config();

export const sentTicket = (emailData) => {
  const template2 = `<!DOCTYPE html>
        <html>
        <head>
            <style>
                html { -webkit-print-color-adjust: exact; }
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
                }
                    
                h1 {
                    text-transform: uppercase !important;
                    font-weight: 900 !important;
                    border-left: 10px solid #fec500 !important;
                    padding-left: 10px !important;
                    margin-bottom: 30px !important;
                }

                .row {
                    overflow: hidden !important;
                    padding-top: 50px !important;
                    padding-left: 10% !important;
                    padding-bottom: 50px !important;
                    background-image: url(${emailData.fileName}) !important;
                    background-repeat: no-repeat !important;
                    background-position: center !important;
                    background-size: cover !important;
                    width: 100% !important;
                    /* adjust as needed */
                    height: 100% !important;
                    /* adjust as needed */
                    border-radius: 5px !important;
                    box-shadow: #989898 2px !important;
                }

                .card {
                    display: grid !important;
                    grid-template-areas: 'info info qr' !important;
                    width: 100% !important;
                    background-color: #fff !important;
                    color: #989898 !important;
                    margin-bottom: 10px !important;
                    border-radius: 4px !important;
                    position: relative !important;
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
                    padding: 10px 10px 30px 50px !important;
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
