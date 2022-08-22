document.addEventListener('DOMContentLoaded', function() {

  // Event listeners for each button. Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);


  // Test function - alert and console log form field
  document.querySelector('#compose-form .btn').addEventListener('click', () => {
    // console.log(user)
    console.log(document.querySelector('#compose-recipients').value);
    console.log(document.querySelector('#compose-subject').value);
    console.log(document.querySelector('#compose-body').value);
    alert("Event listener success!");

    // POST request to /email passing in vals
  })




  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show ('block') compose view and hide ('none') other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

// Three mailbox arguments: inbox, sent, and archive
function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name (passed in as argument)
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}
