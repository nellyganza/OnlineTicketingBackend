import dotenv from 'dotenv';

dotenv.config();

export const sentTicket = (emailData) => {
  const template2 = `
    <!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
        <style>
            body {
                font-size: 16px;
                font-family: 'Helvetica', Arial, sans-serif;
                margin: 0;
            }
    
            .qr-holder {
                position: relative;
                width: 160px;
                height: 160px;
                background-color: #fff;
                text-align: center;
                z-index: 1;
            }
    
            .qr-holder>img {
                margin-top: 15px;
            }
    
            .border-4 {
                border: 4px solid rgba(209, 202, 202, 0.665);
            }
    
            .border-left-4 {
                border-left: 4px solid rgba(209, 202, 202, 0.665);
            }
    
            .border-right-4 {
                border-right: 4px solid rgba(209, 202, 202, 0.665);
            }
    
            .border-top-4 {
                border-top: 4px solid rgba(209, 202, 202, 0.665);
            }
    
            .border-bottom-4 {
                border-bottom: 4px solid rgba(209, 202, 202, 0.665);
            }
    
            .mainticket {
                width: 800px;
            }
        </style>
    </head>
    <body>
        <div class="m-4 row border-4 mainticket">
            <div class="col-8 row">
                <div class="col-12 border-bottom-4 border-right-4 d-flex flex-column">
                    <strong>Event: ${emailData.eventName} </strong>
                    <span>Price: ${emailData.price} </span>
                </div>
                <div class="col-12 border-bottom-4 border-right-4">
                    <div class="row">
                        <div class="col-5  d-flex flex-column border-right-4">
                            <strong>Time:</strong>
                            <span>${emailData.date} </span>
                            <span>${emailData.time} </span>
                        </div>
                        <div class="col-7  d-flex flex-column align-items-end">
                            <strong>Venue:</strong>
                            <span>${emailData.place} </span>
                        </div>
                    </div>
                </div>
                <div class="col-12 border-bottom-4 border-right-4">
                    <div class="d-flex flex-column">
                        <strong>Order Info:</strong>
                        <span>Name:${emailData.userName} </span>
                    </div>
                </div>
                <div class="col-12   d-flex flex-column border-right-4">
                    <strong>Ticket:</strong>
                    <span>Category: ${emailData.type} </span>
                    <span>Seat:${emailData.seat} </span>
                </div>
            </div>
    
            <div class="col-4 d-flex align-items-center justify-content-center">
                <div class="qr-holder">
                    <img src="${emailData.fileName}" alt="" width="150px" height="150px" />
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
  return template2;
};
