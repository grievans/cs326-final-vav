const submitButton = document.getElementById('submit');
        
              submitButton.addEventListener('click', function(a) {
                a.preventDefault();//prevent from reloading
        
                data = {
                  "ok": true
                };
        
                fetch('/markProgress', {
        
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
                  alert("Ok! Server is handling right now!!");
                  // window.location.href="status.html";//jump to next page
                }).catch(function(error) {
                  console.error(error);
                })
              });
        