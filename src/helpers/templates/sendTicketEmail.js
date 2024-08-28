import dotenv from 'dotenv';

dotenv.config();

export const sentTicket = (emailData) => {
  const template2 = `<!DOCTYPE html>
<html>

<head>
    <style>
        html {
            -webkit-print-color-adjust: exact;
            zoom: 0.75;
        }

        @import url('https://fonts.googleapis.com/css?family=Oswald');

        * { 
            box-sizing: border-box !important;
        }

        body {
            background-color: #dadde6 !important; 
            font-family: arial !important;
            height: 100px !important;
        }

        h1 {
            text-transform: uppercase !important;
            font-weight: 900 !important;
            border-left: 10px solid #fec500 !important;
            padding-left: 10px !important;
            padding-bottom: 10px !important;
        }

        .mrow {
            overflow: hidden; 
            background-image: url(${process.env.HOST}/api/v1/files/${emailData.bgTicket}) !important;
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover; 
            /* adjust as needed */
            border-radius: 10px;
            box-shadow: #989898 2px;
            border: 3px white solid;
        }

        .mcard { 
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

        .card-cont>h3 {
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
    </style>
</head>

<body>
    <div>
        <div class="mrow" style="align-items: center !important;justify-content: center !important;display: flex !important;--bs-aspect-ratio: 42.8571428571%;position: relative;width: 100%;" >
            <div class="container" style="--bs-card-spacer-y: 1rem;
            --bs-card-spacer-x: 1rem;
            --bs-card-title-spacer-y: 0.5rem;
            --bs-card-title-color: ;
            --bs-card-subtitle-color: ;
            --bs-card-border-width: var(--bs-border-width);
            --bs-card-border-color: var(--bs-border-color-translucent);
            --bs-card-border-radius: var(--bs-border-radius);
            --bs-card-box-shadow: ;
            --bs-card-inner-border-radius: calc(var(--bs-border-radius) - (var(--bs-border-width)));
            --bs-card-cap-padding-y: 0.5rem;
            --bs-card-cap-padding-x: 1rem;
            --bs-card-cap-bg: rgba(var(--bs-body-color-rgb), 0.03);
            --bs-card-cap-color: ;
            --bs-card-height: ;
            --bs-card-color: ;
            --bs-card-bg: var(--bs-body-bg);
            --bs-card-img-overlay-padding: 1rem;
            --bs-card-group-margin: 0.75rem;
            position: relative;
            display: flex;
            flex-direction: column;
            min-width: 0;
            height: var(--bs-card-height);
            color: white; 
            word-wrap: break-word;
            background-color: var(--bs-card-bg);
            background-clip: border-box;
            border: var(--bs-card-border-width) solid var(--bs-card-border-color);
            border-radius: var(--bs-card-border-radius); 
            padding: 20px !important;">
                <div style="flex-direction: row !important; display: flex !important;margin-right: 1.5rem !important;margin-left: 1.5rem !important;">
                   <div class="card-cont" style="width: 400px;">
                        <h3>${emailData.eventName}</h3>
                        <div>
                            <p class="text-transform: uppercase !important;
                            font-family: 'Oswald', sans-serif !important;">Price: ${emailData.price}</p>
                            <p class="text-transform: uppercase !important;
                            font-family: 'Oswald', sans-serif !important;">Date: ${emailData.date} ${emailData.time}</p>
                            <p class="text-transform: uppercase !important;
                            font-family: 'Oswald', sans-serif !important;">Venue: ${emailData.place}</p>
                            <p class="text-transform: uppercase !important;
                            font-family: 'Oswald', sans-serif !important;">Order: ${emailData.userName}</p>
                            <p class="text-transform: uppercase !important;
                            font-family: 'Oswald', sans-serif !important;">Category: ${emailData.type}</p>
                            <p class="text-transform: uppercase !important;
                            font-family: 'Oswald', sans-serif !important;">Seat: ${emailData.seat}</p>
                            <p class="text-transform: uppercase !important;
                            font-family: 'Oswald', sans-serif !important;">Ticket ID: ${emailData.nationalId}</p>
                        </div>
                        <label class="vericaltext">
                            ${emailData.type}
                        </>
                    </div>
                    <div style="align-items: center !important;justify-content: center !important;flex-direction: column !important;display: flex !important;">
                        <div>
                            <p>   www.eventicore.com</p>
                        </div>
                        <div>
                            <img class="object-fit-contain" src="${emailData.fileName}" alt="" />
                            <!-- <img class="object-fit-contain" src="./barcode.png" alt="" /> -->
                        </div>
                        <div>
                            <p>   From INTERCORE GROUP</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>

</html>`;
  return template2;
};

export const sentGuestTicket = (emailData) => {
  const template2 = `<!DOCTYPE html>
<html>

<head>
    <style>
        html {
            -webkit-print-color-adjust: exact;
            zoom: 0.75;
        }

        @import url('https://fonts.googleapis.com/css?family=Oswald');

        * { 
            box-sizing: border-box !important;
        }

        body {
            background-color: #dadde6 !important;
            font-family: arial !important;
            height: 100px !important;
        }

        h1 {
            text-transform: uppercase !important;
            font-weight: 900 !important;
            border-left: 10px solid #fec500 !important;
            padding-left: 10px !important;
            padding-bottom: 10px !important;
        }

        .mrow {
            overflow: hidden; 
            background-image: url(${process.env.HOST}/api/v1/files/${emailData.bgTicket}) !important;
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover; 
            /* adjust as needed */
            border-radius: 10px;
            box-shadow: #989898 2px;
            border: 3px white solid;
        }

        .mcard { 
            width: 50%;
            right: 0 !important;
            position: absolute;
            background-color: #fff;
            color: #989898;
            border-radius: 4px;
        }

        .vericaltext {  
            background-color: green !important;
            height: 90% !important;
            text-align: center !important;
            color: white !important;
            padding: 10px !important; 
        }

        .card-cont { 
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
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
        }

        .card-cont>h3 {
            font: bold !important;
        }

        .card-cont>div>p {
            padding: 5px 5px 0px 0px !important;
        }
    </style>
</head>

<body>
    <div>
        <div class="mrow" style="align-items: center !important;justify-content: center !important;display: flex !important;--bs-aspect-ratio: 12.8571428571%;position: relative;width: 100%;padding: 20px;" >
            <div class="container" style="">
                <div style="flex-direction: column !important; display: flex !important;margin-right: 1.5rem !important;margin-left: 1.5rem !important;">
                    <div class="card-cont">
                        <h3>${emailData.eventName}</h3>
                        <div>
                            <p class="text-transform: uppercase !important;
                            font-family: 'Oswald', sans-serif !important;">Price: ${emailData.price}</p>
                            <p class="text-transform: uppercase !important;
                            font-family: 'Oswald', sans-serif !important;">Date: ${emailData.date} ${emailData.time}</p>
                            <p class="text-transform: uppercase !important;
                            font-family: 'Oswald', sans-serif !important;">Venue: ${emailData.place}</p> 
                            <p class="text-transform: uppercase !important;
                            font-family: 'Oswald', sans-serif !important;">Category: ${emailData.type}</p>
                            <p class="text-transform: uppercase !important;
                            font-family: 'Oswald', sans-serif !important;">Seat: ${emailData.seat}</p>
                            <p class="text-transform: uppercase !important;
                            font-family: 'Oswald', sans-serif !important;">Badge ID: ${emailData.nationalId}</p>
                        </div>
                        <div class="vericaltext">
                            ${emailData.type}
                        </>
                    </div>
                    <div style="align-items: center !important;justify-content: center !important;flex-direction: column !important;display: flex !important;">
                        <div>
                            <p>www.eventicore.com</p>
                        </div>
                        <div>
                            <img class="object-fit-contain" src="${emailData.fileName}" alt="" height="400" />
                            <!-- <img class="object-fit-contain" src="./barcode.png" alt="" height="400" /> -->
                        </div>
                        <div>
                            <p>From INTERCORE GROUP</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>

</html>`;
  return template2;
};
