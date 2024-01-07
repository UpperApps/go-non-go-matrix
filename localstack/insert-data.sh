echo "Inserting data into dynamodb table 💾"

awslocal dynamodb batch-write-item \
    --request-items file://data.json