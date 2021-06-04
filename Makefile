apiFolder=PCube-API
appFolder=PCube

default: create-env
	
create-env:
	python -m venv env

api-init-env:
	$(MAKE) -C $(apiFolder) update-pip
	$(MAKE) -C $(apiFolder) install-requirements
	$(MAKE) -C $(apiFolder) regenerate-db

api-run:
	$(MAKE) -C $(apiFolder) run