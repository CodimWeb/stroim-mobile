const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

module.exports = {
    target: 'web',
    mode: 'development',
    devtool: 'source-map', //eval-sourcemap, inline-source-map, eval, eval-cheap-source-map, source-map, inline-cheap-source-map
    entry: './src/js/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/app.js',
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        overlay: true,
        hot: false,
        port: 3000,
    },
    module: {
        rules: [{
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(scss|css)$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'home.html',
            template: './src/home.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'ceni-postavshikov.html',
            template: './src/ceni-postavshikov.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'ceni-postavshikov-card.html',
            template: './src/ceni-postavshikov-card.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'announcements.html',
            template: './src/announcements.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'announcement-card.html',
            template: './src/announcement-card.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'proposals.html',
            template: './src/proposals.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'proposal-no-auth.html',
            template: './src/proposal-no-auth.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'proposal-auth.html',
            template: './src/proposal-auth.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'tenders.html',
            template: './src/tenders.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'tender-card.html',
            template: './src/tender-card.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'tender-after-click.html',
            template: './src/tender-after-click.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'tender-no-auth.html',
            template: './src/tender-no-auth.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'catalog.html',
            template: './src/catalog.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'catalog-category.html',
            template: './src/catalog-category.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'catalog-subcategory.html',
            template: './src/catalog-subcategory.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'ui.html',
            template: './src/ui.html'
        }),
        new MiniCssExtractPlugin({
            filename: "css/style.css"
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: './src/img', to: './img' },
                // {from: './src/fonts', to: './dist/fonts'}
            ]
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            jQuery: 'jquery',
            'window.jquery': 'jquery',
            'window.jQuery': 'jquery',
        }),
    ],
}
