// ========= Nav Links Responsive Toggle ==========

let videoSection = document.querySelector(".videoSection")
let profileName = document.querySelector(".profileName");

const urlParams = new URLSearchParams(window.location.search);
const userName = urlParams.get("name");
profileName.innerHTML = userName;


// const urlParams2 = new URLSearchParams(window.location.search);
const dataQueryString = urlParams.get("data");
const data = JSON.parse(decodeURIComponent(dataQueryString));
console.log(data)

document.addEventListener("DOMContentLoaded", (e) => {
  const videos = data.videos.map((video) => {
    return `<a href="./playhead.html?videoId=${video.id}&userName=${encodeURIComponent(
      userName
    )}&data=${encodeURIComponent(JSON.stringify(data))}">
          <div class="videoCard">
            <div class="videoThumbnail">
              <img src="../assets/images/cover.jpg" alt="" />
            </div>
            <h4 class="videoTitle">${video.title}</h4>
          </div>
        </a>`;
  }).join("");
  videoSection.innerHTML = videos;
})

function userToggle() {
    let userProfile = document.getElementById("myTopnav");
    if (userProfile.className === "navLinks") {
      userProfile.className += " responsive";
    } else {
      userProfile.className = "navLinks";
    }
  };



  // ======== Search filter ========
  function search() {
    let filter = document.getElementById('search').value.toUpperCase();
    let item = document.querySelectorAll('.videoCard');
    let l = document.getElementsByTagName('h4');

    for(var i = 0;i<=l.length;i++) {
      let a=item[i].getElementsByTagName('h4')[0];

      let value=a.innerHTML || a.innerText || a.textContent;

      if(value.toUpperCase().indexOf(filter) > -1) {
        item[i].style.display="";
      }
      else {
        item[i].style.display="none";
      }
    }
  }

  function search2() {
    let filter = document.getElementById('search2').value.toUpperCase();
    let item = document.querySelectorAll('.videoCard');
    let l = document.getElementsByTagName('h4');

    for(var i = 0;i<=l.length;i++) {
      let a=item[i].getElementsByTagName('h4')[0];

      let value=a.innerHTML || a.innerText || a.textContent;

      if(value.toUpperCase().indexOf(filter) > -1) {
        item[i].style.display="";
      }
      else {
        item[i].style.display="none";
      }
    }
  }