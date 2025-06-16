let previousButtonIndices = [];
let previousTimestamp = -1;

window.addEventListener("gamepadconnected", (e) => {
    let numOfGamepadsConnected = document.getElementById("numOfGamepadsConnected");
    numOfGamepadsConnected.innerHTML = Number(numOfGamepadsConnected.innerHTML) + 1;

    let labelCell = document.getElementById(`gamepads-${e.gamepad.index}-label`);
    labelCell.innerHTML = e.gamepad.id;

    globalTimestamp[e.gamepad.index] = new Date().getTime();
});

window.addEventListener("gamepaddisconnected", (e) => {
    let numOfGamepadsConnected = document.getElementById("numOfGamepadsConnected");
    numOfGamepadsConnected.innerHTML = Number(numOfGamepadsConnected.innerHTML) - 1;
    document.getElementById(`gamepads-${e.gamepad.index}-label`).innerHTML = "";
});

setInterval(() => {
    // TODO: Multi-controller support
    const gamepad = navigator.getGamepads()[0];
    if (gamepad === null) {
        previousButtonIndices = [];
        return
    }
    
    const timestamp = new Date().getTime() - globalTimestamp[gamepad.index];
    const pressedButtons = gamepad.buttons.map((button, index) => { if (button.pressed == true) return index }).filter(index => index != null)
    if (pressedButtons.length === 0) {
        previousButtonIndices = [];
        return
    }

    // Since there can be no duplicate indices and the arrays are always sorted, this is okay
    if (previousButtonIndices.toString() == pressedButtons.toString()) {
        document.getElementById(`buttons-${gamepad.index}-${previousTimestamp}-elapsed`)
            .innerHTML = timestamp - previousTimestamp;

    } else {
        const tableBody = document.getElementById("buttonPresses").getElementsByTagName("tbody")[0];
        let tableRow = document.createElement("tr");
        tableRow.id = `buttons-${gamepad.index}-${timestamp}`;
    
        let indexCell = document.createElement("td");
        indexCell.id = `buttons-${gamepad.index}-${timestamp}-index`;
        indexCell.innerHTML = gamepad.index
        tableRow.appendChild(indexCell);
    
        let timestampCell = document.createElement("td");
        timestampCell.id = `buttons-${gamepad.index}-${timestamp}-timestamp`;
        timestampCell.innerHTML = timestamp;
        tableRow.appendChild(timestampCell);
    
        let buttonsCell = document.createElement("td");
        buttonsCell.id = `buttons-${gamepad.index}-${timestamp}-buttons`;
        pressedButtons.map((buttonIndex) => {
            const image = document.createElement("img");
            image.src = indexToSymbolButtonMap[buttonIndex]["src"];
            image.alt = indexToSymbolButtonMap[buttonIndex]["alt"];
            buttonsCell.appendChild(image);
        })
        tableRow.appendChild(buttonsCell);

        let elapsedTimeCell = document.createElement("td");
        elapsedTimeCell.id = `buttons-${gamepad.index}-${timestamp}-elapsed`;
        elapsedTimeCell.innerHTML = 0;
        tableRow.appendChild(elapsedTimeCell);
    
        tableBody.appendChild(tableRow);
        previousTimestamp = timestamp;
    }

    previousButtonIndices = pressedButtons.slice(0, pressedButtons.length);
}, 100);