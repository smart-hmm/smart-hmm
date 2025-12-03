package rabbitmqqueue

import (
	"strconv"

	amqp "github.com/rabbitmq/amqp091-go"
)

func getRetryCount(msg amqp.Delivery) int {
	if msg.Headers == nil {
		return 0
	}

	if val, ok := msg.Headers["x-retry"]; ok {
		switch v := val.(type) {
		case int:
			return v
		case int32:
			return int(v)
		case int64:
			return int(v)
		case float32:
			return int(v)
		case float64:
			return int(v)
		case string:
			if n, err := strconv.Atoi(v); err == nil {
				return n
			}
		}
	}

	return 0
}

func incrementRetry(msg *amqp.Delivery) {
	if msg.Headers == nil {
		msg.Headers = amqp.Table{}
	}

	retry := getRetryCount(*msg)
	msg.Headers["x-retry"] = retry + 1
}
