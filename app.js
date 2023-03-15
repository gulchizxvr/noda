const express = require("express")
const fs = require("node:fs/promises")
const path = require("path");


const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.listen(5100, ()=>{
  console.log("start on port 5100")
})


app.get("/users", async (req, res)=> {

   const users = JSON.parse(await fs.readFile(path.join('database','users.json'), {encoding:"utf8"}))

    res.status(200).json(users)
})

app.put('/users', async (req,res)=> {

    const users = JSON.parse(await fs.readFile(path.join("database", "users.json"), {encoding: "utf8"}))
    const newUser = req.body
    users.push(newUser)
    await fs.writeFile(path.join("database", "users.json"), JSON.stringify(users))

     res.status(200).json(
         {
             "message" : `created ${newUser.name}`
         }
     )
})

app.patch('/users/:userId', async (req, res)=> {
    try {
        let users = JSON.parse(await fs.readFile(path.join("database", "users.json"), {encoding: "utf8"}))

        const {userId: id} = req.params
        const {name,age} = req.body


        if (name.length<2 || age<15 ){
            throw new Error("Error name or age")
        }

        users[+id-1] = {...users[+id-1], ...req.body}

        await fs.writeFile(path.join("database", "users.json"), JSON.stringify(users))

        res.status(200).json(
            {
                "message": `Updated ${name} id:${id}`
            }
        )
    } catch (e) {
        res.status(400).json(e.message)
    }

})

app.delete('/users/:userId', async (req, res)=>{
    const users = JSON.parse(await fs.readFile(path.join("database", "users.json"), {encoding: "utf8"}))
    const {userId : id} = req.params
    users.splice(+id-1,1)

    await fs.writeFile(path.join("database", "users.json"), JSON.stringify(users))

    res.status(200).json(
        {
            "message" : `delete ${id}`
        }
    )
})