module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      files: ['src/*.js',"src/class/*.js","src/utils/*.js"],
      tasks: ['browserify']
    },
    browserify: {
      dist: {
        files: {
          'dist/js/bundle.js': ['src/class/*.js','src/utils/*.js','src/*.js'],
        }
      }
    },
    jsdoc : {
        dist : {
            src: ['src/memorama.js','src/class/escenario.js', 'src/utils/detector_ar.js', 'src/utils/Mediador.js','src/class/elemento.js'],
            options: {
                destination: 'doc'
            }
        }
    }
  });
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.registerTask("generating-doc",["jsdoc"])
  grunt.registerTask('default', ['watch']);
};
