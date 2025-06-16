function clearTable() {
    document.getElementById("buttonPresses").getElementsByTagName("tbody")[0].innerHTML = "";
}

async function exportButtons() {
    const formattedButtonPresses = [];

    const tableEntries = document.getElementById("buttonPresses")
        .getElementsByTagName("tbody")[0]
        .getElementsByTagName("tr");

    for (let row of tableEntries) {
        const jsonObject = {};

        for (let cell of row.getElementsByTagName("td")) {
            const idSplit = cell.id.split("-");
            const key = idSplit[idSplit.length - 1]

            if (key === "buttons") {
                jsonObject[key] = []
                for (let img of cell.getElementsByTagName("img")) {
                    jsonObject[key].push(nameToIndexButtonMap[img.alt]);
                }

            } else {
                jsonObject[key] = cell.innerHTML;
            }
        }

        formattedButtonPresses.push(jsonObject);
    }

    const blob = new Blob(
        [JSON.stringify(formattedButtonPresses, null, 2)],
        { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "button-presses.mfn";
    a.click();

    URL.revokeObjectURL(url);
}
