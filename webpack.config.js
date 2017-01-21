module.exports = {
    entry: "./src/StrikeJs.ts",
    output: {
        filename: "./dist/strike.min.js"
    },
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    module: {
        loaders: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    },
    externals:{
        "bluebird":"Promise",
        "react":"React",
        "react-dom":"ReactDOM",
        "immutable":"Immutable"
    }
}