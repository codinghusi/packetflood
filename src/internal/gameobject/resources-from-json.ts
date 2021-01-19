import { loadResource, Resource } from "../resource-loader";



export async function loadResourcesFromJSON(path: string) {
    const response = await fetch(path);
    const json = await response.json();
    const rawObjects = json.objects;
    const resourcePromises = Object.values(rawObjects)
        .map((object: any) => loadResource(object.id, object.group, object, object.path));
    const resourceList = await Promise.all(resourcePromises);
    const resources = resourceList.reduce((acc, resource: Resource) => {
        acc[resource.name] = resource;
        return acc;
    }, {} as any);
    return resources;
}



