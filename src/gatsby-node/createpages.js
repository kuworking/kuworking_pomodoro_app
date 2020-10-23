const MainTemplate = require.resolve(`../components/main`)

exports.createPages = async props => {
  const {
    actions: { createPage },
  } = props

  createPage({
    path: '/',
    component: MainTemplate,
    context: {},
  })
}
