# MedSky

## Hyperledger Network

### Requirements

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
nvm install 20
apt install jq
./install-fabric.sh --fabric-version=3.0.0-beta binary
```

### Running

```
./network.sh setup medium
./network.sh deploy medium
```

### Benchmarks

```
npm install --only=prod @hyperledger/caliper-cli
npx caliper bind --caliper-bind-sut fabric:2.4
npx caliper launch manager \
    --caliper-workspace ./ --caliper-networkconfig network.yaml \
    --caliper-benchconfig benchconfigs/medsky/config.yaml --caliper-flow-only-test \
    --caliper-fabric-gateway-enabled
```

### Prometheus-Grafana Monitor

```
cd prometheus-grafana
docker-compose up -d
```

## RockFS

You can configure Cloud Addresses in `config/accounts.json`

```
git clone https://github.com/jose-bernardo/RockFS
cd RockFS
sh ./install.sh
```

```
cd DepSpacito
sh run.sh
sh ./run.sh
```

## Medplum

### Requirements

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
nvm install 20
```

### Installation

```
git clone https://github.com/jose-bernardo/medplum
cd medplum
npm i
npm run build:fast
```

### Running the Medplum server

You can configure RockFS address in `medplum.config.json`

```
cp -r ../fabric-network/organization packages/server # copy Fabric crypto material
docker-compose up -d # deploy Redis and PostgreSQL database containers
cd packages/server
npm run dev
```

### Running the Medplum app

This is only needed for login and get the JWT token and run the tests

```
cd packages/app
export MEDPLUM_BASE_URL="http://localhost:5555"
npm run dev
```

Then go to `http://localhost:3000` and login with email `admin@example.com` and password `medplum_admin`.

After login retrieve the JWT cookie for the K6 Grafana tests.

### Prometheus-Grafana Monitor

```
cd prometheus-grafana
docker-compose-up -d
```

## Load Testing Machine

### Requirements

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
nvm install 20

# Install exec plugin

go install go.k6.io/xk6/cmd/xk6@latest
xk6 build --with github.com/grafana/xk6-exec@latest

cd fabric-js-gateway
npm i
```

### Run tests

```
export TOKEN='your-medplum-login-jwt-token'
./test.sh fr # FHIR Read-Only test
./test.sh fw # FHIR Write-Only test
./test.sh br # Binary Read-Only test
./test.sh bw # Binary Write-Only test
```