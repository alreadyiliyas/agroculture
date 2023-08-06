package utils

import (
	"encoding/base64"
	"strconv"
)

func Encode(s string) string {
	data := base64.StdEncoding.EncodeToString([]byte(s))
	return string(data)
}
func EncodeInt(i int) string {
	data := strconv.Itoa(i)
	encodedData := base64.StdEncoding.EncodeToString([]byte(data))
	return encodedData
}

func DecodeInt(encodedData string) string {
	data, err := base64.StdEncoding.DecodeString(encodedData)
	if err != nil {
		return "Ошибка"
	}
	return string(data)
}

func Decode(s string) string {
	data, err := base64.StdEncoding.DecodeString(s)
	if err != nil {
		return ""
	}

	return string(data)
}
