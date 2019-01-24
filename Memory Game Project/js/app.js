/*
 * Create a list that holds all of your cards
 */
var cardList = ["diamond", "paper-plane-o", "anchor", "bolt", "cube", "leaf", "bicycle", "bomb"];
cardList = cardList.concat(cardList);
let clicks = 0;
let move = 0;
let myInterval;
let toMatch = [];
let open = [];
let done = [];
let htmlMove = document.getElementById('moves');
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function init() {
    //console.log("RUN !!!");
    var cards = shuffle(cardList);
    //console.log(cards);
    var desk = document.getElementById('desk');
    //console.log(desk);
    for (var i = 0; i < cards.length; i++) {
        desk.innerHTML += '<li class="card"><i class="fa fa-' + cards[i] + '"></i></li>' + '\n';
    }
    createOpen();
    //console.log(desk)  
    addListenersForCards();
    addListenerForRestart();

}

//Create Open list cards

function createOpen() {
    var cardsHTML = document.getElementsByClassName('card');
    open.push(cardsHTML[0]);
    for (var i = 0; i < cardsHTML.length; i++) {
        var checkExist = 0;
        for (var k = 0; k < open.length; k++) {
            if (open[k].innerHTML === cardsHTML[i].innerHTML) {
                checkExist = 1;
            }
        }
        if (checkExist == 0) {
            open.push(cardsHTML[i]);
        } else {
            checkExist = 0;
        }
    }
    //console.log(open);
}

//Restart function and Listener

function addListenerForRestart() {
    var reButton = document.getElementById("res");
    //console.log(reButton);
    reButton.addEventListener("click", function () { restart() });
}

function restart() {
    //console.log("????");
    toMatch=[];
    clicks = 0;
    move = 0;
    timerFun("stop");
    var cardsHTML = document.getElementsByClassName('card');
    while (cardsHTML.length) {
        cardsHTML[0].parentNode.removeChild(cardsHTML[0]);
    }
    var cards = shuffle(cardList);
    for (var i = 0; i < cards.length; i++) {
        desk.innerHTML += '<li class="card"><i class="fa fa-' + cards[i] + '"></i></li>' + '\n';
    }
    createOpen();
    addListenersForCards();
    var starslist = document.getElementsByClassName("fa-star");
    starslist[2].style.color = "";
    starslist[1].style.color = "";
    document.getElementById('moves').innerText = '0';
}

//Cards function and Listener

function addListenersForCards() {
    var cardsHTML = document.getElementsByClassName('card');
    for (var i = 0; i < cardsHTML.length; i++) {
        cardsHTML[i].addEventListener("click", cardslistener);
    }
}

var cardslistener = function () {
    this.classList.toggle("open");
    this.classList.toggle("show");
    clicks++;
    //console.log(clicks);
    toMatch.push(this);
    if (clicks == 1) {
        timerFun("start");
    }
    if (toMatch.length != 0 && toMatch.length === 2) {
        console.log("iamhere")

        if (toMatch[0] === this) {
            /* Handler for clicking the same card twice */
            toMatch = [];
        } else {
            console.log("Accepted Value");
            movesCounter();
            checkCard(toMatch[0], toMatch[1]);
            toMatch = [];
        }

    } else {
        if (toMatch.length > 2) {
            toMatch = [];
            console.log('to match was larger than 2');
        }
    }
};

//Moves and stars functions

function movesCounter() {
    move++;
    if (move == 18) {
        starsHandler(1);
    } else if (move == 24) {
        starsHandler(2);
    }
    htmlMove.innerText = move;
}

function starsHandler(state) {
    var starslist = document.getElementsByClassName("fa-star");
    if (state == 1) {
        starslist[2].style.color = "white";
        starslist[5].style.color = "white";
    } else if (state == 2) {
        starslist[1].style.color = "white";
        starslist[4].style.color = "white";
    }
}

//Timer function

function timerFun(action) {
    var sec = '00';
    var min = '00';
    var hours = '00';
    var htmlTimer = document.getElementById('timo');
    if (action == "start") {
        function modifier() {
            sec++;
            if (sec == 60) {
                min++;
                sec = 0;
            }
            if (min == 60) {
                hours++;
                min = 0;
            }
            var timer = hours.toLocaleString(undefined, { minimumIntegerDigits: 2 }) + ':' + min.toLocaleString(undefined, { minimumIntegerDigits: 2 }) + ':' + sec.toLocaleString(undefined, { minimumIntegerDigits: 2 });
            htmlTimer.innerText = timer;
        }
        myInterval = setInterval(modifier, 1000);
    } else if (action == "stop") {
        clearInterval(myInterval);
        htmlTimer.innerText = '00:00:00';
    }

}

//Card Match Functions

function checkCard(card1, card2) {
    //console.log(card1);
    //console.log(card2);
    if (card1.innerHTML == card2.innerHTML) {
        open.splice(open.indexOf(card1), 1);
        //console.log(open);
        card1.removeEventListener("click", cardslistener);
        card2.removeEventListener("click", cardslistener);
        done.push(card1);
        if (done.length == 8) {
            popup();
            done = [];
        }
        //console.log(done);
    } else {
        setTimeout(function () {
            card1.classList.toggle("open");
            card1.classList.toggle("show");
            card2.classList.toggle("open");
            card2.classList.toggle("show");
        }, 400);
    }
}

//MODAL FUNCTIONS
function popup() {

    var modal = document.getElementById('myModal');
    var close = document.getElementById("close");

    clearInterval(myInterval);

    var timer = document.getElementById('timo');
    var finalTimer = document.getElementById('resultT');
    var moves = document.getElementById('moves');
    var finalMoves = document.getElementById('resultM');
    finalTimer.innerText = timer.innerText;
    finalMoves.innerText = moves.innerText;
    console.log(finalTimer);
    console.log(finalMoves);

    modal.style.display = "block";
}

/* Modal Buttons */
var playAgain = document.getElementById('pAgain');
var close = document.getElementById("close");
playAgain.addEventListener("click", function () {
    modal.style.display = 'none';
    restart();
});
close.addEventListener("click", function () {
    clearInterval(myInterval);
    modal.style.display = 'none';
});

//TESTING MODAL
var modal = document.getElementById('myModal');

// function call
init();