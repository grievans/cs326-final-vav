const submitButton = document.getElementById('submit');
        
              submitButton.addEventListener('click', function(a) {
                a.preventDefault();//prevent from reloading
        
                data = {
                  "ok": true
                };
                const id = 0; //doesn't have a way to get this currently? should be ID of currently viewed request. This isn't my section though so I'm going to prioritize other stuff over getting this implemented
                fetch(`/markProgress/:${id}`, {
        
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
                  alert("Ok! Server is handling right now!!");
                  // window.location.href="status.html";//jump to next page
                }).catch(function(error) {
                  console.error(error);
                })
              });
        