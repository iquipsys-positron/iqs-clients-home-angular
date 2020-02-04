var fs = require('fs')
var angular_json = require('./angular.json');
var project = angular_json['defaultProject'];
var path = './dist/' + project + '/index.html';

fs.readFile(path, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    var result = data.replace(/<base href="(.*)">/g, '<base href="$1/">');

    fs.writeFile(path, result, 'utf8', function (err) {
        if (err) return console.log(err);
    });
});