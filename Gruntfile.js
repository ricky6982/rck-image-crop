module.exports = function (grunt){
    
    var files = require('./files').files;

    // Configuración del Proyecto
    grunt.initConfig({
        builddir: 'dist',
        buildsrc: 'src',
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/**\n'+
                ' * <%= pkg.description %>\n' +
                ' * @version v<%= pkg.version %>\n' +
                ' * @link <%= pkg.homepage %>\n' +
                ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
                ' */'
        },

        clean: [ '<%= builddir %>' ],

        concat: {
            options: {
                banner: '<%= meta.banner %>\n(function(window, angular){\n\n',
                footer: '\n\n})(window, angular);'
            },
            build: {
                src: files.src,
                dest: '<%= builddir %>/<%= pkg.name %>.js'
            }
        },

        uglify: {
            options: {
                banner: '<%= meta.banner %>\n'
            },
            build: {
                files: {
                  '<%= builddir %>/<%= pkg.name %>.min.js': ['<banner:meta.banner>', '<%= concat.build.dest %>']
                }
            }
        },

        html2js: {
            options: {
                module: 'rck-image-crop.templates'
            },
            main: {
                src: ['<%= buildsrc %>/template/**/*.tpl.html'],
                dest: '<%= buildsrc %>/js/template.js'
            }
        },

        jshint: {
            beforeconcat: ["<%= buildsrc %>/js/**/*.js", "<%= buildsrc %>/test/*.js"],
            options: {
              eqnull: true
            }
        },

        sass: {
            dist: {
                files: {
                    '<%= builddir %>/<%= pkg.name %>.css': '<%= buildsrc %>/sass/main.scss'
                }
            }
        },

        watch: {
            startup: {
                files: [],
                tasks: ['karma:continuous:start'],
                options: {
                    atBegin: true,
                    spawn: false
                }
            },
            sass: {
                files: ['<%= buildsrc %>/sass/*.scss'],
                tasks: ['sass']
            },
            html: {
                files: ['<%= buildsrc %>/template/*.tpl.html'],
                tasks: ['html2js', 'concat', 'jshint']
            },
            js: {
                files: ['<%= buildsrc %>/js/**/*.js'],
                tasks: ['concat', 'uglify', 'jshint'],
            },
            karma: {
                files: ['<%= buildsrc %>/js/**/*.js', '<%= buildsrc %>/test/*.js'],
                tasks: ['karma:continuous:run'],
            }
        },

        karma: {
            options: {
                configFile: 'karma.conf.js',
            },
            unit: {
                singleRun: true
            },
            continuous: {
                background: true
            }
        }

    });

    grunt.registerTask('default', 'Perform a normal build', ['jshint', 'concat', 'uglify', 'karma:unit:run']);

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-karma');
};