const loginForm = document.getElementById("loginForm")

loginForm.addEventListener("submit", function (e) {
    e.preventDefault()

    const email = document.getElementById("email")
    const password = document.getElementById("password")

    fetch("http://localhost:3000/login", {
        method: "POST",
        body: JSON.stringify({
            email: email.value,
            password: password.value,
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    }).then(response => {
        if (response.ok) {
            email.value = ""
            password.value = ""
            response.json().then(data => {
                localStorage.setItem("jswt", data.token)
                window.location.href = "/"
            })
        } else {
            alert("Name or username cannot be empty")
            console.error("Name or username cannot be empty")
        }
    })
})
