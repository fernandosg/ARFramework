module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      files: ['js/*.js',"src/trackingcolor.js","src/calibracion.js","src/memorama.js","src/class/*.js","src/basketball.js"],
      tasks: ['browserify']
    },
    browserify: {
      dist: {
        files: {
          'dist/js/bundle.js': ['js/app.js','src/basketball.js','src/calibracion.js','src/class/elemento.js','src/class/detector.js','src/class/labels.js','src/trackingcolor.js','src/class/escenario.js',"src/class/webcamstream.js"],
        }
      }
    }    
  });
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['watch']);
};