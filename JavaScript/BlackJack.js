
var dealerHand = new Array();
var playerHand = new Array();
var count = 0;
var gameOver = true;
var deck = new Deck();
deck.shuffle();
var musicOn= true;
var dealOpenClick = false;
var playerFund = 50;
var dealerFund = 50;
var roundsDealer = 0;
var roundsPlayer = 0;

function Card(num,suit) 
{
  // constructor to construct a card object
  // a Card object has a number, a suit and a filename	
  this.num   = num;
  this.suit  = suit;
  this.fname = fname;
}  // end function Card()

function Deck() 
{
  // constructor to construct a deck of cards object
  this.cards = new Array(52);
  this.nextCard = 0;
  // we create the deck in order and later we shuffle it
  for (i=1; i < 14; i++) 
  {
    this.cards[i-1]  = new Card(i,"c");
    this.cards[i+12] = new Card(i,"h");
    this.cards[i+25] = new Card(i,"s");
    this.cards[i+38] = new Card(i,"d");
  }
  // the deck object has a deck.shuffle() function
  // and a deck.dealCard function()
  this.shuffle = shuffle;
  this.dealCard = dealCard;
} // end function Deck()

function fname() 
{  
  /* this function creates and returns an image filename.
     a filename is the card number + the suit + .gif
	 An Ace is 1, A King is 13
  */
  return "../Media/" + this.num + this.suit + ".png";
}  // end function fname()

function shuffle() 
{
  // The deck is shuffled at the start of a new game
  // and after 75% (39) of the cards have been used.	
  for (i=1; i < 5000; i++) 
  {
    // select two cards at random and exchange them
    card1 = Math.floor(52 * Math.random());
    card2 = Math.floor(52 * Math.random());
    temp = this.cards[card2];
    this.cards[card2] = this.cards[card1];
    this.cards[card1] = temp;
  }
  // reset nextCard to the value of 0
  this.nextCard = 0;
} // end function shuffle()

function dealCard() 
{
  return this.cards[this.nextCard++];
} // end function dealCard()

//We initilize everything
function newGame() 
{
    playerFund = 50;
    dealerFund = 50;
    roundsPlayer = 0;
    roundsDealer = 0;
    gameOver = true;
    $("#dealOpen").show();
    $("#box").hide();
    var music = document.getElementById("Game_bg");
    $("#Game_bg").attr("src","../Media/Game_bg.ogg");
    $("#Game_bg").attr("loop","-1");
    if(!musicOn){
      music.pause();
    }
    document.getElementById("PlayerRoundP").innerHTML = 0;
    document.getElementById("DealerRoundP").innerHTML = 0;
    document.getElementById("DealerMoneyP").innerHTML = "" + dealerFund;
    document.getElementById("PlayerMoneyP").innerHTML = "" + playerFund;
    for(var i = 2; i < 12; i++)
    document.images[i].src = "../Media/back.png"; 
    $("#newGame,#gameOver").hide();
    $("#dealOpenImg").attr("src","../Media/close.png");
    dealOpenClick = false;
    document.form1.dealer.value = "";
    document.getElementById("resultOutPut").innerHTML = "";
    document.form1.player.value = "";
} // end function newGame()

//begin with every round, we check if there is person with the fund less than 0
function deal(dealNum){
  check();
  $("#d10,#d20,#d30").hide();
  document.getElementById("dealOpenImg").src = "../Media/close.png";
  count = 0;
  dealOpenClick = false;
  gameOver = false;
  this.dealNum = dealNum;
  // when we have 75% (39) of the cards used we
  // re-shuffle the deck.  
  if (deck.nextCard > 39) 
    deck.shuffle();   
  dealerHand = new Array();
  playerHand = new Array();

  // deal and display cards
  
  // Display dealer's cards.
  // Do not display the dealer's first card at the start.
  dealerHand[0] = deck.dealCard();   
  document.images[2].src = "../Media/back.png"; 
  // We only shown the dealer's second card at this stage.
  dealerHand[1] = deck.dealCard();
  document.images[3].src = dealerHand[1].fname();
  // We show the back image for the other slots.
  for (i = 4; i < 7; i++) 
    document.images[i].src = "../Media/back.png";

  // Display the player's cards - only two at this stage.
  playerHand[0] = deck.dealCard();
  document.images[7].src = playerHand[0].fname();
  playerHand[1] = deck.dealCard();
  document.images[8].src = playerHand[1].fname();
  // Display back image for the other slots.
  for (i = 9; i < 12; i++) 
    document.images[i].src = "../Media/back.png";

  // Reset the form fields.
  document.form1.dealer.value = "";
  document.form1.player.value = score(playerHand);
  document.getElementById("resultOutPut").innerHTML = "";
  gameOver = false; 
}
function hit() 
{
  var total = 0;
  // index for the new card position
  var newCard = 0;
  if(!gameOver){
      count++;
      if(count <= 3){
      if (!gameOver){
        newCard = playerHand.length;
        playerHand[newCard] = deck.dealCard();
        document.images[newCard + 7].src = playerHand[newCard].fname();
        total = score(playerHand);
      if (total > 21){  // Busted, game over.
        document.form1.player.value = total + "  BUSTED";
      // reveal the dealer's first card
        document.images[2].src = dealerHand[0].fname(); 
        document.form1.dealer.value = score(dealerHand);
        gameOver = true;
        winner();
      } 
    else 
        document.form1.player.value = total;
      }
    } 
    else if(count > 3){
        gameOver = true;
        document.form1.dealer.value = score(dealerHand);
        winner();
    } 
  }
} // end function hit()

function stand() 
{
  var total = 0;
  // index for the new card position
  var newCard = 0;  
  if (!gameOver) 
  {
	// reveal the dealer's first card  
    document.images[2].src = dealerHand[0].fname(); 
    while (score(dealerHand) < 17) 
	  { // Dealer stands on a soft 17
      newCard = dealerHand.length;
      dealerHand[newCard] = deck.dealCard();
      document.images[newCard + 2].src = dealerHand[newCard].fname();
    }
    total = score(dealerHand);
    if (total > 21) 
	  // Busted
      document.form1.dealer.value = total + "  busted";
	  else 
      document.form1.dealer.value = total;
    //out put the winner only game is not over
    winner();
  }
  // The game ends after the player stands.
  gameOver = true; 
} // end function stand()

function score(hand) 
{
  // this function is called for the player hand and the dealer hand.	
  // the variable called soft counts the number of aces in the hand.	
  var total = 0;
  var soft = 0; 
  var pips = 0; 
  for (i = 0; i < hand.length; i++) 
  {
    pips = hand[i].num;
    if (pips == 1) 
	{ 
      soft = soft + 1;
	  // initially count an ace as 11
      total = total + 11;
    } 
	else if (pips == 11 || pips == 12 || pips == 13)
      total = total + 10;
	else 
      total = total + pips;
  }
  while (soft > 0 && total > 21) 
  { // now count each ace as 1 instead
    total = total - 10; // take off 10 (as 11 previously added)
    soft = soft - 1; // reduce number of aces by 1
  }   
  return total;
} // end function score()

//After every round, we check if there is a person with the funds 0 or negative number
function check(){
  var music = document.getElementById("Game_bg");
  if(dealerFund <= 0){
      $("#newGame,#gameOver").show();
      document.getElementById("whoWin").src = "../Media/youWin.png";
      $("#d10,#d20,#d30,#dealOpen").hide();
      $("#Game_bg").removeAttr("loop");
      $("#Game_bg").attr("src","../Media/Audio_You_Win.ogg");
      if(!musicOn){
        music.pause();
      }
    }
  else if(playerFund <= 0){
    $("#newGame,#gameOver").show();
    document.getElementById("whoWin").src = "../Media/youLose.png";
    $("#d10,#d20,#d30,#dealOpen").hide();
    $("#Game_bg").removeAttr("loop");
    $("#Game_bg").attr("src","../Media/Audio_You_Lose.ogg");
    if(!musicOn){
      music.pause();
    }
  }
}

function winner() 
{
  // determine the winner
  // call the function score() with each hand and then check/compare the results
  // update the result textbox on the GUI with the text describing the outcome.
  //after update the data, check if the game is totally over
  var playerTotal = score(playerHand);
  var dealerTotal = score(dealerHand);
  if (playerTotal > 21){
    dealerWin();
  }
  else if (dealerTotal > 21) {
    playerWin();
  }
  else if (playerTotal == dealerTotal){
    dealerWin();
    document.getElementById("resultOutPut").innerHTML = "Tie game";
  }
  else if (playerTotal  > dealerTotal){
    playerWin();
  }
  else if(count == 3){
    playerWin();
  }
  else{
    dealerWin();
  }
  check();
}
//Output the info of who wins in GUI
function playerWin(){
  dealerFund -= dealNum;
  playerFund += dealNum;
  roundsPlayer++;
  $("#box").show();
  document.getElementById("DealerMoneyP").innerHTML = "" + dealerFund;
  document.getElementById("PlayerMoneyP").innerHTML = "" + playerFund;
  document.getElementById("DealerRoundP").innerHTML = "" + roundsDealer;
  document.getElementById("PlayerRoundP").innerHTML = "" + roundsPlayer;
  document.getElementById("resultOutPut").innerHTML = "Player wins";
}
function dealerWin(){
  dealerFund += dealNum;
  playerFund -= dealNum;
  roundsDealer++;
  $("#box").show();
  document.getElementById("DealerMoneyP").innerHTML = "" + dealerFund;
  document.getElementById("PlayerMoneyP").innerHTML = "" + playerFund;
  document.getElementById("DealerRoundP").innerHTML = "" + roundsDealer;
  document.getElementById("PlayerRoundP").innerHTML = "" + roundsPlayer;
  document.getElementById("resultOutPut").innerHTML = "Dealer wins";
}

//These function is used to show and hide the welcome interface
function help(){
  $("#welcomeInterface").hide();
  $("#helpInterface").show();
}

function play(){
  $("#backToHome").show();
  $("#helpInterface,#welcomeInterface,#help,#play,#background").hide();
  $("#everything,#dealOpen,#PlayerMoney,#DealerMoney,#DealerRound,#PlayerRound").show();
  newGame();
}
//This function is used to play and stop music
function music(){
  var music = document.getElementById("Game_bg");
    if(musicOn){
      music.pause();
      document.getElementById("playMusic").src = "../Media/musicOff.png";
      musicOn = false;

    }
    else if(!musicOn){
      music.play();
      document.getElementById("playMusic").src = "../Media/musicOn.png";
      musicOn = true;
    }
}
//When we click deal, it will show you three option
function dealOpen(){
  if(gameOver){
    if(!dealOpenClick){
    document.getElementById("dealOpenImg").src = "../Media/open.png";
    dealOpenClick = true;
    $("#d10,#d20,#d30").show();
  }
  else if(dealOpenClick){
    document.getElementById("dealOpenImg").src = "../Media/close.png";
    dealOpenClick = false;
    $("#d10,#d20,#d30").hide();
  }
  }
}
//click Home, go back to home
function backToHome(){
  $("#backToHome,#d10,#d20,#d30").hide();
  $("#welcomeInterface,#help,#play,#background").show();
  $("#everything,#dealOpen,#PlayerMoney,#DealerMoney,#DealerRound,#PlayerRound").hide();
}