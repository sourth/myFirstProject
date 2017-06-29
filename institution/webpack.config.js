var path = require('path');
var webpack = require('webpack');

var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(__dirname, './src/App.js');
var INDEX_PATH = path.resolve(__dirname, './src/Index.js');
var REGISTER_PATH = path.resolve(__dirname, './src/Register.js');
var BUILD_PATH = path.resolve(__dirname, './build');
var PASSWORD_PATH =path.resolve(__dirname, './src/Password.js');


module.exports = {
	entry: {APP_PATH,INDEX_PATH,REGISTER_PATH,PASSWORD_PATH},
	output: {
		path: BUILD_PATH,
		filename: '[name].js'
	},
	 plugins: [
	 	new webpack.ProvidePlugin({$:"jquery",jQuery:"jquery","window.jQuery":"jquery"})
	 ],
	module: {
		loaders: [{
			test: /\.jsx?$/,
			loaders: ['babel-loader?presets[]=es2015,presets[]=react']
		},{
		    test: /\.less$/,
		    loader: 'style-loader!css-loader!less-loader'
		},{
		    test: /\.(png|jpg)$/,
			loader: 'url-loader'
		}
		]
	}
}
