module.exports = (grunt) ->
  grunt.initConfig
    author: ['David Lichtenberg (https://github.com/dmlicht)', 'Jade Misenas (https://github.com/cmisenas)']
    coffee:
      compile:
        expand: true
        cwd: 'src/'
        src: '*.coffee'
        dest: 'bin/'
        ext: '.js'
    concat:
      dist:
        files:
          'bin/mustached.js': ['bin/urlfield.js', 'bin/main.js']
    uglify:
      dist:
        files:
          'bin/mustached.min.js': ['bin/jquery.js', 'bin/mustached.js']
    cssmin:
      combine:
        files:
          'css/mustached.min.css': ['css/style.css']
          'css/error.min.css': ['css/error.css']
    watch:
      dev:
        files: ['src/*.coffee']
        tasks: 'coffee'
      prod:
        files: ['bin/*.js', 'css/*']
        tasks: 'default'

  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-cssmin'
  grunt.loadNpmTasks 'grunt-contrib-coffee'

  grunt.registerTask(
    'default',
    'Watches the project for changes and automatically builds them.',
    [ 'coffee', 'concat', 'uglify', 'cssmin', 'watch' ]
  )


