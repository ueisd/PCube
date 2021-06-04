
default: create-env update-pip install-requirements regenerate-db

run: 
	python -m flask run

#installation commandes
regenerate-db:
	rm -f db/database/pcube.db 2> /dev/null
	sqlite3 db/database/pcube.db < db/database/pcube.sql
	sqlite3 db/database/pcube.db < db/database/data_generation.sql

pycodestyle:
	pycodestyle ../PCube-API

update-pip:
	pip install --upgrade pip

install-requirements:
	pip install -r requirements.txt

create-env:
	python -m venv env