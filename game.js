/* RETRIEVING USERNAME */

var nameData = sessionStorage.getItem("nameData");
console.log(nameData);

/* PRELOADING IMAGES */

var images = [];
function preload() {
    for (var i = 0; i < arguments.length; i++) {
        images[i] = new Image();
        images[i].src = preload.arguments[i];
    }
}

preload(
	"images/arrows-ccw.png",
	"images/arrows-cw.png",
	"images/Black 13.png",
	"images/Black 13.png",
	"images/Black 13.png",
	"images/Black 14.png",
	"images/Blue 0.png",
	"images/Blue 1.png",
	"images/Blue 2.png",
	"images/Blue 3.png",
	"images/Blue 4.png",
	"images/Blue 5.png",
	"images/Blue 6.png",
	"images/Blue 7.png",
	"images/Blue 8.png",
	"images/Blue 9.png",
	"images/Blue 10.png",
	"images/Blue 11.png",
	"images/Blue 12.png",
	"images/Red 1.png",
	"images/Red 2.png",
	"images/Red 3.png",
	"images/Red 4.png",
	"images/Red 5.png",
	"images/Red 6.png",
	"images/Red 7.png",
	"images/Red 8.png",
	"images/Red 9.png",
	"images/Red 10.png",
	"images/Red 12.png",
	"images/Green 1.png",
	"images/Green 2.png",
	"images/Green 3.png",
	"images/Green 4.png",
	"images/Green 5.png",
	"images/Green 6.png",
	"images/Green 7.png",
	"images/Green 8.png",
	"images/Green 9.png",
	"images/Green 10.png",
	"images/Green 11.png",
	"images/Green 12.png",
	"images/Orange 1.png",
	"images/Orange 2.png",
	"images/Orange 3.png",
	"images/Orange 4.png",
	"images/Orange 5.png",
	"images/Orange 6.png",
	"images/Orange 7.png",
	"images/Orange 8.png",
	"images/Orange 9.png",
	"images/Orange 10.png",
	"images/Orange 11.png",
	"images/Orange 12.png"
)

/* MODEL COMPONENT -- CARD AND PLAYER CLASSES*/

class Card{
	constructor(value, color){
		this.value = value;
		this.color = color;
	}

	get cardValue(){
		return this.value;
	}
	get cardColor(){
		return this.color;
	}
	get cardID(){
		var id = this.color + " " + this.value;
		return id;
	}
	
	get cardImage(){
		return "images/" + this.cardID + ".png";
	}
}

class Player{
	constructor(m_name, isHuman){
		this.m_name = m_name;
		this.isHuman = isHuman;
		this.hand = [];
	}

	get handsize(){
		return this.hand.length;
	}

	get uname(){
		return this.m_name;
	}
}

/* -	-	GAME SETUP -	-	*/

/* CREATING PLAYERS */
var playerList = [];
var user = new Player(nameData, true);
 	cp1 = new Player("Kathy", false);
 	cp2 = new Player("Ash", false);
 	cp3 = new Player("Bon", false);
playerList.push(user, cp1, cp2, cp3);

/* CREATING DECK */

var drawPile = [];

for(var i = 0; i < 15; i++){
    if(i == 0){
        var card1 = new Card(i, "Blue");
     	    card2 = new Card(i, "Green");
        	card3 = new Card(i, "Red");
         	card4 = new Card(i, "Orange");
        drawPile.push(card1, card2, card3, card4);
    }
    else if(i == 14 || i == 13){
        var card1 = new Card(i, "Black");
        drawPile.push(card1, card1, card1, card1);
    }
    else{
        var card1 = new Card(i, "Blue");
     	  	card2 = new Card(i, "Green");
        	card3 = new Card(i, "Red");
         	card4 = new Card(i, "Orange");
        drawPile.push(card1, card1, card2, card2);
        drawPile.push(card3, card3, card4, card4);
    }
}



/* print out entire deck */
/*
for(var i = 0; i != drawPile.length; i++){
	console.log(drawPile[i].cardValue + " " + drawPile[i].cardColor);
}
*/

/* SHUFFLE THE DECK (Fisher-Yates Shuffle) */

function shuffle(){
	var j = 0;
		temp = null;
	for(var i = drawPile.length - 1; i != 0; i -= 1){
		j = Math.floor(Math.random() *(i + 1));
		temp = drawPile[i];
		drawPile[i] = drawPile[j];
		drawPile[j] = temp;
	}
}

shuffle();

/* DEALING CARDS */

/* DEAL FUNCTION */
function deal(receivingPlayer, numberOfCards){
	for(var i = 0; i != numberOfCards; i++)
		receivingPlayer.hand.push(drawPile.pop());
}

/* Deal 7 cards per player */
deal(user, 7);
deal(cp1, 7);
deal(cp2, 7);
deal(cp3, 7);


/* setting direction */
var ccw = true;
setImage();

showHand();
updateComputerCardDisplay(cp1);
updateComputerCardDisplay(cp2);
updateComputerCardDisplay(cp3);
/* START DISCARDPILE */

var currentColor;
var	currentNumber;
var chosenCard; 
var gameOver = false;

var discardPile = [];

//In the case of Wild Draw Four, it's put back in the deck and another one is chosen.
for(;;){
	var chosenCard = drawPile.pop();
	if(chosenCard.cardValue == 14){
		drawPile.unshift(chosenCard);
		continue;
	}
	currentColor = chosenCard.cardColor;
	currentNumber = chosenCard.cardValue;
	discardPile.push(chosenCard);
	displayLastCard(chosenCard);
	break;
}

var userMustChooseColor = false;
if(currentNumber > 9){
	switch(currentNumber){
		//+2
		case 10:
			deal(user,2);
			showHand();
			nextTurn();
			break;
		//skip
		case 11:
			nextTurn();
			break;
		//reverse
		case 12:
			playerList.reverse();
			setImage();
			break;
		case 13:
			userMustChooseColor = true;
		default:
			break;
	}
}

if(userMustChooseColor == false){
	for(;;){
		if(playerList[0].isHuman){
			if(!drawIfUserMustDraw()){
				break;
			}
			showHand();
		}
		else{
			computerTurn(playerList[0]);
			if(chosenCard != null){
				console.log(playerList[0].uname + " played " + chosenCard.cardID);
				currentColor = chosenCard.cardColor;
				currentNumber = chosenCard.cardValue;
				displayLastCard(chosenCard);
				if(chosenCard.cardValue == 12){
					playerList.reverse();
					setImage();
					continue;
				}
				else if(chosenCard.cardValue > 9)
					wordCard(currentNumber);
			}
		}
		nextTurn();
	}
}

var choiceOn = true;
document.getElementById("user-hand").addEventListener('click', userClicked);

function userClicked(e){
	if(choiceOn == false)
		return;
	if(drawPile.length < 20)
		reuse();
	var cardInput = e.target.id;
	choiceOn = false;
	var canUseWildCard2 = true;
	if(cardInput == "Black 14"){
		for(var i = 0; i != user.handsize; i++){
			if(user.hand[i].cardColor == currentColor && user.hand[i].cardColor != "Black"){
				alert("You have a card of the same color so you can't play +4");
				canUseWildCard2 = false;
				break;
			}
		}
		if(canUseWildCard2 == false)
			return;
	}

	var isValid = false;
	var i = 0;
	for(; i != user.handsize; i++){
		if(user.hand[i].cardID == cardInput){
			if(currentColor == "Black" || user.hand[i].cardColor == "Black"){
				isValid = true;
				break;
			}
			else if(user.hand[i].cardValue == currentNumber || user.hand[i].cardColor == currentColor){
				isValid = true;
				break;
			}
		}
	}

	if(isValid == false){
		alert("Not a valid card. Try again");
		return;
	}

	chosenCard = user.hand[i];
	currentNumber = chosenCard.cardValue;
	currentColor = chosenCard.cardColor;
	discardPile.push(chosenCard);
	displayLastCard(chosenCard);
	user.hand.splice(i, 1);

	if(checkUno())
		alert(playerList[0].uname + " has Uno!");
	if(checkWinner()){
		alert(playerList[0].uname + " is our winner!");
		gameOver = true;
		return;
	}

	switch(chosenCard.cardValue){
		//+2 and skip next
		case 10:
			deal(playerList[1],2);
			updateComputerCardDisplay(playerList[1]);
			nextTurn();
			break;
		//skip
		case 11:
			alert(playerList[1].uname + "'s turn was skipped");
			nextTurn();
			break;
		case 12:
			break;
		case 13:
			userChooseColor();
			return;
		case 14:
			userChooseColor();
			deal(playerList[1],4);
			return;
		default:
			break;
	}
	if(chosenCard.cardValue == 12)
		reverse();
	else
		nextTurn();
	gameLoop();
	choiceOn = true;
}


function colorChosen(e){
	var newColor = e.target.id;
	var x = document.getElementById("colorChoice");
	x.style.zIndex='0';
	x.removeEventListener('click', colorChosen);
	currentColor = newColor;
	gameLoop();
}

function gameLoop(){
	var quitFunction = false;
	for(;;){
		setTimeout(function(){
			if(playerList[0].isHuman){
				if(drawIfUserMustDraw()){
					nextTurn();
					return;
				}
				else{
					quitFunction = true;
					return;
				}
			}

			computerTurn(playerList[0]);
			if(chosenCard == null){
				nextTurn();
				return;
			}

			alert(playerList[0].uname + " played " + chosenCard.cardID);
			currentColor = chosenCard.cardColor;
			currentNumber = chosenCard.cardValue;
			displayLastCard(chosenCard);
			if(checkUno())
				alert(playerList[0].uname + " has Uno!");
			if(checkWinner()){
				alert(playerList[0].uname + " is our winner!");
				gameOver = true;
				quitFunction = true;
				return;
			}
			if(chosenCard.cardValue == 12){
				playerList.reverse();
				setImage();
				alert("We are reversing direction now.");
				return;
			}
			else if(chosenCard.cardValue > 9){
				wordCard(currentNumber);
			}
			nextTurn();
		}, 2500);
		if(quitFunction == true)
			break;
	}
}

/* GAME-RELATED FUNCTIONS */
function wordCard(cardValue){
	switch(cardValue){
		//+2
		case 10:
			deal(playerList[1],2);
			alert(playerList[1].uname + " is forced to draw 2 and is skipped");
			if(playerList[1].isHuman)
				showHand();
			else
				updateComputerCardDisplay(playerList[1]);
			nextTurn();
			break;
		//skip
		case 11:
			alert(playerList[1].uname + "'s turn was skipped");
			nextTurn();
			break;
		//change color - wild card
		case 13:
			currentColor = computerChooseColor(playerList[0]);
			alert(playerList[0].uname + " chose the new color to be " + currentColor);
			break;
		//wild card +4
		case 14:
		//logic is: i deal first, then skip
			currentColor = computerChooseColor(playerList[0]);
			deal(playerList[1],4);
			if(playerList[1].isHuman){
				showHand();
			}
			nextTurn();
			alert(playerList[1].uname + " is forced to draw 4 and is skipped");
			break;
		default:
			break;
	}
}


/* GAME-RELATED FUNCTIONS */
function checkWinner(){
	for(var i = 0; i < playerList.length; i++){
		if(playerList[i].handsize == 0)
			return true;
	}
	return false;
}

function setImage(){
	var x = document.getElementById("direction");
	x.innerHTML = "";
	if(ccw == false){
		x.innerHTML += '<img src="images/arrows-ccw.png">';
		ccw = true;
	}
	else{
		x.innerHTML += '<img src="images/arrows-cw.png">';
		ccw = false;
	}
}

function checkUno(){
	return playerList[0].handsize == 1;
}


function nextTurn(){
	var donePlayer = playerList.shift();
	playerList.push(donePlayer);
}


function reuse(){
	while(discardPile.length > 0)
		drawPile.push(discardPile.pop());

	shuffle();
}
//for reverse, use playerList.reverse()

/* PLAYER-RELATED FUNCTIONS */ 

function drawIfUserMustDraw(){
	if(currentColor != "Black"){
		var mustDrawCard = true;
		for(var i = 0; i != user.handsize; i++){
			if(user.hand[i].cardColor == "Black")
				mustDrawCard = false;
			else if(user.hand[i].cardValue == currentNumber)
				mustDrawCard = false;
			else if(user.hand[i].cardColor == currentColor){
				mustDrawCard = false;
			}
		}
		if(mustDrawCard){
			alert("You must a draw a card.");
			deal(user, 1);
			return true;
		}
		else
			return false;
	}
}

function userChooseColor(){
	var x = document.getElementById("colorChoice");
	x.style.zIndex='2';
}

function showHand(){
	var x = document.getElementById("user-hand");
	x.innerHTML = "";
	for(var i = 0; i != user.handsize; i++){
		var m = user.hand[i].cardID;
		x.innerHTML += '<img id="' + user.hand[i].cardID + '" src="' + user.hand[i].cardImage + '" >';
	}
}

function displayLastCard(card){
	var x = document.getElementById("currentCard");
	x.innerHTML = "";
	x.innerHTML += '<img src="' + card.cardImage + '" >';
}

function updateComputerCardDisplay(player){
		switch(player.uname){
		case 'Kathy':
		document.getElementById("Kathy").innerHTML = "";
		for(var i = 0; i != player.handsize; i++){
			document.getElementById("Kathy").innerHTML += '<img src="images/card-back.png" style="position:absolute;left:33px;top:' + (220+20*i) + 'px;">';
		}
			break;
		case 'Ash':
		document.getElementById("Ash").innerHTML = "";
		for(var i = 0; i != player.handsize; i++){
			document.getElementById("Ash").innerHTML += '<img src="images/card-back.png" style="position:absolute;top:52px;left:' + (430+30*i) + 'px;">';
		}
			break;
		case 'Bon':
				document.getElementById("Bon").innerHTML = "";
			for(var i = 0; i != player.handsize; i++){
				document.getElementById("Bon").innerHTML += '<img src="images/card-back.png" style="position:absolute;left:958px;top:' + (220+20*i) + 'px;">';
			}
			break;
		default:
			break;
		}
}


function computerTurn(currentPlayer){
	console.log(currentPlayer.uname + " has " + currentPlayer.handsize + " cards left");
	var wildCard1 = 0;
		wildCard2 = 0;
		sameColor = 0;
		sameValue = 0;
	for(var i = 0; i != currentPlayer.handsize; i++){
		if(currentPlayer.hand[i] == 13)
			wildCard1++;
		else if(currentPlayer.hand[i] == 14)
			wildCard2++;
		else if(currentColor == currentPlayer.hand[i].cardColor)
			sameColor++;
		else if(currentNumber == currentPlayer.hand[i].cardValue)
			sameValue++;
	}

	if(sameColor > 0){
		for(var i = 0; i != currentPlayer.handsize; i++){
			if(currentPlayer.hand[i].cardColor == currentColor){
				break;
			}
		}
	}
	else if(sameValue > 0){
		for(var i = 0; i != currentPlayer.handsize; i++){
			if(currentPlayer.hand[i].cardValue == currentNumber)
				break;
		}
	}
	else if(wildCard1 > 0){
		for(var i = 0; i != currentPlayer.handsize; i++){
			if(currentPlayer.hand[i] == 13)
				break;
		}
	}
	else if(wildCard2 > 0){
		for(var i = 0; i != currentPlayer.handsize; i++){
			if(currentPlayer.hand[i] == 14)
				break;
		}
	}
	else{
		//forced to draw a card
		deal(currentPlayer, 1);
		chosenCard = null;
		updateComputerCardDisplay(currentPlayer);
		return;
	}
	chosenCard = currentPlayer.hand[i];
	discardPile.push(chosenCard);
	currentPlayer.hand.splice(i, 1);
	updateComputerCardDisplay(currentPlayer);
}

function computerChooseColor(){
	var redCount = 0;
		orangeCount = 0;
		blueCount = 0;
		greenCount = 0;
	for(var i = 0; i != playerList[0].handsize; i++){
		if(playerList[0].hand[i].cardColor == "Red")
			redCount++;
		else if(playerList[0].hand[i].cardColor == "Orange")
			orangeCount++;
		else if(playerList[0].hand[i].cardColor == "Blue")
			blueCount++;
		else if (playerList[0].hand[i].cardColor == "Green")
			greenCount++;
	}
	if(redCount >= orangeCount && redCount >= blueCount && redCount >= greenCount)
		return "Red";
	else if(orangeCount >= blueCount && orangeCount >= greenCount)
		return "Orange";
	else if(blueCount >= greenCount)
		return "Blue";
	else
		return "Green";
}