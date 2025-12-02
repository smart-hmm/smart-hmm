package databaseport

type Database interface {
	Open() error
	Close() error
	Ping() error
}
