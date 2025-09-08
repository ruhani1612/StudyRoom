class PomodoroTimer {
    constructor() {
        this.defaultFocus = 25 * 60;
        this.defaultBreak = 5 * 60;
        this.timeLeft = this.defaultFocus;
        this.isRunning = false;
        this.interval = null;
        this.isBreak = false;

        this.timerDisplay = document.getElementById('timerDisplay');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');

        this.startBtn.addEventListener('click', () => this.toggleTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());

        this.updateDisplay();

        // ✅ Add custom timer controls
        this.addCustomTimerUI();
    }

    toggleTimer() {
        if (this.isRunning) this.pauseTimer();
        else this.startTimer();
    }

    startTimer() {
        this.isRunning = true;
        this.startBtn.textContent = '⏸ Pause';
        this.startBtn.classList.replace('btn-primary', 'btn-secondary');

        this.interval = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();

            if (this.timeLeft <= 0) this.timerComplete();
        }, 1000);
    }

    pauseTimer() {
        this.isRunning = false;
        this.startBtn.textContent = '▶ Start';
        this.startBtn.classList.replace('btn-secondary', 'btn-primary');
        clearInterval(this.interval);
    }

    resetTimer() {
        this.pauseTimer();
        this.timeLeft = this.isBreak ? this.defaultBreak : this.defaultFocus;
        this.updateDisplay();
    }

    timerComplete() {
        this.pauseTimer();

        if (this.isBreak) {
            this.isBreak = false;
            this.timeLeft = this.defaultFocus;
            alert('Break is over! Time to focus again.');
        } else {
            this.isBreak = true;
            this.timeLeft = this.defaultBreak;
            this.updateCycleCount();
            alert('Focus session complete! Time for a break.');
        }

        this.updateDisplay();
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        const label = document.querySelector('.timer-label');
        label.textContent = this.isBreak ? 'Break Time' : 'Focus Time';

        const circle = document.querySelector('.timer-circle');
        circle.style.background = this.isBreak
            ? 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)'
            : 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)';
    }

    updateCycleCount() {
        const cyclesElement = document.getElementById('cyclesCount');
        let currentCycles = parseInt(cyclesElement.textContent);
        cyclesElement.textContent = currentCycles + 1;

        const focusTimeElement = document.getElementById('focusTime');
        let currentTime = parseInt(focusTimeElement.textContent.replace('m', ''));
        focusTimeElement.textContent = `${currentTime + (this.defaultFocus / 60)}m`;
    }

    addCustomTimerUI() {
        const timerControls = document.querySelector('.timer-controls');
        const customContainer = document.createElement('div');
        customContainer.style.textAlign = "center";
        customContainer.style.marginTop = "10px";
        customContainer.innerHTML = `
            <label style="font-size:12px;color:#475569;">Focus (min): 
                <input type="number" id="focusInput" value="${this.defaultFocus / 60}" min="1" style="width:50px;">
            </label>
            <label style="font-size:12px;color:#475569;margin-left:8px;">Break (min): 
                <input type="number" id="breakInput" value="${this.defaultBreak / 60}" min="1" style="width:50px;">
            </label>
            <button id="setCustomBtn" class="btn btn-secondary" style="margin-left:8px;">✔ Set</button>
        `;
        timerControls.insertAdjacentElement('afterend', customContainer);

        document.getElementById('setCustomBtn').addEventListener('click', () => {
            const focusValue = parseInt(document.getElementById('focusInput').value);
            const breakValue = parseInt(document.getElementById('breakInput').value);

            if (focusValue > 0 && breakValue > 0) {
                this.defaultFocus = focusValue * 60;
                this.defaultBreak = breakValue * 60;
                this.resetTimer();
                alert(`✅ Timer updated: Focus ${focusValue} min | Break ${breakValue} min`);
            }
        });
    }
}

// Initialize Timer
const timer = new PomodoroTimer();

// ✅ Toggle Done/Undone in schedule
document.querySelectorAll('.schedule-item').forEach(item => {
    item.addEventListener('click', () => {
        if (item.classList.contains('done')) {
            item.classList.remove('done');
            item.style.opacity = "1";
            item.style.textDecoration = "none";
            alert(`Marked "${item.querySelector('.schedule-title').textContent}" as ❌ undone`);
        } else {
            item.classList.add('done');
            item.style.opacity = "0.5";
            item.style.textDecoration = "line-through";
            alert(`Marked "${item.querySelector('.schedule-title').textContent}" as ✅ done`);
        }
    });
});
