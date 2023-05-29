// import pdf from './node_modules/html-pdf';

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
  console.log(Object.entries(groupData));
  Object.entries(groupData).forEach((item) => {
    console.log(item[0]);
    let card = document.createElement('div');
    card.classList.add('accordion-card');
    let cardTitle = document.createElement('div');
    cardTitle.classList.add('accordion-title');
    cardTitle.innerHTML = item[0];
    card.appendChild(cardTitle);
    item[1].forEach((item2) => {
      let cardContent = document.createElement('div');
      cardContent.classList.add('accordion-content');
      card.appendChild(cardContent);
      let cardQuestion = document.createElement('p');
      cardQuestion.classList.add('accordion-text');
      cardQuestion.innerHTML = item2.question;
      cardContent.appendChild(cardQuestion);
      let cardAnswer = document.createElement('p');
      cardAnswer.classList.add('accordion-text');
      cardAnswer.innerHTML = item2.answer;
      cardContent.appendChild(cardAnswer);
    })
    document.querySelector('#result').appendChild(card);
  })

  // groupData.map((item) => {
  //   let card = document.createElement('div');
  //   card.classList.add('card');
  //   let cardTitle = document.createElement('div');
  //   cardTitle.classList.add('card-title');
  //   cardTitle.innerHTML = item.theme;
  //   // let cardQuestion = document.createElement('p');
  //   // cardQuestion.classList.add('card-text');
  //   // cardQuestion.innerHTML = item.question;
  //   card.appendChild(cardTitle);
  //   document.querySelector('#result').appendChild(card);
  // });
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
