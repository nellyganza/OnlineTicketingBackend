import dotenv from 'dotenv';

dotenv.config();

export const sentTicket = (emailData) => {
    const template2 = `<!DOCTYPE html>
        <html>
        <head>
            <style>
                @import url('https://fonts.googleapis.com/css?family=Oswald');

                * {
                    margin: 0;
                    padding: 0;
                    border: 0;
                    box-sizing: border-box
                }

                body {
                    background-color: #dadde6;
                    font-family: arial
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
                    padding-top: 50px;
                    padding-left: 10%;
                    padding-bottom: 50px;
                    background-image: url('/Users/nishimweelysee/Desktop/ticketrwanda/online/ticketrwanda/server/src/public/images/tick-bg.jpeg');
                    background-repeat: no-repeat;
                    background-position: center;
                    background-size: cover;
                    width: 100%;
                    /* adjust as needed */
                    height: 100%;
                    /* adjust as needed */
                    border-radius: 5px;
                    box-shadow: #989898 2px;
                }

                .card {
                    display: grid;
                    grid-template-areas: 'info info info qr';
                    width: 100%;
                    background-color: #fff;
                    color: #989898;
                    margin-bottom: 10px;
                    border-radius: 4px;
                    position: relative
                }
                .vericaltext {
                    writing-mode: vertical-lr;
                    text-orientation: upright;
                    position: absolute;
                    right: 0;
                    background-color: green;
                    height: 90%;
                    text-align: center;
                    color: white;
                    padding: 5px 5px 0px 0px;
                    margin-top: 20px;
                    margin-right: -13px;
                }

                .card-cont {
                    grid-area: info;
                    font-size: 85%;
                    position: relative;
                    padding: 10px 10px 30px 50px;
                    border-right: 2px dashed #dadde6;
                    border: 2px solid black;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    text-transform: uppercase;
                    font-family: 'Oswald', sans-serif;
                }

                .date {
                    grid-area: qr;
                    text-align: center;
                    padding: 10px;
                }

                .date>div {
                    display: flex;
                    flex-direction: column;
                }

                .card-cont >h3 {
                    font: bold;
                }

                .card-cont:before,
                .card-cont:after {
                    content: "";
                    display: block;
                    width: 30px;
                    height: 30px;
                    background-color: dimgrey;
                    position: absolute;
                    top: -15px;
                    right: -15px;
                    z-index: 1;
                    border-radius: 50%
                }

                .card-cont:after {
                    top: auto;
                    bottom: -15px
                }

                .card-cont>div>p {
                    padding: 10px 10px 0px 0px;
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
                                <div class="container-img">
                                    <img src="${emailData.fileName}" alt="" />
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
