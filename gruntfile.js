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
    },
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: [
          'dist/js/libs/JSARToolKit.min.js',
          'dist/js/libs/three.min.js',
          'dist/js/libs/webcam.js',
          'dist/js/bundle.js'
        ],
        dest: 'dist/js/arweb.js',
      },
    },
  });
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.registerTask("generating-doc",["jsdoc"])
  grunt.registerTask('default', ['watch']);
};
