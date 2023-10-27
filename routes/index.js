var express = require('express'),
    passport = require('passport'),
    router = express.Router(),
    contentList = require('./common/contentlist'),
    DAO_sup = require('../lib/DAO/support/DAOConfig'),
    db_client = require('../lib/DAO/clientDao')(DAO_sup.config());    
    wAPI = require('../lib/webAPI_publisher')(db_client);

router.use('/console',require('./features/consoleAdmCtrl'));
router.use('/lms'    ,require('./features/ltiCtrl'));

//global variables
global.ContentTypeList = contentList;


/* GET home page. */
router.get('/', function(req, res, next) {
    req.session.pBag = wAPI.index();
    res.status(200).render('index', { properties: req.session.pBag });
});
    
router.get('/callback', passport.authenticate('auth0', {failureRedirect: '/error' }),
    function(req, res) {
        if (!req.user) { throw new Error('user null');   }
        wAPI.get_publisher_profile({id: req.user.id, name: req.user.displayName}, 
                function(data) {
                    req.session.pBag=data;    
                    res.status(200).redirect("/console");

                }
        );
    }
);

router.get('/error',function(req, res, next) {
    res.status(200).render('./common/error', { properties: req.session.pBag });
    });


router.get('/logout', function(req, res) {
    req.session.pBag = null;
    req.logout();
    res.status(200).redirect("/");
});

module.exports = router;