.PHONY: doc

doc:
	jsdoc ./scripts/* -d ./doc -c ./jsdoc.json
	