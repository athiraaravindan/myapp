module.exports = {
  apps : [{
    name        : "myapp",
    script      : "./bin/www",
      env : {
       "NODE_ENV": "production"
    }
  }]
}