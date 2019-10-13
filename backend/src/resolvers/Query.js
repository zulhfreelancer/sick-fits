const {forwardTo} = require('prisma-binding');

const Query = {

    // Style #1
    // Write custom function before passing to `prisma.graphql` file.
    // We can also use `forwardTo` - see Style #2 below.
    async items(parent, args, ctx, info) {
        const items =  await ctx.db.query.items();
        return items;
    },

    // Style #2
    // When `prisma.graphql` file contains the same function name -
    // item() in this case - we can just forward it without writing
    // own function like above. Much simpler and clean.
    item: forwardTo('db')

};

module.exports = Query;
