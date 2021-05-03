// A reference to Stripe.js
var stripe;
var paymentInfo;
function getamount() {
  paymentInfo = {
    pay: {
      amount: document.getElementById('ticket-total-amount').innerText,
      currency: "RWF"
    },
    buyer: {

    },
    attender: {

    }
  };
}

// Disable the button until we have Stripe set up on the page
document.querySelector("button").disabled = true;

fetch("http://localhost:5000/stripe-key")
  .then(function (result) {
    return result.json();
  })
  .then(function (data) {
    return setupElements(data);
  })
  .then(function ({ stripe, card, clientSecret }) {
    document.querySelector("#button-submit").disabled = false;

    var form = document.getElementById("button-submit");
    form.addEventListener("click", function (event) {
      event.preventDefault();
      if (document.getElementById('r12').checked) {
        getamount();
        pay(stripe, card, clientSecret);
      } else {
        console.log("Mobile Money")
      }
    });
  });

var setupElements = function (data) {
  stripe = Stripe(data.publishableKey);
  /* ------- Set up Stripe Elements to use in checkout form ------- */
  var elements = stripe.elements();
  var style = {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4"
      }
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  };

  var card = elements.create("card", { style: style });
  card.mount("#card-element");

  return {
    stripe: stripe,
    card: card,
    clientSecret: data.clientSecret
  };
};

var handleAction = function (clientSecret) {
  stripe.handleCardAction(clientSecret).then(function (data) {
    if (data.error) {
      showError("Your card was not authenticated, please try again");
    } else if (data.paymentIntent.status === "requires_confirmation") {
      fetch("http://localhost:5000/api/v1/events/tickets/newTicket/payment/cardpay/1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJLd2l6ZXJhIiwibGFzdE5hbWUiOiJCcnlhbiIsImVtYWlsIjoidXNlcmJ1eUBnbWFpbC5jb20iLCJpZCI6MjQsIlJvbGVJZCI6NCwiaWF0IjoxNjE1NDUxNDc5LCJleHAiOjE2MTU0NTUwNzl9.iyAgr23lbRcU5JEc8EOVo8sQdB3BwbWKU1UDISXDmPo"
        },
        body: JSON.stringify({
          pay: {
            paymentIntentId: data.paymentIntent.id
          },
          buyer: {
            firstName: "Nishimwe",
            lastName: "Elysee",
            phoneNumber: "+250788935645",
            email: "nishimwelys@gmail.com"
          },
          attender: {
            attender1: {
              price: "2000000",
              type: 1,
              paymenttype: 1,
              fullName: "Nishimwe Elysee",
              cardNumber: "0000-0000-0000-0000",
              phoneNumber: "+250778676545",
              sittingPlace: 1
            },
            attender2: {
              price: "3000000",
              type: 1,
              paymenttype: 1,
              fullName: "Nishimwe Elysee",
              cardNumber: "5432-0987-4533-1236",
              phoneNumber: "+250778676545",
              sittingPlace: 2
            },
            attender3: {
              price: "4000000",
              type: 1,
              paymenttype: 1,
              fullName: "Nishimwe Elysee",
              cardNumber: "1234-5432-3454-5432",
              phoneNumber: "+250778676545",
              sittingPlace: 3
            }
          }
        })
      })
        .then(function (result) {
          return result.json();
        })
        .then(function (json) {
          if (json.error) {
            showError(json.error);
          } else {
            paymentComplete(clientSecret);
          }
        });
    }
  });
};

/*
 * Collect card details and pay for the order
 */
var pay = function (stripe, card) {
  changeLoadingState(true);

  // Collects card details and creates a PaymentMethod
  stripe
    .createPaymentMethod("card", card)
    .then(function (result) {
      if (result.error) {
        showError(result.error.message);
      } else {
        paymentInfo.pay.paymentMethodId = result.paymentMethod.id;

        return fetch("http://localhost:5000/api/v1/events/tickets/newTicket/payment/cardpay/1", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(paymentInfo)
        });
      }
    })
    .then(function (result) {
      return result.json();
    })
    .then(function (response) {
      if (response.error) {
        showError(response.error);
      } else if (response.requiresAction) {
        // Request authentication
        handleAction(response.clientSecret);
      } else {
        paymentComplete(response.data);
      }
    });
};

/* ------- Post-payment helpers ------- */

/* Shows a success / error message when the payment is complete */
var paymentComplete = function (data) {
  console.log(data);
  changeLoadingState(false);
};

var showError = function (errorMsgText) {
  changeLoadingState(false);
  var errorMsg = document.querySelector(".sr-field-error");
  errorMsg.textContent = errorMsgText;
  setTimeout(function () {
    errorMsg.textContent = "";
  }, 4000);
};

// Show a spinner on payment submission
var changeLoadingState = function (isLoading) {
  if (isLoading) {
    document.querySelector("#button-submit").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("#button-submit").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
};
