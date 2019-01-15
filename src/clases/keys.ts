export class KeysToApiKeys {

    private END_POINT_AUTHORIZATION : string = 'Bearer { "id": "110546993488738742297", "d": "2", "user": 1, "type": "iwgl", "accesToken": { "code": 0, "user": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NDA1NzU1MzksImV4cCI6MTU0MTU3NTUzOSwiZGF0YSI6eyJpZCI6IjExMDU0Njk5MzQ4ODczODc0MjI5NyIsIm5hbWUiOiJqZXJyeSIsImxuYW1lIjoibGFnb3MiLCJjb3JyZW8iOiJqZXJyeXNlYmFzdGlhbmxhZ29zY0BnbWFpbC5jb20iLCJkb21haW4iOiIyIn19.rjO-PSZcHfODT5hrvcJkDgSf46ulI2LBWZGr2s5K11I" } }';
    private END_POINT_TO_SITE: string = 'http://node-express-env.eifgkdzath.us-west-2.elasticbeanstalk.com/';
    private END_POINT_TO_API: string = 'http://node-express-env.eifgkdzath.us-west-2.elasticbeanstalk.com/api/v1';
    constructor() {        
    }

    FUNC_END_POINT_AUTHORIZATION() {
        return this.END_POINT_AUTHORIZATION;
    }

    FUNC_END_POINT_TO_SITE() {
        return this.END_POINT_TO_SITE;
    }

    FUNC_END_POINT_TO_API() {
        return this.END_POINT_TO_API
    }
}