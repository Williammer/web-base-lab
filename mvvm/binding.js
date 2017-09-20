class W {
    constructor(opts) {
        if (!opts.id) {
            console.warn("plz specify the id of parent element to be watched.");
        }

        this.window = window;
        this.$opts = opts || {};

        this.$el = typeof opts.el === 'string' ?
            document.querySelector(opts.el) :
            opts.el || document.body;

        this.$data = opts.data || {};

        this._proxyHandler(opts.handlers);
        this._proxyOpts(this.$opts)

        const pubsub = new Pubsub(this.$data);
        if (!pubsub) {
            return;
        }
        new Parser({
            el: this.$el,
            vm: this
        });
    }
    _proxyHandler(handlers) {
        if (handlers) {
            Object.keys(handlers).forEach((key) => {
                this[key] = handlers[key]; // why this.$opts.handlers[key]?
            });
        }
    }

    _proxyOpts(opts) {
        const topLvProps = ['data', 'computed'];

        topLvProps.forEach((topProp) => {
            let propObj = opts[topProp];

            Object.keys(propObj).forEach((subProp) => {
                Object.defineProperty(this, subProp, {
                    enumerable: true,
                    configurable: false, // can it?
                    get() {
                        if (typeof this.$data[subProp] !== 'undefined') {
                            return this.$data[subProp];
                        } else if (typeof this.$opts.computed[subProp] !== 'undefined') {
                            return this.$opts.computed[subProp]();
                        }
                        return;
                    },

                    set(newValue) {
                        if (this.$data.hasOwnProperty(subProp)) {
                            this.$data[subProp] = newValue;
                        } else if (this.$opts.computed.hasOwnProperty(subProp)) {
                            return this.$opts.computed[subProp](newValue);
                        }
                    }
                })

            })
        })
    }
}

// [Bind]

const dataBinding = {
    bind(data) {
        for (let prop in data) {
            this._bindProp(data, prop);

            // [@subProp] handle nested props with recursion
            if (typeof data[prop] === 'object') {
                this.bind(data[prop]);
            }
        }
    },

    _bindProp(data, prop) {
        let dep = new Dep();
        let value = data[prop];

        Object.defineProperty(data, prop, {
            enumerable: true,
            configurable: false, // can it?

            get() {
                if (Dep.target) {
                    dep.addDep(Dep.target);
                }
                return value;
            },

            set(newValue) {
                if (newValue !== value) {
                    value = newValue;
                    this.bind(newValue); // check this?
                    dep.notify();
                }
            }
        });
    }
}
