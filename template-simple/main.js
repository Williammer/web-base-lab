var colorsArray = ['red', 'green', 'blue', 'orange'];
var items = [];
for (var i = 0; i < 10000; i++) {
    items.push("test");
}

function replaceContent(name) {
    document.getElementById('content').innerHTML =
        tmpl(name, {
            colors: colorsArray,
            items: items
        });
}
