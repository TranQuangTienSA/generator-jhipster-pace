/* global describe, beforeEach, it*/

const path = require('path');
const fse = require('fs-extra');
const helpers = require('yeoman-test');

const deps = [
    [helpers.createDummyGenerator(), 'jhipster:modules']
];

describe('JHipster generator pace', () => {
    describe('Test with Maven and Angular2', () => {
        beforeEach((done) => {
            helpers
                .run(path.join(__dirname, '../generators/app'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, '../test/templates/maven-angular2'), dir);
                })
                .withOptions({
                    testmode: true
                })
                .withPrompts({
                    theme: 'green'
                })
                .withGenerators(deps)
                .on('end', done);
        });
    });

    describe('Test with Gradle and Angular1', () => {
        beforeEach((done) => {
            helpers
                .run(path.join(__dirname, '../generators/app'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, '../test/templates/gradle-angular1'), dir);
                })
                .withOptions({
                    testmode: true
                })
                .withPrompts({
                    theme: 'green'
                })
                .withGenerators(deps)
                .on('end', done);
        });
    });
});
