echo "Creating dynamodb table ⚙️"
awslocal dynamodb create-table \
    --table-name go-non-go-matrix \
    --attribute-definitions \
        AttributeName=pk,AttributeType=S \
        AttributeName=sk,AttributeType=S \
    --key-schema \
        AttributeName=pk,KeyType=HASH \
        AttributeName=sk,KeyType=RANGE \
    --billing-mode PROVISIONED \
    --provisioned-throughput \
        ReadCapacityUnits=10,WriteCapacityUnits=5
echo "Table created successfully ✓"