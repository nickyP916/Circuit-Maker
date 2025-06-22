const resistorCount = 5;
var selectedComponent = null;

// fetch("component images/resistor.svg")
//     .then(response => response.text())
//     .then(svgText => {
//         const parser = new DOMParser();
//         const doc = parser.parseFromString(svgText, "image/svg+xml");
//         const gElement = doc.querySelector("g");

//         const gameArea = document.getElementById("gameArea");
//         gameArea.innerHTML = "";
        
//         for(let i = 0; i < resistorCount; i++){
//             const clone = gElement.cloneNode(true);
//             clone.setAttribute("data-index", i);
//             gameArea.appendChild(clone);
//             enableDragging(clone); //TODO: enable dragging for the original (non-clone as well!)
//             //enableFlip(clone);
//         }
//     });

fetch("component images/rotationTest.svg")
    .then(response => response.text())
    .then(svgText => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, "image/svg+xml");
        const gElement = doc.querySelector("g");
        gElement.setAttribute("data-lastFlipped-x", null);
        gElement.setAttribute("data-lastFlipped-y", null);
        const gameArea = document.getElementById("gameArea");
        gameArea.appendChild(gElement);

        enableFlip(gElement);
    });

function flipHorizontally(component){
    const bbox = component.getBBox();

    const tx = bbox.x + bbox.width / 2;
    const ty = bbox.y + bbox.height / 2;

    let scaleX = 1, scaleY = 1;

    const transform = component.getAttribute("transform");
        if (transform) {
            const flipMatch = transform.match(/scale\(\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*\)/);
            if (flipMatch) {
                scaleX = parseFloat(flipMatch[1]) * -1;
                scaleY = parseFloat(flipMatch[2]);
            }
            else{
                scaleX = -1;
            }

            component.setAttribute("transform", `translate(${tx}, ${ty}) scale(${scaleX}, ${scaleY}) translate(${-tx}, ${-ty})`);
        }
}

function flipVertically(component){
    const bbox = component.getBBox();

    const tx = bbox.x + bbox.width / 2;
    const ty = bbox.y + bbox.height / 2;

    let scaleX = 1, scaleY = 1;

    const transform = component.getAttribute("transform");
        if (transform) {
            const flipMatch = transform.match(/scale\(\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*\)/);
            if (flipMatch) {
                scaleX = parseFloat(flipMatch[1]);
                scaleY = parseFloat(flipMatch[2]) * -1;
            }
            else{
                scaleY = -1;
            }

            component.setAttribute("transform", `translate(${tx}, ${ty}) scale(${scaleX}, ${scaleY}) translate(${-tx}, ${-ty})`);
        }
}

function enableFlip(component){
    document.addEventListener("keydown", (event) => {
        //if(!selectedComponent) return;
        
        const key = event.key;

        let lastXFlipDirection = component.getAttribute("data-lastFlipped-x");
        let lastYFlipDirection = component.getAttribute("data-lastFlipped-y");

        switch(key){
            case "ArrowRight":
                if (lastXFlipDirection !== "right") {
                    flipHorizontally(component);
                    component.setAttribute("data-lastFlipped-x", "right");
                }
                break;
            case "ArrowLeft":
                if (lastXFlipDirection !== "left") {
                    flipHorizontally(component);
                    component.setAttribute("data-lastFlipped-x", "left");
                }
                break;
            case "ArrowUp":
                if (lastYFlipDirection !== "up") {
                    flipVertically(component);
                    component.setAttribute("data-lastFlipped-y", "up");
                }
                break;
            case "ArrowDown":
                if (lastYFlipDirection !== "down") {
                    flipVertically(component);
                    component.setAttribute("data-lastFlipped-y", "down");
                }
                break;
            default:
        }
    })
}


function enableDragging(component) {
    let isDragging = false, offsetX, offsetY;

    let offset = { x: 0, y: 0 };
    let currentTransform = { x: 0, y: 0 };

    const svg = component.ownerSVGElement;

    component.addEventListener("pointerdown", (event) => {
        //TODO: 
        //clear any scale transform
        //set data-lastFlipped-x and data-lastFlipped-y to null...maybe
        //extract out enable dragging from handler, so call setting up handlers (inverse)
        selectedComponent = component;
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
            }}//TODO check this doesn't break after adding scale
       
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