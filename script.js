document.addEventListener("DOMContentLoaded", function() {
    const btn = document.getElementById("spin");
    const container = document.querySelector(".container");
    const attemptsDisplay = document.getElementById("attempt-count");
    const segments = ["50 CZK", "0 CZK", "100 CZK", "20 CZK", "30 CZK", "10 CZK", "1000 CZK"];
    const segmentAngle = 360 / segments.length;
    let rotation = 0;
    let attemptsLeft = 5;
    let isSpinning = false;

    const loseAudio = new Audio('audio/lose.mp3');
    const spinAudio = new Audio("audio/spin.mp3");
    const defaultAudio = new Audio("audio/default.mp3");
    const jackpotAudio = new Audio("audio/jackpot.mp3");

    btn.onclick = function () {
        if (!isSpinning && attemptsLeft > 0) {
            isSpinning = true;
            attemptsLeft--;
            attemptsDisplay.textContent = attemptsLeft;

            spinAudio.play();
            const number = Math.floor(Math.random() * 380) + 6620;
            rotation += number;
            container.style.transition = "transform 4s ease";
            container.style.transform = "rotate(" + rotation + "deg)";
            container.classList.add('blur-animation');

            setTimeout(function() {
                container.classList.remove('blur-animation');
            }, 3900);

            container.addEventListener("transitionend", function handleTransition() {
                container.removeEventListener("transitionend", handleTransition); // Удаляем обработчик после его выполнения
                const normalizedRotation = rotation % 360;
                const winningIndex = Math.floor((360 - normalizedRotation + (segmentAngle / 2)) % 360 / segmentAngle);
                const prize = segments[winningIndex];
                
                switch (prize) {
                    case "0 CZK":
                        loseAudio.play();
                        break;
                    case "1000 CZK":
                        jackpotAudio.play();
                        break;
                    default:
                        defaultAudio.play();
                }
                
                alert("You win: " + prize);
                isSpinning = false;

            }, {once: true});
        } else if (attemptsLeft <= 0) {
            alert("You have no more attempts left!");
        }
    };
});
