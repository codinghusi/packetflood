const prefix = 'pf';

function getLabel(element: Element) {
    return element.getAttribute('inkscape:label');
}

function isSprite(element: Element) {
    return getLabel(element)?.slice(0, prefix.length) === prefix;
}

function labelWithoutPrefix(element: Element) {
    return getLabel(element).slice(`${prefix}_`.length);
}

function getSprites(): Element[] {
    const svg = document.getElementById('svg-object') as HTMLObjectElement;
    const data = svg.contentDocument;
    const elements = data.querySelectorAll('*');
    const sprites: any = {};
    Array.from(elements)
        .filter(isSprite)
        .forEach(element => {
            sprites[labelWithoutPrefix(element)] = element
        });
    return sprites;
}

function createSprite(sprite: Element) {
    // const svgData = `<svg xmlns='http://www.w3.org/2000/svg' viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" /></svg>`;
    sprite.setAttribute('transform', '');
    const svgData = `<svg xmlns='http://www.w3.org/2000/svg' viewBox="0 0 800 800">
    ${sprite.outerHTML}
    </svg>`;
    const realSvgData = btoa(svgData);
    const svg = document.createElement('img');
    svg.src = `data:image/svg+xml;base64,${realSvgData}`;
    svg.setAttribute('width', '3000');
    svg.setAttribute('height', '3000');
    return svg;
}

window.addEventListener('load', () => {
    const sprites = getSprites();
    console.log(sprites);

    Object.values(sprites).forEach(sprite => {
        const laptopSprite = createSprite(sprite);
        laptopSprite.style.position = 'absolute';
        laptopSprite.style.left = '0';
        laptopSprite.style.top = '0';
        console.log(laptopSprite);
        document.body.appendChild(laptopSprite);
    })
    
});