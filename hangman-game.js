//Main game object
var gallowsGame = {
    //Sample word lists - easy, medium and hard - followed by empty arrays for letters.  Could also be loaded into an external file to keep the code trim.
    wordListEasy: ["agent", "clean", "bones", "risen", "stern", "loyal", "choir "],
    wordListMedium: ["artificial", "mechanical", "adroitness", "mandibles", "incredible", "severity", "glimpse"],
    wordListHard: ["chronological", "serendipitous", "singlemindedness", "interspersed", "duodecahedron", "unquestionable", "impugnable"],
    targetWord: [],
    targetWordRevealed: [],
    userGuesses: [],
    //event.key manipulation strings
    userKey: "",
    userKeyCode: "",
    //HTML DOM references
    htmlTargetStatus: document.getElementById("targetStatus"),
    htmlLettersGuessed: document.getElementById("lettersGuessed"),
    htmlBarFuel: document.getElementById("barFuel"),
    htmlCurrentCredits: document.getElementById("currentCredits"),
    htmlCurrentFame: document.getElementById("currentFame"),
    //Crunchy game stats and other goodness.  Just like trail mix!
    targetLettersCorrect: 0,
    userCredits: 0,
    userFame:0,
    userFuel: 10,
    burnFuel: true,





    /*Loads a new targetWord from a word list (array of strings) passed as an argument*/
    getTargetWord: function(list) {
        /*Randomize an index number from 0 to the end of the list*/
        var randomNum = Math.floor(Math.random() * (list.length - 1));
        /*Assign string in randomized index number of list to randomWord for clarity*/
        var randomWord = list[randomNum];
        /*Loads each letter of the word into the targetWord array*/
        for (i = 0; i < randomWord.length; i++) {
            this.targetWord.push(randomWord[i]);
        }
    },
    //Resets the entire puzzle and all the appropriate variables
    resetPuzzle: function() {
        this.targetWord = [];
        this.targetWordRevealed = [];
        this.userGuesses = [];
        this.userFuel = 10;
        this.burnFuel = true;
        this.targetLettersCorrect = 0;
        this.getTargetWord(this.wordListMedium);
        for (i = 0; i < this.targetWord.length; i++) {
            this.targetWordRevealed.push("_");
        }
        //Reset the HTML element display
        this.htmlTargetStatus.innerHTML = this.targetWordRevealed.join(" ");
        this.htmlLettersGuessed.innerHTML = "";
        this.htmlBarFuel.innerHTML = "OOOOOOOOOO";
    },
    /*Checks to see if the user's key matches each letter in the targetWord.  If so, increments targetLettersCorrect, adds the letter(s) to targetWordRevealed at [index] and updates the html element that displays the puzzle in progress.*/

    checkLetter: function(letter, index) {
        debugger;
        if (this.userKey == letter) {
            this.targetLettersCorrect++;
            this.targetWordRevealed[index] = letter;
            this.htmlTargetStatus.innerHTML = this.targetWordRevealed.join(" ");
            this.burnFuel = false;
        }
    },
    //Placed this in a function just in case I decided to modify it later.  Checks the # of correct letters to the targetWord array's length.  If they match, all letters have been guessed.
    checkTargetWord: function() {
        if (this.targetLettersCorrect === this.targetWord.length) {
            this.userCredits += (Math.floor(Math.random() * 250)) + 250;
            this.userFame++;
            this.htmlCurrentCredits.innerHTML = this.userCredits;
            this.htmlCurrentFame.innerHTML = this.userFame;
            
            if (confirm("The last word was: " + this.targetWordRevealed.join("") + ". You have acquired some credits as pay for your efforts.  Keep on earning, hacker! Loading next word.")) {
                this.resetPuzzle();
            } else {
                document.write("Yeeargh!  Destroy the page! (placeholder!)");
            }
        }
    },

    checkHazard: function(hazardToggle, hazardBar) {
        if (hazardToggle === true) {
            this.userFuel--;

            //This part non-functional at the moment.  May be fixed in a future version.
            if (this.userFuel < 7) {
                hazardBar.backgroundColor = "yellow";
            } else if (this.userFuel < 4) {
                hazardBar.backgroundColor = "red";
            }

            var temp = hazardBar.innerHTML;
            hazardBar.innerHTML = temp.substring(0, temp.length - 1);
            if (this.userFuel == 0) {
                if (confirm("The target computer system has traced your connection back to its source: your brain.  Disconnect now!  NOW! ...   Play again?")) {
                    this.resetPuzzle();
                } else {
                    document.write("Yeeargh!  Destroy the page!");
                }
            }

        } else {
            hazardToggle = true;
        }
        return hazardToggle;
    },

    runGame: function(userKeyCode, userKey) {
        this.userKeyCode = userKeyCode;
        this.userKey = userKey;
        /*This is the function that draws all the rest of the code together. If the key pressed is a letter (ascii code between 65 and 90 inclusive), continue, otherwise skip the rest*/
        if (this.userKeyCode >= 65 && this.userKeyCode <= 90) {
            /*indexOf() is used to check the player's guess against all previous guesses, stored in an array. If the player guesses a letter not previously guessed, check it for a match, otherwise don't. */
            if (this.userGuesses.indexOf(this.userKey) == -1) {
                this.userGuesses.push(this.userKey);
                this.htmlLettersGuessed.innerHTML = this.userGuesses.join(", ");
                //Run checkletter () for each index of targetWord to see if one or more letters match.  First time using .bind() to get around scope issues.  I'm going to have to study this in detail
                this.targetWord.forEach(this.checkLetter.bind(this));
                //Check to see if the revealed word and target word match.  If they do, you win!
                this.checkTargetWord();
                /*Bookkeeping phase. Check to see whether or not a hazard is affecting the player and apply the hazard accordingly.  In this case, running out of fuel is the hazard in question but others may apply in future versions*/
                this.burnFuel = this.checkHazard(this.burnFuel, this.htmlBarFuel);
            }
        }
    }

};

//////Main Program//////
////////////////////////

//Set the mood with spy music
gallowsGame.resetPuzzle();
var bgMusic = document.getElementById("bgMusic");
bgMusic.play();

// Checks for a keypress in order to advance the game
document.onkeyup = function(event) {

    gallowsGame.runGame(event.keyCode, event.key.toLowerCase());
};
