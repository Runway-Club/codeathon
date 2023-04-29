package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Submission struct {
	ID         primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	LanguageID int                `json:"language_id" bson:"languageID"`
	Code       string             `json:"code" bson:"code"`
	Evaluated  bool               `json:"evaluated" bson:"evaluated"`
	Score      int32              `json:"score" bson:"score"`
	CreateAt   int64              `json:"create_at" bson:"createAt"`
	ProblemID  primitive.ObjectID `json:"problem_id" bson:"problemID"`
	UID        string             `json:"uid" bson:"uid"`
}

type SubmissionResult struct {
	Submission
	TotalScore  int32   `json:"total_score" bson:"totalScore"`
	TotalTime   float64 `json:"total_time" bson:"totalTime"`
	TotalMemory int32   `json:"total_memory" bson:"totalMemory"`
}

type JudgeStatus struct {
	ID          int    `json:"id" bson:"id"`
	Description string `json:"description" bson:"description"`
}

type TestcaseResult struct {
	ID             primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Input          string             `json:"input,omitempty" bson:"input"`
	ExpectedOutput string             `json:"expected_output,omitempty" bson:"expectedOutput"`
	Time           float64            `json:"time,omitempty" bson:"time"`
	Memory         int32              `json:"memory,omitempty" bson:"memory"`
	Output         string             `json:"output,omitempty" bson:"output"`
	Message        string             `json:"message" bson:"message"`
	Stderr         string             `json:"stderr" bson:"stderr"`
	SID            primitive.ObjectID `json:"submission_id,omitempty" bson:"submissionID,omitempty"`
}

type JudgeSubmissionRequest struct {
	SourceCode   string `json:"source_code"`
	LanguageId   int    `json:"language_id"`
	Stdin        string `json:"stdin"`
	CpuTimeLimit int32  `json:"cpu_time_limit"`
	MemoryLimit  int32  `json:"memory_limit"`
}

type JudgeSubmissionResponse struct {
	Stdout        string      `json:"stdout"`
	Stderr        string      `json:"stderr"`
	Time          string      `json:"time"`
	Memory        int32       `json:"memory"`
	Token         string      `json:"token"`
	Message       string      `json:"message"`
	Status        JudgeStatus `json:"status" bson:"status"`
	CompileOutput string      `json:"compile_output"`
}
