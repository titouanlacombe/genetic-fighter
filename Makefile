.PHONY: doc

setup:
	npm install jsdoc
	npm install clean-jsdoc-theme

doc:
	# || true is a hack to silence return value of jsdoc wich isn't 0
	./node_modules/.bin/jsdoc ./scripts/* -d ./doc -c ./jsdoc-config.json || true
	