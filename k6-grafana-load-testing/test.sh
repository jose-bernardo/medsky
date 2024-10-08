function pre_test_warmup() {
  echo "Sending warmup load..."

  export DURATION=$1
  echo "Sending FHIR data"
  export VUS=40
  ./k6 run ./fhirWriteTest.js > /dev/null

  sleep 30

  echo "Finished warmup"
}

function infoln() {
  echo "$1" | tee -a log.txt
}

# Expires 30 Out 2024
export TOKEN=""

mkdir -p reports

function execFhirWriteTest() {
pre_test_warmup 5m
export VUS=50
export DURATION=70m

infoln "Initializing FHIR WRITE test with $VUS VUs during $DURATION"
infoln "Start Time: $(date)"
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_PORT=9997 K6_WEB_DASHBOARD_EXPORT=reports/fhirWriteTest.html ./k6 run ./fhirWriteTest.js
infoln "End Time: $(date)"
infoln " -------------------- "
}


function execFhirReadTest() {
pre_test_warmup 5m
export VUS=50
export DURATION=70m

infoln "Initializing FHIR READ test with $VUS VUs during $DURATION"
infoln "Start Time: $(date)"
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_PORT=9997 K6_WEB_DASHBOARD_EXPORT=reports/fhirReadTest.html ./k6 run ./fhirReadTest.js
infoln "End Time: $(date)"
infoln " -------------------- "
}


function execBinaryReadTest() {
pre_test_warmup 5m
export VUS=10
export DURATION=70m

infoln "Initializing BINARY READ test with $VUS during $DURATION"
infoln "Start Time: $(date)"
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_PORT=9997 K6_WEB_DASHBOARD_EXPORT=reports/binaryWriteTest.html ./k6 run ./binaryReadTest.js
infoln "End Time: $(date)"
infoln " -------------------- "
}


function execBinaryWriteTest() {
pre_test_warmup 5m
export VUS=10
export DURATION=70m

infoln "Initializing BINARY WRITE test with $VUS during $DURATION"
infoln "Start Time: $(date)"
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_PORT=9997 K6_WEB_DASHBOARD_EXPORT=reports/binaryWriteTest.html ./k6 run ./binaryWriteTest.js
infoln "End Time: $(date)"
infoln " -------------------- "
}

echo "##########################################"
echo "####### Starting System Evaluation #######"
echo "##########################################"

if [ $1 = "fr" ]; then
  execFhirReadTest
elif [ $1 = "fw" ]; then
  execFhirWriteTest
elif [ $1 = "br" ]; then
  execBinaryReadTest
elif [ $1 = "bw" ]; then
  execBinaryWriteTest
else
  execFhirReadTest
  execFhirWriteTest
  execBinaryReadTest
fi

echo "#########################################"
echo "####### Ending System Evaluation ########"
echo "#########################################"