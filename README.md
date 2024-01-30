
# User Authentication Solution

This is a user Authentication service that provides with APIs for login and signup of users.




## APIs

**Base url:**  https://oxm1iurup4.execute-api.ap-south-1.amazonaws.com/dev/

### Signup

```http
  POST /api/signup
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required**. Name of user |
| `email` | `string` | **Required**.Valid Email address of user |
| `phoneNumber` | `string` | **Required**. Valid Phone Number of user |
| `password` | `string` | **Required**. Strong password  |

__Strong password :__ Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one symbol.

__Valid Phone Number:__ Valid phone number is of 10 digits can have country code for India (+91).

__Valid email address__: Valid email address should contain @ in it.

### Get item

```http
  POST /api/login
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `string` | **Required**. Email address of user|
| `password`      | `string` | **Required**. Password of the user |

__! Login Attempts :__ After a maximum of 5 unsuccessful login attempts, the account will be temporarily locked for 1 minute. This lockout mechanism will be enforced after each subsequent invalid login attempt until a successful login is achieved.


## Deployment

Deployment is done on aws lambda

**endpoint** - https://oxm1iurup4.execute-api.ap-south-1.amazonaws.com/dev/





## Tech Stack

**Server:** Node, Express

**Libraries:** xss, jsonwebtoken, mongoose, validator, awsome-phonenumber, serverless-http

**Database:** MongoDB

**Deployment:** AWS Lambda




