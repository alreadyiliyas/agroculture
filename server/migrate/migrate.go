package main

import (
	"fmt"
	"log"
	"server/initializers"
	"server/models"
)

func init() {
	config, err := initializers.LoadConfig(".")
	if err != nil {
		log.Fatal("Не удалось загрузить переменные окружения")
	}
	initializers.ConnectDB(&config)
}

func main() {
	initializers.DB.AutoMigrate(&models.User{})
	initializers.DB.AutoMigrate(&models.Session{})
	fmt.Println("Миграция прошла успешно!")
}
