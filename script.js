import pdf from './node_modules/html-pdf';

const data = [];

const getFlashcard = () => {
  // const theme = document.querySelector(".flashcard-game-card-front h4").innerHTML; 
  // const question = document.querySelector(".flashcard-game-card-front .flashcard-game-card-content").innerHTML; 
  // const solution = document.querySelector(".flashcard-game-card-back .flashcard-game-card-content").innerHTML;

  const fullfront = document.querySelector(".flashcard-game-card-front").innerHTML;
  const fullback = document.querySelector(".flashcard-game-card-back").innerHTML;
  // const [tab] = chrome.runtime.query({active: true, lastFocusedWindow: true});
  chrome.runtime.sendMessage({
    fullfront: fullfront,
    fullback: fullback,
  });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    data.push(request);
    console.log(data);
  }
);


const exportPDF = () => {
  let html = fs.readFileSync('./results.html', 'utf8');
  let options = { format: 'Letter' };
  
  pdf.create(html, options).toFile('./flashcards.pdf', function(err, res) {
    if (err) return console.log(err);
    console.log(res); // { filename: '/app/businesscard.pdf' }
  });
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