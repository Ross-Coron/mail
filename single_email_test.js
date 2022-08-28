// TODO - pass in email id
fetch('/emails/1')
  .then(response => response.json())
  .then(email => {
    // Debug
    console.log(email);

    // For fields in eamil, create an list item and display value
    for (const field in email) {
      var list_item = document.createElement("li");
      list_item.id = "test";
      list_item.innerHTML = email[field];
      document.querySelector('#emails-view').appendChild(list_item);
    }
  });
