import * as PIXI from 'pixi.js';
import { KeyValue } from './utils';

async function fetchSvgAsDocument(path: string): Promise<Document> {
    return new Promise((resolve, reject) => {
        const obj = document.createElement('object');
        obj.addEventListener('load', async () => {
            const doc = obj.contentDocument;
            obj.remove();
            resolve(doc);
        });
        obj.data = `/res/sprites/${path}`;
        obj.type = 'image/svg+xml';
        document.body.appendChild(obj);
    });
}

function partToSVG(part: Element) {
    if (!part) {
        throw `Can't convert to SVG: part is null`;
    }
    const svg = document.createElement('svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('viewbox', '0 0 500 500');
    svg.innerHTML = part.outerHTML;
    return svg as unknown as SVGElement;
}

function getObjectOfDocument(doc: XMLDocument) {
    return partToSVG(doc.getElementById('Object'));
}

function getLightOfDocument(doc: XMLDocument) {
    return partToSVG(doc.getElementById('Light'));
}

function svgDataURL(svg: SVGElement) {
    return `data:image/svg+xml;base64,${btoa(svg.outerHTML)}`;
}

function getTexture(svg: SVGElement) {
    const img = new Image();
    img.src = svgDataURL(svg);
    document.body.appendChild(img);
    const texture = new PIXI.Texture(new PIXI.BaseTexture(img));
    // document.body.removeChild(img);
    return texture;
}

export class Resource {
    constructor(public name: string,
                public group: string,
                public data: any,
                public textures: KeyValue<PIXI.Texture> = {}) {}
}



const resources: Resource[] = [];

function collectResourcesByGroup(groupName: string) {
    return resources.filter(resource => resource.group === groupName);
}

export async function loadResource(id: string, group: string, data: any, path: string) {
    const doc = await fetchSvgAsDocument(path);
    const lightSVG = partToSVG(getLightOfDocument(doc));
    const objectSVG = partToSVG(getObjectOfDocument(doc));

    const light = getTexture(lightSVG);
    const object = getTexture(objectSVG);

    const resource = new Resource(id, group, data, {
        object, light
    });
    
    resources.push(resource);

    return resource;
}
