apiFolder=PCube-API
appFolder=PCube

default: api-install app-install

#commandes backend
api-install: create-env api-init-env

create-env:
	python -m venv env

api-init-env:
	$(MAKE) -C $(apiFolder) update-pip
	$(MAKE) -C $(apiFolder) install-requirements
	$(MAKE) -C $(apiFolder) regenerate-db

api-run-dev:
	$(MAKE) -C $(apiFolder) run

#comandes frontend
app-install:
	$(MAKE) -C $(appFolder) install-requirements

app-run-dev:
	$(MAKE) -C $(appFolder) run	

app-run-heroku:
	$(MAKE) -C $(appFolder) run-heroku