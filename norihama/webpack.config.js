module.exports = {
    mode: 'development',
    entry: {
        index: "./ts/index.ts",
    },
    output: {
        path: __dirname,
        filename: "./dist/[name].js"
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', ".csv"]
    }
}