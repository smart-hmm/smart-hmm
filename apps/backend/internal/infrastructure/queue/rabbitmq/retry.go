package rabbitmqqueue

import amqp "github.com/rabbitmq/amqp091-go"

func getRetryCount(msg amqp.Delivery) int {
	if val, ok := msg.Headers["x-retry"]; ok {
		if v, ok := val.(int32); ok {
			return int(v)
		}
	}
	return 0
}

func incrementRetry(msg *amqp.Delivery) {
	retry := getRetryCount(*msg)
	if msg.Headers == nil {
		msg.Headers = amqp.Table{}
	}
	msg.Headers["x-retry"] = retry + 1
}
