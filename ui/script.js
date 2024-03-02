function autoGenerate() {
    var outputLog = document.getElementById('outputLog');
    outputLog.innerHTML = '';

    var path = document.getElementById('module_path').value;
    var moduleName = document.getElementById('module_name').value;

    fetch(`https://example.com/api?module_name=${moduleName}&path=${path}`)
        .then(response => response.json())
        .then(data => {
            outputLog.innerHTML = 'Hello ' + JSON.stringify(data);
        })
        .catch(error => {
            outputLog.innerHTML = 'Error: ' + error;
        });
}