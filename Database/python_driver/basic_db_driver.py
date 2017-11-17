
from neo4j.v1 import GraphDatabase, basic_auth

driver = GraphDatabase.driver("bolt://<host>:<port>", auth=basic_auth("<user>", "<password>"))
session = driver.session()

session.run("CREATE (a:Person {name: {name}, title:{title}})",
            {"name": "Arthur", "title": "King"})

result = session.run("MATCH (a:Person) WHERE a.name = {name} "
                       "RETURN a.name AS name, a.title AS title",
                       {"name": "Arthur"})
for record in result:
    print("{} {}".format(record["title"], record["name"]))

session.close()
