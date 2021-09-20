const sass = require('node-sass');
const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      options: {
        implementation: sass,
        sourceMap: true
      },
      build: {
        files: [{
            src: 'src/scss/app.scss',
            dest: 'dist/assets/css/app.css'
          }]
      }
    },
    imagemin: {
      png: {
        options: {
          use: [
            pngquant({quality: [0.7, 0.9]})
          ],
          optimizationLevel: 7
        },
        files: [
          {
            expand: true,
            cwd: 'src/img',
            src: ['**/*.{png,PNG}', '**/*.png'],
            dest: 'dist/assets/img',
            ext: '.png'
          }
        ]
      },
      gif: {
        options: {
          optimizationLevel: 7
        },
        files: [
          {
            expand: true,
            cwd: 'src/img',
            src: ['**/*.{gif,GIF}', '**/*.gif'],
            dest: 'dist/assets/img',
            ext: '.gif'
          }
        ]
      },
      jpg: {
        options: {
          use: [
            mozjpeg({quality: 80})
          ],
          progressive: true
        },
        files: [
          {
            expand: true,
            cwd: 'src/img',
            src: ['**/*.{jpg,JPG,jpeg,JPEG}', '**/*.jpeg'],
            dest: 'dist/assets/img',
            ext: '.jpg'
          }
        ]
      }
    },
    svgmin: {
      options: {
        plugins: [
          {
            removeViewBox: false
          },
          {
            removeUselessStrokeAndFill: false
          },
          {
            removeAttrs: {
              attrs: [
                'xmlns'
              ]
            }
          }
        ]
      },
      dist: {
        files: [{
            expand: true,
            cwd: 'src/svg',
            src: ['*.svg'],
            dest: 'dist/assets/svg',
            ext: '.min.svg'
          }]
      }
    },
    cssmin: {
      options: {
        sourceMap: true,
        keepSpecialComments: 0,
        root: 'dist/assets/css/',
        rebase: true
      },
      target: {
        files: [{
            expand: true,
            cwd: 'dist/assets/css',
            src: ['*.css', '!*.min.css'],
            dest: 'dist/assets/css',
            ext: '.min.css'
          }]
      }
    },
    stripCssComments: {
      dist: {
        files: {
          'dist/assets/css/app.min.css': 'dist/assets/css/app.min.css'
        },
        options: {
          preserve: false
        }
      }
    },
    uglify: {
      options: {
        compress: {
          drop_console: true
        }
      },
      my_target: {
        files: [{
            expand: true,
            cwd: 'src/js',
            src: '**/*.js',
            dest: 'dist/assets/js'
          }]
      }
    },
    watch: {
      css: {
        files: '**/*.scss',
        tasks: ['sass', 'cssmin', 'stripCssComments']
      },
      images: {
        files: ['src/img/*.{png,jpg,jpeg,gif,PNG,JPG,JPEG,GIF}'],
        tasks: ['imagemin'],
        options: {
          spawn: false
        }
      },
      svg: {
        files: '**/*.svg',
        tasks: ['svgmin']
      },
      js: {
        files: 'src/js/*.js',
        tasks: ['uglify']
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-strip-css-comments');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-svgmin');
  grunt.registerTask('default', ['watch']);
};
