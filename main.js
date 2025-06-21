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

function enableDragging(svg) {
    let isDragging = false, offsetX, offsetY;

    let offset = { x: 0, y: 0 };
    let currentTransform = { x: 0, y: 0 };

    svg.addEventListener("pointerdown", (event) => {
        isDragging = true;

        const point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        const cursor = point.matrixTransform(svg.getScreenCTM().inverse());

        // Read the current transform if one exists
        const transform = svg.getAttribute("transform");
        if (transform) {
            const match = transform.match(/translate\(([^,]+),([^)]+)\)/);
            if (match) {
                currentTransform.x = parseFloat(match[1]);
                currentTransform.y = parseFloat(match[2]);
            }}
       
        offset.x = cursor.x - currentTransform.x;
        offset.y = cursor.y - currentTransform.y;
    });
    
    document.addEventListener("pointermove", (event) => {
        if (!isDragging) return;

        const point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        const cursor = point.matrixTransform(svg.getScreenCTM().inverse());

        const x = cursor.x - offset.x;
        const y = cursor.y - offset.y;

        svg.setAttribute("transform", `translate(${x},${y})`);
    });

    document.addEventListener("pointerup", () => isDragging = false);
}