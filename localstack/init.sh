echo "Initializing localstack resources 🚀"

docker compose up -d

sh create-resources.sh
sh insert-data.sh
