package controllers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/thanhpk/randstr"
	"gorm.io/gorm"
	"log"
	"math/rand"
	"net/http"
	"net/url"
	"server/initializers"
	"server/models"
	"server/utils"
	"strconv"
	"strings"
	"time"
)

type AuthController struct {
	// контроллер хранит ссылку на экземпляр базы данных
	DB *gorm.DB
}

func NewAuthController(DB *gorm.DB) AuthController {
	return AuthController{DB}
}

// Ввод данных для регистрации
func (acc *AuthController) SighUpUser(ctx *gin.Context) {
	var payload *models.SignUpInput

	if err := ctx.ShouldBindJSON(&payload); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	hashedPassword, err := utils.HashPassword(payload.Password)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "error", "message": err.Error()})
		return
	}

	now := time.Now()
	var flagVerified bool
	if payload.Provider == "local" {
		flagVerified = false
	} else if payload.Provider == "google" {
		flagVerified = true
	}

	newUser := models.User{
		Name:     payload.Name,
		Email:    strings.ToLower(payload.Email),
		Password: hashedPassword,
		Role:     "user",
		Photo:    payload.Photo,
		//Provider: регистрация через форму или гугл и т.д.
		Provider:  payload.Provider,
		Verified:  flagVerified,
		CreatedAt: now,
		UpdatedAt: now,
	}

	result := acc.DB.Create(&newUser)
	//Если пользователь с таким email уже существует, то возвращается ошибка конфликта. Если произошла другая ошибка, то возвращается общая ошибка.
	if result.Error != nil && strings.Contains(result.Error.Error(), "duplicate key value violates unique") {
		ctx.JSON(http.StatusConflict, gin.H{"status": "fail", "message": "User with that email already exists"})
		return
	} else if result.Error != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "error", "message": "Something bad happened"})
		return
	}
	if payload.Provider == "local" {
		config, _ := initializers.LoadConfig(".")

		// Generate Verification Code
		code := randstr.String(20)
		verification_code := utils.Encode(code)

		// Update User in Database
		newUser.VerificationCode = verification_code
		acc.DB.Save(newUser)
		var firstName = newUser.Name
		if strings.Contains(firstName, " ") {
			firstName = strings.Split(firstName, " ")[1]
		}

		emailData := utils.EmailData{
			URL:       config.ClientOrigin + "/api/auth/verifyemail/" + code,
			FirstName: firstName,
			Subject:   "Your account verification code",
		}
		utils.SendEmail(&newUser, &emailData)
		message := "Подтвердите аккаунт на почте, отправленный на: " + newUser.Email
		ctx.JSON(http.StatusCreated, gin.H{"status": "success", "message": message})

	} else if payload.Provider == "google" {
		var user models.User
		//userResponse := &models.UserResponse{
		//	ID:        newUser.ID,
		//	Name:      newUser.Name,
		//	Email:     newUser.Email,
		//	Photo:     newUser.Photo,
		//	Role:      newUser.Role,
		//	Provider:  newUser.Provider,
		//	CreatedAt: newUser.CreatedAt,
		//	UpdatedAt: newUser.UpdatedAt,
		//}
		result := acc.DB.First(&user, "email = ?", strings.ToLower(payload.Email))

		if result.Error != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": "Invalid email or Password"})
			return
		}
		config, _ := initializers.LoadConfig(".")

		//Создаем токен
		access_token, err := utils.CreateToken(config.AccessTokenExpiresIn, user.ID, config.AccessTokenPrivateKey)

		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": err.Error()})
			return
		}
		refresh_token, err := utils.CreateToken(config.RefreshTokenExpiresIn, user.ID, config.RefreshTokenPrivateKey)

		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": err.Error()})
			return
		}

		ctx.SetCookie("access_token", access_token, config.AccessTokenMaxAge*60, "/", "127.0.0.1", false, false)
		ctx.SetCookie("refresh_token", refresh_token, config.RefreshTokenMaxAge*60, "/", "127.0.0.1", false, false)
		ctx.SetCookie("logged_in"+"", "true", config.AccessTokenMaxAge*60, "/", "127.0.0.1", false, false)

		ctx.JSON(http.StatusOK, gin.H{"status": "success", "access_token": access_token})
		//ctx.JSON(http.StatusCreated, gin.H{"status": "success", "data": gin.H{"user": userResponse}})
	}
}

// Верификация Email
func (acc *AuthController) VerifyEmail(ctx *gin.Context) {

	code := ctx.Params.ByName("verificationCode")
	log.Println(code)
	verification_code := utils.Encode(code)

	var updatedUser models.User
	result := acc.DB.First(&updatedUser, "verification_code = ?", verification_code)
	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": "Invalid verification code or user doesn't exists"})
		return
	}

	if updatedUser.Verified {
		ctx.JSON(http.StatusConflict, gin.H{"status": "fail", "message": "User already verified"})
		return
	}

	updatedUser.VerificationCode = ""
	updatedUser.Verified = true
	acc.DB.Save(&updatedUser)

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "message": "Email verified successfully"})
}

// Авторизация пользователя
func (acc *AuthController) SighInUser(ctx *gin.Context) {
	var payload *models.SignInInput

	if err := ctx.ShouldBindJSON(&payload); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": err.Error()})
		return
	}
	var user models.User
	//First - первый объект, найденный по условию
	//&user сохранение найденного объекта в бд
	//where = $1
	//$1 = payload.Email
	result := acc.DB.First(&user, "email = ?", strings.ToLower(payload.Email))
	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": "Invalid email or Password"})
		return
	}
	if !user.Verified {
		ctx.JSON(http.StatusForbidden, gin.H{"status": "fail", "message": "Please verify your email"})
		return
	}
	if err := utils.VerifyPassword(user.Password, payload.Password); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": "Invalid email or Password"})
		return
	}

	config, _ := initializers.LoadConfig(".")

	//Создаем токен
	access_token, err := utils.CreateToken(config.AccessTokenExpiresIn, user.ID, config.AccessTokenPrivateKey)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": err.Error()})
		return
	}
	refresh_token, err := utils.CreateToken(config.RefreshTokenExpiresIn, user.ID, config.RefreshTokenPrivateKey)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	ctx.SetCookie("access_token", access_token, config.AccessTokenMaxAge*60, "/", "127.0.0.1", false, false)
	ctx.SetCookie("refresh_token", refresh_token, config.RefreshTokenMaxAge*60, "/", "127.0.0.1", false, false)
	ctx.SetCookie("logged_in"+"", "true", config.AccessTokenMaxAge*60, "/", "127.0.0.1", false, false)

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "access_token": access_token})
}

// Обновление пароли
func (acc *AuthController) ResetPassUser(ctx *gin.Context) {
	var payload *models.ResetInput
	var updateUserPass models.User
	if err := ctx.ShouldBindJSON(&payload); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": err.Error()})
		return
	}
	hashedPassword, err := utils.HashPassword(payload.New_password)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "error", "message": err.Error()})
		return
	}

	now := time.Now()

	result := acc.DB.First(&updateUserPass, "email = ?", payload.Email)
	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": "Invalid verification code or user doesn't exists"})
		return
	}
	updateUserPass.NewPassword = hashedPassword
	updateUserPass.UpdatedAt = now
	code := rand.Intn(1000000)
	log.Println(code)
	updatePass := utils.EncodeInt(code)
	log.Println(updatePass)
	updateUserPass.VerificationCode = updatePass
	acc.DB.Save(updateUserPass)

	var firstName = updateUserPass.Name
	if strings.Contains(firstName, " ") {
		firstName = strings.Split(firstName, " ")[1]
	}

	emailData := utils.EmailData{
		URL:       url.QueryEscape(strconv.Itoa(code)),
		FirstName: firstName,
		Subject:   "Ваш 6-ти значный код для подтверждения обновления пароли",
	}
	utils.SendEmail(&updateUserPass, &emailData)
	message := "Код отправлен на почту: " + updateUserPass.Email
	ctx.JSON(http.StatusCreated, gin.H{"status": "success", "message": message})
}

// Подтвердить код
func (acc *AuthController) ConfirmCodeUser(ctx *gin.Context) {
	var payload *models.ConfirmCodeInput
	var updateUser *models.User
	if err := ctx.ShouldBindJSON(&payload); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	now := time.Now()
	result := acc.DB.First(&updateUser, "email = ?", payload.Email)
	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": "Invalid verification code or user doesn't exists"})
		return
	}

	log.Println(payload.Code)
	decodedCode := utils.DecodeInt(updateUser.VerificationCode)
	log.Println(decodedCode)
	if payload.Code != decodedCode {
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": "Invalid verification code"})
		return
	}
	hashedPassword, err := utils.HashPassword(payload.Password)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "error", "message": err.Error()})
		return
	}
	updateUser.Password = hashedPassword
	updateUser.NewPassword = ""
	updateUser.VerificationCode = ""
	updateUser.UpdatedAt = now
	acc.DB.Save(&updateUser)
	message := "Пароль успешно обновлен"
	ctx.JSON(http.StatusCreated, gin.H{"status": "success", "message": message})
}

// Обновление контроллеров токенов доступа
func (acc *AuthController) RefreshAccessToken(ctx *gin.Context) {
	message := "не удалось обновить токен доступа"
	cookie, err := ctx.Cookie("refresh_token")

	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{"status": "fail", "message": message})
		return
	}
	config, _ := initializers.LoadConfig(".")

	sub, err := utils.ValidateToken(cookie, config.RefreshTokenPublicKey)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{"status": "fail", "message": err.Error()})
		return
	}
	var user models.User
	result := acc.DB.First(&user, "id = ?", fmt.Sprint(sub))
	if result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{"status": "fail", "message": "the user belonging to this token no logger exists"})
		return
	}
	access_token, err := utils.CreateToken(config.AccessTokenExpiresIn, user.ID, config.AccessTokenPrivateKey)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{"status": "fail", "message": err.Error()})
		return
	}
	ctx.SetCookie("access_token", access_token, config.AccessTokenMaxAge*60, "/", "localhost", false, true)
	ctx.SetCookie("logged_in", "true", config.AccessTokenMaxAge*60, "/", "localhost", false, false)

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "access_token": access_token})
}

// контроллер из выхода системы
func (acc *AuthController) LogoutUser(ctx *gin.Context) {
	ctx.SetCookie("access_token", "", -1, "/", "localhost", false, true)
	ctx.SetCookie("refresh_token", "", -1, "/", "localhost", false, true)
	ctx.SetCookie("logged_in", "", -1, "/", "localhost", false, false)

	ctx.JSON(http.StatusOK, gin.H{"status": "success"})
}
