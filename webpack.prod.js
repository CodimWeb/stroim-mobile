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
            filename: 'announcement.html',
            template: './src/announcement.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'tenders.html',
            template: './src/tenders.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'tender.html',
            template: './src/tender.html'
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
            filename: 'ui.html',
            template: './src/ui.html'
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
