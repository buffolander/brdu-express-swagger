module.exports = {
  "swagger":"2.0",
  "info": {
    "title":"Mock API",
    "version":"1.0"
  },
  "host": "api.server.test",
  "schemes": ["https"],
  "paths": {
    "/users": {
      "post": {
        "operationId": "usersCreate",
        "parameters": [{
          "name": "user",
          "in": "body",
          "schema": {
            "type": "object",
            "required": ["name", "email"],
            "properties": {
              "name": {
                "type": "string"
              },
              "email": {
                "type": "string"
              },
              "birthday": {
                "type": "date"
              }
            }
          }
        }],
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "responses": {
          "200": {
            "description": "ok",
            "schema": {
              "type": "object",
              "properties": {
                "ok": {
                  "type": "boolean",
                  "default": true
                }
              }
            }
          }
        }
      }
    }
  },
  "definitions": {
    "User": {
      "type": "object",
      "required": [
        "name",
        "email"
      ],
      "properties": {
        "name": {
          "type": "string"
        },
        "email": {
          "type": "string"
        },
        "birthday": {
          "type": "date"
        }
      }
    }
  }
}
