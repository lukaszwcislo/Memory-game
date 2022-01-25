"use strict";
class Game {
    constructor(buttonStart, buttonReset, buttonPlayAgain, boxPatternFields, selectSteps, boxPlayerFields, popup) {
        this.patternSteps = [];
        this.playerSteps = [];
        this.clicks = 0;
        this.highlighting = false;
        this.currentStep = 1;
        this.currentPattern = [];
        this.buttonStart = buttonStart;
        this.buttonReset = buttonReset;
        this.buttonPlayAgain = buttonPlayAgain;
        this.boxPatternFields = boxPatternFields;
        this.selectSteps = selectSteps;
        this.boxPlayerFields = boxPlayerFields;
        this.popup = popup;
    }
    randomNumbers() {
        return Math.floor(Math.random() * 15) + 1;
    }
    deactivateFields(field) {
        field.forEach((e) => {
            e.style.opacity = ".4";
            e.style.pointerEvents = "none";
        });
    }
    activateFields(field) {
        field.forEach((e) => {
            e.style.opacity = "1";
            e.style.pointerEvents = "all";
        });
    }
    highlightFields() {
        let index = 0;
        const turnOfHighlight = () => {
            this.boxPatternFields[this.patternSteps[index] - 1].classList.remove("highlighted");
            index++;
            if (index === this.currentStep) {
                this.highlighting = false;
            }
            if (this.highlighting === false) {
                this.activateFields(this.boxPlayerFields);
                this.deactivateFields(this.boxPatternFields);
                clearInterval(highlight);
            }
            console.log(this);
        };
        const highlight = setInterval(() => {
            this.highlighting = true;
            if (this.highlighting === true) {
                this.deactivateFields(this.boxPlayerFields);
                this.activateFields(this.boxPatternFields);
            }
            this.boxPatternFields[this.patternSteps[index] - 1].classList.add("highlighted");
            setTimeout(turnOfHighlight, 500);
        }, 600);
    }
    start() {
        this.deactivateFields(this.boxPlayerFields);
        this.deactivateFields(this.boxPatternFields);
        let choosedSteps = this.selectSteps.selectedIndex + 1;
        let randomField = this.boxPatternFields[this.randomNumbers()];
        let index = 1;
        const inputSelectHeader = document.querySelector(".select__header");
        this.selectSteps.addEventListener("change", (e) => {
            choosedSteps = e.target.value;
            inputSelectHeader.textContent = choosedSteps;
        });
        window.addEventListener("DOMContentLoaded", () => {
            inputSelectHeader.textContent = choosedSteps;
        });
        this.buttonStart.addEventListener("click", () => {
            for (let i = 0; i < choosedSteps; i++) {
                this.patternSteps.push(parseInt(randomField.textContent));
                randomField = this.boxPatternFields[this.randomNumbers()];
            }
            console.log("Cała kombinacja", this.patternSteps);
            console.log("Wybrana liczba kroków: ", choosedSteps);
            for (let step of this.patternSteps) {
                this.currentPattern.push(step);
                if (this.currentStep === index) {
                    break;
                }
            }
            console.log("Aktualny wzór", this.currentPattern);
            this.highlightFields();
            this.chooseField();
            this.buttonStart.setAttribute("disabled", "");
            this.selectSteps.setAttribute("disabled", "");
            this.selectSteps.parentNode.setAttribute("disabled", "");
        });
        this.reset();
    }
    chooseField() {
        this.boxPlayerFields.forEach((e) => {
            e.addEventListener("click", () => {
                this.playerSteps.push(parseInt(e.textContent));
                this.clicks++;
                console.clear();
                console.log("Cały wzór", this.patternSteps);
                console.log("Aktualny wzór", this.currentPattern);
                console.log("Wybory uzytkownika", this.playerSteps);
                console.log("Clicks: " + this.clicks);
                console.log("Poziom trudności:", this.selectSteps.selectedIndex + 1);
                if (this.clicks === this.currentStep) {
                    this.highlighting = true;
                    if (this.highlighting === true) {
                        this.deactivateFields(this.boxPlayerFields);
                        this.activateFields(this.boxPatternFields);
                    }
                    this.clicks = 0;
                    this.checkScore();
                }
            });
        });
    }
    checkScore() {
        if (JSON.stringify(this.currentPattern) === JSON.stringify(this.playerSteps)) {
            this.currentStep++;
            if (this.currentStep <= this.patternSteps.length) {
                this.highlightFields();
                const createCurrentPattern = () => {
                    this.currentPattern = [];
                    let index = 0;
                    for (let step of this.patternSteps) {
                        this.currentPattern.push(step);
                        index++;
                        if (this.currentStep === index) {
                            break;
                        }
                    }
                };
                createCurrentPattern();
            }
            this.clicks = 0;
        }
        if (JSON.stringify(this.patternSteps) === JSON.stringify(this.playerSteps)) {
            this.popup.classList.add("visible");
        }
        else {
            this.playerSteps = [];
            this.highlightFields();
        }
    }
    reset() {
        this.buttonReset.addEventListener("click", () => {
            this.buttonStart.removeAttribute("disabled");
            this.selectSteps.removeAttribute("disabled");
            this.selectSteps.parentNode.removeAttribute("disabled", "");
            this.clicks = 0;
            this.patternSteps = [];
            this.playerSteps = [];
            this.currentStep = 1;
            this.currentPattern = [];
            this.highlighting = false;
            console.log(this);
        });
        this.buttonPlayAgain.addEventListener("click", () => {
            this.popup.classList.remove("visible");
        });
    }
}
const game = new Game(document.querySelector(".button--start"), document.querySelector(".button--reset"), document.querySelector(".button--play-again"), document.querySelectorAll(".box--pattern .box__field"), document.querySelector("#stepsNumber"), document.querySelectorAll(".box--player .box__field"), document.querySelector(".popup"));
game.start();
