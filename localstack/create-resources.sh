echo "Creating dynomodb table ⚙️"
awslocal dynamodb create-table \
    --table-name go-non-go-matrix \
    --attribute-definitions \
        AttributeName=pk,AttributeType=S \
        AttributeName=sk,AttributeType=S \
        AttributeName=goal_id,AttributeType=S \
        AttributeName=goal_criteria_sk,AttributeType=S \
        AttributeName=goal_item_sk,AttributeType=S \
        AttributeName=criteria_pair_sk,AttributeType=S \
        AttributeName=item_id,AttributeType=S \
        AttributeName=criteria_id,AttributeType=S \
    --key-schema \
        AttributeName=pk,KeyType=HASH \
        AttributeName=sk,KeyType=RANGE \
    --billing-mode PROVISIONED \
    --provisioned-throughput \
        ReadCapacityUnits=10,WriteCapacityUnits=5 \
    --global-secondary-indexes file://gsi.json
echo "Table created successfully ✓"