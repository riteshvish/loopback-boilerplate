module.exports = function (Model, options) {
  Model.observe('before save', function event (ctx, next) {
    // Observe any insert/update event on Model
    if (ctx.instance) {
      ctx.instance.createdAt = new Date()
      ctx.instance.updatedAt = new Date()
      if(ctx.options && ctx.options.accessToken){
        ctx.instance.createdBy = ctx.options.accessToken.userId
        ctx.instance.updatedBy = ctx.options.accessToken.userId
      }
    } else {

      ctx.data.updatedAt = new Date()
      if(ctx.options && ctx.options.accessToken){
        ctx.data.updatedBy = ctx.options.accessToken.userId
      }
    }
    next()
  })
}
