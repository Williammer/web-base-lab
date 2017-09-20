class Pubsub {
    constructor(data) {
        if (!this.__handlers || typeof this.__handlers !== "object") {
            this.__handlers = {};
        }
    }

    isValidEvt(evt) {
        return (evt && typeof evt === "string");
    }
    isValidCallback(callback) {
        return (callback && typeof callback === "function");
    }
    hasEvtHandlers(evt) {
        return (this.isValidEvt(evt) && this.__handlers[evt].length > 0);
    }

    subscribe(evt, callback) {
        if (this.isValidEvt(evt) && this.isValidCallback(callback)) {
            if (this.__handlers[evt].length > 0) {
                this.__handlers[evt].push(callback);
            } else {
                this.__handlers[evt] = [callback];
            }
        }
    }

    publish(evt) {
        if (this.hasEvtHandlers(evt)) {
            let i = 0;
            while (i < this.__handlers[evt].length) {
                this.__handlers[evt][i]();
                i++;
            }
        }
    }

    unsubscribe(evt, callback) {
        if (this.isValidCallback(callback) && this.hasEvtHandlers(evt)) {
            const handlerLength = this.__handlers[evt].length;

            for (let i = handlerLength - 1; i >= 0; i--) {
                if (this.__handlers[evt][i] === callback) {
                    this.__handlers[evt].splice(i, 1);
                }
            }
        }
    }

    unsubscribeAll(evt) {
        if (this.hasEvtHandlers(evt)) {
            delete this.__handlers[evt];
        }
    }
}
