# http://www.cdotson.com/2014/06/generating-json-documents-from-sqlite-databases-in-python/
# auteur : Chad Dotson


def dict_factory(cursor, row):
    # Permets de créer un dictionnaire à partir des
    # informations recueillies d'une requête.
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d
