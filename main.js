
fetch("component images/resistor.svg")
    .then(response => response.text())
    .then(svg => {
        document.getElementById("gameArea").innerHTML = svg;
        enableDragging();
    });

function enableDragging() {
    const resistor = document.getElementById("resistor");
    let isDragging = false, offsetX, offsetY;

    resistor.addEventListener("mousedown", (event) => {
    isDragging = true;

    let svg = resistor.closest("svg");
    let point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    let transformPoint = point.matrixTransform(svg.getScreenCTM().inverse());

    offsetX = transformPoint.x;
    offsetY = transformPoint.y;

});

document.addEventListener("mousemove", (event) => {
    if (!isDragging) return;

    let svg = resistor.closest("svg");
    let point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    let transformPoint = point.matrixTransform(svg.getScreenCTM().inverse());

    let x = transformPoint.x - offsetX;
    let y = transformPoint.y - offsetY;

    resistor.setAttribute("transform", `translate(${x},${y})`);

});

document.addEventListener("mouseup", () => isDragging = false);

}