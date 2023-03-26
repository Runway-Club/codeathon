FROM golang:1.19.2-alpine3.15
WORKDIR /app
EXPOSE 8080
COPY . .
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build  -o /out/main ./
ENTRYPOINT ["/out/main"]
CMD ["go", "run", "main.go"]