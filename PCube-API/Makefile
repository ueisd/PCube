default: run


run: 
	flask run

regenerate-db:
	rm -f db/database/pcube.db 2> /dev/null
	sqlite3 db/database/pcube.db < db/database/pcube.sql
	sqlite3 db/database/pcube.db < db/database/data_generation.sql

pycodestyle:
	pycodestyle ../PCube-API