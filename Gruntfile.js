module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

	// CONFIGURATION
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// https://github.com/gruntjs/grunt-contrib-copy
		copy: {
			dist: {
				expand: true,
				flatten: true,
				src: [
					'src/index.html'
				],
    			dest: 'dist/',
			}
		},

		// https://github.com/dciccale/grunt-processhtml
		processhtml: {
			dist: {
				files: {
					'dist/index.html': ['dist/index.html']
				}
			},
		},

		// https://github.com/sindresorhus/grunt-sass
		sass: {
			options: {
				sourceMap: false
			},
			dist: {
				files: {
					'tmp/css/style.css': 'src/scss/style.scss'
				}
			}
		},

		// https://github.com/nDmitry/grunt-postcss
		postcss: {
			dev: {
				options: {
					map: {
						inline: true
					},
					processors: [
						require('pixrem')(), // add fallbacks for rem units
						require('autoprefixer')({browsers: 'last 2 versions'}) // add vendor prefixes
					]
				},
				src: 'tmp/css/style.css',
				dest: 'dist/css/style.css'
			},
			prod: {
				options: {
					processors: [
						require('pixrem')(), // add fallbacks for rem units
						require('autoprefixer')({browsers: 'last 2 versions'}), // add vendor prefixes
						require('cssnano')() // minify the result
					]
				},
				src: 'tmp/css/style.css',
				dest: 'dist/css/style.min.css'
			}

		},

		// http://www.browsersync.io/docs/grunt/
		browserSync: {
			bsFiles: {
				src: [
					'dist/css/style.css',
					'dist/index.html'
				]
			},
			options: {
				watchTask: true,
				server: {
					baseDir: "./dist"
				}
			},
		},

		// https://github.com/gruntjs/grunt-contrib-watch
		watch: {
			css: {
				files: 'src/scss/*.scss',
				tasks: ['sass', 'postcss'],
			},
			html: {
				files: 'src/*.html',
				tasks: ['copy'],
			}
		}

	});

	// Task to run when doing 'grunt' in terminal.
	grunt.registerTask('default', [
		'copy',
		'sass',
		'postcss:dev',
		'browserSync',
		'watch'
	]);

	grunt.registerTask('prod', [
		'copy',
		'processhtml',
		'sass',
		'postcss:prod'
	]);
};
