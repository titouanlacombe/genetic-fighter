.PHONY: doc setup npm-rm-proxy clean

# If npm is having trouble in wsl
npm-rm-proxy:
	npm config rm proxy
	npm config rm https-proxy

setup:
	npm install jsdoc
	npm install clean-jsdoc-theme

# || true is a hack to silence return value of jsdoc wich isn't 0
doc:
	./node_modules/.bin/jsdoc ./scripts/* -d ./doc -c ./jsdoc-config.json || true

clean:
	rm -dR doc node_modules
	rm package-lock.json package.json
	