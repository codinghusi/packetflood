import * as PIXI from 'pixi.js'

class LightTexture {
    constructor(public texture: PIXI.Texture) {}

    applyTransformation(texture: PIXI.Texture) {
        Object.assign(this.texture, texture);
    }

    brightness(intensity: number) {

    }
}

export class Texture {
    public base: PIXI.Texture;

    constructor(base: PIXI.Texture,
                public light: LightTexture) {
        if (this.light) {
            const proxy = new Proxy(base, {
                set(target, prop, newval) {
                    this.light.applyTransformation(proxy);
                    return newval;
                }
            });
            this.base = proxy;
        }
    }

    brightness(intensity: number) {

    }
}

class GameObject {
    constructor(public texture: Texture,
                public properties: any) {}
}


export interface ObjectResources {
    [texturename: string]: GameObject | ObjectResources;
}

export class ResourceManager {
    resources: ObjectResources;
    loadingPromise: Promise<void>;

    constructor(public app: PIXI.Application,
                public path: string) {
        // TODO: load
        this.loadingPromise = fetch(this.path).then(async response => {
            const data = await response.json();
            this.resources = await this.loadData(data) as ObjectResources;
        });
    }

    texture(name: string) {
        return this.resources[name];
    }

    async loadData(data: any): Promise<ObjectResources | GameObject> {
        if (typeof(data) === 'object') {
            if ('path' in data) {
                const { path } = data;
                const texture = await this.loadTexture(path);
                return new GameObject(texture, data);
            } else  {
                // recursion on all keys of data (sry for bad code):
                return Object.fromEntries(
                    await Promise.all(
                        Object.entries(data)
                            .map( async ([key, value]) => ([key, await this.loadData(value)])) ));
            }
        } else {
            return data;
        }
    }

    toSVG(element: Element) {
        if (!element) return null;

        const svg = document.createElement('svg');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('viewbox', '0 0 500 500');
        svg.innerHTML = element.outerHTML;
        return svg as unknown as SVGElement;
    }

    svgToDataUrl(svg: SVGElement) {
        const b64 = btoa(svg.outerHTML);
        return `data: image/svg+xml;base64,${b64}`;
    }

    toPixiTexture(svg: SVGElement): Promise<PIXI.Texture> {
        if (!svg) return null;

        const self = this;
        return new Promise((resolve, reject) => {
            const url = self.svgToDataUrl(svg);
            const img = new Image();
            img.src = url;
            // TODO: Can I do this? Last Change here
            const texture = new PIXI.Texture(new PIXI.BaseTexture(img));
            resolve(texture);
        });
    }

    elementToPixiTexture(element: Element) {
        return this.toPixiTexture(this.toSVG(element));
    }

    async loadTexture(path: string): Promise<Texture> {
        return new Promise((resolve, reject) => {
            const obj = document.createElement('object');
            obj.addEventListener('load', async () => {
                const doc = obj.contentDocument;
                
                const [pixiLightTexture, pixiObjectTexture] = await Promise.all([
                    this.elementToPixiTexture(doc.getElementById('Light')),
                    this.elementToPixiTexture(doc.getElementById('Object'))
                ]);

                const sprite = new Texture(
                    pixiObjectTexture, 
                    new LightTexture(pixiLightTexture),
                );

                obj.remove();
                resolve(sprite);
            });
            obj.data = `/res/sprites/${path}`;
            obj.type = 'image/svg+xml';
            document.body.appendChild(obj);
        });
    }
}