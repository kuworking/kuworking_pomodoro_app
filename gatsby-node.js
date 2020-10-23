// create pages programatically to build the seo structure at build time
const { createPages } = require(`./src/gatsby-node/createpages`)
exports.createPages = props => createPages({ ...props })

// remove trailing slashes
const { onCreatePage } = require(`./src/gatsby-node/oncreatepage`)
exports.onCreatePage = props => onCreatePage({ ...props })
