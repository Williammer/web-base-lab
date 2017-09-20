const updater = {
    value(node, newVal, prop) {

    }

    dom(node, newVal, nextNode) {
        if (newVal) {
            nextNode.parentNode.insertBefore(node, nextNode);
        } else {
            nextNode.parentNode.removeChild(node);
        }
    }
};
