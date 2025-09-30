const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: './src/index.js', // Lokasi file utama aplikasi Anda
    output: {
        path: path.resolve(__dirname, 'dist'), // Direktori output
        filename: 'bundle.js', // Nama file output
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader', // Loader untuk transpilasi ES6+
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'], // Loader untuk CSS
            },
        ],
    },
    plugins: [
        // Plugin lain yang mungkin Anda perlukan
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
        }),
    ],
};
