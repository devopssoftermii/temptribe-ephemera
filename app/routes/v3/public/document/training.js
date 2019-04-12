var Sequelize = require('sequelize');
require('dotenv-safe').config();
const Op = Sequelize.Op;

module.exports = function (router) {

    router.get('/categories', function (req, res, next) {
        var models = req.app.locals.models;
        return models.documentCategory.findAll({
            attributes: ['ID', ['description', 'title'], 'order'],
            where: {
                visible: true,
            }
        }).then(function (result) {
            res.jsend(result);
        }).catch(function (err) {
            next(err);
        });
    });


    router.get('/categories/:id', function (req, res, next) {
        var models = req.app.locals.models;
        var baseUrl = process.env.ADMIN_APP_HOST + '/docs/database/';
        var id = parseInt(req.params.id);
        return models.documents.findAll({
            where: {
                cat_ID: id,
                VisibleMobile: true
            },
        }).then(function (result) {
            var documents = [];
            for (let document of result) {
                let link = (document.IsLink == true ? document.file : baseUrl +  encodeURI(document.file)); //document.id + '_' +
                if (link) {
                    documents.push({
                        link: link,
                        title: document.title,
                        type: getType(document),
                        order: document.order
                    });
                }
            }
            res.jsend(documents);
        }).catch(function (err) {
            next(err);
        });
    });
};

function getType(document) {
    if (document.IsLink) {
        return 'video_link';
    }  else {
        return 'document';
    }
}
