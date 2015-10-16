'use strict';

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        app: 'app',
        dist: 'dist',

        stylus: {
            compile: {
                options: {
                    use: [
                        require('s-grid'),
                        require('rupture'),
                        function () {
                            return require('autoprefixer-stylus')({
                                browsers: 'last 2 versions'
                            });
                        }
                    ]
                },
                files: {
                    '<%= app %>/css/app.css': '<%= app %>/styl/app.styl'
                }
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                ignores: ['<%= app %>/js/highlight.min.js']
            },
            all: [
                'Gruntfile.js',
                '<%= app %>/js/**/*.js'
            ]
        },

        clean: {
            dist: {
                src: ['<%= dist %>/*']
            },
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= app %>/',
                    src: ['fonts/**', '**/*.html', '!**/*.styl', '!bower_components/**'],
                    dest: '<%= dist %>/'
                }, {
                    expand: true,
                    flatten: true,
                    src: ['<%= app %>/bower_components/font-awesome/fonts/**'],
                    dest: '<%= dist %>/fonts/',
                    filter: 'isFile'
                }]
            },
        },

        imagemin: {
            target: {
                files: [{
                    expand: true,
                    cwd: '<%= app %>/images/',
                    src: ['**/*.{jpg,gif,svg,jpeg,png}'],
                    dest: '<%= dist %>/images/'
                }]
            }
        },

        uglify: {
            options: {
                preserveComments: 'some',
                mangle: false
            }
        },

        useminPrepare: {
            html: ['<%= app %>/index.html'],
            options: {
                dest: '<%= dist %>'
            }
        },

        usemin: {
            html: ['<%= dist %>/**/*.html', '!<%= app %>/bower_components/**'],
            css: ['<%= dist %>/css/**/*.css'],
            options: {
                dirs: ['<%= dist %>']
            }
        },

        watch: {
            grunt: {
                files: ['Gruntfile.js'],
                tasks: ['stylus']
            },
            stylus: {
                files: '<%= app %>/styl/**/*.styl',
                tasks: ['stylus']
            },
            assemble: {
                files: '<%= app %>/templates/**/*.hbs',
                tasks: ['assemble']
            },
            livereload: {
                files: ['<%= app %>/**/*.html', '!<%= app %>/bower_components/**', '<%= app %>/js/**/*.js', '<%= app %>/css/**/*.css', '<%= app %>/images/**/*.{jpg,gif,svg,jpeg,png}'],
                options: {
                    livereload: true
                }
            }
        },

        connect: {
            app: {
                options: {
                    port: 9000,
                    base: '<%= app %>/',
                    open: true,
                    livereload: true,
                    hostname: '127.0.0.1'
                }
            },
            dist: {
                options: {
                    port: 9001,
                    base: '<%= dist %>/',
                    open: true,
                    keepalive: true,
                    livereload: false,
                    hostname: '127.0.0.1'
                }
            }
        },

        assemble: {
            options: {
                flatten: true,
                plugins: ['permalinks'],
                partials: ['<%= app %>/templates/partials/*.hbs'],
                layoutdir: '<%= app %>/templates/layouts/',
                data: ['<%= app %>/templates/data/*.{json,yml}']
            },
            pages: {
                src: '<%= app %>/templates/pages/*.hbs',
                dest: '<%= app %>/'
            }
        }

    });


    grunt.registerTask('compile-stylus', ['stylus']);

    grunt.registerTask('default', ['assemble', 'compile-stylus', 'connect:app', 'watch']);
    grunt.registerTask('validate-js', ['jshint']);
    grunt.registerTask('server-dist', ['connect:dist']);

    grunt.registerTask('publish', ['assemble', 'compile-stylus', 'clean:dist', 'validate-js', 'useminPrepare', 'copy:dist', 'newer:imagemin', 'concat', 'cssmin', 'uglify', 'usemin']);

};
