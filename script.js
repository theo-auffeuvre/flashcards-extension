// import pdf from './node_modules/html-pdf';

const getFlashcard = () => {
  // const theme = document.querySelector(".flashcard-game-card-front h4").innerHTML;
  // const question = document.querySelector(".flashcard-game-card-front .flashcard-game-card-content").innerHTML;
  // const solution = document.querySelector(".flashcard-game-card-back .flashcard-game-card-content").innerHTML;
  let theme = document.querySelector(".flashcard-game-card-title").innerHTML;
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
  
}

if (!localStorage.getItem('data')) {
  localStorage.setItem('data', JSON.stringify([]));
}
let data = JSON.parse(localStorage.getItem('data'));
updateCounter();

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
