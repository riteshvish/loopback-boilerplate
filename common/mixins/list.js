'use strict'
let async =require("async")

module.exports = function (Model, options) {
  Model.list = function (filter, request, callback) {
    // this.definition.name
    let model = {}
    let _filter= filter || {}

    _filter.where=_filter.where || {}

    _filter.offset=_filter.offset || 0
    _filter.limit=_filter.limit || 10
    let page=(_filter.page || 0)

    if(_filter.offset){
      page = parseInt(_filter.offset / _filter.limit)
    }

    if((page || page===0))
      _filter.offset = page * _filter.limit
    _filter.page = page
    model.count=function(countCallback){
      Model.count(_filter.where,countCallback)
    }
    model.list=function(listCallback){
      Model.find(_filter,listCallback)
    }

    async.parallel(model,(error,data)=>{

      if(error)
        return callback(error)

      const baseUrl = Model.app.get('url').replace(/\/$/, '')
      let _url=[baseUrl,request.baseUrl,request.url].join("")
      const decoded = decodeURIComponent(_url).replace(/"/gi,'%22')

      console.log("request.url",decoded);
      // page + 2


      var next = decoded
      var pervious = decoded//(decoded+ JSON.stringify(filter)).replace("/\"","'")

      let pagination = {};
      if (data.list && data.list.length == _filter.limit && (page * _filter.limit !== data.count)) {
        pagination.next = next;
      }
      if (_filter.page != 0) {
        pagination.pervious = decoded;//'http://localhost:3000/api/Countries/list?filter={"%22"limit"%22":1,"%22"page"%22":1}&access_token=xx88ZA3sVS5AnmWAAivcZHO11drR51LczvDSfxA7GLkx8DiAFFAvxoOJZzr8ZVdw';
      }
      data.filter=_filter;
      data.pagination=pagination

      callback(null, data)
    })
  }

  Model.remoteMethod('list', {
    http: {path: '/list', verb: 'get'},
    accepts: [
      {arg: 'filter', type: 'object'},
      {arg: 'request', type: 'object', 'http': {source: 'req'}}
    ],
    returns: {arg: 'data', type: 'object'}
  })
}
