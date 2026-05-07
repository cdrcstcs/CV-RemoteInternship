package database
import (
	"context"
	"fmt"
	"github.com/go-redis/redis/v8"
)
var Ctx = context.Background()
func CreateClient(dbNo int) *redis.Client {
	rdb := redis.NewClient(&redis.Options{
		Addr:     "redis-15884.c10.us-east-1-4.ec2.redns.redis-cloud.com:15884",
		Password: "",
		DB:       dbNo,
	})
	_, err := rdb.Ping(Ctx).Result()
	if err != nil {
		fmt.Printf("Could not connect to Redis: %v\n", err)
		return nil
	}
	fmt.Println("Successfully connected to Redis")
	return rdb
}