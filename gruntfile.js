module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      files: ['js/*.js',"js/stages/*.js","src/class/*.js"],
      tasks: ['browserify']
    },
    browserify: {
      dist: {
        files: {
          'dist/js/bundle.js': ['js/app.js','js/stages/*.js','src/class/*.js'],
        }
      }
    }    
  });
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['watch']);
};