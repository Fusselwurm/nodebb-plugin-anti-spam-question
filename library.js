var pluginData = require('./plugin.json');
var winston = require.main.require('winston');
var Meta = require.main.require('./src/meta');
var db = require.main.require('./src/database');
var Plugin = {};
var question = '';
var answer = '';

pluginData.nbbId = pluginData.id.replace(/nodebb-plugin-/, '');

Plugin.load = function(params, callback) {

    var render = function(req, res, next) {
        res.render('admin/plugins/' + pluginData.nbbId, pluginData || {});
    };

    Meta.settings.get(pluginData.nbbId, function(err, settings) {
        if (err || !settings) {
            winston.warn('[plugins/' + pluginData.nbbId + '] Settings not set or could not be retrived!');
        } else {
            question = settings.question;
            answer = settings.answer;
            winston.info('[plugins/' + pluginData.nbbId + '] Settings loaded');
        }

        params.router.get('/admin/plugins/' + pluginData.nbbId, params.middleware.admin.buildHeader, render);
        params.router.get('/api/admin/plugins/' + pluginData.nbbId, render);

        if (typeof callback === 'function') {
            callback();
        }
    });
};

Plugin.addQuestion = function(data, callback) {
    if (!answer || !question) {
        winston.warn('no question/answer for anti spam plugin defined');
    }
    var captcha = {
        label: 'Anti-Spam',
        html: ''
            + '<span class="help-block">' + question + '</span>'
            + '<input class="form-control" id="anti-spam-answer" name="anti-spam-answer" type="text" value=""/>',
        styleName: pluginData.nbbId
    };
    if (data.templateData.regFormEntry && Array.isArray(data.templateData.regFormEntry)) {
        data.templateData.regFormEntry.push(captcha);
    } else {
        data.templateData.captcha = captcha;
    }
    callback(null, data);
};

Plugin.checkRegister = function(data, callback) {
    var err, req;
    req = data.req;
    if (req.body['anti-spam-answer'] !== answer) {
        err = new Error('wrong anti spam answer');
    }
    callback(err, data);

};

Plugin.admin = {
    menu: function(custom_header, callback) {
        custom_header.plugins.push({
            "route": '/plugins/' + pluginData.nbbId,
            "icon": pluginData.faIcon,
            "name": pluginData.name
        });

        callback(null, custom_header);
    }
};

module.exports = Plugin;
