'use stric';

var fs = require('fs');
var path = require('path');
var Slack = require('node-slack');

module.exports = {
  config: require('./schema'),
  
  globalRoutes: function (app) {
    app.post('/test', function (req, res) {
      if (req.body.config.proxyURL != null && req.body.config.proxyURL != '') {
        var slack = new Slack(req.body.config.webhookURL, { proxy: req.body.config.proxyURL });
      } else {
        var slack = new Slack(req.body.config.webhookURL);
      }
      
      slack.send({
        channel: req.body.config.channel,
        username: 'Strider',
        icon_url: req.body.config.icon_url,
        text: 'Slack plugin test!'
      }, function(err, out) {
        if (err) {
          return res.status(500).send(err.stack);
        }
        else {
          return res.status(201).send(out);
        }
      });
    });
    
    app.get('/bot_avatar', function (req, res) {
      var filePath = path.join(__dirname, 'static', 'bot_avatar.png');
      
      fs.createReadStream(filePath).pipe(res);
    });
    
    app.get('/ejs_hint/:kind', function (req, res) {
      if (req.user && req.user.account_level > 0)  {
        var filePath = path.join(__dirname, 'hints', req.params.kind);
        
        if (fs.existsSync(filePath)) {
          var readStream = fs.createReadStream(filePath);
          
          readStream.pipe(res);
        } else {
          res.status(404).end();
        }
      } else {
        res.status(401).end();
      }
    });
  }
};
