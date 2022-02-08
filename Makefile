.PHONY: doc

doc:
	jsdoc ./scripts/AIController.js -d ./doc -c ./jsdoc.json
	