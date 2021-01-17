import { loadResourcesFromJSON } from "./object-loader";


(async () => {
    const resources = await loadResourcesFromJSON('/res/resources.json');
    console.log(resources);
})()
