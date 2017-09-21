'use strict';
var app = require('../../server/server');

module.exports = function(Likeapartments) {
  Likeapartments.likeApartments = function(likeInfo, cb) {
    var Apartments = app.models.Apartments;
    const {memberId, apartmentsId} = likeInfo;
    Likeapartments.find(
      {
        where: {
          memberId,
          apartmentsId,
        },
      },
      function(err3, data3) {
        if (err3) cb(err3);
        if (data3.length > 0) {
          /* var err = new Error();
            err = {
              statusCode: 450,
              name: 'Error Like Apartments',
              message: 'User has liked apartments.',
            };
            cb(err); */

          Likeapartments.destroyAll(
            {
              memberId,
              apartmentsId,
            },
            function(err4, data4) {
              if (err4) cb(err4);
              Apartments.find(
                {
                  include: ['reviews', 'images', 'likes'],
                  where: {
                    id: apartmentsId,
                  },
                },
                function(err5, data5) {
                  if (err5) cb(err5);
                  cb(null, data5[0]);
                }
              );
            }
          );
        } else {
          Likeapartments.create(
            {
              memberId,
              apartmentsId,
            },
            function(err, data) {
              if (err) cb(err);
              Likeapartments.find(
                {
                  include: {apartments: ['reviews', 'images', 'likes']},
                  where: {
                    memberId,
                    apartmentsId,
                  },
                },
                function(err2, data2) {
                  if (err2) cb(err2);
                  data2.forEach(function(value) {
                    var obj = value.toJSON();
                    cb(null, obj.apartments);
                  });
                }
              );
            }
          );
        }
      }
    );
  };

  Likeapartments.remoteMethod('likeApartments', {
    http: {path: '/likeApartmentsMethod', verb: 'post'},
    accepts: [{arg: 'likeInfo', type: 'object', http: {source: 'body'}}],
    returns: [{arg: 'result', type: 'object'}],
  });
};
