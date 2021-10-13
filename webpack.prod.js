const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: './src/js/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/app-[hash].js',
        clean: true,
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
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            sourceMap: false
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: false
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: false
                        }
                    }
                ]
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
            }),
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'home.html',
            template: './src/home.html',
            inject: 'body',
        }),
        new HtmlWebpackPlugin({
            filename: 'ceni-postavshikov.html',
            template: './src/ceni-postavshikov.html',
            inject: 'body',
        }),
        new HtmlWebpackPlugin({
            filename: 'ceni-postavshikov-card.html',
            template: './src/ceni-postavshikov-card.html',
            inject: 'body',
        }),
        new HtmlWebpackPlugin({
            filename: 'announcements.html',
            template: './src/announcements.html',
            inject: 'body',
        }),
        new HtmlWebpackPlugin({
            filename: 'proposals.html',
            template: './src/proposals.html',
            inject: 'body',
        }),
        new HtmlWebpackPlugin({
            filename: 'proposal-no-auth.html',
            template: './src/proposal-no-auth.html',
            inject: 'body',
        }),
        new HtmlWebpackPlugin({
            filename: 'proposal-auth.html',
            template: './src/proposal-auth.html',
            inject: 'body',
        }),
        new HtmlWebpackPlugin({
            filename: 'my-proposals.html',
            template: './src/my-proposals.html',
            inject: 'body',
        }),
        new HtmlWebpackPlugin({
            filename: 'my-response-proposals.html',
            template: './src/my-response-proposals.html',
            inject: 'body',
        }),
        new HtmlWebpackPlugin({
            filename: 'announcement-card.html',
            template: './src/announcement-card.html',
            inject: 'body',
        }),
        new HtmlWebpackPlugin({
            filename: 'my-announcements.html',
            template: './src/my-announcements.html',
            inject: 'body',
        }),
        new HtmlWebpackPlugin({
            filename: 'announce-tender.html',
            template: './src/announce-tender.html',
            inject: 'body',
        }),
        new HtmlWebpackPlugin({
            filename: 'tenders.html',
            template: './src/tenders.html',
            inject: 'body',
        }),
        new HtmlWebpackPlugin({
            filename: 'my-tenders.html',
            template: './src/my-tenders.html',
            inject: 'body',
        }),
        new HtmlWebpackPlugin({
            filename: 'tender-card.html',
            template: './src/tender-card.html',
            inject: 'body',
        }),
        new HtmlWebpackPlugin({
            filename: 'tender-after-click.html',
            template: './src/tender-after-click.html',
            inject: 'body',
        }),
        new HtmlWebpackPlugin({
            filename: 'tender-no-auth.html',
            template: './src/tender-no-auth.html',
            inject: 'body',
        }),
        new HtmlWebpackPlugin({
            filename: 'catalog.html',
            template: './src/catalog.html',
            inject: 'body',
        }),
        new HtmlWebpackPlugin({
            filename: 'catalog-category.html',
            template: './src/catalog-category.html',
            inject: 'body',
        }),
        new HtmlWebpackPlugin({
            filename: 'catalog-subcategory.html',
            template: './src/catalog-subcategory.html',
            inject: 'body',
        }),
        new HtmlWebpackPlugin({
            filename: 'tender-success.html',
            template: './src/tender-success.html',
            inject: 'body',
        }),
        new HtmlWebpackPlugin({
            filename: 'proposal-success.html',
            template: './src/proposal-success.html',
            inject: 'body',
        }),
        new HtmlWebpackPlugin({
            filename: 'add-proposal.html',
            template: './src/add-proposal.html',
            inject: 'body',
        }),
        new HtmlWebpackPlugin({
            filename: 'ui.html',
            template: './src/ui.html',
            inject: 'body',
        }),
        new MiniCssExtractPlugin({
            // filename: "[name].[hash].css"
            filename: "css/style.[hash].css"
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: './src/img', to: './img' },
                // { from: './src/fonts', to: './dist/fonts' }
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
