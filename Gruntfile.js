module.exports = function(grunt) {

  grunt.initConfig({

    critical: {
      test: {
        options: {
          base: './',
          css: [
              'css/style.css',
          ],
          dimensions: [{
            width: 1300,
            height: 900
          },
          {
            width: 320,
            height: 360
          }]
        },
        src: 'index.html',
        dest: 'test/index.html'
      }
    },
  });

  grunt.loadNpmTasks('grunt-critical');
  grunt.registerTask('default', ['critical']);

};
