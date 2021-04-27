console.log("SANITY CHECK", $);

//iife
(function () {
    var diags = [
        [3, 8, 13, 18],
        [4, 9, 14, 19, 24],
        [5, 10, 15, 20, 25, 30],
        [11, 16, 21, 26, 31, 36],
        [17, 22, 27, 32, 37],
        [23, 28, 33, 38],
        [2, 9, 16, 23],
        [1, 8, 15, 22, 29],
        [0, 7, 14, 21, 28, 35],
        [6, 13, 20, 27, 34, 41],
        [12, 19, 26, 33, 40],
        [18, 25, 32, 39],
    ];

    var currentPlayer = "player-1";
    var slots = $(".slot");
    var columns = $(".column");
    var winner = $(".winner");
    var tie = $(".tie");
    var buttonClose = $(".buttonClose");
    var buttonNewGame = $(".buttonNewGame");
    var coin = $("#coin");
    var scorePlayer1 = 0;
    var scorePlayer2 = 0;
    var scoreZebra = $("#scoreZebra"); //player 1
    var scoreLion = $("#scoreLion"); //player 2
    var buttonReset = $(".buttonReset");

    waitForEvent();

    function waitForEvent() {
        columns.on("click", function (e) {
            columns.off();
            var col = $(e.currentTarget);

            var slotsInCol = col.children();

            for (var i = slotsInCol.length - 1; i >= 0; i--) {
                var slot = slotsInCol.eq(i);

                // is that slot still free?
                if (!slot.hasClass("player-1") && !slot.hasClass("player-2")) {
                    //index of column an row col.index()
                    var left = 10 + (col.index() - 1) * 100;
                    console.log(left);

                    var top = 10 + i * 100;

                    coin.css({
                        left: left,
                        top: top,
                        visibility: "visible",
                        transition: "top 1s",
                    });

                    coin.one("transitionend", function () {
                        console.log(currentPlayer);
                        slot.addClass(currentPlayer);
                        coin.css({
                            top: 0,
                            visibility: "hidden",
                        });

                        console.log(".row" + i);
                        var slotsInRow = $(".row" + i);

                        //console.log(slotsInRow);

                        var victoryInCol = checkVictory(slotsInCol); // victory in column?
                        var victoryInRow = checkVictory(slotsInRow); // victory in row?
                        var victoryInDiag = checkDiagonalVictory();

                        // there is a victory for currentPlayer
                        if (victoryInCol || victoryInRow || victoryInDiag) {
                            // TODO: show actual winning message on screen
                            popUp();
                            buttonClose.on("click", function () {
                                winner.off();
                                winner.css({ display: "none" });
                                columns.off();
                            });
                            buttonNewGame.on("click", function () {
                                resetAll();
                                winner.off();
                                winner.css({ display: "none" });
                                waitForEvent();
                            });

                            console.log("victory", currentPlayer);

                            if (currentPlayer == "player-1") {
                                scorePlayer1++;
                                updateScore(scorePlayer1, scorePlayer2);
                                // scoreZebra.text("Player 1: " + scorePlayer1);
                            } else {
                                scorePlayer2++;
                                updateScore(scorePlayer1, scorePlayer2);
                                // scoreLion.text("Player 2: " + scorePlayer2);
                            }

                            // columns.off();
                        } else {
                            var count = 0;
                            for (var k = 0; k < slots.length; k++) {
                                if (
                                    slots.eq(k).hasClass("player-1") ||
                                    slots.eq(k).hasClass("player-2")
                                ) {
                                    count++;
                                    if (count == 42) {
                                        console.log("tie");
                                        // columns.off();
                                        tieMessage();
                                        buttonClose.on("click", function () {
                                            tie.css({ display: "none" });
                                            columns.off();
                                            resetAll();
                                        });
                                    }
                                }
                            }
                            switchPlayer();
                            setTimeout(waitForEvent, 200);
                        }
                    });

                    // coin.slideDown(function () {});

                    coin.removeClass("player-1 player-2");
                    coin.addClass(currentPlayer);
                    break; // this will stop the loop after the first free slot
                }
            }

            function resetAll() {
                for (var i = 0; i < slots.length; i++) {
                    if (slots.eq(i).hasClass("player-1")) {
                        slots.eq(i).removeClass("player-1");
                    } else if (slots.eq(i).hasClass("player-2")) {
                        slots.eq(i).removeClass("player-2");
                    }
                }
                console.log(slots);
            }

            function switchPlayer() {
                if (currentPlayer === "player-1") {
                    currentPlayer = "player-2";
                } else {
                    currentPlayer = "player-1";
                }
            }

            function checkDiagonalVictory() {
                var diag = diags;
                var slotsToCheck = [];

                for (var i = 0; i < diag.length; i++) {
                    for (var j = 0; j < diag[i].length; j++) {
                        slotsToCheck.push(slots.eq(diag[i][j]));
                    }
                }

                return checkVictory(slotsToCheck);
            }

            function checkVictory(slots) {
                var count = 0;

                for (var i = 0; i < slots.length; i++) {
                    var slot = $(slots[i]);

                    if (slot.hasClass(currentPlayer)) {
                        count++;
                        if (count === 4) {
                            return true;
                        }
                    } else {
                        count = 0;
                    }
                }

                return false;
            }

            function popUp() {
                winner.fadeIn(1000, function () {
                    $("#messageWinner").text(currentPlayer + " has won!");
                });
            }

            function tieMessage() {
                tie.fadeIn(1000, function () {
                    $("#messageTie").text("Oh no! Nobody won!");
                });
            }

            function resetScore() {
                scorePlayer1 = 0;
                scorePlayer2 = 0;
                updateScore(scorePlayer1, scorePlayer2);
            }

            buttonReset.on("click", function () {
                resetScore();
            });

            function updateScore(scorePlayer1, scorePlayer2) {
                scoreZebra.text("Player 1: " + scorePlayer1);
                scoreLion.text("Player 2: " + scorePlayer2);
            }
        });
    }
})();
