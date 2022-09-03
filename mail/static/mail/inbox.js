document.addEventListener('DOMContentLoaded', function() {

  // Load inbox by default
  load_mailbox('inbox');

  // Event listeners for each NavBar button. Use buttons to toggle between views.
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', () => compose_email("New Email"));

  // Email handling
  document.addEventListener('click', event => {

    // Get email's unique id
    const email = event.target.dataset.email;

    // Check if the user clicked view button or archive button
    if (event.target.className === 'view') {
      view_email(email);
    } else if (event.target.className === 'archive') {
      archive_email(email);
    }
  });

  // When compose email form submitted
  document.querySelector('#compose-form').onsubmit = function() {

    // Load inbox view
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

    // Prevents form from submitting (default behaviour)
    return false;
  };
});

// Function: displays compose email view (titled 'New Email' or 'Reply') and clears form contents
function compose_email(state, email) {

  if (state === "New Email") {

    // Set page title to 'New Email'
    document.querySelector('#NewOrReply').innerHTML = state

    // Show ('block') compose view and hide ('none') other views
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';

    // Clear out any previous values from form fields
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';

  } else if (state === "Reply") {

    // Set page title to 'New Email'
    document.querySelector('#NewOrReply').innerHTML = state

    // Show ('block') compose view and hide ('none') other views
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';

    // Auto fills form with reply elements (Re, sender, etc.)
    document.querySelector('#compose-recipients').value = `${email.sender}`;
    document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
    document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: ${email.body} \r\n\r\n --- \r\n\r\n`;
  }
}

// Function: view mailboxes. Called by clicking NavBar button. Three valid mailboxes / arguments: inbox, sent, and archive
function load_mailbox(mailbox) {

  // Show mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';

  // Show capitalised mailbox name (passed in as argument)
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Inbox view
  if (mailbox === 'inbox') {

    console.log('Debug: viewing inbox.');

    // GET request to API route 'emails/inbox', converts to JSON, provide array of emails as variable emails
    fetch('/emails/inbox')
      .then(response => response.json())
      .then(emails => {
        // DEBUG - logs all emails as array to console
        console.log(emails);

        // For each email, create a list item with styling (style.css), and add
        for (let email in emails) {
          const item = document.createElement("div");
          item.id = "style_test";
          item.innerHTML = `Email from <b>${emails[email].sender}</b> recieved <b>${emails[email].timestamp}</b> <button class="btn btn-sm btn-primary view" data-email="${emails[email].id}">View</button>`;

          // If email has been read, display as grey otherwise white
          if (emails[email].read === true) {
            item.style.backgroundColor = "lightgray";
          } else {
            item.style.backgroundColor = "white";
          }

          // If email has NOT been archived, attach archive button
          if (emails[email].archived === false) {
            item.innerHTML += `<button class="btn btn-sm btn-secondary archive" data-email="${emails[email].id}">Archive</button>`

            // TODO
            item.setAttribute("align", "center");
          }

          // Add populated item to page
          document.querySelector('#emails-view').appendChild(item);
        }
      });

    // Sent view
  } else if (mailbox === 'sent') {

    console.log('Debug: viewing sent emails');

    fetch('/emails/sent')
      .then(response => response.json())
      .then(emails => {
        console.log(emails);

        for (let email in emails) {
          const item = document.createElement('div');
          item.id = 'style_test';

          item.innerHTML = `Email from ${emails[email].sender} recieved ${emails[email].timestamp} <button class="view" data-email="${emails[email].id}">View</button>`;
          document.querySelector('#emails-view').appendChild(item);
        }
      });

    // Archive view
  } else if (mailbox === 'archive') {

    fetch('/emails/archive')
      .then(response => response.json())
      .then(emails => {

        console.log(emails);

        for (let email in emails) {
          const item = document.createElement('div');
          item.id = "style_test";

          item.innerHTML = `Email from ${emails[email].sender} recieved ${emails[email].timestamp} <button class="view" data-email="${emails[email].id}">View</button>`;
          item.innerHTML += `<button class="archive" data-email="${emails[email].id}">Unarchive</button>`;
          document.querySelector('#emails-view').appendChild(item);
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

  // Clear previous contents (if any)
  document.getElementById("email-view").innerHTML = '';

  // Mark email as read
  fetch(`/emails/${email}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  })

  // View email contents
  fetch(`/emails/${email}`)
    .then(response => response.json())
    .then(email => {

      console.log(email);

      // Display email fields as bullet points

      for (let field in email) {
        const email_field = document.createElement("li");

        email_field.innerHTML = `${field}: ${email[field]}`;
        document.querySelector('#email-view').appendChild(email_field);
      }

      // Add reply button
      const reply = document.createElement('button')
      reply.innerHTML = ("Reply")
      document.querySelector('#email-view').appendChild(reply);

      // Handling for when button clicked
      reply.onclick = function() {
        document.querySelector('#email-view').style.display = 'none';
        compose_email("Reply", email);
      }
    })
}

// Function: archive and unarchive email
async function archive_email(email) {

  const result = await fetch(`/emails/${email}`)
  data = await result.json()

  if (data.archived === true) {
    fetch(`/emails/${email}`, {
      method: 'PUT',
      body: JSON.stringify({
        archived: false
      })
    })
    console.log("Email archived")

  } else {
    fetch(`/emails/${email}`, {
      method: 'PUT',
      body: JSON.stringify({
        archived: true
      })
    })
    console.log("Email unarchived")
  }

  location.reload(load_mailbox('inbox'))
}
