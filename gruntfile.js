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
    esdoc : {
        dist : {
            options: {
                source: 'src/',
                destination: './doc',
                plugins: [
                   {"unexportedIdentifier": {"enable": false}}
                ]
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
  grunt.loadNpmTasks('grunt-esdoc');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.registerTask("generating-doc",["esdoc"])
  grunt.registerTask('default', ['watch']);
};
