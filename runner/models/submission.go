package models

type Submission struct {
	LanguageId int    `json:"language_id"`
	Source     string `json:"source"`
	ProblemId  string `json:"problem_id"`
	UserId     string `json:"user_id"`
}

type JudgeSubmissionRequest struct {
	SourceCode     string `json:"source_code"`
	LanguageId     int    `json:"language_id"`
	Stdin          string `json:"stdin"`
	ExpectedOutput string `json:"expected_output"`
	CpuTimeLimit   int    `json:"cpu_time_limit"`
	MemoryLimit    int    `json:"memory_limit"`
}

type JudgeSubmissionResponse struct {
	Stdout        string  `json:"stdout"`
	Stderr        string  `json:"stderr"`
	Time          int64   `json:"time"`
	Memory        float32 `json:"memory"`
	Token         string  `json:"token"`
	Message       string  `json:"message"`
	CompileOutput string  `json:"compile_output"`
}

type JudgeSubmissionAsyncResponse struct {
	Token string `json:"token"`
}

type WaitingSubmission struct {
	ProblemId string   `json:"problem_id"`
	UserId    string   `json:"user_id"`
	Tokens    []string `json:"tokens"`
	Time      int64    `json:"time"`
	Evaluated bool     `json:"evaluated"`
}
