package models

type ProblemSample struct {
	Input  string `json:"input"`
	Output string `json:"output"`
}

type TestCase struct {
	Input          string `json:"input"`
	ExpectedOutput string `json:"expected_output"`
	TimeLimit      int    `json:"time_limit"`
	MemoryLimit    int    `json:"memory_limit"`
	Score          int    `json:"score"`
	ViewOnFailure  bool   `json:"allow_view_on_failed"`
}

type Problem struct {
	Id        int             `json:"id"`
	Title     string          `json:"title"`
	Tags      []string        `json:"tags"`
	Content   string          `json:"content"`
	Samples   []ProblemSample `json:"samples"`
	TestCases []TestCase      `json:"testcases"`
}
