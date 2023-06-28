rm -R src/scotty-api
openapi-generator-cli generate -i http://localhost:8872/api.php/openapi -g typescript-jquery -o src/scotty-api
npx webpack