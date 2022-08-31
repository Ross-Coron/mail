document.addEventListener('DOMContentLoaded', function() {

  load_mailbox('inbox');

  // Event listeners for each NavBar button. Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  document.addEventListener('click', event => {

    // Find what was clicked on
    let element = event.target;

    // Get email id
    let email = event.target.dataset.email;

    // Check if the user clicked view button and view that email
    if (element.className === 'view') {
      view_email(email);
    }

    // Check if the user clicked archive button, archive, return to inbox
    if (element.className === 'archive') {
      archive_email(email);
      load_mailbox('inbox');
    }
  });

  // When compose email form submitted
  document.querySelector('#compose-form').onsubmit = function() {

    // Load inbox
    load_mailbox('inbox');

    // Send email via a POST request to API (/emails route)
    fetch('/emails', {
        method: 'POST',
        body: JSON.stringify({
          recipients: document.querySelector('#compose-recipients').value,
          subject: document.querySelector('#compose-subject').value,
          body: document.querySelector('#compose-body').value
        })
      })

      // Console log debug
      .then(response => response.json())
      .then(result => {
        console.log(result);
      });

    // Prevents form from submitting
    return false;
  };
});

// Function: displays compose email form and clears contents
function compose_email() {

  // Show ('block') compose view and hide ('none') other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out any previous values from form fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

// Function to view mailboxes. Called by clicking NavBar button. Three valid arguments: inbox, sent, and archive
function load_mailbox(mailbox) {

  // Show mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';

  // Show capitalise mailbox name (passed in as argument)
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  if (mailbox === 'inbox') {
    // Debug
    console.log('Viewing inbox...');

    // GET request to emails/inbox, converts to JSON, provide array of emails as variable emails
    fetch('/emails/inbox')
      .then(response => response.json())
      .then(emails => {
        // Debug - displays all emails as array
        console.log(emails);

        // For each email, create a list item with styling (style.css)
        for (let email in emails) {
          var list_item = document.createElement("li");
          list_item.id = "style_test";

          list_item.innerHTML = `Email from ${emails[email].sender} recieved ${emails[email].timestamp} <button class="view" data-email="${emails[email].id}">View</button>`;

          // If email has been read (default is unread), render in grey
          if (emails[email].read === true) {
            list_item.style.backgroundColor = "gray";
          } else {
            list_item.style.backgroundColor = "white";
          }

          // If email is not archived, render archive button
          if (emails[email].archived === false) {
            list_item.innerHTML += `<button class="archive" data-email="${emails[email].id}">Archive</button>`
          }

          // Add populated list item to page
          document.querySelector('#emails-view').appendChild(list_item);
        }
      });


  // Sent view - IN PROGRESS
  } else if (mailbox === 'sent') {

    fetch('/emails/sent')
      .then(response => response.json())
      .then(emails => {
        // Debug
        console.log(emails);

        for (let email in emails) {
          var list_item = document.createElement('li');
          list_item.id = 'style_test';

          list_item.innerHTML = `Email from ${emails[email].sender} recieved ${emails[email].timestamp} <button class="view" data-email="${emails[email].id}">View</button>`;
          document.querySelector('#emails-view').appendChild(list_item);
        }

        // DEBUG
        console.log('Sent - success');

      });

  // Archive view
  } else if (mailbox === 'archive') {

    fetch('/emails/archive')
      .then(response => response.json())
      .then(emails => {
        // Debug
        console.log(emails);

        for (let email in emails) {
          var list_item = document.createElement('li');
          list_item.id = "style_test";

          list_item.innerHTML = `Email from ${emails[email].sender} recieved ${emails[email].timestamp} <button class="view" data-email="${emails[email].id}">View</button>`;
          list_item.innerHTML += `<button class="archive" data-email="${emails[email].id}">Unarchive</button>`;
          document.querySelector('#emails-view').appendChild(list_item);
        }
      })
  }
};


// Function: view single email and mark as read
function view_email(email) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';

  console.log(event.target.dataset.email);
  //  email = event.target.dataset.email

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

      for (let field in email) {
        var list_item = document.createElement("li");

        list_item.innerHTML = `${field}: ${email[field]}`;
        document.querySelector('#email-view').appendChild(list_item);
      }

      // Add button to page
      var x = document.createElement('button')
      x.innerHTML = ("Click Me!")
      document.querySelector('#email-view').appendChild(x);




    })
}


// Function: archive /unarchive email
async function archive_email(email) {

  let res = await fetch(`/emails/${email}`)
  data = await res.json()

  if (data.archived === true) {
    fetch(`/emails/${email}`, {
      method: 'PUT',
      body: JSON.stringify({
        archived: false
      })
    })
    alert("DEBUG: Unarchived")

  } else {
    fetch(`/emails/${email}`, {
      method: 'PUT',
      body: JSON.stringify({
        archived: true
      })
    })
  }
}
