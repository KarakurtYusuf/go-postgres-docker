FROM golang:1.26-alpine

WORKDIR /app

COPY . .

RUN go mod download

RUN go build -o api .

EXPOSE 8000

CMD ["./api"]