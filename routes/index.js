var express = require('express');
var router = express.Router();
var request = require('sync-request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/getUrlInfo', function(req, res, next) {
    //url地址
    let url = req.body.url;
    //需要匹配的地址正则式
    let reg = new RegExp(req.body.reg,"g");
    //前缀，页面中的下载地址使用相对路径时，需要不全路径才能下载
    let prefix = req.body.prefix;

    let urlArr=new Array();
    let html = "";
    html=request('GET', url).getBody().toString();

    getCaptureUrls(html,reg).forEach(item=>urlArr.push(`${prefix}${item}`));
    res.send({ html: html,urlArr:urlArr});
});

function loadPage(url,reg){
    //加载http模块,使用promise控制为同步
    return new Promise(function(resolve, reject) {
        var http = require('http');
        http.get(url, function(res) {
            var html = '';
            res.on('data', function(data) {
                html += data;
            });
            res.on('end', function() {
                console.log(html);
                resolve(html);
            });
        });
    });
};

function getCaptureUrls(content,reg){
    //使用set去除重复数据
    let arrs = new Set(content.match(reg));
    return arrs;
};

function sleep(ms) {
    setTimeout(null,ms);
}
module.exports = router;