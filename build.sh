tsc --module es6 --target es6 --rootDir ./src --outDir ./es6 --jsx react 
tsc --module commonjs --target es6 --rootDir ./src --outDir ./lib --jsx react 
tsc --module amd --target es5 --rootDir ./src --outFile ./es5/strike.js --jsx react
tsc --module system --target es5 --rootDir ./src --outFile ./systemjs/strike.js --jsx react