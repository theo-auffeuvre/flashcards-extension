// import pdf from './node_modules/html-pdf';

const data = JSON.parse(localStorage.getItem('data'));

const getFlashcard = () => {
  // const theme = document.querySelector(".flashcard-game-card-front h4").innerHTML;
  // const question = document.querySelector(".flashcard-game-card-front .flashcard-game-card-content").innerHTML;
  // const solution = document.querySelector(".flashcard-game-card-back .flashcard-game-card-content").innerHTML;
  const theme = document.querySelector(".flashcard-game-card-title").innerHTML;
  const question = document.querySelector(".flashcard-game-card-content-markdown").innerHTML;
  const answer = document.querySelector(".flashcard-game-card-back .flashcard-game-card-content").innerHTML;
  // const [tab] = chrome.runtime.query({active: true, lastFocusedWindow: true});
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
    // const result = document.querySelector('#result')
    // result.innerHTML = data.map((item) => {
    //   return `<div class="card">
    //     <div class="card-body">
    //       <h4 class="card-title">${item.theme}</h4>
    //       <p class="card-text">${item.question}</p>
    //       <p class="card-text">${item.answer}</p>
    //     </div>
    //   </div>`
    // }).join('');
  }
);


const exportPDF = () => {
  let result = ""
  result = data.map((item) => {
    return `<div class="card">
      <div class="card-body">
        <h4 class="card-title">${item.theme}</h4>
        <p class="card-text">${item.question}</p>
        <p class="card-text">${item.answer}</p>
      </div>
    </div>`
  }).join('');
  let mywindow = window.open();
  mywindow.document.write(result);
  mywindow.print();
}

document.querySelector('#button').addEventListener("click", () => {
  console.log("button clicked");
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
