const path = require('path');
const { merge } = require('webpack-merge');
const singleSpaDefaults = require('webpack-config-single-spa-react-ts');
const Dotenv = require('dotenv-webpack');

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: 'hrx',
    projectName: 'hrx-web-ui-automation',
    webpackConfigEnv,
    argv,
  });

  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    devServer: {
      https: true,
      historyApiFallback: true,
    },
    module: {
      rules: [
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          use: [
            'file-loader',
            {
              loader: 'image-webpack-loader',
              options: {
                mozjpeg: {
                  progressive: true,
                },
                // optipng.enabled: false will disable optipng
                optipng: {
                  optimizationLevel: 7,
                },
                pngquant: {
                  quality: [0.65, 0.9],
                  speed: 4,
                },
                gifsicle: {
                  interlaced: false,
                },
                // the webp option will enable WEBP
                webp: {
                  quality: 75,
                },
              },
            },
          ],
          type: 'javascript/auto',
        },
        {
          test: /\.scss$/i,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: false,
                importLoaders: 2,
                modules: {
                  mode: 'local',
                  auto: true,
                  localIdentName: '[local]__[hash:base64:5]',
                },
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: false,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: false,
                sassOptions: {
                  outputStyle: 'expanded',
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [new Dotenv()],
    resolve: {
      alias: {
        src: path.resolve(__dirname, './src/'),
        assets: path.resolve(__dirname, './src/assets'),
        api: path.resolve(__dirname, './src/api'),
        components: path.resolve(__dirname, './src/components'),
        containers: path.resolve(__dirname, './src/containers'),
        constants: path.resolve(__dirname, './src/constants'),
        services: path.resolve(__dirname, './src/services'),
        types: path.resolve(__dirname, './src/types'),
        utils: path.resolve(__dirname, './src/utils'),
        styles: path.resolve(__dirname, './src/styles'),
        hooks: path.resolve(__dirname, './src/hooks'),
        store: path.resolve(__dirname, './src/store'),
      },
    },
  });
};