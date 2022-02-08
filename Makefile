.PHONY: doc

setup:
	apt-get install npm
	npm install jsdoc
	npm install clean-jsdoc-theme

doc:
	jsdoc ./scripts/* -d ./doc -c ./jsdoc-config.json
	