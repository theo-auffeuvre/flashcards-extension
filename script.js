
const getFlashcard = () => {
  let theme = document.querySelector(".flashcard-game-card-header").innerHTML;
  let question = document.querySelector(".flashcard-game-card-content-markdown").innerHTML;
  let answer = document.querySelector(".flashcard-game-card-back .flashcard-game-card-content").innerHTML;

  answer = answer.replace(/<button(.*)<\/button>/s, "");

  chrome.runtime.sendMessage({
    theme: theme,
    question: question,
    answer: answer,
  });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    data.push(request);
    localStorage.setItem('data', JSON.stringify(data));
    updateCounter();
  }
);


const exportPDF = () => {
  let result = ""
  result = data.map((item) => {
    return `<div class="card">
      <div class="card-body">
        <div class="card-title">${item.theme}</div>
        <p class="card-text">${item.question}</p>
        <p class="card-text">${item.answer}</p>
      </div>
    </div>`
  }).join('');
  let mywindow = window.open();
  mywindow.document.write(result);
  mywindow.print();
}

const updateCounter = () => {
  const counter = document.querySelector('#counter');
  counter.innerHTML = data.length;
}

const showFlashcards = () => {
  // chrome.tabs.create({ url: "facebook.com" });
  let groupData = data.reduce((r, a) => {
    r[a.theme] = [...r[a.theme] || [], a];
    return r;
  }, {});
  Object.entries(groupData).forEach((item) => {
    let html = `
      <div class="accordion-card">
        <div class="accordion-title" id="accordion">${item[0]}</div>
        <div class="accordion-content ">
          ${item[1].map((item2) => {
            return `<div class="flashcard">
                      <div class="accordion-text text-secondary">${item2.question}</div>
                      <div class="accordion-text">${item2.answer}</div>
                    </div>`
          }).join("")}
        </div>
      </div>
    `;
    document.querySelector('#result').innerHTML += html;
    document.querySelector('#accordion').addEventListener("click", (e) => {
      console.log(e.target);
      e.target.nextSibling.style.display = "block";
    });
  });
}

const isFlashcardPage = () => {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    let tabUrl = tabs[0].url;
    if (tabUrl.match(/kitt\.lewagon\.com\/camps\/\d*\/flashcards/gm)) {
      document.querySelector('#add').disabled = false;
    } else {
      document.querySelector('#add').disabled = true;
      document.querySelector('#add').title = "You must be on a flashcard page to add a flashcard";
      document.querySelector('#add').style.cursor = "not-allowed";
    }
  });
}

if (!localStorage.getItem('data')) {
  localStorage.setItem('data', JSON.stringify([]));
}
let data = JSON.parse(localStorage.getItem('data'));
updateCounter();
isFlashcardPage();

document.querySelector('#add').addEventListener("click", () => {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    let activeTabId = tabs[0].id;
    chrome.scripting.executeScript({
      target: { tabId: activeTabId },
      func: getFlashcard
    })
  });
});

document.querySelector('#export').addEventListener("click", () => {
  exportPDF();
});

document.querySelector('#clear').addEventListener("click", () => {
  localStorage.clear();
  data = [];
  updateCounter();
});

document.querySelector('#show').addEventListener("click", () => {
  showFlashcards();
});
