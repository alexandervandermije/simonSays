var simonSaysApp = angular.module('simonSaysApp', []);


simonSaysApp.controller('SimonSaysController', function SimonSaysController($scope) {
		if (!window.console) window.console = {};
			if (!window.console.log) window.console.log = function () { };


		var blueButton = $('#blueButton');
		var blueAudio = new Audio('sound/d.wav');
		var yellowButton = $('#yellowButton');
		var yellowAudio = new Audio('sound/c.wav');
		var greenButton = $('#greenButton');
		var greenAudio = new Audio('sound/b.wav');
		var redButton = $('#redButton');
		var redAudio = new Audio('sound/a.wav');


		var succesAudio = new Audio('sound/kidsCheering.mp3');
		var failAudio = new Audio('sound/kidsAww.mp3');

		var allButtonsNeeded = [];
		var buttonsNeededInRound = [];
		var buttonsChosenByPlayer = [];
		var possibleButtons = ['red', 'blue', 'green', 'yellow']
		
		var buttonsClicked = 0;
		$scope.round = 0;
		$scope.score = 0;
		var amountButtonsAtStart = 4;
		$scope.gameStarted = false;

		var timeBetweenButtonAnimation = 1200;

		var animateButton = function(button)// animates a specific button send by the animateButtons() function
		{
			if(button == 'red') // When button is selected
			{
				redAudio.play(); // play corresponding audio
				setTimeout(function()
				{
					redButton.addClass('activatedRed');// add corresponding Class after short amount of time

					setTimeout(function()// and remove it again after a second
					{
						redButton.removeClass('activatedRed');
					},1000);
				}, 250);
			}
			else if(button == 'blue')
			{
				setTimeout(function()
				{
					blueAudio.play();
					blueButton.addClass('activatedBlue');
					
					setTimeout(function()
					{
						blueButton.removeClass('activatedBlue');
					},1000);
				}, 250);
			}
			else if(button == 'green')
			{
				setTimeout(function()
				{
					greenAudio.play();
					greenButton.addClass('activatedGreen');
					
					setTimeout(function()
					{
						greenButton.removeClass('activatedGreen');
					},1000);
				}, 250);
			}
			else if(button == 'yellow')
			{
				setTimeout(function()
				{
					yellowAudio.play();
					yellowButton.addClass('activatedYellow');
					
					setTimeout(function()
					{
						yellowButton.removeClass('activatedYellow');
					},1000);
				}, 250);
			}
		} 
		
		animateButtons = function()
		{
			var i = 0;
			var animateButtonsInterval = setInterval(function()// set the continues interval between button animations
			{
				animateButton(allButtonsNeeded[i]);// animate button from allButtonsNeeded array corresponding with i
				i++;// increase i
				stopAnimating(i)// Check if i is larger than allButtonsNeeded.length
			},timeBetweenButtonAnimation);

			var stopAnimating = function(i)
			{
				if(i > allButtonsNeeded.length)// if i is longer then there are buttons
				{
					clearInterval(animateButtonsInterval); // stop the interval from repeating
				}
				else if ($scope.gameStarted == false) {// if the game is reset, cut off the animation
					clearInterval(animateButtonsInterval);
				}

			}
		}
		$scope.restartGame = function()
		{
			$scope.gameStarted = false;
		}
		$scope.startGame = function()// Setups & restarts the game 
		{
			console.log(redAudio.readyState);
			$scope.gameStarted = true;
			$scope.score = 0;
			buttonsClicked = 0; // set buttons clicked to zero
			buttonsChosenByPlayer = []; // empty arrays used to compare chosen buttons with needed buttons
			buttonsNeededInRound = [];
			allButtonsNeeded = [];// empty array with all buttons in case 
			$scope.round = 0;

			for(var i=0;i<amountButtonsAtStart;i++)
			{
				var randomButton = possibleButtons[Math.floor(Math.random()*possibleButtons.length)];// chose a random button
				allButtonsNeeded.push(randomButton);// add to array containing all buttons needed
			}
			animateButtons();
		}
		
		
		var newRound = function()
		{
			buttonsClicked = 0; // set buttons clicked to zero
			buttonsChosenByPlayer = []; // empty arrays used to compare chosen buttons with needed buttons
			buttonsNeededInRound = [];
			$scope.round++;// increment the round by 1

			var randomButton = possibleButtons[Math.floor(Math.random()*possibleButtons.length)]; // chose a random button to add 
			allButtonsNeeded.push(randomButton); // add this button to existing collection of buttons
			animateButtons();
		}

		$scope.clickedButton = function(color)
		{
			buttonsChosenByPlayer.push(color); // add the selected button to array of buttons player selected
			buttonsNeededInRound.push(allButtonsNeeded[buttonsClicked]); // add the corresponding button from allButtonsNeeded to a new array
			
			redAudio.pause();// stop and reset the audio of any button that was pressed before
			redAudio.currentTime = 0;
			greenAudio.pause();
			greenAudio.currentTime = 0;
			yellowAudio.pause();
			yellowAudio.currentTime = 0;
			blueAudio.pause();
			blueAudio.currentTime = 0;

			if(color == 'red')// and play the audio of the button pressed
			{
				redAudio.play();
			}
			else if(color == 'green')
			{
				greenAudio.play();
			}
			else if(color == 'yellow')
			{
				yellowAudio.play();
			}
			else if(color == 'blue')
			{
				blueAudio.play();
			}

			if(JSON.stringify(buttonsChosenByPlayer) === JSON.stringify(buttonsNeededInRound))// check if the arrays are the same
			{
				$scope.score++;
			}
			else
			{// player clicked on the wrong button
				$scope.score = 0;
				$scope.round = 0;
				failAudio.play();

				$scope.gameStarted = false;
				
				return;
			}

			buttonsClicked++;
			
			if(buttonsClicked === allButtonsNeeded.length) // check if the round is complete
			{
				$scope.round++;
				succesAudio.play();
				setTimeout(function()
				{
					newRound();
				},1000)

			}
		}

		
  });