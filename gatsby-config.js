const gtm = ''

const manifest = {
  name: 'kuworking',
  short_name: 'kuworking',
  start_url: '/',
  background_color: '#ffffff',
  theme_color: '#000000',
  display: `minimal-ui`,
  icon: `static/favicon.png`,
  include_favicon: true,
}

const metadata = {
  name: 'kuworking',
  site: 'kuworking',
  title: 'kuworking', // needed for gatsby-plugin-feed
  description: 'React, WordPress and Svelte',
  siteUrl: 'https://www.kuworking.com',
  site_lang: `es`,
  social: {
    twitter: '@kuworking',
    facebook: 'https://www.facebook.com/kuworkingJS/',
  },
  keywords: ['react', 'svelte', 'gatsby', 'next', `wordpress`, `javascript`, `css`],
}

module.exports = {
  siteMetadata: metadata,
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `content/tools`,
        name: `content/tools`,
      },
    },

    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-google-tagmanager`,
      options: {
        id: gtm,
        includeInDevelopment: false,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: manifest,
    },

    `gatsby-plugin-emotion`,

    //    {
    //      resolve: 'gatsby-plugin-webpack-bundle-analyser-v2',
    //      options: {
    //        devMode: true,
    //      },
    //    },
  ],
}
