const form = document.getElementById("form");
const tokenValue = document.getElementById("token");
const passwordInput = document.getElementById("password");
const password2Input = document.getElementById("password2");
let registered = document.querySelector(".registered");



form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const isValid = validateInputs();
  if (isValid) {
    const resetPasswordToken = tokenValue.value;
    const password = passwordInput.value;
    const confirm_password = password2Input.value;
    registered.classList.add("show_user");

    try {
      const response = await axios.put(
        "/api/v1/user/resetpassword",
        {
          resetPasswordToken,
          password,
          confirm_password,
        },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      const data = response.data;
      if (data) {
        tokenValue.value = "";
        passwordInput.value = "";
        password2Input.value = "";
        registered.textContent = "Reset Successful";

        setTimeout(() => {
          registered.classList.remove("show_user");
        }, 1000);

        setTimeout(() => {
          window.location.href = "../pages/sign_in.html";
        })
      }
    } catch (err) {
      if (err.response) {
        // console.log(err.response.status);
        // console.log(err.message);
        // console.log(err.response.headers); // 👉️ {... response headers here}
        console.log(err.response.data);
        let errMsg = err.response.data.msg; // 👉️ {... response data here}
        registered.textContent = errMsg;
      }
    }
    

  }
})

const setError = (element, message) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error");

  errorDisplay.innerText = message;
  inputControl.classList.add("error");
  inputControl.classList.remove("success");
};

const setSuccess = (element) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error");

  errorDisplay.innerText = "";
  inputControl.classList.add("success");
  inputControl.classList.remove("error");
};



const validateInputs = () => {
  const token = tokenValue.value.trim();
  const passwordValue = passwordInput.value.trim();
  const password2Value = password2Input.value.trim();
  let status = false;
  let tokenStatus = false;
  let passStatus = false;
  let pass2Status = false;

  if (token === ""){
    setError(tokenValue, "Token is required");
  } else if (token.length < 10) {
    setError(tokenValue, "Please input a valid Token");
  } else {
    setSuccess(tokenValue);
    tokenStatus = true;
  }

  if (passwordValue === "") {
    setError(password, "Password is required");
  } else if (passwordValue.length < 8) {
    setError(password, "Password must be at least 8 character.");
  } else {
    setSuccess(password);
    passStatus = true;
  }

  if (password2Value === "") {
    setError(password2, "Please confirm your password");
  } else if (password2Value !== passwordValue) {
    setError(password2, "Passwords doesn't match");
  } else {
    setSuccess(password2);
    pass2Status = true;
  }



  if (
    tokenStatus &&
    passStatus &&
    pass2Status
  ) {
    status = true;
  }
  return status;
}

function toggleToken() {
  let resetToken = document.getElementById("token");

  if (resetToken.getAttribute("type") === "password") {
    resetToken.setAttribute("type", "text");
    document.getElementById("eye").style.color = "#fff";
  } else {
    resetToken.setAttribute("type", "password");
    document.getElementById("eye").style.color = "#000";
  }
}
function togglePW1() {
  let password = document.getElementById("password");

  if (password.getAttribute("type") === "password") {
    password.setAttribute("type", "text");
    document.getElementById("eye").style.color = "#fff";
  } else {
    password.setAttribute("type", "password");
    document.getElementById("eye").style.color = "#000";
  }
}

function togglePW2() {
  let password = document.getElementById("password2");

  if (password.getAttribute("type") === "password") {
    password.setAttribute("type", "text");
    document.getElementById("eye2").style.color = "#fff";
  } else {
    password.setAttribute("type", "password");
    document.getElementById("eye2").style.color = "#000";
  }
}