function setup() {
    document.getElementById("loginButton").addEventListener("click", login);
    document.getElementById("createAccountButton").addEventListener("click", createAccount);
}
async function login(event) {
    event.preventDefault();
    // console.log("B")
    const email = document.getElementById("userEmail");
    const password = document.getElementById("userEmail");
    const data = {"user_email":email, "password":password};
    fetch("/user/login",{
        method: "POST",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then((response) => {
        return response.json;
    }).then((data) => {
        if (data["login_status"] === "valid") {
            window.localStorage.setItem('session', data["session_token"]);
            window.location.href = "./welcome.html";
        } else {
            alert("Invalid login credentials.");
        }
    });
    // console.log("A")
}
async function createAccount(event) {
    event.preventDefault();
    const email = document.getElementById("userEmail");
    const password = document.getElementById("userEmail");
    const data = {"user_email":email, "password":password};
    fetch("/user/new",{
        method: "POST",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then((response) => {
        return response.status;
    }).then((status) => {
        if (status === 201) {
            login(event); //TODO maybe should just make new do login too?
        } else {
            alert("Failed to create account; try another email.")
        }
    });
}
window.addEventListener('load', setup);