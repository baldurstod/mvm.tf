package main

type Config struct {
	HTTP struct {
		Port          int    `json:"port"`
		HttpsKeyFile  string `json:"https_key_file"`
		HttpsCertFile string `json:"https_cert_file"`
	} `json:"http"`
	Sessions struct {
		FileStore  string `json:"file_store"`
		AuthKey    string `json:"auth_key"`
		EncryptKey string `json:"encrypt_key"`
	} `json:"database"`
}
