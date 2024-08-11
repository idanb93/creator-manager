FROM golang:1.22.6-alpine

WORKDIR /app

COPY . .

# Download and install the dependencies
RUN go get -d -v ./...

# Build the go app
RUN go build -o api .

EXPOSE 8080

CMD ["./api"]