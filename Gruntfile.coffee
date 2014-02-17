module.exports = (grunt) ->
  grunt.initConfig
    author: ['David Lichtenberg (https://github.com/dmlicht)', 'Jade Misenas (https://github.com/cmisenas)']
    concat:
      dist:
        files:
          'bin/mustached.js': ['src/jquery.js', 'src/urlfield.js', 'src/main.js']
    uglify:
      dist:
        files:
          'bin/mustached.min.js': ['bin/mustached.js']
    cssmin:
      combine:
        files:
          'css/mustached.min.css': ['css/style.css']
          'css/error.min.css': ['css/error.css']
    watch:
      files: ['src/*.js', 'bin/*.js']
      tasks: 'default'

  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-cssmin'

  grunt.registerTask(
    'default',
    'Watches the project for changes and automatically builds them.',
    [ 'concat', 'uglify', 'cssmin', 'watch' ]
  )


