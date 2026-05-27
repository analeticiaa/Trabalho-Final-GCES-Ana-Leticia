#!/bin/sh
echo "Iniciando fuzzing por 30 segundos..."
timeout 30 npx jazzer server/fuzz/gameCollection.fuzz.js \
  --instrumentation_includes="gameCollection" \
  -- -max_total_time=30 || true
echo "Fuzzing concluído!"