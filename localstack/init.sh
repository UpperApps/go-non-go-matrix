echo "Initializing localstack resources 🚀"

podman compose up -d

# Wait for localstack to be healthy
echo "Waiting for LocalStack to be ready..."
until curl -s http://localhost:4566/_localstack/health | grep -q '"dynamodb":'; do
    sleep 1
done

sh create-resources.sh
sh insert-data.sh
