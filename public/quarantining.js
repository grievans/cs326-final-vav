const submitButton = document.getElementById('submit');
const updateButton = document.getElementById('update');
const getButton = document.getElementById('get');
const deleteButton = document.getElementById('delete');

      //POST
      submitButton.addEventListener('click', function(a) {
        a.preventDefault();//prevent from reloading

        
        const requestTitle = document.getElementById('requestTitle');
        const requestDescription = document.getElementById('requestDescription');
        const name = document.getElementById('name'); 
        const req_location = document.getElementById('location');
        const email = document.getElementById('email');
        const phoneNumber = document.getElementById('phoneNumber');

        let data = {
          "requestTitle" : requestTitle.value, 
          "requestDescription" : requestDescription.value, 
          "name" : name.value, 
          "req_location" : req_location.value, 
          "email" : email.value, 
          "phoneNumber" : phoneNumber.value, 
        };

        fetch('/submitRequest', {

          method: 'post', 
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, *same-origin, omit
          headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: 'follow', // manual, *follow, error
          referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(data) // body data type must match "Content-Type" header
        }).then(function(response) {
          return response.text();
        }).then(function(text) {
          alert(text);
          window.location.href="status.html";//jump to next page
        }).catch(function(error) {
          console.error(error);
        })
      });

      //UPDATE
      updateButton.addEventListener('click', function(a) {
        a.preventDefault();//prevent from reloading

        
        const requestTitle = document.getElementById('requestTitle');
        const requestDescription = document.getElementById('requestDescription');
        const name = document.getElementById('name'); 
        const req_location = document.getElementById('location');
        const email = document.getElementById('email');
        const phoneNumber = document.getElementById('phoneNumber');

        let data = {
          "requestTitle" : requestTitle.value, 
          "requestDescription" : requestDescription.value, 
          "name" : name.value, 
          "req_location" : req_location.value, 
          "email" : email.value, 
          "phoneNumber" : phoneNumber.value, 
        };

        fetch('/submitRequest', {

          method: 'put', 
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, *same-origin, omit
          headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: 'follow', // manual, *follow, error
          referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(data) // body data type must match "Content-Type" header
        }).then(function(response) {
          return response.text();
        }).then(function(text) {
          alert(text);
          // window.location.href="status.html";//jump to next page
        }).catch(function(error) {
          console.error(error);
        })
      });


      //GET
      getButton.addEventListener('click', function(a) {
        a.preventDefault();//prevent from reloading

        
        const requestTitle = document.getElementById('requestTitle');
        const requestDescription = document.getElementById('requestDescription');
        const name = document.getElementById('name'); 
        const req_location = document.getElementById('location');
        const email = document.getElementById('email');
        const phoneNumber = document.getElementById('phoneNumber');

        let data = {
          "requestTitle" : requestTitle.value, 
          "requestDescription" : requestDescription.value, 
          "name" : name.value, 
          "req_location" : req_location.value, 
          "email" : email.value, 
          "phoneNumber" : phoneNumber.value, 
        };

        query = "requestTitle="+requestTitle.value + "&" +"requestDescription=" + requestDescription.value + "&" +"name=" + name.value + 
        "&" +"location=" + req_location.value + "&" +"email=" + email.value + "&" +"phone=" + phoneNumber.value;

        fetch('/submitRequest/?' + query, {

          method: 'get', 
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, *same-origin, omit
          headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: 'follow', // manual, *follow, error
          referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        }).then(function(response) {
          return response.json();
        }).then(function(text) {
          text = JSON.stringify(text);
          alert(text);
          // window.location.href="status.html";//jump to next page
        }).catch(function(error) {
          console.error(error);
        })
      });

      //DELETE
      deleteButton.addEventListener('click', function(a) {
        a.preventDefault();//prevent from reloading

        
        const requestTitle = document.getElementById('requestTitle');
        const requestDescription = document.getElementById('requestDescription');
        const name = document.getElementById('name'); 
        const req_location = document.getElementById('location');
        const email = document.getElementById('email');
        const phoneNumber = document.getElementById('phoneNumber');

        let data = {
          "requestTitle" : '', 
          "requestDescription" : '', 
          "name" : '', 
          "req_location" : '', 
          "email" : '', 
          "phoneNumber" : '', 
        };

        // query = "requestTitle="+requestTitle.value + "&" +"requestDescription=" + requestDescription.value + "&" +"name=" + name.value + 
        // "&" +"location=" + req_location.value + "&" +"email=" + email.value + "&" +"phone=" + phoneNumber.value;

        fetch('/submitRequest', {

          method: 'delete', 
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, *same-origin, omit
          headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: 'follow', // manual, *follow, error
          referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(data) 
        }).then(function(response) {
          return response.text();
        }).then(function(text) {
          // text = JSON.stringify(text);
          alert(text);
          // window.location.href="status.html";//jump to next page
        }).catch(function(error) {
          console.error(error);
        })
      });