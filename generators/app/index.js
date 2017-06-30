const util = require('util');
const chalk = require('chalk');
const generator = require('yeoman-generator');
const packagejs = require('../../package.json');
const semver = require('semver');
const BaseGenerator = require('generator-jhipster/generators/generator-base');
const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

const JhipsterGenerator = generator.extend({});
util.inherits(JhipsterGenerator, BaseGenerator);

const DEFAULT_PACE_THEME = 'green';

module.exports = JhipsterGenerator.extend({
    initializing: {
        readConfig() {
            this.jhipsterAppConfig = this.getJhipsterAppConfig();
            if (!this.jhipsterAppConfig) {
                this.error('Can\'t read .yo-rc.json');
            }
        },
        displayLogo() {
            // it's here to show that you can use functions from generator-jhipster
            // this function is in: generator-jhipster/generators/generator-base.js
            this.printJHipsterLogo();

            // Have Yeoman greet the user.
            this.log(`Welcome to the ${chalk.bold.yellow('JHipster Pace')} generator! ${chalk.yellow(`v${packagejs.version}\n`)}`);
        },
        checkJhipster() {
            const jhipsterVersion = this.jhipsterAppConfig.jhipsterVersion;
            const minimumJhipsterVersion = packagejs.dependencies['generator-jhipster'];
            if (!semver.satisfies(jhipsterVersion, minimumJhipsterVersion)) {
                this.warning(`\nYour generated project used an old JHipster version (${jhipsterVersion})... you need at least (${minimumJhipsterVersion})\n`);
            }
        }
    },

    prompting() {
        const done = this.async();
        const prompts = [
            {
                type: 'list',
                name: 'theme',
                choices: [
                    {
                        value: DEFAULT_PACE_THEME,
                        name: DEFAULT_PACE_THEME
                    },
                    {
                        value: 'black',
                        name: 'black'
                    },
                    {
                        value: 'blue',
                        name: 'blue'
                    },
                    {
                        value: 'orange',
                        name: 'orange'
                    },
                    {
                        value: 'pink',
                        name: 'pink'
                    },
                    {
                        value: 'purple',
                        name: 'purple'
                    },
                    {
                        value: 'red',
                        name: 'red'
                    },
                    {
                        value: 'silver',
                        name: 'silver'
                    },
                    {
                        value: 'white',
                        name: 'white'
                    },
                    {
                        value: 'yellow',
                        name: 'yellow'
                    }
                ],
                message: 'Please select a theme.',
                default: DEFAULT_PACE_THEME
            }
        ];

        this.prompt(prompts).then((props) => {
            this.props = props;
            // To access props later use this.props.someOption;

            done();
        });
    },

    writing() {
        // function to use directly template
        this.template = function (source, destination) {
            this.fs.copyTpl(
                this.templatePath(source),
                this.destinationPath(destination),
                this
            );
        };

        // read config from .yo-rc.json
        this.baseName = this.jhipsterAppConfig.baseName;
        this.packageName = this.jhipsterAppConfig.packageName;
        this.packageFolder = this.jhipsterAppConfig.packageFolder;
        this.clientFramework = this.jhipsterAppConfig.clientFramework;
        this.clientPackageManager = this.jhipsterAppConfig.clientPackageManager;
        this.buildTool = this.jhipsterAppConfig.buildTool;

        // use function in generator-base.js from generator-jhipster
        this.angularAppName = this.getAngularAppName();

        // use constants from generator-constants.js
        const javaDir = `${jhipsterConstants.SERVER_MAIN_SRC_DIR + this.packageFolder}/`;
        const resourceDir = jhipsterConstants.SERVER_MAIN_RES_DIR;
        const webappDir = jhipsterConstants.CLIENT_MAIN_SRC_DIR;

        // variable from questions
        this.theme = this.props.theme;

        this.addNpmDependency('pace-progress', '1.0.2');

        const webpackCopyContent = ',\n                { from: \'./node_modules/pace-progress\', to: \'content/pace-progress\' }';
        this.replaceContent('webpack/webpack.common.js', webpackCopyContent, '', false);
        this.replaceContent('webpack/webpack.common.js', 'to: \'robots.txt\' }', `to: \'robots.txt\' }${webpackCopyContent}`, false);

        const indexLoadingContent = '<div class="loading"></div>';
        this.replaceContent(`${webappDir}index.html`, '<jhi-main>.*</jhi-main>', `<jhi-main>${indexLoadingContent}</jhi-main>`, true);
        const indexHeaderContent = '    <!-- begin-pace-progress -->\n'
        + `    <link rel="stylesheet" href="/content/pace-progress/themes/${this.theme}/pace-theme-flash.css"/>\n`
        + '    <style type="text/css">\n'
        + '        .pace .pace-activity {top: 70px;} .pace .pace-progress-inner {box-shadow: none;}\n'
        + '        .loading::before,\n'
        + '        .loading::after {\n'
        + '            position: fixed;\n'
        + '            z-index: 3000;\n'
        + '            top: 0;\n'
        + '            left: 0;\n'
        + '            display: flex;\n'
        + '            justify-content: center;\n'
        + '            align-items: center;\n'
        + '            width: 100%;\n'
        + '            height: 100%;\n'
        + '        }\n'
        + '        .loading::before {\n'
        + '            content: \'\';\n'
        + '            background-color: #fff;\n'
        + '        }\n'
        + '        .loading::after {\n'
        + '            font-family: "Helvetica Neue", Helvetica, sans-serif;\n'
        + '            content: \'LOADING\';\n'
        + '            text-align: center;\n'
        + '            white-space: pre;\n'
        + '            font-weight: normal;\n'
        + '            font-size: 24px;\n'
        + '            letter-spacing: 0.04rem;\n'
        + '            color: #000;\n'
        + '            opacity: 0.8;\n'
        + '            animation: animation 1s alternate infinite;\n'
        + '        }\n'
        + '        @keyframes animation {\n'
        + '            to { opacity: 0.2; }\n'
        + '        }\n'
        + '    </style>\n'
        + '    <script type="text/javascript">\n'
        + '        window.paceOptions = {\n'
        + '            document: true,\n'
        + '            eventLag: true,\n'
        + '            restartOnPushState: true,\n'
        + '            restartOnRequestAfter: true,\n'
        + '            ajax: {\n'
        + '                trackMethods: [ \'POST\',\'GET\']\n'
        + '            }\n'
        + '        };\n'
        + '    </script>\n'
        + '    <script src="/content/pace-progress/pace.js"></script>\n'
        + '    <!-- end-pace-progress -->\n';
        this.replaceContent(`${webappDir}index.html`, /[\n ]*<!-- begin-pace-progress[\s\S]*end-pace-progress -->/gm, '', false);
        this.replaceContent(`${webappDir}index.html`, '</head>', `${indexHeaderContent}</head>`, false);
    },

    install() {
        let logMsg =
            `To install your dependencies manually, run: ${chalk.yellow.bold(`${this.clientPackageManager} install`)}`;

        if (this.clientFramework === 'angular1') {
            logMsg =
                `To install your dependencies manually, run: ${chalk.yellow.bold(`${this.clientPackageManager} install & bower install`)}`;
        }
        const injectDependenciesAndConstants = (err) => {
            if (err) {
                this.warning('Install of dependencies failed!');
                this.log(logMsg);
            } else if (this.clientFramework === 'angular1') {
                this.spawnCommand('gulp', ['install']);
            }
        };
        const installConfig = {
            bower: this.clientFramework === 'angular1',
            npm: this.clientPackageManager !== 'yarn',
            yarn: this.clientPackageManager === 'yarn',
            callback: injectDependenciesAndConstants
        };
        this.installDependencies(installConfig);
    },

    end() {
        this.log('End of pace generator');
    }
});
