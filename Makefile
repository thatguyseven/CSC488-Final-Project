Name ?= aan1

all: build run push
 
build: 
	docker build -f .\docker\Dockerfile.api -t ${Name}/ghg-analysis-flask-api:latest . 
	docker build -f .\docker\Dockerfile.wrk -t ${Name}/ghg-api-worker:latest . 
run: 
	docker run --rm -p 5000:5000 ${Name}/ghg-analysis-flask-api:latest
	docker run --rm ${Name}/ghg-api-worker:latest
push: 
	docker push ${Name}/ghg-analysis-flask-api:latest 
	docker push ${Name}/ghg-api-worker:latest 

# deploy