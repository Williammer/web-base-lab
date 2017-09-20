class Parser {
    constructor(options) {
        this.$el = options.el;
        this.vm = options.vm;

        if (this.$el) {
            this.$fragment = nodeToFrag(this.$el); // changed $el to child nodes ?
            this.$parsedEl = this.parse(this.$fragment);
            this.$el.appendChild(this.$parsedEl);
        }
    }

    parse(node, scope) {
        // recusively parse each childNode
        if (node.childNode && node.childNode.length > 0) {
            Array.slice.call(node.childNode).forEach((child) => {
                if (child.nodeType === 1) {
                    this.parseElementNode(child, scope);
                }
                if (child.nodeType === 3) {
                    this.parseTextNode(child, scope);
                }
            });
        }
    }

    parseElementNode(node, scope) {
        const attrs = node.attributes;

        scope = scope || this.vm;

        Array.forEach.call(attrs, (attr) => { // attrName -> attrValue -> directive
            let attrName = attr.name,
                attrValue = attr.value,
                dir = this._checkDirective(attrName), // dir[type, prop, ]  // [toAdd]
                dirType = dir.type;

            if (dir.type) {
                let handler = this[dirType + 'Handler']; // [toAdd]
                handler && handler(node, scope, exp, dir.prop);
                node.removeAttribute(attrName);
            }
        });

        // [may] hv lazy parse
        this.parse(node, scope);
    }

    parseTextNode(node, scope) {
        const text = node.textContent().trim();
        if (!text) {
            return;
        }

        const exp = this._parseTextToExp(text);

        scope = scope || this.vm;
        this.textHandler(node, scope, exp); // [toAdd]
    }

    bindToWatcher(node, scope, exp, dir, prop) {
        // To init Watcher and trigger callback
        const updateFn = updater[dir]; // [toAdd]
        const watcher = new Watcher(exp, scope, (newVal) => {
            updateFn && updateFn(node, newVal, prop); // [toAdd]
        });
    }

    parseExpression(exp, scope) {
        try {
            with(scope){
                return eval(exp); // todo: the sandbox is better
            }
        } catch(e){
            console.warn(`compileExpression error: ${e}`);
        }
    }

    // parseClass(node, scope, exp, prop) {
    // }

    _parseTextToExp(text) {
        // parse {{ ... }}
        const regExpMusta = /\{\{(.+?)\}\}/g,
            pieces = text.split(regExpMusta),
            matches = text.match(regExpMusta);

        let tokens = [];

        pieces.forEach((piece) => {
            if (matches && matches.indexOf(`{{${piece}}}`) > -1) {
                tokens.push(piece);
            } else if (piece) {
                tokens.push('`' + piece + '`');
            }
        });

        return tokens.join('+');
    }

    _checkDirective(attrName) {

    }

    // xxHandlers
    modelHandler(node, scope, exp, prop) {
        if (node.tagName.toLowerCase() === 'input') {
            this.bindToWatcher(node, scope, exp, 'value', prop);
            node.addEventListener('input', (evt) => {
                node.isInputting = true; // state lock
                const newVal = evt.target.value;
                scope[exp] = newVal;
            });
        }
    }

    // forHandler(node, scope, exp, prop) {
    // }

    _valueUpdater(node, newValue) {
        if (!node.isInputting) {
            node.value = newValue || '';
        }

        node.isInputting = false;
    }
}
