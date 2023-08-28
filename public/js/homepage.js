const btnVisit = document.querySelectorAll(".call-to-action");

document.addEventListener("DOMContentLoaded", () => {
  const userNameClass = document.querySelector(".username");
  // const newUrl = `/pages/home_page.html?name=${userName}`;

  const urlParams = new URLSearchParams(window.location.search);
  const userName = urlParams.get("name");
  userNameClass.innerHTML = userName;

  window.history.replaceState(null, document.title, window.location.href);

  console.log(`Welcome, ${userName}! You are on the protected page.`);


  btnVisit.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();

      try {
        const response = await axios.get("/api/v1/library", {
          withCredentials: true,
        });
        const data = response.data;
        if (data) {
          console.log(data);
        }
        setTimeout(() => {
          const dataQueryString = encodeURIComponent(JSON.stringify(data));

          window.location.href = `../pages/library.html?name=${userName}&data=${dataQueryString}`;
        }, 500);
      } catch (err) {
        if (err.response) {
          console.log(err.response.status);
          console.log(err.message);
          console.log(err.response.headers); // 👉️ {... response headers here}
          console.log(err.response.data);
          // let errMsg = err.response.data.msg; // 👉️ {... response data here}
          // logged_in.textContent = errMsg;
        }
      }
    });
  })

  
});
