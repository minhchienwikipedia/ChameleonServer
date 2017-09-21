'use strict';

module.exports = function(Likeapartments) {
  Likeapartments.likeApartments = function(likeInfo, cb) {
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
          var err = new Error();
          err = {
            statusCode: 450,
            name: 'Error Like Apartments',
            message: 'User has liked apartments.',
          };

          cb(err);
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
                  cb(null, data2);
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
