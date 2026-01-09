#!/bin/bash

echo "=== Test de Workload Injection ==="
echo ""
echo "Ce script teste l'élasticité de l'application en envoyant beaucoup de requêtes."
echo ""


if ! docker stack services scapp &> /dev/null; then
    echo "Erreur: Le stack scapp ne tourne pas!"
    echo "Lance d'abord: docker stack deploy -c scapp.yml scapp"
    exit 1
fi



sleep 2


test_with_curl() {
    local num_requests=$1
    local url=$2

    echo "Envoi de $num_requests requêtes avec curl..."
    start_time=$(date +%s)

    success=0
    failed=0

    for i in $(seq 1 $num_requests); do
        response=$(curl -s -o /dev/null -w "%{http_code}" $url)
        if [ "$response" = "200" ]; then
            ((success++))
        else
            ((failed++))
        fi

       
        if [ $((i % 100)) -eq 0 ]; then
            echo "  Progression: $i/$num_requests requêtes"
        fi
    done

    end_time=$(date +%s)
    duration=$((end_time - start_time))

    echo ""
    echo "Résultats:"
    echo "  - Durée totale: ${duration}s"
    echo "  - Requêtes réussies: $success"
    echo "  - Requêtes échouées: $failed"
    if [ $duration -gt 0 ]; then
        rps=$((num_requests / duration))
        echo "  - Requêtes par seconde: ${rps} req/s"
    fi
}


test_with_ab() {
    local num_requests=$1
    local concurrency=$2
    local url=$3

    echo "Test avec Apache Bench:"
    echo "  - $num_requests requêtes"
    echo "  - $concurrency requêtes concurrentes"
    echo ""

    ab -n $num_requests -c $concurrency $url
}


API_URL="http://localhost:3001/products"

echo "=== TEST 1: Charge légère ==="
echo ""


if command -v ab &> /dev/null; then
 
    test_with_ab 1000 50 $API_URL
else
    
    test_with_curl 500 $API_URL
fi

echo ""
echo "Attente de 5 secondes..."
sleep 5
echo ""

echo "=== TEST 2: Charge élevée ==="
echo ""

if command -v ab &> /dev/null; then
    test_with_ab 5000 200 $API_URL
else
    test_with_curl 1000 $API_URL
fi


docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" | grep scapp

echo ""
echo "=== État ==="
docker stack services scapp | grep -E "(NAME|products-daemon|api-gateway)"


