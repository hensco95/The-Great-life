let videoWrapper = document.querySelector(".videoWrapper");
let profileName = document.querySelector(".userName");
let videoTitle = document.querySelector(".videoTitle");
let ac_body = document.querySelector(".accordion-item-body");

// ========= Nav Links Responsive Toggle ==========
function userToggle() {
  let userProfile = document.getElementById("myTopnav");
  if (userProfile.className === "navLinks") {
    userProfile.className += " responsive";
  } else {
    userProfile.className = "navLinks";
  }
}

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// const urlParams = new URLSearchParams(window.location.search);
const userName = getQueryParam("userName");
profileName.innerHTML = userName;

const title = getQueryParam("title");

const videoId = getQueryParam("videoId");
const dataQueryString = getQueryParam("data");
const data = JSON.parse(decodeURIComponent(dataQueryString));
// const video = data.videos[videoIndex];

const youtubeEmbedURL = `https://www.youtube.com/embed/${videoId}`;

videoWrapper.innerHTML = `
  <iframe
    width="100%"
    height="300px"

    src="${youtubeEmbedURL}"
    frameborder="0"
  ></iframe>`
  ;




const accordionItemHeaders = document.querySelectorAll(
  ".accordion-item-header"
);

accordionItemHeaders.forEach((accordionItemHeader) => {
  accordionItemHeader.addEventListener("click", (event) => {
    // Uncomment in case you only want to allow for the display of only one collapsed item at a time!

    // const currentlyActiveAccordionItemHeader = document.querySelector(".accordion-item-header.active");
    // if(currentlyActiveAccordionItemHeader && currentlyActiveAccordionItemHeader!==accordionItemHeader) {
    //   currentlyActiveAccordionItemHeader.classList.toggle("active");
    //   currentlyActiveAccordionItemHeader.nextElementSibling.style.maxHeight = 0;
    // }

    accordionItemHeader.classList.toggle("active");
    const accordionItemBody = accordionItemHeader.nextElementSibling;
    if (accordionItemHeader.classList.contains("active")) {
      accordionItemBody.style.maxHeight = accordionItemBody.scrollHeight + "px";
    } else {
      accordionItemBody.style.maxHeight = 0;
    }
  });
});
