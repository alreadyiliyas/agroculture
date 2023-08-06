package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"log"
	"net/http"
	"path/filepath"
	"server/models"
)

type UserController struct {
	DB *gorm.DB
}

func NewUserController(DB *gorm.DB) UserController {
	return UserController{DB}
}

func (uc *UserController) GetMe(ctx *gin.Context) {
	currentUser := ctx.MustGet("currentUser").(models.User)

	userResponse := &models.UserResponse{
		ID:        currentUser.ID,
		Name:      currentUser.Name,
		Email:     currentUser.Email,
		Photo:     currentUser.Photo,
		Role:      currentUser.Role,
		Provider:  currentUser.Provider,
		CreatedAt: currentUser.CreatedAt,
		UpdatedAt: currentUser.UpdatedAt,
	}
	ctx.JSON(http.StatusOK, gin.H{"status": "success", "data": gin.H{"user": userResponse}})
}

func (uc *UserController) UpdateUserInfo(ctx *gin.Context) {
	currentUser := ctx.MustGet("currentUser").(models.User)
	userID := currentUser.ID

	var user models.User
	err := uc.DB.First(&user, userID).Error
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": "fail", "message": "Unable to update user information"})
		return
	}

	// Обновление ФИО (name)
	name := ctx.PostForm("name")
	if name != "" {
		user.Name = name
	}

	// Обновление фото (photo)
	file, err := ctx.FormFile("photo")
	if err == nil {
		extension := filepath.Ext(file.Filename)
		fileName := uuid.New().String() + extension
		if err := ctx.SaveUploadedFile(file, "images/"+fileName); err != nil {
			ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": "fail", "message": "Unable to update user information"})
			return
		}
		user.Photo = fileName
	}
	err = uc.DB.Save(&user).Error
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": "fail", "message": "Unable to update user information"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "message": "User information updated successfully"})
}

func (uc *UserController) UploadPhotoArea(ctx *gin.Context) {
	emailUser := ctx.PostForm("email")

	var user models.User
	err := uc.DB.First(&user, "email = ?", emailUser).Error
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": "fail", "message": "Такой email не найден!"})
		log.Println("1")
		return
	}

	file, err := ctx.FormFile("photo_area")
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": "fail", "message": "Ошибка при получении файла"})
		log.Println("2")
		return
	}

	extension := filepath.Ext(file.Filename)
	fileName := uuid.New().String() + extension
	if err := ctx.SaveUploadedFile(file, "images/"+fileName); err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": "fail", "message": "Ошибка при сохранении файла"})
		log.Println("3")
		return
	}
	user.Photo_area = fileName

	err = uc.DB.Save(&user).Error
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": "fail", "message": "Не удается загрузить TIF файл"})
		log.Println("4")
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "message": "Удалось загрузить фото"})
}
