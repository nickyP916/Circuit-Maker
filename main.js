const resistorCount = 5;

fetch("component images/resistor.svg")
    .then(response => response.text())
    .then(svg => {
        const gameArea = document.getElementById("gameArea");
        gameArea.innerHTML = "";
        
        for(let i = 0; i < resistorCount; i++){
            const wrapper = document.createElement("div");
            wrapper.innerHTML = svg;
            const svgElement = wrapper.firstElementChild;
            svgElement.setAttribute("data-index", i);
            gameArea.appendChild(svgElement);
            enableDragging(svgElement);
        }
        
    });

function enableDragging(component) {
    let isDragging = false, offsetX, offsetY;

    component.addEventListener("mousedown", (event) => {
        isDragging = true;
        let svg = component.closest("svg");
        let point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        let transformPoint = point.matrixTransform(svg.getScreenCTM().inverse());

        offsetX = transformPoint.x;
        offsetY = transformPoint.y;
    });
    
    document.addEventListener("mousemove", (event) => {
        if (!isDragging) return;

        let svg = component.closest("svg");
        let point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        let transformPoint = point.matrixTransform(svg.getScreenCTM().inverse());

        let x = transformPoint.x - offsetX;
        let y = transformPoint.y - offsetY;

        component.setAttribute("transform", `translate(${x},${y})`);
    });

    document.addEventListener("mouseup", () => isDragging = false);
}