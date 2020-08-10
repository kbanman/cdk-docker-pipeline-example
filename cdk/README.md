## Setup
* Create a github [personal access token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token) with access to your fork of this repository. 
* Store that token in AWS Secrets Manager with the name `github-token-secret`:
```
aws secretsmanager create-secret \
    --name github-token-secret \
    --secret-string <your-token-here>
```
