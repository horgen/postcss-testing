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

		// https://github.com/nDmitry/grunt-postcss
		postcss: {
			options: {
				map: false,
				processors: [
					require('pixrem')(), // add fallbacks for rem units
					require('autoprefixer')({browsers: 'last 2 versions'}) // add vendor prefixes
				]
			},
			dist: {
				src: 'src/css/style.css',
				dest: 'dist/css/style.css'
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
				files: 'src/css/*.css',
            	tasks: ['postcss'],
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
		'postcss',
		'browserSync',
		'watch'
	]);

	grunt.registerTask('prod', [
		'copy',
		'processhtml',
		'postcss'
	]);
};
