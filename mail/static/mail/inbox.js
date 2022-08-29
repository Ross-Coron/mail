// TODO: styling, comment, archive email option

document.addEventListener('DOMContentLoaded', function() {

  // By default, load the inbox TODO: duplicate?
  load_mailbox('inbox');

  // Event listeners for each NavBar button. Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // When compose email form submitted
  document.querySelector('#compose-form').onsubmit = function() {

    // By default, load the inbox TODO: duplicate?
    load_mailbox('inbox');

    // Send email via POST request to /emails.
    fetch('/emails', {
        method: 'POST',
        body: JSON.stringify({
          recipients: document.querySelector('#compose-recipients').value,
          subject: document.querySelector('#compose-subject').value,
          body: document.querySelector('#compose-body').value
        })
      })

      // ???
      .then(response => response.json())
      .then(result => {
        // Debug
        console.log(result);
      })

    // Prevents form from submitting
    return false;
  };
});


function compose_email() {

  // Show ('block') compose view and hide ('none') other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out any previous values from form fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

// Called by clicking NavBar button. Three valid arguments: inbox, sent, and archive
function load_mailbox(mailbox) {

  // Show mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';

  // Show the mailbox name (passed in as argument)
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  if (mailbox === "inbox") {
    // Debug
    console.log("Inbox - success")

    // GET request to emails/inbox, converts to JSON, provide array of emails as variable emails
    fetch('/emails/inbox')
      .then(response => response.json())
      .then(emails => {
        // Debug
        console.log(emails);

        // For each email, create a list item with styling
        for (const email in emails) {
          var list_item = document.createElement("li");
          list_item.id = "style_test";

          list_item.innerHTML = `Email from ${emails[email].sender} recieved ${emails[email].timestamp} <button class="view" data-email="${emails[email].id}">View</button>`;

          // If email has been read (default is unread), render in grey
          if (emails[email].read === true) {
            console.log("Read");
            list_item.style.backgroundColor = "gray";

          } else {
            console.log("Not read")
            list_item.style.backgroundColor = "white";
          }

          // Add populated list item to page
          document.querySelector('#emails-view').appendChild(list_item);
        }
      });

    // ???
    document.addEventListener('click', event => {

      // Find what was clicked on
      const element = event.target;

      // Check if the user clicked the view button
      if (element.className === 'view') {
        view_email(event.target.dataset.email)
      }
    });

    // Test alerts for mailbox specification
  } else if (mailbox === "sent") {
    console.log("Sent - success")
  } else if (mailbox === "archive") {
    console.log("Archived - success")
  }
};


function view_email(email) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';

  console.log(event.target.dataset.email)
  email = event.target.dataset.email

  fetch(`/emails/${email}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  });

  fetch(`/emails/${email}`)
    .then(response => response.json())
    .then(email => {
      // Debug
      console.log(email);

      // For fields in eamil, create an list item and display value
      document.getElementById("email-view").innerHTML = '';

      for (const field in email) {
        var list_item = document.createElement("li");

        list_item.innerHTML = `${field}: ${email[field]}`;
        document.querySelector('#email-view').appendChild(list_item);


        // Check if archived
        if (email.archived === true){
          console.log("True");
        }

        else {
          console.log("False")
        }



      }
    })
}

// Archive email
function archive(email) {
  fetch(`/emails/${email}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: true
    })
})
}
