// remove trailing slashes

const { urlResolve } = require(`gatsby-core-utils`)
/**
 * Remove trailing slashes and prevents *.components.js files to be converted to pages
 */

const replacePath = path => (path === `/` ? path : path.replace(/\/$/, ``))

exports.onCreatePage = async props => {
  const { page, actions } = props
  const { createPage, deletePage } = actions

  return new Promise(resolve => {
    const oldPage = Object.assign({}, page)
    page.path = urlResolve(replacePath(page.path))
    if (page.path.includes('404')) resolve()
    if (page.path.includes('.components.js')) resolve()

    if (page.path !== oldPage.path) {
      deletePage(oldPage)
      createPage({
        ...page,
        context: {
          date: Date(page.updatedAt),
          ...page.context,
        },
      })
    }
    resolve()
  })
}
