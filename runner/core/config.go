package core

type Config struct {
	Host     string   `json:"host"`
	Port     int      `json:"port"`
	Judge0   string   `json:"judge0"`
	MongoURI string   `json:"mongouri"`
	Elastic  *Elastic `json:"elastic"`
}

type Elastic struct {
	Addresses              []string `json:"addresses"`
	Username               string   `json:"username"`
	Password               string   `json:"password"`
	CertificateFingerprint string   `json:"certificate_fingerprint"`
}
