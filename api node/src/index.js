const app = require("./app")
require("./database")

app.listen(app.get("port"), function() {
    console.clear()
    console.log("Server on port", app.get("port"))
})
