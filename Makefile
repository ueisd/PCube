apiFolder=PCube-API
appFolder=PCube

default: create-env
	
create-env:
	python3.8 -m venv env

api-init-env:
	$(MAKE) -C $(apiFolder) update-pip
	$(MAKE) -C $(apiFolder) install-requirements
	$(MAKE) -C $(apiFolder) regenerate-db

api-run:
	$(MAKE) -C $(apiFolder) run

app-init-env:
	$(MAKE) -C $(appFolder) install-requirements

app-run:
	$(MAKE) -C $(appFolder) run