document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === "admin" && pass === "1234") {
    alert("Login berhasil!");
    window.location.href = "index.html";
  } else {
    alert("Username atau password salah!");
  }
});