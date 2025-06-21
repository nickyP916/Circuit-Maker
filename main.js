const resistorCount = 5;

fetch("component images/resistor.svg")
    .then(response => response.text())
    .then(svgText => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, "image/svg+xml");
        const gElement = doc.querySelector("g");

        const gameArea = document.getElementById("gameArea");
        gameArea.innerHTML = "";
        
        for(let i = 0; i < resistorCount; i++){
            const clone = gElement.cloneNode(true);
            clone.setAttribute("data-index", i);
            gameArea.appendChild(clone);
            enableDragging(clone);
        }
    });

function enableDragging(component) {
    let isDragging = false, offsetX, offsetY;

    let offset = { x: 0, y: 0 };
    let currentTransform = { x: 0, y: 0 };

    const svg = component.ownerSVGElement;

    component.addEventListener("pointerdown", (event) => {
        isDragging = true;

        const point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        const cursor = point.matrixTransform(svg.getScreenCTM().inverse());

        // Read the current transform if one exists
        const transform = component.getAttribute("transform");
        if (transform) {
            const match = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
            if (match) {
                currentTransform.x = parseFloat(match[1]);
                currentTransform.y = parseFloat(match[2]);
            }}
       
        offset.x = cursor.x - currentTransform.x;
        offset.y = cursor.y - currentTransform.y;

        component.setPointerCapture(event.pointerId);
        event.preventDefault();

    });
    
    document.addEventListener("pointermove", (event) => {
        if (!isDragging) return;

        const svg = component.ownerSVGElement;

        const point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        const cursor = point.matrixTransform(svg.getScreenCTM().inverse());

        const x = cursor.x - offset.x;
        const y = cursor.y - offset.y;

        component.setAttribute("transform", `translate(${x},${y})`);
    });

    document.addEventListener("pointerup", () => isDragging = false);
}