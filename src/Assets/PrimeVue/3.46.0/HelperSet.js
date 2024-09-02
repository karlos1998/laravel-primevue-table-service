export default class {
    helpers;
    type;

    constructor({ init, type }) {
        console.log('helper set constructor method')
        this.helpers = new Set(init);
        this.type = type;
    }
    add(instance) {
        console.log('helper set add method')
        this.helpers.add(instance);
    }
    update() {
        // @todo
    }
    delete(instance) {
        this.helpers.delete(instance);
    }
    clear() {
        this.helpers.clear();
    }
    get(parentInstance, slots) {
        console.log('helper set get method')
        return [...this.helpers].map((v) => v.vnode);
    }
}
