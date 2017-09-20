/*
 * Dependency manager
 */

class Dep {
    constructor() {
        this._dep = {};
    }

    addDep(target) {
        if (!this._dep[target.uid]) {
            this._dep[target.uid] = target;
        }
    }

    notify() {
        for (let uid in this._dep) {
            this._dep[uid].update();
        }
    }
}


/*
 * Mutation Watcher
 */
class Watcher {
    constructor(exp, scope, callback) {
        this._exp = exp || "";
        this._scope = scope || this;
        this._callback = callback || function() {};
        this._value = null;

        this.update();
    }

    get() {
        Dep.target = this; // check this
        let value = new Parser({}).parseExpression(this._exp, this._scope); // [toAdd]
        Dep.target = null;

        return value;
    }

    update() {
        let newValue = this.get();
        if (newValue !== this._value) {
            this._callback && this._callback(this._value, newValue);
            this._value = newValue;
        }
    }
}
