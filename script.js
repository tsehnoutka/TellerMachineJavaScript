const RESET_BTN = document.querySelector("#Reset");
const WIN_BTN = document.querySelector("#SetWinner");
const BET_BTN = document.querySelector("#Bet");
const WIN_NUM = document.querySelector("#WinningHorseNum");
const BET_AMT = document.querySelector("#BetAmount");
const CASH_DRAWER_TXT= document.querySelector("#CashDrawer");
const HORSES_TXT = document.querySelector("#Horses");
const MSG_TXT = document.querySelector("#Message");

const denoms = [1,5,10,20,100];
const initDenoms = new Object();
initDenoms[1]  =10;
initDenoms[5]  =10;
initDenoms[10] =10;
initDenoms[20] =10;
initDenoms[100]=10;

var cashDrawer = new Object();
var Total =0;

aHorses = [[0,"invalid",0,"lost"],
    [1, "That Darn Grey Cat", 5, "win"],
    [2, "Fort Utopis", 10, "lost"],
    [3, "Count Sheep", 9, "lost"],
    [4, "Ms Traitou", 4, "lost"],
    [5, "Real Princess", 3, "lost"],
    [6, "Pa Kettle", 5, "lost"],
    [7, "Gin Stinger", 6, "lost"]];
// this is the currentWinner = 1
var currentWinner=1;

function printHorses(){
  var output ="";
  for (x=1; x<aHorses.length; x++){
    output = output + aHorses[x] + "\n";
  }
  return output;
}

function printCashDrawer(){
  var output ="";
  denoms.sort(function(a, b){return a-b});
  for ( i=0; i <denoms.length; i++){
    denom = denoms[i];
    temp = cashDrawer[denom];
    output = output + "$" + denom + " - " + cashDrawer[denom] + "\n";
  }
  output = output + "Total - " + Total + "\n";

  return output;
}
function printMessage(message){
  MSG_TXT.value +=message;
  MSG_TXT.scrollTop = MSG_TXT.scrollHeight;
}

function setCashDrawer(){
  Total=0;
  for ( i=0; i <denoms.length; i++){
    denom = denoms[i];
    cashDrawer[denom] = initDenoms[denom];
    Total += denom*cashDrawer[denom];
  }
  CASH_DRAWER_TXT.innerHTML=printCashDrawer();
}

function onResetClick() {
  console.log("The Reset button has been pressed");
  setCashDrawer();
}
RESET_BTN.addEventListener("click",onResetClick,false);

function setWinner(){
  var newWinningHorse = WIN_NUM.value;
  console.log("The new Winning Horse is: " + newWinningHorse);
  //  is number is valid
  if(isNaN(newWinningHorse) || !( newWinningHorse > 0 && newWinningHorse < aHorses.length ) ){
   alert("please enter a vaild Horse Number");
  }else{
    // change the winning horse in aHorse
    aHorses[currentWinner][3] = "lost";
    aHorses[newWinningHorse][3] = "won";
    currentWinner=newWinningHorse;
    console.log(printHorses());
    printMessage("Winning Horse set to : " + newWinningHorse + "\n");
    HORSES_TXT.innerHTML = printHorses();
    selectTextareaLine(HORSES_TXT,newWinningHorse);
  }

}
function onSetWinnerClick() {
  console.log("The Set Winner button has been pressed");
  setWinner();
}
WIN_BTN.addEventListener("click",onSetWinnerClick,false);

function payTheUser(horseName, payout){
  mapPayout = new Object();
  var tempTotal=payout;

  if (Total < payout) {
    console.log("Insuficient Funds : " + payout);
    printMessage("Insuficient Funds (Total): " + payout + "\n");
    return 0;
  }

  //
  denoms.sort(function(a, b){return b-a});
  for (x=0; x< denoms.length; x++){
    var denom = denoms[x];
    var DenominationLeft = cashDrawer[denom];
    var cashOut = 0;
    while ((tempTotal >= denom) && (DenominationLeft > 0)) {
      cashOut++;
      DenominationLeft--;
      tempTotal -= denom;
    }  //  end while
    mapPayout[denom] = cashOut;
  } //  end for
  if(0==tempTotal){
    //  We can pay it out
    Total -= payout;
    var output ="";

    denoms.sort(function(a, b){return a-b});
    output += "Payout : " + horseName + "," + payout + "\n" + "Dispensing: \n";
    for ( i = 0; i< denoms.length; i++) {
 		   var denom = denoms[i];
 			 output +="$" + denom + "," + mapPayout[denom] + "\n";
 			 cashDrawer[denom] = cashDrawer[denom] - mapPayout[denom];
 		}
    printMessage(output + "\n");
  }
  else {
    //  We CAN'T pay it out
    console.log("Insufficient Funds : " + payout);
    printMessage("Insuficient Funds (Denomination) : " + payout + "\n");
  }
  CASH_DRAWER_TXT.innerHTML=printCashDrawer();
}

function onBetClick() {
  var bet =Number(BET_AMT.value);
  console.log("The Bet button has been pressed : " + bet);

  if (isNaN(bet) ||  !Number.isInteger(bet) ){
    alert("please enter a valid amount");
  }
  else {
    odds = aHorses[currentWinner][2];
    payTheUser(aHorses[currentWinner][1], bet * odds);
  }
}
BET_BTN.addEventListener("click",onBetClick,false);

function pageLoad(){
  HORSES_TXT.innerHTML=printHorses();
  setCashDrawer();
  selectTextareaLine(HORSES_TXT,currentWinner);
}



// stolen from:
// http://lostsource.com/2012/11/30/selecting-textarea-line.html
function selectTextareaLine(tarea,lineNum) {
    lineNum--; // array starts at 0
    var lines = tarea.value.split("\n");

    // calculate start/end
    var startPos = 0, endPos = tarea.value.length;
    for(var x = 0; x < lines.length; x++) {
        if(x == lineNum) {
            break;
        }
        startPos += (lines[x].length+1);
    }

    var endPos = lines[lineNum].length+startPos;

    // do selection
    // Chrome / Firefox

    if(typeof(tarea.selectionStart) != "undefined") {
        tarea.focus();
        tarea.selectionStart = startPos;
        tarea.selectionEnd = endPos;
        return true;
    }

    // IE
     if (document.selection && document.selection.createRange) {
        tarea.focus();
        tarea.select();
        var range = document.selection.createRange();
        range.collapse(true);
        range.moveEnd("character", endPos);
        range.moveStart("character", startPos);
        range.select();
        return true;
    }

    return false;
}
