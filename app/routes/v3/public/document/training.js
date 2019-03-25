var Sequelize = require('sequelize');
require('dotenv-safe').config();
const Op = Sequelize.Op;

module.exports = function(router) {

  router.get('/training', function(req, res, next) {
    var models = req.app.locals.models;
    var baseUrl = process.env.ADMIN_APP_HOST + '/docs/database/traningVideos/';
    return  models.documents.findAll({
        where: {
            [Op.or]: [
                {
                    IsTrainingVideos: {
                        [Op.eq]: true
                    }
                },
                {
                    IsLink: {
                        [Op.eq]: true
                    }
                }
            ]
        }
      }).then(function(result) {
        var documents = [];

        for(let document of result) {
          let link = (document.IsLink == true ? document.file : baseUrl + document.id + '_' + encodeURI(document.file));
          if(link){
            documents.push({
                link: link,
                title: document.title,
                type: getType(document)
            });
          }
        }
        res.jsend(documents);
    }).catch(function(err) {
        next(err);
    });
  });
};

function getType(document) {
   if(document.IsLink) {
     return 'video_link';
   }
   return 'file';

}
