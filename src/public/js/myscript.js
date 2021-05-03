function openSearch() {
    document.getElementById("search-myOverlay").style.display = "block";

  }
  
  // Close the full screen search box
  function closeSearch() {
    document.getElementById("search-myOverlay").style.display = "none";
  }

  function openContactHost(){
    document.getElementById("contact-host").style.display = "block";
  }

  function postComment() {
    var date = new Date();
    var d = date.getDate() + ' ' +['January', 'February', 'March','April', 'May', 'June', 'July','August', 'September', 'October','November', 'December'][date.getMonth()] + ' ' +date.getFullYear();
    var name = document.getElementById('comment_author').value;
    var comment = document.getElementById('comment').value;
    if(name && comment){
      var postedComment = document.getElementById('comment-posted');
      var html =    '<div class="comment-info-left">'+
                          `<abbr>${d}</abbr>`+
                          `<address>by ${name}</address>`+
                    "</div>"+
                    '<div class="comment-info-right">'+
                          `<p>${comment}</p>`+
                    "</div>";
      var commentContainer = document.createElement('div');
      commentContainer.classList.add('comment-container');
      commentContainer.innerHTML = html;
      postedComment.appendChild(commentContainer);
    }
  }


var ticket_info_modal = document.getElementById("ticket-info-myModal");

// Get the button that opens the modal
var ticket_info_btn = document.getElementById("getTicketButton");

// Get the <span> element that closes the modal
var ticket_info_span = document.getElementsByClassName("ticket-info-close")[0];

// When the user clicks the button, open the modal 
function openGetTicket(){
  ticket_info_modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
ticket_info_span.onclick = function() {
  ticket_info_modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == ticket_info_modal) {
    ticket_info_modal.style.display = "none";
  }
}
function addLink(event){
  const container = event.currentTarget;
  const link = container.getAttribute('href');
  document.getElementById('event-video-iframe').src = link;
}



function calculateCost() {
  const cost = document.getElementById('select-ticket-cost').value;
  const num = document.getElementById('select-ticket-number').value;
  const servicefee = document.getElementById('ticket-service-charges').innerText;
  const total = cost * num;
  const totalAmount = total + Number(servicefee);
  const p = `<p>${cost} Frw </p><i>*</i><p>${num} Tickets</p>`;
  document.getElementsByClassName('ticket-calculation')[0].innerHTML = p;
  document.getElementById('ticket-amaount').innerText =total;
  document.getElementById('ticket-total-amount').innerText = totalAmount;
  createTickets();
}

function setToDefaults() {
  document.getElementById('select-0-0').selected = true;
  document.getElementById('select-0-1').selected = true;
  document.getElementsByClassName('ticket-calculation')[0].innerHTML = null;
  document.getElementById('ticket-amaount').innerText =0;
  document.getElementById('ticket-total-amount').innerText = 0;
}


function changeTicketInfoClass() {
    const classes = document.getElementsByClassName('ticket-tab-list');
    for(let i=0;i<classes.length;i++){
      classes[i].classList.remove('active');
    }
}

function setCLasstoActiveOnTicketInfoHeader(id) {
  changeTicketInfoClass();
  const classes = document.getElementsByClassName('ticket-tab-list');
  for(let i=0;i<classes.length;i++){
      if(String(classes[i].getElementsByTagName('a')[0].getAttribute('href'))===id){
        classes[i].classList.add('active');
      }
  }
}

function createTickets() {
  const number = document.getElementById('select-ticket-number').value;
  const container = document.getElementById('bought-ticket-info');
  for (let index = 0; index < number; index++) {
    const form = document.createElement('form');
    form.classList.add('ticket-info')
    const ticket = `<fieldset>
                      <legend style="margin-bottom:0;">Ticket ${index+1} Information</legend>
                      <div class="ticket">
                        <input placeholder="First Name" type="text">
                        <input placeholder="Last Name" type="text">
                        <input placeholder="Phone Number" type="tel">
                        <input placeholder="Email" type="email">
                        <input placeholder="Sitting place" type="number">
                        <input placeholder="Card Number" required type="text">
                      </div>
                  </fieldset>`
    form.innerHTML = ticket;
    container.appendChild(form);
  }
}

// Payment Method Selection 

function displayMethodContent(event) {
  const target = event.currentTarget;
  const id = target.getElementById();
  if(id === "momo"){
    document.getElementById('pay-card-content').style.display = "none";
    document.getElementById('pay-momo-content').style.display = "block";
  }
  else
  {
    document.getElementById('pay-card-content').style.display = "block";
    document.getElementById('pay-momo-content').style.display = "none";
  }
}


$('#r11').on('click', function(){
  $(this).parent().find('a').trigger('click')
})

$('#r12').on('click', function(){
  $(this).parent().find('a').trigger('click')
})