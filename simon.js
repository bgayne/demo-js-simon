var inputMode = false;
var strictFlag = false;
var playerTurn = false;
var turns = 0;
var moveStack = [];
var playerStack = [];


//Sounds
var sounds = [
  new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
  new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
  new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
  new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')]

function newMove() { return Math.floor(Math.random() * 4); }

function clearPlayerStack() { playerStack = []; }

function resetGame() {
  moveStack = [];
  playerStack = [];
  updateCounter("reset");
}

function checkInput(val) {
  if(moveStack[playerStack.length - 1] === val) {
    $("#"+val).addClass("button-"+val+"-active");
    setTimeout(function() {
      $("#"+val).removeClass("button-"+val+"-active");
      if(playerStack.length === moveStack.length) setTimeout(nextTurn(), 200);
    }, 150);
  }
  else {
    setTimeout(function() {
      $("#"+val).removeClass("button-"+val+"-active");
      setTimeout(handleError(), 200);
    }, 150);
  }
}

function updateCounter(action) {
  if(action === "reset") {
    turns = 0;
    $(".steps").text(""+turns);
    return null;
  }
  turns++;
  $(".steps").text(""+turns);
  if(turns === 20) victory();
}


function handleError() {
  if(!strictFlag) {
    playerStack.pop();
    playerTurn = false;
    lockButtons(true);
    errorAnimation();
    setTimeout(animateStack(moveStack.length), 2000);
    lockButtons(false);
    playerTurn = true;
  }
  else {
    errorAnimation();
    setTimeout(resetGame(), 900);
  }
}

function lockButtons(action) {
  if(action){
     $(".simon-button").addClass("noclick");
     $(".button").addClass("noclick");
  }
  else {
    $(".simon-button").removeClass("noclick");
    $(".button").removeClass("noclick");
  }
}


function errorAnimation() {
  setTimeout(() => {
    for(var i = 0; i < 4; i++) {
      $("#"+i).addClass("button-"+i+"-active");
    }
  },200)
  setTimeout(() => {
    for(var i = 0; i < 4; i++) {
      $("#"+i).removeClass("button-"+i+"-active");
    }
  },400)
  setTimeout(() => {
    for(var i = 0; i < 4; i++) {
      $("#"+i).addClass("button-"+i+"-active");
    }
  },600)
  setTimeout(() => {
    for(var i = 0; i < 4; i++) {
      $("#"+i).removeClass("button-"+i+"-active");
    }
  },800)
}

function animateStack(count) {
  if(count <= 0) return -1
  var i = moveStack.length - count;
  setTimeout(() => $("#"+moveStack[i]).removeClass("button-"+moveStack[i]+"-active"), 600);
  setTimeout(() => {
    $("#"+moveStack[i]).addClass("button-"+moveStack[i]+"-active");
    sounds[moveStack[i]].play()
  }, 600);
  setTimeout(() => {
    $("#"+moveStack[i]).removeClass("button-"+moveStack[i]+"-active")
    animateStack(count-1)
  }, 800);


}

function nextTurn() {
  playerTurn = false;
  updateCounter();
  moveStack.push(newMove());
  playerStack = [];
  lockButtons(true);
  animateStack(moveStack.length);
  lockButtons(false);
  playerTurn = true;
}

function startGame() {
  resetGame();
  moveStack.push(newMove())
  lockButtons(true);
  animateStack(moveStack.length);
  lockButtons(false)
  playerTurn = true;
}

$(function(){

  $(".button-start").on("click", function() {
    startGame();
  });

  $(".button-reset").on("click", function() {
    resetGame();
  });

  $(".button-strict").on("click", function() {
    $(this).toggleClass("strict-active");
    strictFlag = strictFlag === true ? false : true;
  });

  $(".simon-button").on("click", function() {
    if(playerTurn) {
      playerStack.push(+$(this).attr('id'));
      checkInput(playerStack[playerStack.length-1]);
    }
  })


})
