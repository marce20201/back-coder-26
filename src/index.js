const PORT = process.env.PORT || 8080
const app = require('./server')

app.listen(PORT,()=>{
    console.log('Servidor corriendo')
})

