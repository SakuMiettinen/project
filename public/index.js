window.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("jswt")
    const logoutBtn = document.getElementById("logout")

    if (!token) {
        logoutBtn.style.display = "none"
    } else {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("jswt")
            window.location.href = "/"
        })
        const loginBtn = document.getElementById("login")
        loginBtn.style.display = "none"
        const registerBtn = document.getElementById("register")
        registerBtn.style.display = "none"
    }
})
