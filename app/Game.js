class Game {


    constructor({
        buttonStart,
        buttonReset,
        buttonPlayAgain,
        boxPatternField,
        selectSteps,
        boxPlayerField,
        popup
    }) {
        this.buttonStart = buttonStart;
        this.buttonReset = buttonReset;
        this.buttonPlayAgain = buttonPlayAgain;
        this.boxPatternField = boxPatternField;
        this.selectSteps = selectSteps;
        this.boxPlayerField = boxPlayerField;
        this.popup = popup;
    }
    
    patternSteps = [];
    playerSteps = [];
    clicks = 0;
    highlighting = false;

    randomNumbers = () => {
        
      return Math.floor(Math.random() * 15) + 1;
    }

    highlight = () => {
        let i = 0;
        let index = 0;
    
        const dim = () => { 
            this.boxPatternField[this.patternSteps[index]-1].classList.remove("highlighted");
            i++;
            index++; 
        }

            const time = setInterval(() => {
                this.highlighting = true;
                if (this.highlighting === true) {
                    this.boxPlayerField.forEach(e=>{
                        e.style.opacity = '.4';
                        e.style.pointerEvents = 'none';
                    });
                } 
                this.boxPatternField[this.patternSteps[index]-1].classList.add("highlighted");
                setTimeout(dim, 500);
                console.log("PatternSteps element: " + i);
                    
                if (i == this.patternSteps.length - 1) {
                    this.highlighting = false;
                    clearInterval(time);
                    
                    console.log('Pattern Steps: ' + this.patternSteps);
                    if (this.highlighting === false){
                        this.boxPlayerField.forEach(e=>{
                            e.style.opacity = '1';
                            e.style.pointerEvents = 'all';
                        });
                    }
                } 

            }, 600);
    
      }


    start = () => {

        this.buttonStart.addEventListener('click', ()=>{
            for(let i = 0; i < (this.selectSteps.selectedIndex + 1) ; i++) {
                this.patternSteps.push(this.boxPatternField[this.randomNumbers()].textContent);
            }
            console.log('Pattern steps: ' + this.patternSteps);
            console.log("Selected index: " + (this.selectSteps.selectedIndex + 1));
            this.highlight();
            this.chooseField();
            this.buttonStart.setAttribute('disabled', '');
        });

        this.reset();
            
    }

    chooseField = () => {
        this.boxPlayerField.forEach(e=>{

            e.addEventListener('click', () => {
                this.playerSteps.push(e.textContent);
                this.clicks++;
                console.log(this.patternSteps);
                console.log(this.playerSteps);
                console.log(`Select steps: ${this.selectSteps}`);
                console.log("Clicks: " + this.clicks);
                console.log("Selected index:" + (this.selectSteps.selectedIndex + 1))
                if(this.clicks === (this.selectSteps.selectedIndex + 1)) {
                    this.highlighting = true;
                    if (this.highlighting === true) {
                        this.boxPlayerField.forEach(e=>{
                            e.style.opacity = '.4';
                            e.style.pointerEvents = 'none';
                        });
                    } 
                    this.clicks = 0;
                    this.checkScore();
                }
                
              
            })
        })
    }

    checkScore = () => {
        if (JSON.stringify(this.patternSteps) === JSON.stringify(this.playerSteps)) {
            console.log(JSON.stringify(this.patternSteps));
            this.popup.classList.add('visible');
        } else {
            this.playerSteps = [];
            this.highlight();
        }
    }

    reset = () =>{
        this.buttonReset.addEventListener('click', ()=>{
            this.buttonStart.removeAttribute('disabled');
            this.clicks = 0;
            this.patternSteps = [];
            this.playerSteps = [];
            console.log("Clicks: " + this.clicks);
        });
        this.buttonPlayAgain.addEventListener('click', ()=>{
            // this.buttonStart.removeAttribute('disabled');
            // this.patternSteps = [];
            // this.playerSteps = [];
            this.popup.classList.remove('visible');
        })

    }
    

}


const game = new Game({
    buttonStart : document.querySelector('.button--start'),
    buttonReset : document.querySelector('.button--reset'),
    buttonPlayAgain : document.querySelector('.button--play-again'),
    boxPatternField : document.querySelectorAll('.box--pattern .box__field'),
    selectSteps : document.querySelector('#stepsNumber'),
    boxPlayerField : document.querySelectorAll('.box--player .box__field'),
    popup : document.querySelector('.popup')
});

game.start();



