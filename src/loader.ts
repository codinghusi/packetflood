/* import * as PIXI from 'pixi.js';

interface LightMapping {
    [svg_id: string]: number // in degrees
}

class TextureLight {
    constructor(public pixiTexture: PIXI.Texture,
                public direction: number) {}
}

class Texture {
    constructor(public base: Texture,
                public light: TextureLight) {}

    private static loadTexture(name: string, lightMapping: LightMapping): Promise<Texture> {
        return new Promise((resolve, reject) => {
            const obj = document.createElement('object');
            obj.addEventListener('load', () => {
                const doc = obj.contentDocument;
                const lights = Object.entries(mapping)
                    .map(([id, angle]) => ({
                        element: doc.getElementById(id),
                        angle
                    }))
                    .filter(map => map.angle)
                    .map(/* map the svgs to pixi textures *//*);

                obj.remove();
                resolve(sprite);
            });
            obj.data = `/res/sprites/${name}.svg`;
            obj.type = 'image/svg+xml';
            document.body.appendChild(obj);
        })
    }

    static async loadPixi(app: PIXI.Application, name: string) {
        const myspr = await this.loadTexture(name);
        
        app.loader.add(name, )
    }
}

class SVG {
    constructor(public svgElement: SVGElement | Element) {
        if (this.svgElement.tagName !== 'svg') {
            this.svgElement = toSVG(this.svgElement);
        }
    }

    pixiSprite(app: PIXI.Application, name: string) {
        app.loader.add(name, this.url()).load((loader, resources) => {

        });
    }
    
    url() {
        return `data:image/svg+xml;base64,` + btoa(this.svgElement.outerHTML);
    }
}

function toSVG(part: Element) {
    const svg = document.createElement('svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('viewbox', '0 0 500 500');
    svg.innerHTML = part.outerHTML;
    return svg as unknown as SVGElement;
}*/