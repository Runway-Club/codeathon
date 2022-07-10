package models

type TestcaseResult struct {
	Input          string `json:"input,omitempty"`
	ExpectedOutput string `json:"expected_output,omitempty"`
	Output         string `json:"output,omitempty"`
	Message        string `json:"message"`
	Stderr         string `json:"stderr"`
}

type EvaluateResult struct {
	SubmissionId string           `json:"submission_id"`
	Score        int              `json:"score"`
	TotalScore   int              `json:"total_score"`
	TotalMemory  float64          `json:"total_memory"`
	TotalTime    float64          `json:"total_time"`
	Testcases    []TestcaseResult `json:"testcases"`
	Evaluated    bool             `json:"evaluated"`
	UserId       string           `json:"user_id"`
}
