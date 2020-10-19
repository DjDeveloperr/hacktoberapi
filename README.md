# Hacktober API
Simple API to check eligibility of Repositories and Pull Requests for Hacktoberfest. 

API is hosted [here](https://hf.djd.wtf) at the moment.

## Setup
`npm install` and `npm start`
You also need a `.env` file with your Github Access Token (`TOKEN`).

## API Endpointers
```http
GET /api/repo/:user/:repo
```
### Parameters
* user: string - Owner of the Repository
* repo: string - Repository Name

### Response
Sends JSON with following properties if everything goes right:
* user: string - Owner of the Repository
* repo: string - Repository Name
* eligibile: boolean - Whether Repository is eligibile or not
If not found, a Error response with code 404 is sent:
```json
{
	"code": 404,
	"msg": "Not Found"
}
```

```http
GET /api/pr/:user/:repo/:pr_num
```
### Parameters
* user: string - Owner of the Repository
* repo: string - Repository Name
* pr_num: number - Pull Request's Number

### Response
Sends JSON with following properties if everything goes right:
* user: string - Owner of the Repository
* repo: string - Repository Name
* pr_num: number - Pull Request's Number
* merged?: boolean - Whether PR is merged or not
* repoEligible?: boolean - Whether PR's Repository is eligibile or not
* eligibile?: boolean - Whether Repository is eligibile or not
* invalid?: boolean - Whether Repository is invalid (Spam) or not
Else if something goes wrong, sends a similar error response like above.

### Note
I'm not so good with docs, you can PR improvments to Docs and Code both :)