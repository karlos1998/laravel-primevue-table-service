export default class {
    helpers;
    type;

    constructor({ init, type }) {
        this.helpers = new Set(init);
        this.type = type;
    }
    add(instance) {
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
        return [...this.helpers].map((v) => v.vnode);
    }
}
