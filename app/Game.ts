import { patternFields } from "./components/Fields.js";

class Game {
	private buttonStart: HTMLButtonElement;
	private buttonReset: HTMLButtonElement;
	private buttonPlayAgain: HTMLButtonElement;
	private boxPatternFields: NodeListOf<HTMLDivElement>;
	private selectSteps: HTMLSelectElement;
	private boxPlayerFields: NodeListOf<HTMLDivElement>;
	private popup: HTMLDivElement;

	constructor(
		buttonStart: HTMLButtonElement,
		buttonReset: HTMLButtonElement,
		buttonPlayAgain: HTMLButtonElement,
		boxPatternFields: any,
		selectSteps: HTMLSelectElement,
		boxPlayerFields: NodeListOf<HTMLDivElement>,
		popup: HTMLDivElement
	) {
		this.buttonStart = buttonStart;
		this.buttonReset = buttonReset;
		this.buttonPlayAgain = buttonPlayAgain;
		this.boxPatternFields = boxPatternFields;
		this.selectSteps = selectSteps;
		this.boxPlayerFields = boxPlayerFields;
		this.popup = popup;
	}

	public patternSteps: number[] = [];
	public playerSteps: number[] = [];
	public clicks = 0;
	public highlighting = false;
	public currentStep = 1;
	public currentPattern: number[] = [];

	public randomNumbers() {
		return Math.floor(Math.random() * 15) + 1;
	}

	public deactivateFields(field: any) {
		field.forEach((e: any) => {
			e.style.opacity = ".4";
			e.style.pointerEvents = "none";
		});
	}

	public activateFields(field: any) {
		field.forEach((e: any) => {
			e.style.opacity = "1";
			e.style.pointerEvents = "all";
		});
	}

	public highlightFields() {
		let index = 0;

		const turnOfHighlight = () => {
			this.boxPatternFields[this.patternSteps[index] - 1].classList.remove(
				"highlighted"
			);
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

			this.boxPatternFields[this.patternSteps[index] - 1].classList.add(
				"highlighted"
			);

			setTimeout(turnOfHighlight, 500);
		}, 600);
	}

	public start() {
		this.deactivateFields(this.boxPlayerFields);
		this.deactivateFields(this.boxPatternFields);

		let choosedSteps = this.selectSteps.selectedIndex + 1;
		let randomField = this.boxPatternFields[this.randomNumbers()];
		let index = 1;

		this.selectSteps.addEventListener("change", (e: any) => {
			console.log(e.target.value);
			choosedSteps = e.target.value;
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
		});

		this.reset();
	}

	public chooseField() {
		this.boxPlayerFields.forEach((e: any) => {
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

	public checkScore() {
		if (
			JSON.stringify(this.currentPattern) === JSON.stringify(this.playerSteps)
		) {
			this.currentStep++;
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
			this.clicks = 0;
		}
		if (
			JSON.stringify(this.patternSteps) === JSON.stringify(this.playerSteps)
		) {
			console.log(JSON.stringify(this.patternSteps));
			this.popup.classList.add("visible");
		} else {
			this.playerSteps = [];
			this.highlightFields();
		}
	}

	public reset() {
		this.buttonReset.addEventListener("click", () => {
			this.buttonStart.removeAttribute("disabled");
			this.selectSteps.removeAttribute("disabled");
			this.clicks = 0;
			this.patternSteps = [];
			this.playerSteps = [];
			this.currentStep = 1;
			this.currentPattern = [];
		});
		this.buttonPlayAgain.addEventListener("click", () => {
			this.popup.classList.remove("visible");
		});
	}
}

const game: Game = new Game(
	document.querySelector(".button--start"),
	document.querySelector(".button--reset"),
	document.querySelector(".button--play-again"),
	patternFields,
	document.querySelector("#stepsNumber"),
	document.querySelectorAll(".box--player .box__field"),
	document.querySelector(".popup")
);

game.start();
