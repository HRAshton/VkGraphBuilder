const path = require('path');

module.exports = {
    context: path.resolve(__dirname),
    devtool: 'inline-source-map',
    entry: {
        friends: './jsSrc/friends.ts',
        groups: './jsSrc/groups.ts',
    },
    mode: 'development',
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        }]
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'wwwroot'),
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js']
    },
};