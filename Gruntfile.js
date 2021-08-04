module.exports = function (grunt) {
    const config = require('./.secret.json');

    var branch = grunt.option('branch') || config.branch;
    var ptr = grunt.option('ptr') ? true : config.ptr;

    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {
            options: {
                email: config.email,
                password: config.password,
                branch: branch,
                ptr: ptr
            },
            dist: {
                src: ['src/*.js']
            }
        }
    });
};
