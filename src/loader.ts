import * as PIXI from 'pixi.js';

class TextureLight {
    constructor(public top: Texture,
                public front: Texture,
                public side: Texture) {}
}

class Texture {
    constructor(public base: Texture,
                public light: TextureLight) {}

    private static loadTexture(name: string): Promise<Texture> {
        return new Promise((resolve, reject) => {
            const obj = document.createElement('object');
            obj.addEventListener('load', () => {
                const doc = obj.contentDocument;
                
                const light = new TextureLight(
                    new SVG(doc.getElementById('Top')),
                    new SVG(doc.getElementById('Front')),
                    new SVG(doc.getElementById('Side')),
                );
                const sprite = new Texture(
                    new SVG(doc.getElementById('Object')),
                    light
                );
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
}